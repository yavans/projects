/**
 * Promise/A+ 规范完整实现
 * 通过 promises-aplus-tests 官方测试套件
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.MyPromise = factory();
  }
})(this, function () {
  'use strict';

  const PENDING   = 'pending';
  const FULFILLED = 'fulfilled';
  const REJECTED  = 'rejected';

  // Promise resolution procedure (2.3)
  function resolvePromise(promise, x, resolve, reject) {
    // 2.3.1: if promise and x refer to the same object
    if (promise === x) {
      return reject(new TypeError('Chaining cycle detected'));
    }

    // 2.3.2: if x is a MyPromise
    if (x instanceof MyPromise) {
      return x.then(
        val  => resolvePromise(promise, val, resolve, reject),
        err  => reject(err)
      );
    }

    // 2.3.3: if x is an object or function
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      let called = false;
      try {
        const then = x.then;
        if (typeof then === 'function') {
          then.call(x,
            y => {
              if (called) return;
              called = true;
              resolvePromise(promise, y, resolve, reject);
            },
            r => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } else {
          resolve(x);
        }
      } catch (e) {
        if (called) return;
        called = true;
        reject(e);
      }
    } else {
      resolve(x);
    }
  }

  function MyPromise(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state !== PENDING) return;
      this.state = FULFILLED;
      this.value = value;
      this.onFulfilledCallbacks.forEach(fn => fn());
    };

    const reject = (reason) => {
      if (this.state !== PENDING) return;
      this.state = REJECTED;
      this.reason = reason;
      this.onRejectedCallbacks.forEach(fn => fn());
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  // 2.2: The then method
  MyPromise.prototype.then = function (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    onRejected  = typeof onRejected  === 'function' ? onRejected  : e => { throw e; };

    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state === FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) { reject(e); }
        }, 0);
      }

      if (this.state === REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) { reject(e); }
        }, 0);
      }

      if (this.state === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) { reject(e); }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) { reject(e); }
          }, 0);
        });
      }
    });

    return promise2;
  };

  MyPromise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
  };

  MyPromise.prototype.finally = function (callback) {
    return this.then(
      value => MyPromise.resolve(callback()).then(() => value),
      reason => MyPromise.resolve(callback()).then(() => { throw reason; })
    );
  };

  // Static methods
  MyPromise.resolve = function (value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value));
  };

  MyPromise.reject = function (reason) {
    return new MyPromise((_, reject) => reject(reason));
  };

  MyPromise.all = function (promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('Argument must be an array'));
      }
      const results = [];
      let count = 0;
      if (promises.length === 0) return resolve(results);

      promises.forEach((p, i) => {
        MyPromise.resolve(p).then(
          val => {
            results[i] = val;
            count++;
            if (count === promises.length) resolve(results);
          },
          reject
        );
      });
    });
  };

  MyPromise.race = function (promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(p => MyPromise.resolve(p).then(resolve, reject));
    });
  };

  MyPromise.allSettled = function (promises) {
    return new MyPromise((resolve) => {
      const results = [];
      let count = 0;
      if (promises.length === 0) return resolve(results);

      promises.forEach((p, i) => {
        MyPromise.resolve(p).then(
          value => {
            results[i] = { status: 'fulfilled', value };
            count++;
            if (count === promises.length) resolve(results);
          },
          reason => {
            results[i] = { status: 'rejected', reason };
            count++;
            if (count === promises.length) resolve(results);
          }
        );
      });
    });
  };

  MyPromise.any = function (promises) {
    return new MyPromise((resolve, reject) => {
      const errors = [];
      let count = 0;
      if (promises.length === 0) {
        return reject(new AggregateError([], 'All promises were rejected'));
      }
      promises.forEach((p, i) => {
        MyPromise.resolve(p).then(resolve, err => {
          errors[i] = err;
          count++;
          if (count === promises.length) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        });
      });
    });
  };

  return MyPromise;
});
