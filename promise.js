class Promise {
  constructor(fn) {
    if (typeof fn !== "function") {
      throw new TypeError("fn is required");
    }
    this.state = 0;
    this.handlers = [];
    this.doResolve(this, fn);
  }

  doResolve(promise, fn) {
    let done = false;
    try {
      fn(
        (value) => {
          if (done) return;
          this.resolve(promise, value);
          done = true;
        },
        (e) => {
          if (done) return;
          this.reject(promise, e);
        }
      );
    } catch (e) {
      done = true;
      this.reject(promise, e);
    }
  }

  resolve(promise, value) {
    if (value === promise) {
      throw new TypeError("can not resolve itself");
    }

    if (value && typeof value === "object") {
      if (value instanceof Promise) {
        promise.state = 3;
        // this.deffer = value
        this.value = value;
      } else {
        try {
          // if `value.then` result in that throws a error, reject()
          // if calling value.then throws a error,reject()
          // calling value.then with value as `this`,
          // first argument is resolve, seond is reject
          const then = value.then;
          this.doResolve(promise, then.bind(value));
        } catch (e) {
          // throw e;
          this.reject(promise, e);
        }
      }
    } else {
      promise.state = 1;
      promise.value = value;
      this.finale(promise);
    }
  }
  finale(promise) {
    let handler;
    while ((handler = promise.handlers.shift())) {
      this.handle(promise, handler);
    }
  }

  handle(promise, handler) {
    let p = promise;
    while (p.state === 3) {
      p = p.value;
    }
    if (p.state === 0) {
      promise.handlers.push(handler);
    } else {
      this.handleResolve(promise, handler);
    }
  }

  handleResolve(promise, handler) {
    setTimeout(() => {
      const cb =
        promise.state === 1 ? handler.onFullfilled : handler.onRejected;
      if (!cb) {
        if (promise.state === 1) {
          this.resolve(handler.promise);
        } else {
          this.reject(handler.promise);
        }
      }

      try {
        const res = cb(promise.value);
        this.resolve(handler.promise, res);
      } catch (e) {
        this.reject(handler.promise, e);
      }
    }, 0);
  }

  reject(promise, value) {
    promise.state = 2;
    promise.value = value;
    this.finale(promise);
  }
  then(onFullfilled, onRejected) {
    const promise = new Promise((r1, r2) => {});
    this.handle(this, { promise: promise, onFullfilled, onRejected });
    return promise;
  }
}

module.exports = Promise;
