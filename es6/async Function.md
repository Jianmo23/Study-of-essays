* 时间：`2019-05-31`
* 运行环境： `macOS 10.14.4  chrome 版本 73.0.3683.86（正式版本)`
* NodeJS：`node v9.0.0  npm v6.9.0`
* 更新时间： ``

# 含义
`async` 函数是 ES2017 标准引入的，使得异步操作更加简单；它是 `Generator` 函数的语法糖。

```js
// Generator
const fs = require('fs');

const readFile = function (fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName, function (error, data) {
            if (error) {
                return reject(error);
            }

            resolve(data);
        })
    });
}

const gen = function* () {
    let f1 = yield readFile('/a');
    let f2 = yield readFile('/b');

    console.log(f1.toString());
    console.log(f2.toString());
}
```
使用 `async` 函数改写 `gen` 遍历器函数：
```js
const asyncReadFile = async function () {
    let f1 = await readFile('/a');
    let f2 = await readFile('/b');

    console.log(f1.toString());
    console.log(f2.toString());
}
```
对比发现：**`async` 函数就是将 `Generator` 函数的星号（`*`）替换成 `async`，将 `yield` 替换成 `await`，仅此而已。**

`async` 函数对 `Generator` 函数的改进，体现在以下四点:
## (1) 内置执行器
`Generator` 函数的执行必须靠执行器，所以才有了 `co` 模块，而 `async` 函数自带执行器。也就是说，`async` 函数的执行，与普通函数一模一样，只要一行。
```js
asyncReadFile()
```

## (2) 更好的语义
`async` 和 `await`，比起星号 `*` 和 `yield`，语义更清楚了。`async` 表示函数里有异步操作，`await` 表示紧跟在后面的表达式需要等待结果。

## (3) 更广的适用性
`co` 模块约定，`yield` 命令后面只能是 `Thunk` 函数或 `Promise` 对象，而 `async` 函数的 `await` 命令后面，可以是 `Promise` 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 `resolved` 的 `Promise` 对象）。

## (4) 返回值是 `Promise`
`async` 函数的返回值是 `Promise` 对象，这比 `Generator` 函数的返回值是 `Iterator` 对象方便多了。你可以用 `then` 方法指定下一步的操作。

进一步说，`async` 函数完全可以看作多个异步操作，包装成的一个 `Promise` 对象，而 `await` 命令就是内部 `then` 命令的语法糖。

# 基本用法
`async` 函数返回一个 `Promise` 对象，可以使用 `then` 方法添加回调函数。当函数执行的时候，一旦遇到 `await` 就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

```js
// 案例一
async function getStockPriceByName (name) {
    let symbol = await getStockSymbol(name);
    let stockPrice = await getStockPrice(symbol);

    return stockPrice;
}
getStockPriceByName('goog').then(function (result) {
    console.log(result);
})

// 案例二
function timeout (ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms);
    })
}

async function asyncPrint (value, ms) {
    await timeout(ms);
    console.log(value);
}
asyncPrint('hello', 1000);
```
由于 `async` 函数返回的是 `Promise` 对象，可以作为 `await` 命令的参数。
```js
// 改写案例二
async function timeout (ms) {
    await new Promise(function (resolve, reject) {
        setTimeout(resolve, ms);
    })
}

async function asyncPrint (value, ms) {
    await timeout(ms);
    console.log(value);
}
asyncPrint('hello', 1000);
```
`async` 函数有多种使用形式:
```js
// 函数声明式
async function foo () {}

// 函数表达式
var foo = async function () {}

// 对象方法
var obj = {
    async foo () {} // 没有 function 关键字
}
obj.foo().then(function () {})

// class 的方法
class Storage {
    constructor () {
        this.cachePromise = cache.open('avatars');
    }

    async getAvatar (name) {
        let cache = await this.cachePromise;
        return cache.match(`/avatars/${name}.jpg`);
    }
}
var storage = new Storage();
storage.getAvatar('jake').then(function (result) {});

// 剪头函数
const foo = async () => {};
```

# 语法
> async 函数的语法规则总体上比较简单，难点是错误处理机制。

## 返回 `Promise` 对象
**`async` 函数返回一个 `Promise` 对象。**

**`async` 函数内部 `return` 语句返回的值，会成为 `then` 方法回调函数的参数。**

**`async` 函数内部抛出错误，会导致返回的 `Promise` 对象变为 `reject` 状态。抛出的错误对象会被 `catch` 方法回调函数接收到。**

```js
// 验证一
async function f () {
    return 'hello world';
    // 等同于
    // return Promise.resolve('hello world');
}
f().then(v => console.log(v)); // 'hello world'

// 验证二
async function f () {
    throw new Error('出错了！')
}

f().then(function (resp) {
    console.log('success: ', resp);
}, function (resp) {
    console.log('error: ', resp);
}).catch(resp => {
    console.log('catch: ', resp);
})
// error:  Error: 出错了！
// 备注：catch 方法未执行的原因是 then 中的 error 方法内部返回的是一个全新的 Promise 实例，且 error 方法内部没有错误被捕获！
```

## Promise 对象的状态变化
`async` 函数返回的 `Promise` 对象，必须等到内部所有 `await` 命令后面的 `Promise` 对象执行完，才会发生状态改变，除非遇到 `return` 语句或者抛出错误。也就是说，只有 `async` 函数内部的异步操作执行完，才会执行 `then` 方法指定的回调函数。

## `await` 命令
正常情况下，`await` 命令后面是一个 `Promise` 对象，返回该对象的结果。如果不是 `Promise` 对象，就直接返回对应的值。

```js
async function f () {
    return 123;
    // 等同于
    // return await 123;
}
f().then(console.log);
```

另一种情况是，`await` 命令后面是一个 `thenable` 对象（即定义 `then` 方法的对象），那么 `await` 会将其等同于 `Promise` 对象。

```js
class Sleep {
    constructor (timeout) {
        this.timeout = timeout;
    }
    then (resolve, reject) {
        let startTime = Date.now();
        console.log(11111)

        setTimeout(() => {
            resolve(Date.now() - startTime)
        }, this.timeout);
    }
}

(async function () {
    let actualTime = await new Sleep(1000);
    console.log(actualTime);
})()
```
上面代码中，`await` 命令后面是一个 `Sleep` 对象的实例。这个实例不是 `Promise` 对象，但是因为定义了 `then` 方法，`await` 会将其视为 `Promise` 处理。


await命令后面的 Promise 对象如果变为reject状态，则reject的参数会被catch方法的回调函数接收到。
```js
async function f () {
    await Promise.reject('出错了');
    // 等同于
    // return await Promise.reject('出错了');
}
f().then(resp => console.log('success: ', resp))
.catch(resp => console.log('catch: ', resp))
// catch:  出错了
```
`await` 语句前面没有 `return`，但是 `reject` 方法的参数依然传入了 `catch` 方法的回调函数。这里如果在 `await` 前面加上 `return`，效果是一样的。

**任何一个 `await` 语句后面的 `Promise` 对象变为 `reject` 状态，那么整个 `async` 函数都会中断执行。**
```js
async function f() {
  await Promise.reject('出错了');
  await Promise.resolve('hello world'); // 不会执行
}
f().then(resp => console.log('success: ', resp))
.catch(resp => console.log('catch: ', resp))
// catch:  出错了
```

如果希望即使一个异步操作失败，也不要中断后面的异步操作。有两种方法可以实现：

**方法一：**

可以将这个 `await` 放在 `try...catch` 结构里面，这样不管这个异步操作是否成功，第二个 `await` 都会执行。
```js
async function f () {
    try {
        await Promise.reject('出错了');
    } catch (e) {}

    return await Promise.resolve('hello world!')
}
f().then(resp => console.log('success: ', resp))
.catch(resp => console.log('catch: ', resp))
// success:  hello world!
```

**方法二：**
在可能失败的 `await` 后面的 `Promise` 对象再跟一个 `catch` 方法，处理前面可能出现的错误。
```js
async function f () {
    await Promise.reject('出错了').catch(resp => console.log('inner catch: ', resp))

    return await Promise.resolve('hello world!')
}
f().then(resp => console.log('success: ', resp))
.catch(resp => console.log('catch: ', resp))
// inner catch:  出错了
// success:  hello world!
```

## 错误处理
如果 `await` 后面的异步操作出错，那么等同于 `async` 函数返回的 `Promise` 对象被 `reject`。

```js
async function f () {
    await new Promise(function (resolve, reject) {
        throw new Error('出错了'); // new Error('出错了') 整个将作为参数传递给 catch 方法
    })
}

f().then(resp => console.log('success: ', resp))
.catch(resp => console.log('catch: ', resp.message))
// catch:  出错了
```

如果防止因为出错中断执行 `async` 函数，可以采用 `try...catch` 语句包裹
```js
async function f () {
    try {
        await new Promise(function (resolve, reject) {
            throw new Error('出错了');
        })
    } catch (e) {}

    return await('hello world'); // await() 当做方法调用
}
f().then(resp => console.log('success: ', resp))
.catch(resp => console.log('catch: ', resp.message))
// success:  hello world

// 使用 try...catch 结构，实现多次重复尝试。
const superagent = require('superagent');
const NUM_RETRIES = 3;
async function test () {
    let i;
    for (i = 0; i < NUM_RETRIES; ++i) {
        try {
            await superagent.get('http://google.com/this-throws-an-error');
            break;
        } catch (e) {}
    }
    console.log(i);
}
// 如果 await 操作成功，就会使用 break 语句退出循环；如果失败，会被 catch 语句捕捉，然后进入下一轮循环。
```

## 使用注意点

### `await` 命令后面的 `Promise` 可能会是 `rejected` 因此最好使用 `try...catch` 语句包裹
```js
// 法一
async function f () {
    try{
        await new Promise(function (resolve, reject) {
            reject()
        })
    } catch (e) {}
 }

// 法二
async function f () {
    await new Promise(function (resolve, reject) {
        reject()
    }).catch(function (resp) {})
 }
```

### 多个 `await` 命令后面的异步操作，**如果不存在继发关系，最好让它们同时触发**。
```js
async function f () {
    // getFoo 和 getBar是两个独立的异步操作（即互不依赖），被写成继发关系。
    // 这样比较耗时，因为只有 getFoo 完成以后，才会执行 getBar，完全可以让它们同时触发。
    let foo = await getFoo();
    let bar = await getBar();

    // 修改一
    //let [foo, bar] await Promise.all([getFoo(), getBar()]);

    // 修改二
    //let fooPromise = getFoo();
    //let barPromise = getBar();

    //let foo = await fooPromise;
    //let bar = await barPromise;
}
```
上面两种写法，`getFoo` 和 `getBar` 都是同时触发，这样就会**缩短程序的执行时间**。

## `await` 命令只能用在 `async` 函数之中，如果用在普通函数，就会报错。
```js
async function f (db) {
    let data = [{}, {}, {}];

    data.forEach(function (doc) {
        await db.post(doc); // 报错
    })
}
```
修改
```js
async function f (db) {
    let data = [{}, {}, {}];

    // 可能得到错误结果
    data.forEach(async function (doc) {
        await db.post(doc);
    })
}
// 上面代码可能不会正常工作，原因是这时三个 db.post 操作将是并发执行，也就是同时执行，
// 而不是继发执行。正确的写法是采用 for 循环。
```
再次修改
```js
async function f (db) {
    let data = [{}, {}, {}];

    // 继发执行？
    for (let doc of data) {
        await db.post(doc);
    }
}
```
如果确实希望多个请求并发执行，可以使用 `Promise.all` 方法。当三个请求都会 `resolved` 时，下面两种写法效果相同。
```js
// 法一
async function f (db) {
    let data = [{}, {}, {}];
    let promises = data.map(doc => db.post(doc));

    let results = await Promise.all(promises);
    console.log(results);
}

// 法二
async function f (db) {
    let data = [{}, {}, {}];
    let promises = data.map(doc => db.post(doc));

    let results = [];
    for (let promise of promises) {
        results.push(await promise);
    }
    console.log(results);
}
```

目前，`esm` 模块加载器支持顶层 `await`，即 `await` 命令可以不放在 `async` 函数里面，直接使用。
```js
// async 函数的写法
const start = async () => {
  const res = await fetch('google.com');
  return res.text();
};

start().then(console.log);

// 顶层 await 的写法
const res = await fetch('google.com');
console.log(await res.text());
// 备注：使用 esm 加载器，才会生效。
```

### `async` 函数可以保留运行堆栈
```js
const a = () => {
  b().then(() => c());
};
```
上面代码中，函数 `a` 内部运行了一个异步任务 `b()`。当 `b()` 运行的时候，函数 `a()` 不会中断，而是继续执行。
等到 `b()` 运行结束，可能 `a()` 早就运行结束了，`b()` 所在的上下文环境已经消失了。
如果 `b()` 或 `c()` 报错，错误堆栈将不包括 `a()`。

改写成 `async` 函数
```js
const a = async () => {
    await b();
    c();
}
// 通过改写可以看出 await 命令后的语句在实际执行时机层间讲，相当于
// .then(function () { /*somme code*/ })
```
上面代码中，`b()` 运行的时候，`a()` 是暂停执行，上下文环境都保存着。一旦 `b()` 或 `c()` 报错，错误堆栈将包括 `a()`。

# `async` 函数的实现原理
> async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。

```js
async function fn (args) {
    /* some code */
}

// 等同于
function fn (args) {
    return spawn(function* () {
        /* some code */
    })
}
// 所有的 async 函数都可以写成上面的第二种形式，其中的 spawn 函数就是自动执行器。
```

```js
// spawn 自动执行器的实现
function spawn (genF) {
    return new Promise(function (resolve, reject) {
        const gen = genF();

        function step (nextF) {
            let next;

            try {
                next = nextF();
            } catch (e) {
                return reject(e);
            }

            if (next.done) {
                return resolve(next.value);
            }

            Promise.resolve(next.value).then(function (v) {
                step(function () {
                    return gen.next(v);
                })
            }, function (e) {
                step(function () {
                    // 向 Generator 函数内部拋错
                    return gen.throw(e);
                })
            });
        }

        step(function () { return gen.next(undefined) });
    });
}


// 个人实现一
function spawn (genF) {
    return new Promise(function (resolve, reject) {
        const gen = genF();
        let curIter = gen.next();

        function step () {
            if (curIter.done) {
                return resolve(curIter.value);
            }

            Promise.resolve(curIter.value).then(function (v) {
                curIter = gen.next(v);
                step();
            }).catch(function (e) {
                gen.throw(e);
            });
        }

        step();
    });
}
// 该方法含有闭包问题，且在第一次运行时没有 try...catch 有可能发生的错误

// 个人实现二
function spawn (genF) {
    return new Promise(function (resolve, reject) {
        const gen = genF();

        function step (preV = undefined) {
            let curIter = {};
            try {
                curIter = gen.next(preV);
            } catch (e) {
                return reject(e);
            }

            if (curIter.done) {
                return resolve(curIter.value);
            }

            Promise.resolve(curIter.value).then(function (v) {
                step(v);
            }).catch(function (e) {
                gen.throw(e);
            });
        }

        step();
    });
}
```

# 与其他异步处理方法的比较

例：假定某个 DOM 元素上面，部署了一系列的动画，前一个动画结束，才能开始后一个。如果当中有一个动画出错，就不再往下执行，返回上一个成功执行的动画的返回值。

分别使用 async 函数与 Promise、Generator 函数实现上述效果，进而比较：

```js
// Promise
function chainAnimationsPromise (elem, animations) {
    // 保存上一个动画的返回值
    let ret = null;

    let p = Promise.resolve();

    for (let anim of animations) {
        // 使用then方法，添加所有动画
        p = p.then(function (val) {
            ret = val;
            return anim(elem);
        });
    }

    return p.catch(function (e) {
        /* 忽略错误，继续执行 */
    }).then(function () {
        return ret;
    });
}

// for...of 循环内使用 Promise 执行示例
var arr = [
    new Promise(function (resolve, reject) {
        resolve(1);
    }),
    new Promise(function (resolve, reject) {
        reject(2);
    }),
    new Promise(function (resolve, reject) {
        resolve(3);
    })
];
var promise = Promise.resolve();
for (let p of arr) {
    promise = promise.then(resp => {
        console.log(resp)
        return p;
    });
    console.log(promise); // arr[2] 元素不会再被 then 捕获
}
promise.catch(resp => console.log('catch: ', resp))
```
虽然 `Promise` 的写法比回调函数的写法大大改进，但是一眼看上去，代码完全都是 `Promise` 的 API（`then`、`catch`等等），操作本身的语义反而不容易看出来。

```js
// Generator
function chainAnimationsGenerator (elem, animations) {
    return spawn(*function () {
        let ret = null;

        try {
            for (let anim of animations) {
                ret = yield anim(elem);
            }
        } catch (e) {
            /* 忽略错误，继续执行 */
        }

        return ret;
    });
}
```
上面代码使用 Generator 函数遍历了每个动画，语义比 Promise 写法更清晰，用户定义的操作全部都出现在 `spawn` 函数的内部。
这个写法的问题在于，必须有一个任务运行器，自动执行 Generator 函数，上面代码的 `spawn` 函数就是自动执行器，它返回一个 `Promise` 对象，
而且必须保证 `yield` 语句后面的表达式，必须返回一个 `Promise`。

```js
// async
async function chainAnimationsAsync (elem, animations) {
    let ret = null;
    try {
        for (let anim of animations) {
            ret = await anim(elem);
        }
    } catch (e) {
        /* 忽略错误，继续执行 */
    }

    return ret;
}
```
可以看到 `Async` 函数的实现最简洁，最符合语义，几乎没有语义不相关的代码。它将 `Generator` 写法中的自动执行器，改在语言层面提供，不暴露给用户，因此代码量最少。
如果使用 `Generator` 写法，自动执行器需要用户自己提供。

# 实例：按顺序完成异步造作
实际开发中，经常遇到一组异步操作，需要按照顺序完成。比如，依次远程读取一组 URL，然后按照读取的顺序输出结果

```js
// Promise 实现
function logInOrder (urls = []) {
    // 远程读取所有urls
    const textPromises =  urls.map(url => {
        return fetch(url).then(resp => resp.text());
    });

    // 按次序输出
    textPromises.reduce(function (chain, textPromise) {
        return chain.then(() => textPromise).then(console.log);
        // 没有这样写的原因是： 初试的 chain 是一个空的 Promise 实例，通过传递 Promise.resolve() 实现
        // return chain.then(console.log);
    }, Promise.resolve())
}
```

```js
// async
async function logInOrder (urls = []) {
    for (let url of urls) {
        let resp = await fetch(url);
        console.log(await resp.text())
    }
}
```
上面代码确实大大简化，问题是所有远程操作都是继发。只有前一个 URL 返回结果，才会去读取下一个 URL，这样做效率很差，非常浪费时间。我们需要的是并发发出远程请求。

```js
async function logInOrder (urls = []) {
    const textPromises = urls.map(async url => {
        let resp = await fetch(url);
        return resp.text();
    });

    for (let textPromise of textPromises) {
        // 这种直接打印的方式虽然是按序执行  但是不能保证有内容输出
        // textPromise.then(console.log)

        // OK, textPromise 执行结束才会进入下一次循环
        console.log(await textPromise);
    }
}
```
上面代码中，虽然 `map` 方法的参数是 `async` 函数，但它是并发执行的，因为只有 `async` 函数内部是继发执行，外部不受影响。
后面的 `for..of` 循环内部使用了 `await`，因此实现了按顺序输出。

# 异步遍历器
`Iterator` 接口是一种数据遍历的协议，只要调用遍历器对象的 `next` 方法，就会得到一个对象，表示当前遍历指针所在的那个位置的信息。
`next` 方法返回的对象的结构是 `{value, done}`，其中 `value` 表示当前的数据的值，`done` 是一个布尔值，表示遍历是否结束。

这里隐含着一个规定，**`next` 方法必须是同步的，只要调用就必须立刻返回值**。也就是说，一旦执行 `next` 方法，就必须同步地得到 `value` 和 `done` 这两个属性。
如果遍历指针正好指向同步操作，当然没有问题，但对于异步操作，就不太合适了。目前的解决方法是:
`Generator` 函数里面的异步操作，返回一个 `Thunk` 函数
或者
`Promise` 对象，
即 `value` 属性是一个 `Thunk` 函数或者 `Promise` 对象，等待以后返回真正的值，而 `done` 属性则还是同步产生的。

JavaScript 语言是 **传值调用**，它的 `Thunk` 函数含义有所不同。在 JavaScript 语言中，`Thunk` 函数替换的不是表达式，而是多参数函数，将其替换成一个只接受回调函数作为参数的单参数函数。
```js
// 回忆 thunk 函数的实现
function thunk (fn) {
    return function () {
        const args = new Array(arguments.length),
              ctx = this;

        for (let i = 0, len = arguments.length; i < len; i++) {
            args[i] = arguments[i];
        }

        return function (done) {
            let called = false;

            args.push(function () {
                if (called) { return; }

                called = true;
                done && done.apply(ctx, arguments);
            });

            try {
                fn.apply(ctx, args);
            } catch (e) {
                done && done(e);
            }
        }
    }
}
```
**ES2018** 引入了“异步遍历器”（`Async Iterator`），为异步操作提供原生的遍历器接口，即 `value` 和 `done` 这两个属性都是异步产生。

## 异步遍历的接口
异步遍历器的最大的语法特点，就是调用遍历器的 `next` 方法，返回的是一个 `Promise` 对象。

```js
asyncIterator.next().then(({value, done}) => console.log(value, done))
```

我们知道，一个对象的同步遍历器的接口，部署在 `Symbol.iterator` 属性上面。同样地，对象的异步遍历器接口，部署在 `Symbol.asyncIterator` 属性上面。
不管是什么样的对象，只要它的 `Symbol.asyncIterator` 属性有值，就表示应该对它进行异步遍历。

```js
const asyncIterable = createAsyncIterable(['a', 'b']);
const asyncIterator = asyncIterable[Symbol.asyncIterator]();


asyncIterator.next().then(iterResult1 => {
    console.log(iterResult1); // {value: 'a', done: false}
    return asyncIterator.next();
}).then(iterResult2 => {
    console.log(iterResult2); // {value: 'b', done: false}
    return asyncIterator.next();
}).then(iterResult3 => {
    console.log(iterResult3); // {value: undefined, done: true}
})
```
上面代码中，异步遍历器其实返回了两次值。第一次调用的时候，返回一个 `Promise` 对象；等到 `Promise` 对象 `resolve` 了，再返回一个表示当前数据成员信息的对象。
这就是说，**异步遍历器与同步遍历器最终行为是一致的，只是会先返回 `Promise` 对象，作为中介。**

由于异步遍历器的 `next` 方法，返回的是一个 `Promise` 对象。因此，可以把它放在 `await` 命令后面。
```js
async function f () {
    const asyncIterable = createAsyncIterable(['a', 'b']);
    const asyncIterator = asyncIterable[Symbol.asyncIterator]();

    console.log(await asyncIterator.next());
    // {value: 'a', done: false}
    console.log(await asyncIterator.next());
    // {value: 'b', done: false}
    console.log(await asyncIterator.next());
    // {value: undefined, done: true}
}
```

**注意，异步遍历器的 `next` 方法是可以连续调用的，不必等到上一步产生的 `Promise` 对象 `resolve` 以后再调用。**
这种情况下，`next` 方法会累积起来，自动按照每一步的顺序运行下去。
```js
async function f () {
    const asyncIterable = createAsyncIterable(['a', 'b']);
    const asyncIterator = asyncIterable[Symbol.asyncIterator]();

    const [{value: v1}, {value: v2}] = await Promise.all[asyncIterator.next(), asyncIterator.next()];

    console.log(v1, v2);
}
```

另一种用法是一次性调用所有的 `next` 方法，然后 `await` 最后一步操作
```js
async function runner () {
    const writer = openFile('file.txt');
    writer.next('hello');
    writer.next('world');

    return writer.return();
}

runner();
```

## `for await...of`
`for...of` 循环用于遍历同步的 `Iterator` 接口。
新引入的 `for await...of` 循环，则是用于遍历异步的 `Iterator` 接口

```js
async function f () {
    for await (const x of createAsyncIterable(['a', 'b'])) {
        console.log(x)
    }
}
f()
// a
// b
```
上面代码中，`createAsyncIterable()` 返回一个拥有异步遍历器接口的对象，`for...of` 循环自动调用这个对象的异步遍历器的 `next` 方法，会得到一个 `Promise` 对象。
`await` 用来处理这个 `Promise` 对象，一旦 `resolve`，就把得到的值（`x`）传入 `for...of` 的循环体。

`for await...of` 循环的一个用途，是部署了 `asyncIterable` 操作的异步接口，可以直接放入这个循环。

**如果 `next` 方法返回的 `Promise` 对象被 `reject`，`for await...of` 就会报错，要用 `try...catch` 捕捉。**
```js
async function f () {
    try {
        for await (const x of createAsyncIterable()) {
            console.log(x)
        }
    } catch (e) {}
}
```

**注意，`for await...of` 循环也可以用于同步遍历器。**
```js
(async function () {
    for await (let x of ['a', 'b']) {
        console.log(x)
    }
})()
// a
// b
```

## 异步 `Generator` 函数
> 就像 Generator 函数返回一个同步遍历器对象一样，异步 Generator 函数的作用，是返回一个异步遍历器对象。

在语法上，异步 Generator 函数就是 `async` 函数与 Generator 函数的结合。
```js
async function* gen () {
    yield 'hello';
}
var asyncIter = gen();

// 异步的 Iterator 对象调用 next 方法返回的是一个 Promise 对象
asyncIter.next().then(console.log); // {value: "hello", done: false}
```

**异步遍历器的设计目的之一，就是 Generator 函数处理同步操作和异步操作时，能够使用同一套接口。**
```js
// 同步 Generator 函数
function* map (iterable, func) {
    const iter = iterable[Symbol.iterator]();

    while (true) {
        let {value, done} = iter.next();
        if (done) break;
        yield func(value);
    }
}

// 异步 Generator 函数
async function* map (iterable, func) {
    const iter = iterable[Symbol.asyncIterator]();

    while (true) {
        let {value, done} = await iter.next();
        if (done) break;
        yield func(value);
    }
}
```

```js
async function* readLines (path) {
    let file = await fileOpen(path);

    try {
        while (!file.EOF) {
            yield await file.readLine();
        }
    } catch (e) {
        await file.close();
    }
}
```
上面代码中，异步操作前面使用 `await` 关键字标明，即 `await` 后面的操作，应该返回 `Promise` 对象。凡是使用 `yield` 关键字的地方，就是 `next` 方法停下来的地方，
它后面的表达式的值（即 `await file.readLine()` 的值），会作为 `next()` 返回对象的 `value` 属性，这一点是与同步 Generator 函数一致的。

异步 Generator 函数内部，能够同时使用 `await` 和 `yield` 命令。可以这样理解:
`await` 命令用于将外部操作产生的值输入函数内部，
`yield` 命令用于将函数内部的值输出。

异步 Generator 函数可以与 `for await...of` 循环结合起来使用。

异步 Generator 函数的返回值是一个异步 Iterator，即每次调用它的 `next` 方法，会返回一个 Promise 对象，
也就是说，跟在 `yield` 命令后面的，应该是一个 Promise 对象。如果 `yield` 命令后面是一个字符串，会被自动包装成一个 Promise 对象(其他的基本数据类型亦然)。
```js
function fetchRandom () {
    const url = 'https://www.random.org/decimal-fractions/'
    + '?num=1&dec=10&col=1&format=plain&rnd=new';
    return fetch(url);
}

async function* asyncGenerator () {
    console.log('start');
    const result = await fetchRandom(); // A
    yield 'Result: ' + await result.text(); // B
    console.log('done');
}

const ag = asyncGenerator();
ag.next().then(({value, done}) => {
    console.log(value, done)
})
```
上面代码中，`ag` 是 `asyncGenerator` 函数返回的异步遍历器对象。调用 `ag.next()`以后，上面代码的执行顺序如下:
1. `ag.next()` 立刻返回一个 `Promise` 对象。
2. `asyncGenerator` 函数开始执行，打印出 `start`。
3. `await` 命令返回一个 Promise 对象，`asyncGenerator` 函数停在这里。
4. A 处变成 `fulfilled` 状态，产生的值放入 `result` 变量，`asyncGenerator` 函数继续往下执行。
5. 函数在 B 处的 `yield` 暂停执行，**一旦 `yield` 命令取到值，`ag.next()` 返回的那个 Promise 对象变成 `fulfilled` 状态**。
6. `ag.next()` 后面的 `then` 方法指定的回调函数开始执行。该回调函数的参数是一个对象 `{value, done}`，其中 `value` 的值是 `yield` 命令后面的那个表达式的值，`done` 的值是 `false`。

A 和 B 两行的作用类似于下面的代码
```js
async function* asyncGenerator () {
    fetchRandom().then(result => {
        return result.text();
    }).then(result => {
        resolve({
            value: 'Result: ' + result,
            done: false
        })
    })
}
```

如果异步 Generator 函数抛出错误，会导致 Promise 对象的状态变为 `reject`，然后抛出的错误被 `catch` 方法捕获。
```js
async function* asyncGenerator () {
    throw new Error('Problem!');
}

asyncGenerator().next().then(resp => console.log('success: ', resp)).catch(resp => console.log('catch: ', resp.message))
// catch:  Problem!
```

**注意，普通的 `async` 函数返回的是一个 `Promise` 对象，而异步 `Generator` 函数返回的是一个异步 `Iterator 对象。**
可以这样理解，`async` 函数和异步 `Generator` 函数，是封装异步操作的两种方法，都用来达到同一种目的。
区别在于:
`async` 函数自带执行器，异步 `Generator` 函数通过 `for await...of` 执行，或者自己编写执行器.

```js
// 异步 Generator 函数的执行器
async function takeAsync (asyncIterable, count = Infinity) {
    const result = [],
          iterator = asyncIterable[Symbol.asyncIterator]();
    console.log(asyncIterable === asyncIterable[Symbol.asyncIterator]()) // true

    while (result.length < count) {
        const {value, done} = await iterator.next();
        if (done) break;
        result.push(value);
    }

    return result;
}
```
上面代码中，异步 Generator 函数产生的异步遍历器，会通过 `while` 循环自动执行，**每当 `await iterator.next()` 完成，就会进入下一轮循环**。
一旦 `done` 属性变为 `true`，就会跳出循环，异步遍历器执行结束。

```js
// 使用异步 Generator 函数执行器
async function f () {
    async function* gen () {
        yield 1;
        yield 2;
        yield 3;
    }

    return takeAsync(gen());
}
f().then(result => console.log(result)) // [1, 2, 3]
```

异步 Generator 函数出现以后，JavaScript 就有了四种函数形式：
- 普通函数
- async 函数
- Generator 函数
- 异步 Generator 函数
请注意区分每种函数的不同之处。
基本上，如果是一系列按照顺序执行的异步操作（比如读取文件，然后写入新内容，再存入硬盘），可以使用 async 函数；
如果是一系列产生相同数据结构的异步操作（比如一行一行读取文件），可以使用异步 Generator 函数。

## `yield*` 语句
`yield*` 语句也可以跟一个异步遍历器。

```js
async function* gen1 () {
    yield 'a';
    yield 'b';
    return 2;
}
async function* gen2 () {
    // yield* 后面跟的的是一个遍历器对象（同步/异步），
    // 如果生成该遍历器函数内部没有 return 语句，yield* 就相当于部署了 for...of 循环
    // 如果生成该遍历器函数内部有 return 语句，需要使用下面的形式来接收 return 的值
    // 详情见 [引用2]
    const result = yield* gen1();
}
var asyncIter = gen2();
asyncIter.next() // {value: 'a', done: false}
asyncIter.next() // {value: 'b', done: false}
asyncIter.next() // {value: 2, done: true}
```

与同步 Generator 函数一样，`for await...of` 循环会展开 `yield*`。
```js
(async function () {
    for await (let x of gen2()) {
        console.log(x)
    }
})()
// 'a'
// 'b'
```

# 引用
* [阮一峰 ES6入门-async 函数](http://es6.ruanyifeng.com/#docs/async)
* [阮一峰 ES6入门-Generator 函数的语法-yield* 表达式](http://es6.ruanyifeng.com/#docs/generator#yield--%E8%A1%A8%E8%BE%BE%E5%BC%8F)
