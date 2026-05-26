/**
 * MiniRedux — 自建状态管理库
 * createStore / combineReducers / applyMiddleware / subscribe
 * ~120 行
 */
const MiniRedux = (() => {
  function createStore(reducer, preloadedState, enhancer) {
    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
      enhancer = preloadedState;
      preloadedState = undefined;
    }
    if (typeof enhancer === 'function') {
      return enhancer(createStore)(reducer, preloadedState);
    }

    let state = preloadedState || reducer(undefined, { type: '@@INIT' });
    let listeners = [];
    let isDispatching = false;

    function getState() {
      if (isDispatching) throw new Error('Cannot getState while dispatching');
      return state;
    }

    function dispatch(action) {
      if (typeof action !== 'object' || !action.type) {
        throw new Error('Actions must be plain objects with a type property');
      }
      if (isDispatching) throw new Error('Cannot dispatch while dispatching');

      try {
        isDispatching = true;
        state = reducer(state, action);
      } finally {
        isDispatching = false;
      }

      listeners.slice().forEach(l => l());
      return action;
    }

    function subscribe(listener) {
      if (isDispatching) throw new Error('Cannot subscribe while dispatching');
      listeners.push(listener);
      let called = false;
      return function unsubscribe() {
        if (called) return;
        called = true;
        listeners = listeners.filter(l => l !== listener);
      };
    }

    dispatch({ type: '@@INIT' });
    return { getState, dispatch, subscribe };
  }

  function combineReducers(reducers) {
    const keys = Object.keys(reducers);
    return function combination(state = {}, action) {
      let changed = false;
      const next = {};
      for (const key of keys) {
        const prev = state[key];
        const nextState = reducers[key](prev, action);
        next[key] = nextState;
        changed = changed || nextState !== prev;
      }
      return changed ? next : state;
    };
  }

  function applyMiddleware(...middlewares) {
    return (createStore) => (reducer, preloadedState) => {
      const store = createStore(reducer, preloadedState);
      let dispatch = store.dispatch;

      const middlewareAPI = {
        getState: store.getState,
        dispatch: (action) => dispatch(action),
      };

      const chain = middlewares.map(m => m(middlewareAPI));
      dispatch = chain.reduceRight((next, m) => m(next), store.dispatch);

      return { ...store, dispatch };
    };
  }

  return { createStore, combineReducers, applyMiddleware };
})();

/* ── Built-in Middleware ── */

// Logger
MiniRedux.logger = (api) => (next) => (action) => {
  const prev = api.getState();
  console.group('%c action %c' + action.type, 'color:#999', 'color:#333;font-weight:bold');
  console.log('%c prev state ', 'color:#999;font-weight:bold', prev);
  console.log('%c action      ', 'color:#2196F3;font-weight:bold', action);
  const result = next(action);
  console.log('%c next state  ', 'color:#4CAF50;font-weight:bold', api.getState());
  console.groupEnd();
  return result;
};

// Thunk
MiniRedux.thunk = (api) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(api.dispatch, api.getState);
  }
  return next(action);
};

if (typeof module !== 'undefined') module.exports = MiniRedux;
