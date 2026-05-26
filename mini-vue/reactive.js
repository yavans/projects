// MiniVue — Proxy-based reactive system (~180 lines)
// Implements: reactive, effect, computed, ref, watch

let activeEffect = null;
const targetMap = new WeakMap();

function track(target, key) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }
  deps.add(activeEffect);
  activeEffect._deps.push(deps);
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const deps = depsMap.get(key);
  if (!deps) return;
  const run = new Set(deps);
  run.forEach(effect => {
    if (effect._scheduler) {
      effect._scheduler();
    } else {
      effect();
    }
  });
}

export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);
      track(target, key);
      if (typeof res === 'object' && res !== null) {
        return reactive(res);
      }
      return res;
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, value, receiver);
      if (oldValue !== value) {
        trigger(target, key);
      }
      return result;
    }
  });
}

export function effect(fn, options = {}) {
  const _effect = () => {
    cleanup(_effect);
    activeEffect = _effect;
    try {
      fn();
    } finally {
      activeEffect = null;
    }
  };
  _effect._deps = [];
  _effect._scheduler = options.scheduler || null;
  _effect();
  return () => cleanup(_effect);
}

function cleanup(_effect) {
  _effect._deps.forEach(deps => deps.delete(_effect));
  _effect._deps.length = 0;
}

export function computed(fn) {
  let dirty = true;
  let value;
  const _effect = () => {
    dirty = true;
  };
  const runner = () => {
    cleanup(runner);
    activeEffect = runner;
    try {
      value = fn();
    } finally {
      activeEffect = null;
    }
    dirty = false;
    return value;
  };
  runner._deps = [];
  runner._scheduler = _effect;
  return {
    get value() {
      if (dirty) {
        return runner();
      }
      track(runner, 'value');
      return value;
    }
  };
}

export function ref(raw) {
  const r = {
    _value: raw,
    get value() {
      track(r, 'value');
      return r._value;
    },
    set value(v) {
      if (r._value !== v) {
        r._value = v;
        trigger(r, 'value');
      }
    }
  };
  return r;
}

export function watch(source, callback) {
  let getter;
  if (typeof source === 'function') {
    getter = source;
  } else {
    getter = () => traverse(source);
  }
  let oldValue;
  const _effect = effect(() => {
    const newValue = getter();
    callback(newValue, oldValue);
    oldValue = newValue;
  });
  return () => _effect();
}

function traverse(value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) return value;
  seen.add(value);
  for (const key in value) {
    traverse(value[key], seen);
  }
  return value;
}
