* 时间：`2019-04-23`
* 运行环境： `macOS 10.14.4  chrome 版本 73.0.3683.86（正式版本)`
* NodeJS：`node v9.2.1  npm v6.7.0`
* 更新时间： `2019-06-05`

## `Promise`
```
所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，
从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。
```
### `Promise` 特点：
* 对象的状态不受外界影响。`Promise` 对象代表一个异步操作，有三种状态：
`pending`（进行中）、
`fulfilled`（已成功）、
`rejected`（已失败）。
只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。

* 一旦状态改变，就不会再变，任何时候都可以得到这个结果。`Promise` 对象的状态改变，只有两种可能：从 `pending` 变为 `fulfilled` 和从 `pending` 变为 `rejected`。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 `resolved`（已定型）。如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（`Event`）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

### `Promise` 缺点：
* 无法取消 `Promise`，一旦新建它就会立即执行，无法中途取消。

* 如果不设置回调函数，`Promise` 内部抛出的错误，不会反应到外部。

* 当处于 `pending` 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

## `Promise` 使用
```js
<!-- 利用 Promise 封装方法：异步加载图片 -->
function loadImageAsync (url) {
    return Promise(function (resolve, reject) {
        var img = new Image();

        img.onload = function () {
            resolve(img)
        }

        img.onerror = function () {
            reject(new Error('Could not load image at ' + url))
        }

        img.src = url;
    })
}

<!-- 利用 Promise 封装方法：Ajax请求 -->
function getData (url) {
    return new Promise(function (resolve, reject) {
        var handler = function () {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onreadystatechange = handler;
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send();
    })
}

<!-- Promise 执行顺序 -->
var p1 = new Promise(function (resolve, reject) {})
var p2 = new Promise(function (resolve, reject) {
    resolve(p1)
})
// 上面代码中，`p1` 和 `p2` 都是 `Promise` 的实例，但是 `p2` 的 `resolve` 方法将 `p1` 作为参数，即一个异步操作的结果是返回另一个异步操作。

**注意，这时 `p1` 的状态就会传递给 `p2`，也就是说，`p1` 的状态决定了 `p2` 的状态。如果 `p1` 的状态是 `pending`，那么 `p2` 的回调函数就会等待 `p1` 的状态改变；
   如果 `p1` 的状态已经是 `resolved` 或者 `rejected`，那么 `p2` 的回调函数将会立刻执行。**

<!-- Promise 执行顺序实例 -->
var p1 = new Promise(function (reaolve, reject) {
    setTimeout(function () {
        reject(new Error('fail'));
    }, 3000);
});
var p2 = new Promise(function (resolve, reject) {
    setTimeout(() => {
        // console.log('p2: ', p1)
        resolve(p1)
    }, 1000);
});
p2.then(result => console.log('success: ', result)).catch(error => console.log('error: ', error))
// error: Error: fail

// 代码解释：
**`p1` 是一个 `Promise`，3 秒之后变为 `rejected`。`p2` 的状态在 1 秒之后改变，`resolve` 方法返回的是 `p1`。
   由于 `p2` 返回的是另一个 `Promise`，导致 `p2` 自己的状态无效了，由 `p1` 的状态决定 `p2` 的状态。所以，后面的 `then` 语句都变成针对后者（`p1`）。
   又过了 2 秒，`p1` 变为 `rejected` ，导致触发 `catch` 方法指定的回调函数。**
```

**注意，调用 `resolve` 或 `reject` 并不会终结 `Promise` 的参数函数的执行。**
```js
new Promise(function (resolve, reject) {
    resolve(1)
    console.log(2)
}).then(resp => console.log(resp))
// 2
// 1

// 分析：
// 调用 `resolve(1)` 以后，后面的 `console.log(2)` 还是会执行，并且会首先打印出来。这是因为立即 `resolved` 的 `Promise` 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。
```
**一般来说，调用 `resolve` 或 `reject` 以后，`Promise` 的使命就完成了，后继操作应该放到 `then` 方法里面，而不应该直接写在 `resolve` 或 `reject` 的后面。
   所以，最好在它们前面加上 `return` 语句，这样就不会有意外。**
```js
new Promise(function (resolve, reject) {
    return resolve(1)
    // 后面不执行了
    console.log(2)
}).then(resp => console.log(resp))
```

## `Promise` 常用方法
### `Promise.prototype.then()`
```js
// then 方法返回一个新的 Promise, 因此可以使用链式调用
getData('/rest').then(resp => {
    return getData('resp.url');
}).then(resp => {}, error => {})
```

### `Promise.prototype.catch()`
```
Promise.prototype.catch 方法是 .then(null, rejection) 或 .then(undefined, rejection) 的别名，用于指定发生错误时的回调函数。内部返回的是新的 Promise 对象！
```
重要的一点是，如果 `.then()` 方法中指定的回调函数运行时产生错误同样可以被 `.catch()` 捕获。

```js
var p = new Promise(function (resolve, reject) {
    throw new Error('test');
});
p.catch(resp => {
    console.log(resp)
});

<!-- 等价写法一 -->
var p = new Promise(function (resolve, reject) {
    try {
        throw new Error('test');
    } catch (e) {
        reject(e);
    }
});
p.catch(resp => {
    console.log(resp)
});

<!-- 等价写法二 -->
var p = new Promise(function (resolve, reject) {
    reject(new Error('test'))
});
p.catch(resp => {
    console.log(resp)
});

// 比较上面两种写法，可以发现 reject 方法的作用，等同于抛出错误。
```

**如果 `Promise` 状态已经变成 `resolved`，再抛出错误是无效的。**
```js
var p = new Promise((resolve, reject) => {
    resolve(111)
    throw new Error('error')
})
p.then(resp => console.log(resp)).catch(resp => console.log(resp))
// 111

// Promise 在resolve 语句后面再抛出错误，不会被捕获，等于没有抛出。因为 Promise 的状态一旦改变，就永久保持该状态，不会再变了。
```

**`Promise` 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个 `catch` 语句捕获。**
```js
new Promise((resolve, reject) => {
    resolve(11)
}).then(resp => {
    // param 不存在
    console.log(param)
}).then(resp => {
    //
}).catch(resp => {
    console.log(resp)
})
// ReferenceError: param is not defined
```

推荐使用 `catch` 方法捕获 `Promise` 实例错误，而不是使用 `then` 方法中第二个参数，原因有二：
1. `catch` 不仅可以捕获 `pending -> rejected` 错误，还可以捕获 `then` 方法内部的错误

2. 使用 `catch` 更接近同步写法（`try/catch`）

**跟传统的 `try/catch` 代码块不同的是，如果没有使用 `catch` 方法指定错误处理的回调函数，`Promise` 对象抛出的错误不会传递到外层代码，即不会有任何反应。通俗的说法就是“Promise 会吃掉错误”。**
```js
var someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing().then(function() {
  console.log('everything is great');
});

setTimeout(() => { console.log(123) }, 2000);
// 上面代码中，someAsyncThing函数产生的 Promise 对象，内部有语法错误。浏览器运行到这一行，会打印出错误提示ReferenceError: x is not defined，
// 但是不会退出进程、终止脚本执行，2 秒之后还是会输出123。这就是说，Promise 内部的错误不会影响到 Promise 外部的代码.
```

**使用 `catch` 方法捕获错误时，如果前面的调用没有错误，其内部传递的方法不会执行**
```js
Promise.resolve()
.catch(function(error) {
  console.log('oh no', error);
})
.then(function() {
  console.log('carry on');
});
// carry on
```

### `Promise.prototype.finally()`
```
finally方法用于指定不管 Promise 对象最后状态如何，都会执行的操作
```
```js
// finally方法的回调函数不接受任何参数，这意味着没有办法知道，前面的 Promise 状态到底是 fulfilled 是 rejected。这表明，
// finally方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果。
var p = new Promise((resolve, reject) => {
    resolve()
});
p.finally(() => {});

<!-- 等价于如下代码 -->
var p = new Promise((resolve, reject) => {
    resolve()
});
p.then(result => {
    return result;
}, error => {
    throw error;
})
// 由此，finally 方法本质上是 then 方法的特例
```

`finally` 方法的实现
```js
Promise.prototype.finally = function (callback) {
    var P = this.constructor;

    return this.then(resp => {
        P.resolve(callback()).then(() => value)
    }, error => {
        P.resolve(callback()).then(() => { throw error; })
    })
}
// 可以看出，不管成功还是失败，finally 方法总是返回原来的值

// resolve 的值是 undefined
Promise.resolve(2).then(() => {}, () => {})

// resolve 的值是 2
Promise.resolve(2).finally(() => {})

// reject 的值是 undefined
Promise.reject(3).then(() => {}, () => {})

// reject 的值是 3
Promise.reject(3).finally(() => {})

// 以上案例使用 then 方法对应回调函数接收即可看到结果
```

### `Promise.all()`
```js
// Promise.all方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

var p = Promise.all([p1, p2, p3]);
```
上面代码中，`Promise.all` 方法接受一个数组作为参数，`p1`、`p2`、`p3` 都是 `Promise` 实例，如果不是，就会先调用下面讲到的 `Promise.resolve` 方法，
将参数转为 `Promise` 实例，再进一步处理。（`Promise.all` 方法的参数可以不是数组，但必须具有 `Iterator` 接口，且返回的每个成员都是 `Promise` 实例。）

`P` 的状态由 `p1`, `p2`, `p3` 决定，分两种情况：
1.只有 `p1`、`p2`、`p3` 的状态都变成 `fulfilled`，`p` 的状态才会变成 `fulfilled` ，此 `p1`、`p2`、`p3` 的返回值组成一个数组，传递给 `p` 的回调函数。

2.只要 `p1`、`p2`、`p3` 之中有一个被 `rejected`，`p` 的状态就变成 `rejected`，此时第一个被 `reject` 的实例的返回值，会传递给 `p` 的回调函数。


**注意：如果作为参数的 `Promise` 实例，自己定义了 `catch` 方法，那么它一旦被 `rejected`，并不会触发 `Promise.all()` 的 `catch` 方法。**
```js
var p1 = new Promise((resolve, reject) => {
    resolve('hello')
}).then(result => result).catch(e => e);

var p2 = new Promise((resolve, reject) => {
    throw new Error('报错了')
}).then(result => result)
.catch(e => {
    console.log('catch in p2: ', e)
    return e;
});

Promise.all([p1, p2]).then(result => console.log('success of then in Promise.all: ', result))
.catch(e => console.log('catch in Promise.all: ', e))
// 运行后会发现，不会调用 Promise.all 的 catch 方法
```
**原因分析**
`p1` 会 `resolved`，`p2` 先是 `rejected`， 然后被自己的 `catch` 方法捕获，`catch` 内部返回的是一个新的 `Promise` 实例，
`p2` 此时实际上指向的是这个实例，这个实例在执行完 `catch` 方法后也会变成 `resolved`。因为 `Promise.all()` 方法内部的实例都会 `resolved`，
所以 `Promise.all()` 会调用其 `then` 方法的第一个回调函数，而不会调用 catch 方法！

**修改：如果 `p2` 没有自己的 `catch` 方法，就是调用 `Promise.all()` 的 `catch` 方法**
```js
var p1 = new Promise((resolve, reject) => {
    resolve('hello')
}).then(result => result).catch(e => e);

var p2 = new Promise((resolve, reject) => {
    throw new Error('报错了')
}).then(result => result)

Promise.all([p1, p2]).then(result => console.log('success of then in Promise.all: ', result))
.catch(e => console.log('catch in Promise.all: ', e))
// catch in Promise.all:  Error: 报错了
```

### `Promise.race()`
```js
// Promise.race方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。
var p = Promise.race([p1, p2, p3]);
```
上面代码中，只要`p1`、`p2`、`p3` 之中有一个实例率先改变状态，`p` 的状态就跟着改变。那个率先改变的 `Promise` 实例的返回值，就传递给 `p` 的回调函数。

`Promise.race` 方法的参数与 `Promise.all` 方法一样，如果不是 `Promise` 实例，就会先调用 `Promise.resolve` 方法，将参数转为 `Promise` 实例，再进一步处理。
```js
// 实际运用举例：指定时间内没有获得结果，自定义改变状态
var p = Promise.race([
    fetch('/source/rest'),
    new Promise((resolve, reject) => {
        setTimeout(function () {
            reject(new Error('request timeout'))
        }, 5000)
    })
]);

p.then(console.log).catch(console.error)
```

### `Promise.resolve()`
```js
// Promise.resolve 的作用在于：将现有对象转化为 Promise 对象。

Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```
**`Promise.resolve` 方法的参数分成四种情况:**

**1. 参数是一个 `Promise` 实例**
```
如果参数是 Promise 实例，那么 Promise.resolve 将不做任何修改、原封不动地返回这个实例。
```

**2. 参数是一个 `thenable` 对象**
```
thenable 对象指的是具有 then 方法的对象
```

**执行方式：** `Promise.resolve` 方法会将这个对象转为 `Promise` 对象，然后就立即执行 `thenable` 对象的 `then` 方法。
```js
var thenable = {
    then (resolve, reject) {
        resolve(42)
    }
};
var p = Promise.resolve(thenable);
p.then(console.log)
// 42
```
**3. 参数不是具有 `then` 方法的对象，或根本就不是对象**
```
如果参数是一个原始值，或者是一个不具有 then 方法的对象，则 Promise.resolve 方法返回一个新的 Promise 对象，状态为 resolved。
```

```js
var p = Promise.resolve('Hello');

p.then(function (s){
  console.log(s)
});
// 立即输出 'hello'
```
上面代码生成一个新的 `Promise` 对象的实例 `p`。由于字符串 `Hello` 不属于异步操作（判断方法是字符串对象不具有 `then` 方法），
返回 `Promise` 实例的状态从一生成就是 `resolved` ，所以回调函数会立即执行。`Promise.resolve` 方法的参数，会同时传给回调函数。

**4. 不带有任何参数**
```
Promise.resolve() 方法允许调用时不带参数，直接返回一个 resolved 状态的 Promise 对象。
```
所以，如果希望得到一个 `Promise` 对象，比较方便的方法就是直接调用 `Promise.resolve()` 方法。
```js
var p = Promise.resolve();
p.then(console.log)
```
**注意：立即 `resolve()` 的 `Promise` 对象，是在本轮“事件循环”（`event loop`）的结束时执行，而不是在下一轮“事件循环”的开始时。**
```js
var thenable = {
    then (resolve, reject) {
        console.log(1)
        resolve()
    }
}
Promise.resolve(thenable).then(resp => {
    console.log(2)
})
setTimeout(function () {
    console.log(3)
}, 0)
console.log(4)
// 4 1 2 3
```

### `Promise.reject()`
```
Promise.reject(reason) 方法也会返回一个新的 Promise 实例，该实例的状态为 rejected。
```

```js
var p = Promise.reject('出错了');
// 等价于
var p = new Promise((resolve, reject) => reject('出错了'));

// 监听执行
p.then(null, console.error)
```
上面代码生成一个 `Promise` 对象的实例 `p`，状态为 `rejected`，**回调函数会立即执行**。

**注意: `Promise.reject()` 方法的参数，会原封不动地作为 `reject` 的理由，变成后续方法的参数。这一点与 `Promise.resolve` 方法不一致。**
```js
var thenable = {
    then (resolve, reject) {
        reject('出错了');
    }
};

Promise.reject(thenable)
.catch(e => {
    console.log(e === thenable)
})
// true
```

### `Promise.try()` [传送门](http://es6.ruanyifeng.com/#docs/promise#Promise-try)
实际开发中，经常遇到一种情况：不知道或者不想区分，函数 `f` 是同步函数还是异步操作，但是想用 `Promise` 来处理它。因为这样就可以不管 `f` 是否包含异步操作，
都用 `then` 方法指定下一步流程，用 `catch` 方法处理f抛出的错误。一般就会采用下面的写法。
```js
Promise.resolve().then(f)
```

上面的写法有一个缺点，就是如果f是同步函数，那么它会在本轮事件循环的末尾执行。
```js
const f = () => console.log('now');
Promise.resolve().then(f);
console.log('next');
// next
// now
```

后续补充....


## 引用
* [阮一峰 ES6入门-Promise](http://es6.ruanyifeng.com/#docs/promise)
