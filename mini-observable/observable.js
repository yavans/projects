// MiniObservable — RxJS-lite reactive programming (~170 lines)
// Observable, Observer, pipeable operators, Subscription

export class Observable {
  constructor(subscribe) {
    this._subscribe = subscribe;
  }

  subscribe(observer) {
    const _observer = typeof observer === 'function'
      ? { next: observer, error: () => {}, complete: () => {} }
      : observer;

    const subscription = new Subscription();
    const cleanup = this._subscribe({
      next: (v) => {
        if (!subscription.closed) _observer.next(v);
      },
      error: (e) => {
        if (!subscription.closed) {
          _observer.error && _observer.error(e);
          subscription.unsubscribe();
        }
      },
      complete: () => {
        if (!subscription.closed) {
          _observer.complete && _observer.complete();
          subscription.unsubscribe();
        }
      }
    });
    subscription._cleanup = typeof cleanup === 'function' ? cleanup : null;
    return subscription;
  }

  pipe(...operators) {
    return operators.reduce((obs, op) => op(obs), this);
  }
}

export class Subscription {
  constructor() {
    this.closed = false;
    this._cleanup = null;
    this._children = [];
  }

  add(child) {
    this._children.push(child);
  }

  unsubscribe() {
    if (this.closed) return;
    this.closed = true;
    if (this._cleanup) this._cleanup();
    this._children.forEach(c => c.unsubscribe());
    this._children.length = 0;
  }
}

export class Subject extends Observable {
  constructor() {
    super(() => {});
    this._observers = [];
  }

  next(value) {
    this._observers.forEach(o => o.next(value));
  }

  error(err) {
    this._observers.forEach(o => o.error && o.error(err));
  }

  complete() {
    this._observers.forEach(o => o.complete && o.complete());
  }

  subscribe(observer) {
    const _observer = typeof observer === 'function'
      ? { next: observer }
      : observer;
    this._observers.push(_observer);
    const sub = new Subscription();
    sub._cleanup = () => {
      const idx = this._observers.indexOf(_observer);
      if (idx > -1) this._observers.splice(idx, 1);
    };
    return sub;
  }
}

// --- Operators ---

export function map(fn) {
  return (source) => new Observable((observer) => {
    return source.subscribe({
      next: (v) => observer.next(fn(v)),
      error: (e) => observer.error(e),
      complete: () => observer.complete(),
    });
  });
}

export function filter(fn) {
  return (source) => new Observable((observer) => {
    return source.subscribe({
      next: (v) => { if (fn(v)) observer.next(v); },
      error: (e) => observer.error(e),
      complete: () => observer.complete(),
    });
  });
}

export function take(n) {
  return (source) => new Observable((observer) => {
    let count = 0;
    const sub = source.subscribe({
      next: (v) => {
        if (count < n) {
          observer.next(v);
          count++;
          if (count >= n) {
            observer.complete();
            sub.unsubscribe();
          }
        }
      },
      error: (e) => observer.error(e),
      complete: () => observer.complete(),
    });
    return sub;
  });
}

export function debounceTime(ms) {
  return (source) => new Observable((observer) => {
    let timer;
    const sub = source.subscribe({
      next: (v) => {
        clearTimeout(timer);
        timer = setTimeout(() => observer.next(v), ms);
      },
      error: (e) => observer.error(e),
      complete: () => observer.complete(),
    });
    return () => {
      clearTimeout(timer);
      sub.unsubscribe();
    };
  });
}

export function merge(...sources) {
  return new Observable((observer) => {
    const subs = sources.map(src =>
      src.subscribe({
        next: (v) => observer.next(v),
        error: (e) => observer.error(e),
        complete: () => {},
      })
    );
    return () => subs.forEach(s => s.unsubscribe());
  });
}

// --- Creation helpers ---

export function fromEvent(el, event) {
  return new Observable((observer) => {
    const handler = (e) => observer.next(e);
    el.addEventListener(event, handler);
    return () => el.removeEventListener(event, handler);
  });
}

export function interval(ms) {
  return new Observable((observer) => {
    let count = 0;
    const id = setInterval(() => observer.next(count++), ms);
    return () => clearInterval(id);
  });
}

export function of(...values) {
  return new Observable((observer) => {
    values.forEach(v => observer.next(v));
    observer.complete();
  });
}
