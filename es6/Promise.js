const TYPE = p => Object.prototype.toString.call(p).replace(/\[object\s*|\]/ig, '').toLowerCase();

const isFunction = f => !!f && TYPE(f) === 'function';

const PENDING = 'PENDING',
    FULFILLED = 'FULFILLED',
    REJECTED = 'REJECTED';

class MyPromise {
    constructor(handle) {
        if (!isFunction(handle)) {
            throw new Error('MyPromise must accept a function as a parameter.');
        }

        this._status = PENDING;
        this._value = undefined;
        this._fulfilledQueues = [];
        this._rejectedQueues = [];

        try {
            handle(this._resolve.bind(this), this._reject.bind(this));
        } catch (e) {
            this._reject(e);
        }

        this._resolve(val) {
            const run = () => {
                if (this._status !== PENDING) { return; }

                this._status = FULFILLED;
                this._value = val;

                const runFulfilled = (value) => {
                    let cb;
                    while (cb = this._fulfilledQueues.shift()) {
                        cb(value);
                    }
                }

                const runRejected = (value) => {
                    let cb;
                    while (cb = this._rejectedQueues.shift()) {
                        cb(value);
                    }
                }

                if (val instanceof MyPromise) {
                    val.then(res => {
                        this._value = res;
                        runFulfilled(res);
                    }, err => {
                        this._value = err;
                        runRejected(err);    
                    })
                } else {
                    this._value = val;
                    runFulfilled(val);
                }
            }

            setTimeout(run, 0);
        }
        this._reject(val) {
            if (this._status !== PENDING) { return; }
            
            const run = () => {
                this._status = REJECTED;
                this._value = val;

                let cb;
                while (cb = this._rejectedQueues.shift()) {
                    cb(val);
                }
            }

            setTimeout(run, 0);
        }
    }

    then(onFulfilled, onRejected) {
        const { _value, _status } = this;
        
        return new MyPromise(function (onFulfilledNext, onRejectedNext) {
            let fulfilled = value => {
                try {
                    if (!isFunction(onFulfilled)) {
                        onFulfilledNext(value);
                    } else {
                        let res = onFulfilled(value);

                        if (res instanceof MyPromise) {
                            res.then(onFulfilledNext, onRejectedNext)
                        } else {
                            onFulfilledNext(res);
                        }
                    }
                } catch (e) {
                    onRejectedNext(e);
                }
            };

            let rejected = value => {
                try {
                    if (!isFunction(onRejected)) {
                        onRejectedNext(value);
                    } else {
                        let res = onRejected(value);

                        if (res instanceof MyPromise) {
                            res.then(onFulfilledNext, onRejectedNext)
                        } else {
                            onRejectedNext(res);
                        }
                    } 
                } catch (e) {
                    onRejectedNext(e);
                }
            };

            switch (_status) {
                case PENDING:
                    this._fulfilledQueues.push(fulfilled);
                    this._rejectedQueues.push(rejected);
                    break;
                case FULFILLED:
                    fulfilled(_value);
                    break;
                case REJECTED:
                    rejected(_value);
                    break;
            }
        });
    }
}