* 时间：`2019-05-21`
* 运行环境： `macOS 10.14.4  chrome 版本 73.0.3683.86（正式版本)`
* NodeJS：`node v9.2.1  npm v6.7.0`
* 更新时间： ``

异步编程对 JavaScript 语言太重要。JavaScript 语言的执行环境是“单线程”的，如果没有异步编程，根本没法用，程序执行会很卡！

# 传统方法
ES6 诞生以前，异步编程的方法，大概有下面四种:

* 回调函数 (容易形成回调地狱 `callback hell`)

* 事件监听

* 发布/订阅

* `Promise` 对象

Generator 函数将 JavaScript 异步编程带入了一个全新的阶段。

# 基本概念
## 异步
> 所谓"异步"，简单说就是一个任务不是连续完成的，可以理解成该任务被人为分成两段，先执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段。

比如，有一个任务是读取文件进行处理，任务的第一段是向操作系统发出请求，要求读取文件。然后，程序执行其他任务，等到操作系统返回文件，
再接着执行任务的第二段（处理文件）。**这种不连续的执行，就叫做异步**。

**相应地，连续的执行就叫做同步。** 由于是连续执行，不能插入其他任务，所以操作系统从硬盘读取文件的这段时间，程序只能干等着。

## 回调函数
JavaScript 语言对异步编程的实现，就是回调函数。**所谓回调函数，就是把任务的第二段单独写在一个函数里面，等到重新执行这个任务的时候，就直接调用这个函数。**
回调函数的英语名字 `callback`，直译过来就是"重新调用"。

一个有趣的问题是，为什么 `Node` 约定，回调函数的第一个参数，必须是错误对象 `err`（如果没有错误，该参数就是 `null`）？

原因是执行分成两段:
第一段执行完以后，任务所在的上下文环境就已经结束了。在这以后抛出的错误，原来的上下文环境已经无法捕捉，只能当作参数，传入第二段。

## `Promise`
回调函数本身并没有问题，它的问题出现在多个回调函数嵌套。代码不是纵向发展，而是横向发展，很快就会乱成一团，无法管理。因为多个异步操作形成了强耦合，只要有一个操作需要修改，
它的上层回调函数和下层回调函数，可能都要跟着修改。这种情况就称为"回调函数地狱"（`callback hell`）。

Promise 对象就是为了解决这个问题而提出的。它不是新的语法功能，而是一种新的写法，允许将回调函数的嵌套，改成链式调用。采用 Promise，连续读取多个文件，写法如下。
```js
// fs-readfile-promise模块的作用就是返回一个 Promise 版本的 readFile 函数
var readFile = require('fs-readfile-promise');

readFile(fileA)
.then(function (data) {
    console.log(data.toString());
})
.then(function () {
    return readFile(fileB);
})
.then(function (data) {
    console.log(data.toString());
})
.catch(function (err) {
    console.log(err);
});
```

可以看到，`Promise` 的写法只是回调函数的改进，使用 `then` 方法以后，异步任务的两段执行看得更清楚了，除此以外，并无新意。

**`Promise` 的最大问题是代码冗余**，原来的任务被 `Promise` 包装了一下，不管什么操作，一眼看去都是一堆 `then`，原来的语义变得很不清楚。

# `Generator` 函数
## 协程
> 传统的编程语言，早有异步编程的解决方案（其实是多任务的解决方案）。其中有一种叫做"协程"（coroutine），意思是多个线程互相协作，完成异步任务。

协程有点像函数，又有点像线程。它的运行流程大致如下:
- 第一步，协程 `A` 开始执行。

- 第二步，协程 `A` 执行到一半，进入暂停，执行权转移到协程 `B`。

- 第三步，（一段时间后）协程 `B` 交还执行权。

- 第四步，协程 `A` 恢复执行。

上面流程的协程 `A`，就是异步任务，因为它分成两段（或多段）执行。

```js
function* asyncJob () {
    // some code
    var f = yield readFile(fileA);
    // some code
}
```
上面代码的函数 `asyncJob` 是一个协程，它的奥妙就在其中的 `yield` 命令。**`yield` 表示执行到此处，执行权将交给其他协程。也就是说，`yield` 命令是异步两个阶段的分界线**。

协程遇到 `yield` 命令就暂停，等到执行权返回，再从暂停的地方继续往后执行。**它的最大优点，就是代码的写法非常像同步操作，如果去除 `yield` 命令，简直一模一样**。

## 协程的 `Generator` 函数实现
> Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权（即暂停执行）。

整个 `Generator` 函数就是一个封装的异步任务，或者说是异步任务的容器。异步操作需要暂停的地方，都用 `yield` 语句注明

```js
function* gen (x) {
    // 另外，`yield` 表达式如果用在另一个表达式之中，必须放在圆括号里面。
    // 当 `yield` 表达式用作函数参数或放在赋值表达式的右边，可以不加括号。
    var y = yield x + 1;
    return y;
}
var it = gen(1);
it.next();
// {value: 2, done: false}
it.next();
// {value: undefined, done: true}
```

上面代码中，调用 `Generator` 函数，会返回一个内部指针（即遍历器）`g`。这是 `Generator` 函数不同于普通函数的另一个地方，即执行它不会返回结果，
返回的是 **指针对象**。调用指针 `g` 的 `next` 方法，会移动内部指针（即执行异步任务的第一段），指向第一个遇到的 `yield` 语句，上例是执行到 `x + 2` 为止。

换言之，`next` 方法的作用是分阶段执行 `Generator` 函数。每次调用 `next` 方法，会返回一个对象，表示当前阶段的信息（`value` 属性和 `done` 属性）。
`value` 属性是 `yield` 语句后面表达式的值，表示当前阶段的值；
`done` 属性是一个布尔值，表示 `Generator` 函数是否执行完毕，即是否还有下一个阶段。

## `Generator` 函数的数据交换和错误处理
> Generator 函数可以暂停执行和恢复执行，这是它能封装异步任务的根本原因。除此之外，它还有两个特性，使它可以作为异步编程的完整解决方案：函数体内外的数据交换和错误处理机制。

`next` 返回值的 `value` 属性，是 `Generator` 函数向外输出数据；`next` 方法还可以接受参数，向 `Generator` 函数体内输入数据，作为上个阶段异步任务的返回结果。
```js
function* gen (x) {
    // 另外，`yield` 表达式如果用在另一个表达式之中，必须放在圆括号里面。
    // 当 `yield` 表达式用作函数参数或放在赋值表达式的右边，可以不加括号。
    var y = yield x + 1;
    return y;
}
var it = gen(1);
it.next();
// {value: 2, done: false}
it.next(2);
// {value: 2, done: true}
```

Generator 函数内部还可以部署错误处理代码，捕获函数体外抛出的错误。
```js
function* gen (x) {
    try {
        var y = yield x + 2;
        return y;
    } catch (e) {
        console.log('inner: ', e)
    }
}
var it = gen(1);
it.next();
it.throw(new Error('出错了！')) // inner: Error: 出错了！
try {
    it.throw(new Error('出错了！'))
} catch (e) {
    console.log('outer: ', e) // outer:  Error: 出错了！
}
```
上面代码中，`Generator` 函数体外，使用指针对象的 `throw` 方法抛出的错误，可以被函数体 `try...catch` 代码块捕获。这意味着，
**出错的代码与处理错误的代码，实现了时间和空间上的分离**，这对于异步编程无疑是很重要的。

## 异步任务的封装
```js
var fetch = require('node-fetch');

function* gen () {
    var url = 'https://api.github.com/users/github';
    var result = yield fetch(url);

    return result;
}

var g = gen();
var result = g.next();

// fetch 函数执行后返回 Promise 实例
result.value.then(function (data) {
    return data.json();
}).then(function (data) {
    g.next(data);
})
```
可以看到，虽然 `Generator` 函数将异步操作表示得很简洁，但是流程管理却不方便（即何时执行第一阶段、何时执行第二阶段）。

# `Thunk` 函数
> Thunk 函数是自动执行 Generator 函数的一种方法。

## 参数的求值策略
> "求值策略"，即函数的参数到底应该何时求值

```js
var x = 1;

function f(m) {
    return m * 2;
}

f(x + 5)
```
上面代码先定义函数f，然后向它传入表达式 `x + 5`。请问，这个表达式应该何时求值？

一种意见是"传值调用"（`call by value`），即在进入函数体之前，就计算 `x + 5` 的值（等于 6），再将这个值传入函数 `f`。C 语言就采用这种策略。
```js
f(x + 5)
// 传值调用时，等同于
f(6)
```

另一种意见是“传名调用”（`call by name`），即直接将表达式 `x + 5` 传入函数体，只在用到它的时候求值。Haskell 语言采用这种策略。
```js
f(x + 5)
// 传名调用时，等同于
(x + 5) * 2
```

传值调用和传名调用，各有利弊！

传值调用比较简单，但是对参数求值的时候，实际上还没用到这个参数，有可能造成性能损失。

```js
function f(a, b){
    return b;
}

f(3 * x * x - 2 * x - 1, x);
```
上面代码中，函数 `f` 的第一个参数是一个复杂的表达式，但是函数体内根本没用到。对这个参数求值，实际上是不必要的。因此，有一些计算机学家倾向于"传名调用"，即 **只在执行时求值**。

## Thunk 函数的含义
> 编译器的“传名调用”实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做 Thunk 函数。

```js
function f (m) {
    return m * 2
}

f (x + 5);
// 等同于
var thunk = function () {
    return x + 5;
};
function f (thunk) {
    return thunk() * 2
}
```
这就是 `Thunk` 函数的定义，它是“ **传名调用** ”的一种实现策略，用来替换某个表达式。

## JavaScript 语言的 `Thunk` 函数
JavaScript 语言是 **传值调用**，它的 `Thunk` 函数含义有所不同。在 JavaScript 语言中，`Thunk` 函数替换的不是表达式，而是多参数函数，将其替换成一个只接受回调函数作为参数的单参数函数。

```js
// 正常版本的readFile（多参数版本）
fs.readFile(fileName, callback);

// Thunk版本的readFile（单参数版本）
var Thunk = function (fileName) {
    return function (callback) {
        return fs.readFile(fileName, callback);
    }
}
var readFileThunk = Thunk(fileName);
readFileThunk(callback);
```
上面代码中，`fs` 模块的 `readFile` 方法是一个多参数函数，两个参数分别为文件名和回调函数。经过转换器处理，它变成了一个单参数函数，只接受回调函数作为参数。
这个单参数版本，就叫做 `Thunk` 函数。

**任何函数，只要参数有回调函数，就能写成 `Thunk` 函数的形式。**

```js
// ES5 版本
var Thunk = function (fn) {
    return function () {
        var args = [].slice.call(arguments);
        return function (callback) {
            args.push(callback);
            return fn.apply(this, args);
        }
    }
}

// ES6 版本
var Thunk = function (fn) {
    // 对象扩展运算符
    return function (...args) {
        return function (callback) {
            return fn.call(this, ...args, callback);
        }
    }
}
```
使用上面的转换器，生成 `fs.readFile` 的 `Thunk` 函数。
```js
Thunk(fs.readFile)(fileName)(callback)
```

```js
function Thunk (fn) {
    return function (...args) {
        return function (cb) {
            return fn.call(this, ...args, cb)
        }
    }
}

function f (a, cb) {
    cb(a)
}
var ft = Thunk(f);
ft(1)(console.log)
```

## `Thunkify` 模块
> 生产环境的转换器，建议使用 Thunkify 模块。

```js
// 安装
npm install Thunkify

// 使用
var thunkify = require('thunkify');
var fs = require('fs');

var read = thunkify(fs.readFile);
read('package.json')(function(err, str){
  // ...
});
```

Thunkify 源码分析
```js
function thunkify (fn) {
    return function () {
        var args = new Array(arguments.length);
        var ctx = this;

        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i];
        }

        return function (done) {
            var called;

            // 数组的末尾把传递过来的回调函数 done 再包装一层，目的是为了拦截回调函数的重复调用
            // 此时添加的function 就是指下面 f 方法中的 callback
            args.push(function () {
                if (called) { return; }
                called = true;

                // arguments 就是指当前function中传递的不定参数
                done.apply(null, arguments)
            });

            try {
                fn.apply(ctx, args);
            } catch (e) {
                done(e);
            }
        }
    }
}
```
它的源码主要多了一个检查机制，变量 `called` 确保回调函数只运行一次。这样的设计与下文的 `Generator` 函数相关。
```js
function f (a, b, callback) {
    var sum = a + b;

    callback(sum);
    callback(sum);
}

var ft = thunkify(f);
var  print = console.log.bind(console);
ft(1, 2)(print) // 只会打印一次
```

## `Generator` 函数的流程管理
`Thunk` 函数可以用于 `Generator` 函数的自动流程管理。

`Generator` 函数可以自动执行。
```js
function* gen () {
    // some code
}

var it = gen();
var res = it.next();

while (!res.done) {
    console.log(res.value);
    res = it.next();
}
```
但是，这不适合异步操作。如果必须保证前一步执行完，才能执行后一步，上面的自动执行就不可行。这时，`Thunk` 函数就能派上用处。
以读取文件为例。下面的 `Generator` 函数封装了两个异步操作。
```js
var fs = require('fs');
var thunkify = require('thunkify');
var readFileThunk = thunkify(fs.readFile);

var gen = function* () {
    var r1 = yield readFileThunk('/etc/fstab');
    console.log(r1.toString());

    var r2 = yield readFileThunk('/etc/shells');
    console.log(r2.toString());
}
```
上面代码中，`yield` 命令用于将程序的执行权移出 `Generator` 函数，那么就需要一种方法，将执行权再交还给 `Generator` 函数。

这种方法就是 `Thunk` 函数，因为它可以在回调函数里，将执行权交还给 `Generator` 函数。为了便于理解，我们先看如何手动执行上面这个 `Generator` 函数。

```js
var g = gen();

var r1 = g.next();
r1.value(function (err, data) {
    if (err) {
        throw err;
    }

    var r2 = g.next(data);
    r2.value(function (err, data) {
        if (err) {
            throw err;
        }

        g.next(data);
    })
});
```
仔细查看上面的代码，可以发现 `Generator` 函数的执行过程，其实是将同一个回调函数，反复传入 `next` 方法的 `value` 属性。这使得我们可以用递归来自动完成这个过程。

## Thunk 函数的自动流程管理
`Thunk` 函数真正的威力，在于可以自动执行 `Generator` 函数。

下面就是一个基于 `Thunk` 函数的 `Generator` 执行器。
```js
function run (fn) {
    var gen = fn();

    function next (err, data) {
        var result = gen.next(data);
        if(result.done) { return; }
        resul.value(next)
    }

    next()
};

function* g () {}

run(g)
```

有了这个执行器，执行 `Generator` 函数方便多了。不管内部有多少个异步操作，直接把 `Generator` 函数传入 `run` 函数即可。
当然，**前提是每一个异步操作，都要是 `Thunk` 函数，也就是说，跟在 `yield` 命令后面的必须是 `Thunk` 函数**。
```js
var g = function* (){
    var f1 = yield readFileThunk('fileA');
    var f2 = yield readFileThunk('fileB');
    // ...
    var fn = yield readFileThunk('fileN');
};

run(g);
```

**`Thunk` 函数并不是 `Generator` 函数自动执行的唯一方案。因为自动执行的关键是，必须有一种机制，自动控制 `Generator` 函数的流程，接收和交还程序的执行权。
回调函数可以做到这一点，`Promise` 对象也可以做到这一点。**

# `co` 模块
[co 模块](https://github.com/tj/co)是著名程序员 TJ Holowaychuk 于 2013 年 6 月发布的一个小工具，用于 `Generator` 函数的自动执行。

## 基本用法
```js
var gen = function* () {
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

// co 模块可以让你不用编写 Generator 函数的执行器。
var co = require('co');
co(gen).then(function (data) {
    console.log(data)
})
```
`co函数` 返回一个 `Promise` 对象，因此可以用 `then` 方法添加回调函数。

## co 模块原理
为什么 `co` 可以自动执行 `Generator` 函数?

**`Generator` 就是一个异步操作的容器**。它的自动执行需要一种机制，当异步操作有了结果，能够自动交回执行权。

两种方法可以做到:
- 回调函数。将异步操作包装成 `Thunk` 函数，在回调函数里面交回执行权。

- `Promise` 对象。将异步操作包装成 `Promise` 对象，用 `then` 方法交回执行权。

`co 模块` 其实就是将两种自动执行器（`Thunk`函数和 `Promise` 对象），包装成一个模块。使用 `co` 的前提条件是，
**`Generator` 函数的 `yield` 命令后面，只能是 `Thunk` 函数或 `Promise` 对象。如果数组或对象的成员，全部都是 `Promise` 对象，也可以使用 `co`**。

## 基于 `Promise` 对象的自动执行

```js
var fs = require('fs');

var readFile = function (fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName, function (error, data) {
            if (err) {
                return reject(error)
            }

            resolve(data);
        })
    })
}

var gen = function* () {
    var f1 = yield readFile('/etc/fstab');
    var f2 = yield readFile('/etc/shells');

    console.log(f1.toString())
    console.log(f2.toString())
}

// 手动执行
var g = gen();

g.next().value.then(function (data) {
    g.next(data).value.then(function (data) {
        g.next(data);
    })
})

// 自动执行器
function run (gen) {
    var g = gen();

    function next (data) {
        var result = g.next(data);
        if (result.done) {
            return result.value;
        }
        result.value.then(function (data) {
            next(data);
        });
    }

    next();
}

run(gen);
```

## co 模块的源码
co 就是上面那个自动执行器的扩展
首先，co 函数接受 `Generator` 函数作为参数，返回一个 `Promise` 对象。

```js
function co (gen) {
    var ctx = this;

    return new Promise(function (resolve, reject) {
        if (typeof gen === 'function') {
            gen = gen.call(ctx);
        }
        if (!gen || typeof gen.next !== 'function') {
            return resolve(gen);
        }

        onFulfilled();

        function onFulfilled (resp) {
            var ret;
            try {
                ret = gen.next(resp);
            } catch (e) {
                return reject(e)
            }

            next(ret);
        }

        function next (ret) {
            if (ret.done) {
                return resolve(ret.value);
            }

            var value = toPromise.call(ctx, ret.value);
            if (value && isPromise(value)) {
                return value.then(onFulfilled, onRejected);
            }

            return onRejected(
                new TypeError(
                  'You may only yield a function, promise, generator, array, or object, '
                  + 'but the following object was passed: "'
                  + String(ret.value)
                  + '"'
                )
            );
        }
    });
}
```
上面代码中，`next` 函数的内部代码，一共只有四行命令。

第一行，检查当前是否为 `Generator` 函数的最后一步，如果是就返回。

第二行，确保每一步的返回值，是 `Promise` 对象。

第三行，使用 `then` 方法，为返回值加上回调函数，然后通过 `onFulfilled` 函数再次调用 `next` 函数。

第四行，在参数不符合要求的情况下（参数非 `Thunk` 函数和 `Promise` 对象），将 `Promise` 对象的状态改为 `rejected`，从而终止执行。

## 处理并发的异步操作
co 支持并发的异步操作，即允许某些操作同时进行，等到它们全部完成，才进行下一步。

这时，要把并发的操作都放在数组或对象里面，跟在 `yield` 语句后面。

```js
// 数组的写法
co(function* () {
  var res = yield [
    Promise.resolve(1),
    Promise.resolve(2)
  ];
  console.log(res);
}).catch(onerror);

// 对象的写法
co(function* () {
  var res = yield {
    1: Promise.resolve(1),
    2: Promise.resolve(2),
  };
  console.log(res);
}).catch(onerror);
```
## 实例：处理 Stream
涉及 nodeJS, 后续继续学习。。。。

# 引用
* [阮一峰 ES6入门-Generator 函数的异步应用](http://es6.ruanyifeng.com/#docs/generator-async)
