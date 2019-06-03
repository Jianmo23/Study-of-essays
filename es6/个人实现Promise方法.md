```js
// 类型判断
const TYPE = variable => !variable ? '' : Object.prototype.toString.call(variable).replace(/\[object\s*|\]/ig, '').toLowerCase();

const isFunction = f => TYPE(f) === 'function';

// 定义 Promise 三种状态常量
/*
 * Promise 共有三种状态： Pending(进行中)、Fulfilled(成功)、Rejected(失败)
 * 状态只能由 Pending 变为 Fulfilled 或由 Pending 变为 Rejected ，且状态改变之后不会再发生变化，会一直保持这个状态。
*/
const PENDING = 'PENDING',
      FULFILLED = 'FULFILLED',
      REJECTED = 'REJECTED';

class MyPromise {
    constructor (handle) {
        // 实例化时需要传递函数作为参数
        if (!isFunction(handle)) {
            throw new Error('MyPromise must accept a function as a parameter');
        }
        // 添加状态
        this._status = PENDING;
        // 添加 Promise 值
        this._value = undefined;
        // 添加成功回调函数队列
        this._fulfilledQueues = [];
        // 添加失败回调函数队列
        this._rejectedQueues = [];
        // 执行 handle
        try {
            handle(this._resolve.bind(this), this._reject.bind(this));
        } catch (e) {
            this._reject(e);
        }

        // 添加 resolve 时执行的函数
        _resolve (val) {
            const run = () => {
                if(this._status !== PENDING) { return; }

                this._status = FULFILLED;

                // 依次执行成功队列中的函数，并清空队列
                const runFulfilled = value => {
                    let cb;
                    while(cb = this._fulfilledQueues.shift()) {
                        cb(value);
                    }
                };
                // 依次执行失败队列中的函数，并清空队列
                const runRejected = error => {
                    let cb;
                    while(cb = this._fulfilledQueues.shift()) {
                        cb(error);
                    }
                };

                // 如果 resolve 的参数为 Promise 对象，则必须等待该 Promise 对象状态改变后,
                // 当前 Promsie 的状态才会改变，且状态取决于参数 Promsie 对象的状态
                if (val instanceof MyPromise) {
                    val.then(value => {
                        this._value = value;
                        runFulfilled(value);
                    }, err => {
                        this._value = err;
                        runRejected(err);
                    });
                } else {
                    this._value = val;
                    runFulfilled(val);
                }
            };

            // 为了支持同步的 Promise，这里采用异步调用
            setTimeout(() => run(), 0)
        }

        // 添加 reject 时执行的函数
        _reject (err) {
            if(this._status !== PENDING) { return; }

            // // 依次执行失败队列中的函数，并清空队列
            const run = () => {
                this._status = REJECTED;
                this._value = err;

                let cb;
                while(cb = this._rejectedQueues.shift()) {
                    cb(err);
                }
            };

            // 为了支持同步的 Promise，这里采用异步调用
            setTimeout(run, 0)
        }
    }
    /*
     * 实现 Promise.then 方法
     * Promise.then(onFulfilled, onRejected)
     * onFulfilled 和 onRejected 都是可选参数。
     * 如果 onFulfilled 或 onRejected 不是函数，其必须被忽略
    */
    then (onFulfilled, onRejected) {
        const {_value, _status} = this;

        // 内部返回新的 Promise 实例
        return new MyPromise((onFulfilledNext, onRejectedNext) => {
            // 封装一个成功时执行的函数
            let fulfilled = value => {
                try {
                    // 保证 then 方法的第一个参数不存在或非函数时正常调用
                    if (!isFunction(onFulfilled)) {
                        onFulfilledNext(value);
                    } else {
                        let res = onFulfilled(value);

                        if (res instanceof MyPromise) {
                            // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                            res.then(onFulfilledNext, onRejectedNext);
                        } else {
                            // 否则会将返回结果直接作为参数，传入下一个 then 的回调函数，并立即执行下一个 then 的回调函数
                            onFulfilledNext(res);
                        }
                    }
                } catch (err) {
                    // 如果执行报错，新的 Promise 对象的状态为失败
                    onRejectedNext(err);
                }
            };

            // 封装一个失败时执行的函数
            let rejected = error => {
                try {
                    // // 保证 then 方法的第二个参数不存在或非函数时正常调用
                    if (!isFunction(onRejected)) {
                        onRejectedNext(error);
                    } else {
                        let res = onRejected(error);

                        if (res instanceof MyPromise) {
                            // 如果当前回调函数返回 MyPromise 对象，必须等待其状态改变后在执行下一个回调
                            res.then(onFulfilledNext, onRejectedNext);
                        } else {
                            // 否则会将返回结果直接作为参数，传入下一个 then 的回调函数，并立即执行下一个 then 的回调函数
                            // then 之后后返回的是一个新的 Promise 实例， 在执行不报错的情况下，存在链式调用时会执行 then 的第一个参数
                            onFulfilledNext(res);
                        }
                    }
                } catch (err) {
                    // 如果函数执行出错，新的 Promise 对象的状态为失败
                    onRejectedNext(err);
                }
            };

            switch (_status) {
                // 当状态为 pending 时，将 then 方法回调函数加入执行队列等待执行
                case PENDING:
                    this._fulfilledQueues.push(fulfilled);
                    this._rejectedQueues.push(rejected);
                    break;
                // 状态转变后执行对应的回调函数
                case FULFILLED:
                    fulfilled(_value);
                    break;
                case REJECTED:
                    rejected(_value);
                    break;
            }
        });
    }
    catch (onRejected) {
        return this.then(undefined, onRejected);
    }
    finally (cb) {
        // finally 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作
        this.then(
            value => MyPromise.resolve(cb()).then(() => value),
            reason => MyPromise.resolve(cb()).then(() => { throw reason; })
        );
    }
    // 静态方法
    static resolve (value) {
        if (value instanceof MyPromise) { return value; }

        return new Promise(resolve => resolve(value));
    }
    // 静态方法
    static reject (value) {
        // Promise.reject() 方法的参数，会原封不动地作为 `reject` 的理由，变成后续方法的参数。这一点与 `Promise.resolve` 方法不一致。
        return new MyPromise((resolve, reject) => reject(value));
    }
    // 静态方法
    static race (list) {
        return new MyPromise((resolve, reject) => {
            for (let p of list) {
                // 只要有一个实例率先改变状态，新的 MyPromise 的状态就跟着改变
                this.resolve(p).then(res => {
                    resolve(res);
                }, err => {
                    reject(err);
                });
            }
        });
    }
    // 静态方法
    static all (list) {
        return new MyPromise((resolve, reject) => {
            // 返回值的集合
            let values = [];
            let count = 0;
            for (let [i, p] of list.entries()) {
                // 数组参数如果不是 MyPromise 实例，先调用 MyPromise.resolve
                this.resolve(p).then(res => {
                    values[i] = res;
                    count++;
                    // 所有状态都变成 fulfilled 时返回的 MyPromise 状态就变成 fulfilled
                    if (count === list.length) { resolve(values) }
                }, err => {
                    // 有一个被 rejected 时返回的 MyPromise 状态就变成 rejected
                    reject(err);
                })
            }
        });
    }
}
```

## 引用
* [Promise 实现](https://www.jianshu.com/p/43de678e918a)
* [改进：一个Promise实现](https://www.jianshu.com/p/4f3bef72758c)
