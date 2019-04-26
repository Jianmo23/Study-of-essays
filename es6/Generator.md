* 时间：`2019-05-06`
* 运行环境： `macOS 10.14.4  chrome 版本 73.0.3683.86（正式版本)`
* NodeJS：`node v9.2.1  npm v6.7.0`
* 更新时间： ``

# `Generator` 简介
> Generator 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同。

> Generator 函数有多种理解角度。语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。

> 执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

在形式上，`Generator` 函数是一个普通函数，但是有两个特征：
1. `function` 关键字与函数名之间有一个星号；

2. 函数体内部使用 `yield` 表达式，定义不同的内部状态

```js
function* helloWorldGenerator () {
    yield 'hello';
    yield 'world';
    return 'ending';
}
var hw = helloWorldGenerator();

for (let item of hw) {
    console.log(item)
}
// 'hello'
// 'world'
```
`Generator` 函数的调用方法与普通函数一样，也是在函数名后面加上一对圆括号。不同的是，调用 `Generator` 函数后，该函数并不执行，
返回的也不是函数运行结果，而是一个指向内部状态的指针对象（遍历器对象 `Iterator Object`）

因此，必须调用遍历器对象的 `next` 方法，使得指针移向下一个状态。也就是说，每次调用 `next` 方法，内部指针就从函数头部或上一次停下来的地方开始执行，
直到遇到下一个 `yield` 表达式（或 `return` 语句）为止。换言之，`Generator` 函数是分段执行的，`yield` 表达式是暂停执行的标记，而 `next` 方法可以恢复执行。

```js
function* helloWorldGenerator () {
    yield 'hello';
    yield 'world';
    return 'ending';
}
var hw = helloWorldGenerator();
hw.next() // {value: "hello", done: false}
hw.next() // {value: "world", done: false}
hw.next() // {value: "ending", done: true}
hw.next() // {value: undefined, done: true}

// value属性表示当前的内部状态的值，是yield表达式后面那个表达式的值；
// done属性是一个布尔值，表示是否遍历结束。
```
**注意：
如果 `Generator` 函数内部最后一步是 `yield` 语句，则调用 `next()` 方法执行后， 返回对象的 `done` 属性为 `false` ,仍需再次执行 `next()` 才能结束遍历器遍历；
反之，如果最后一步是 `return` 语句， 调用 `next()` 方法执行后， 返回对象的 `done` 属性为 `true`，即结束遍历器遍历。**

`ES6` 没有规定，`function` 关键字与函数名之间的星号，写在哪个位置。因此以下写法都能通过。
```js
function * fn () {}
function *fn () {}
function* fn () {}
function*fn () {}
```
由于 `Generator` 函数仍然是普通函数，所以一般的写法是上面的 **第三种**，即星号紧跟在function关键字后面!
```js
function* fn () {}
```
## `yield` 表达式
> 由于 Generator 函数返回的遍历器对象，只有调用 next 方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。yield 表达式就是暂停标志。

遍历器对象的next方法的运行逻辑如下：
1. 遇到 `yield` 表达式，就暂停执行后面的操作，并将紧跟在 `yield `后面的那个表达式的值，作为返回的对象的 `value` 属性值。

2. 下一次调用 `next` 方法时，再继续往下执行，直到遇到下一个 `yield` 表达式。

3. 如果没有再遇到新的 `yield` 表达式，就一直运行到函数结束，直到 `return` 语句为止，并将 `return` 语句后面的表达式的值，
   作为返回的对象的 `value` 属性值（此时返回的对象 `done` 属性值为 `true`）。

4. 如果该函数没有 `return` 语句，则返回的对象的 `value` 属性值为 `undefined`。

**需要注意:**
**`yield` 表达式后面的表达式，只有当调用 `next` 方法、内部指针指向该语句时才会执行，因此等于为 `JavaScript` 提供了手动的“惰性求值”（`Lazy Evaluation`）的语法功能。**
```js
function* sum () {
    yield 123 + 234;
}
// yield 后面的表达式123 + 234，不会立即求值，只会在next方法将指针移到这一句时，才会求值。
```

`yield` 表达式与 `return` 语句的区别：
* 每次遇到 `yield`，函数会暂停执行；下一次再从该位置继续向后执行。而 `return` 语句不具备位置记忆的功能

**一个函数里面，只能执行一次（或者说一个）`return` 语句，但是可以执行多次（或者说多个）`yield` 表达式。**

`yield` 表达式与 `return` 语句的相同点：
* 两者都能返回紧跟在语句后面的那个表达式的值，作为返回的对象 `value` 的属性值

`Generator` 函数可以不用 `yield` 表达式，这时就变成了一个单纯的暂缓执行函数。
```js
function* f () {
    console.log('执行了！')
}

var generator = f();

setTimeout(function () {
    generator.next()
}, 1000)
```

**注意： `yield` 表达式只能用在 `Generator` 函数里面，用在其他地方都会报错。**
```js
var arr = [1, [[2, 3], 4], [5, 6]];

function* flat (a = []) {
    a.forEach(function (item) {
        if (typeof item !== 'number') {
            yield* flat(item)
        } else {
            yield item
        }
    })
}

for (let f of flat(arr)) {
    console.log(f)
}
```
上述代码会报语法错误，因为 `forEach` 方法内部的 `function` 是普通函数，但是内部使用了 `yield` 表达式，还使用了 `yield*` 表达式，一种修改方式是：
```js
function* flat (a = []) {
    for (let i = 0, len = a.length; i < len; i++) {
        let item = a[i];

        if (typeof item !== 'number') {
            yield* flat(item)
        } else {
            yield item
        }
    }
}
for (let f of flat(arr)) {
    console.log(f)
}
// 1, 2, 3, 4, 5, 6
```
另外，`yield` 表达式如果用在另一个表达式之中，必须放在圆括号里面。(有例外，往下看)
```js
function* demo () {
    // console.log('hello' + yield) // SyntaxErrorshou
    // console.log('hello' + yield 123) // SyntaxError

    // console.log('hello' + (yield)) // ok
    console.log('hello' + (yield 123)) // ok
}
```
当 `yield` 表达式用作函数参数或放在赋值表达式的右边，可以不加括号。
```js
function* demo() {
  foo(yield 'a', yield 'b'); // OK
  let input = yield; // OK
}
```

## `Generator` 函数 与 `Iterator` 接口的关系
> 在 Iterator 中说过，任意一个对象的 Symbol.iterator 方法，等于该对象的遍历器生成函数，调用该函数会返回该对象的一个遍历器对象。

> 由于 Generator 函数就是遍历器生成函数，因此可以把 Generator 赋值给对象的 Symbol.iterator 属性，从而使得该对象具有 Iterator 接口。

```js
var obj = {
    *[Symbol.iterator] () {
        yield 1;
        yield 2;
        yield 3;
    }
}
[...obj] // [1, 2, 3]
```

`Generator` 函数执行后，返回一个遍历器对象。该对象本身也具有 `Symbol.iterator` 属性，执行后返回自身。
```js
function* fn () {}

var f = fn();

f[Symbol.iterator]() === f // true
```
# `next` 方法的参数
> yield 表达式本身没有返回值，或者说总是返回 undefined。next 方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值。

```js
function* f () {
    for (let i = 0; true; i++) {
        var reset = yield i;
        if (reset) {
            i = -1;
        }
    }
}
var g = f();
g.next() // {value: 0, done: false}
g.next() // {value: 1, done: false}
g.next(true) // {value: 0, done: false}
// 代码解释：
// 上面代码先定义了一个可以无限运行的 Generator 函数 f，如果 next 方法没有参数，每次运行到 yield 表达式，变量 reset 的值总是 undefined。
// 当 next 方法带一个参数 true 时，变量 reset 就被重置为这个参数（即 true），因此 i 会等于 -1，下一轮循环就会从 -1 开始递增。
```

这个功能有很重要的语法意义! `Generator` 函数从暂停状态到恢复运行，它的上下文状态（`context`）是不变的。通过 `next` 方法的参数，
就有办法在 `Generator` 函数开始运行之后，继续向函数体内部注入值。也就是说，可以在 `Generator` 函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。

```js
function* foo (x) {
    var y = 2 * (yield (x + 1));
    var z = yield(y / 3);
    return (x + y + z)
}

var g = foo(5);
g.next() // {value: 6, done: false}
g.next() // {value: NaN, done: false}
g.next() // {value: NaN, done: true}
g.next() // {value: undefined, done: true}

var g2 = foo(5);
g2.next() // {value: 6, done: false}
g2.next(12) // {value: 8, done: false}
g2.next(13) // {value: 42, done: true}
g.next() // {value: undefined, done: true}
```

**注意：**
由于 `next` 方法的参数表示上一个 `yield` 表达式的返回值，所以在第一次使用 `next` 方法时，传递参数是无效的。V8 引擎直接忽略第一次使用 `next` 方法时的参数，
只有从第二次使用 `next` 方法开始，参数才是有效的。从语义上讲，第一个 `next` 方法用来启动遍历器对象，所以不用带有参数。

```js
function* dataConsumer() {
  console.log('Started');
  console.log(`1. ${yield}`);
  console.log(`2. ${yield}`);
  return 'result';
}

var g = dataConsumer();
g.next()
// 'Started'
// {value: undefined, done: false}
g.next(1)
// '1. 1'
// {value: undefined, done: false}
g.next(2)
// '2. 2'
// {value: 'result', done: true}
```
如果想要第一次调用 `next` 方法时，就能够输入值，可以在 `Generator` 函数外面再包一层。
```js
function wrap (generatorFn) {
    return function (...args) {
        var generatorObj = generatorFn(...args)
        generatorObj.next()
        return generatorObj
    }
}
var wrapped = wrap(function* () {
    console.log(`First input: ${yield}`);
    return 'Done'
})
wrapped().next('hello')
// First input: hello
// {value: "Done", done: true}
```

# `for...of` 循环
> for...of 循环可以自动遍历 Generator 函数运行时生成的 Iterator 对象，且此时不再需要调用next方法。

```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
// 备注： 一旦 next 方法的返回对象的 done 属性为 true，for...of 循环就会中止，且不包含该返回对象
```
利用 `Generator` 函数和 `for...of` 循环，实现斐波那契数列
```js
function* fibonacci () {
    let [prev, curr] = [0, 1];

    for (;;) {
        yield curr;
        [prev, curr] = [curr, prev + curr];
    }
}
for (let n of fibonacci()) {
  if (n > 1000) break;
  console.log(n);
}
```

```js
function* objEntries () {
    // 此处使用 Reflect.ownKeys() 会获取 Symbol 属性
    var propKeys = Object.keys(this);

    for (let key of propKeys) {
        yield [key, this[key]]
    }
}
var obj = {
    First: 'yy',
    Last: 'z',
    [Symbol.iterator]: objEntries
}

for (let [key, value] of obj) {
    console.log(`${key} : ${value}`)
}
```

除了 `for...of` 循环以外，扩展运算符（`...`）、解构赋值和 `Array.from` 方法内部调用的，都是遍历器接口。这意味着，它们都可以将 `Generator` 函数返回的 `Iterator` 对象，作为参数。
```js
function* number () {
    yield 1;
    yield 2;
    return 3;
    yield 4;
}

[...number()] // [1, 2]

Array.from(number()) // [1, 2]

var [x, y] = number()
x // 1
y // 2
```

# `Generator.prototype.throw()`
> Generator 函数返回的遍历器对象，都有一个 throw 方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获。

```js
function* g () {
    try {
        yield
    } catch (e) {
        console.log('内部捕获：', e)
    }
}
var i = g();
i.next()

try {
    i.throw('a')
    i.throw('b')
} catch (e) {
    console.log('外部捕获：', e)
}
// 内部捕获：a
// 外部捕获：b
```
上面代码中，遍历器对象 `i` 连续抛出两个错误。第一个错误被 `Generator` 函数体内的 `catch` 语句捕获。`i` 第二次抛出错误，由于 `Generator` 函数内部的 `catch` 语句已经执行过了，
因此不会再捕捉到这个错误了，所以这个错误就被抛出了 `Generator` 函数体，被函数体外的 `catch` 语句捕获。

`throw` 方法可以接受一个参数，该参数会被 `catch` 语句接收，**建议抛出 `Error` 对象的实例**。
```js
function* g () {
    try {
        yield
    } catch (e) {
        console.log(e)
    }
}
var i = g();
i.next // {value: undefined, done: true}

i.throw(new Error('出错了')) // Error: 出错了
```
注意，不要混淆遍历器对象 `throw` 方法和全局的 `throw` 命令。上面代码的错误，是用遍历器对象的 `throw` 方法抛出的，而不是用 `throw` 命令抛出的。后者只能被函数体外的 `catch` 语句捕获。
```js
function* g () {
    while (true) {
        try {
            yield
        } catch (e) {
            if (e != 'a') throw e;
            console.log('内部错误', e)
        }
    }
}
var i =  g();
i.next();

try {
    throw new Error('a');
    throw new Error('b');
} catch (e) {
    console.log('外部捕获', e);
}
// 外部捕获 Error: a
```
上面代码之所以只捕获了 `a`，是因为函数体外的 `catch` 语句块，捕获了抛出的 `a` 错误以后，就不会再继续执行 `try` 代码块里面剩余的语句

如果 `Generator` 函数内部没有部署 `try...catch` 代码块，那么遍历器对象的 `throw` 方法抛出的错误，将被外部 `try...catch` 代码块捕获。
```js
function* g () {
    while (true) {
        yield;
        console.log('内部错误', e)
    }
}
var i = g();
i.next();

try {
    i.throw('a')
    i.throw('b')
} catch (e) {
    console.log('外部错误', e)
}
// 外部错误 a
// 备注：错误捕获仅执行一次
```
如果 `Generator` 函数内部和外部，都没有部署 `try...catch` 代码块，那么程序将报错，直接中断执行。
```js
function* g () {
    yield console.log('hello');
    yield console.log('world');
}
var i = g();
i.next();

i.throw()
// 错误未捕获  中断执行
```
`throw` 方法抛出的错误要被内部捕获，前提是必须至少执行过一次 `next` 方法。因为第一次执行 `next` 方法，等同于启动执行 `Generator` 函数的内部代码，
否则 `Generator` 函数还没有开始执行，这时 `throw` 方法抛错只可能抛出在函数外部。
```js
function* gen() {
  try {
    yield 1;
  } catch (e) {
    console.log('内部捕获');
  }
}

var g = gen();
g.throw(1); // 外部报错，因为此时外部没有部署 try...catch 语句，因此程序会报错，中断执行！
```
`throw` 方法被内部捕获以后（也就是说，`Generator` 函数内部需要部署 `try...catch` 语句），会附带执行下一条 `yield` 表达式。也就是说，**会附带执行一次 `next` 方法**。
同样说明，只要 `Generator` 函数内部部署了 `try...catch` 代码块，那么遍历器的 `throw` 方法抛出的错误，不影响下一次遍历。
```js
function* g () {
    try {
        yield console.log('a')
    } catch (e) {}

    yield console.log('b')
    yield console.log('c')
}
var i = g();
i.next()  // a  {value: undefined, done: false}
i.throw() // b  {value: undefined, done: false}
i.next()  // c {value: undefined, done: false}
i.next()  // {value: undefined, done: true}

// 如果去掉内部的 try...catch 语句， 在调用 try { i.throw() } catch (e) {} 时不会附带执行一条 yield 语句
```
另外，`throw` 命令与 `g.throw` 方法是无关的，两者互不影响。
```js
var gen = function* gen(){
  yield console.log('hello');
  yield console.log('world');
}

var g = gen();
g.next();
// hello
// {value: undefined, done: false}

try {
  throw new Error();
} catch (e) {
  g.next();
}
// world
// {value: undefined, done: false}
g.next()
// {value: undefined, done: true}
```
这种函数体内捕获错误的机制，大大方便了对错误的处理。多个 `yield` 表达式，可以只用一个 `try...catch` 代码块来捕获错误。如果使用回调函数的写法，想要捕获多个错误，
就不得不为每个函数内部写一个错误处理语句，现在只在 `Generator` 函数内部写一次 `catch` 语句就可以了。

`Generator` 函数体外抛出的错误，可以在函数体内捕获；反过来，`Generator` 函数体内抛出的错误，也可以被函数体外的 `catch` 捕获。
```js
function* g () {
    var x = yield 3;
    var y = x.toUpperCase();
    yield y;
}
var i = g();
i.next()  // {value: 3, done: false}

try {
    i.next(42)
} catch (e) {
    console.log(e)
}
// TypeError: x.toUpperCase is not a function
```
一旦 `Generator` 执行过程中抛出错误，且没有被内部捕获，就不会再执行下去了。如果此后还调用 `next` 方法，将返回一个 `value` 属性等于 `undefined` 、`done` 属性等于 `true` 的对象，
即 `JavaScript` 引擎认为这个 `Generator` 已经运行结束了。
```js
function* g () {
    yield 1;
    console.log('throwing an exception')
    throw new Error('generator broke!')
    yield 2
    yield 3;
}
function log (generator) {
    var v;
    console.log('starting generator')

    try {
        v = generator.next()
        console.log('第一次运行next方法', v)
    } catch (e) {
        console.log('捕获错误', v, e)
    }

    try {
        v = generator.next()
        console.log('第二次运行next方法', v)
    } catch (e) {
        console.log('捕获错误', v, e)
    }

    try {
        v = generator.next()
        console.log('第三次运行next方法', v)
    } catch (e) {
        console.log('捕获错误', v, e)
    }
    console.log('caller done')
}
log(g())
// starting generator
// 第一次运行next方法 {value: 1, done: false}
// throwing an exception
// 捕获错误 {value: 1, done: false} Error: generator broke!
// 第三次运行next方法 {value: undefined, done: true}
// caller done
```

# `Generator.prototype.return()`
> Generator 函数返回的遍历器对象，还有一个 return 方法，可以返回给定的值，并且终结遍历 Generator 函数。

```js
function* g () {
    yield 1;
    yield 2;
    yield 3;
}

var i = g();
i.next() // {value: 1, done: false}
i.return('over') // {value: "over", done: true}
i.next // {value: undefined, done: true}
```
如果 `return` 方法调用时，不提供参数，则返回值的 `value` 属性为 `undefined`。

如果 `Generator` 函数内部有 `try...finally` 代码块，且正在执行 `try` 代码块，那么 `return` 方法会推迟到 `finally` 代码块执行完再执行。
```js
function* numbers () {
    yield 1;
    try {
        yield 2;
        yield 3;
    } finally {
        yield 4;
        yield 5;
    }
    yield 6;
}
var i = numbers();
i.next() // {value: 1, done: false}
i.next() // {value: 2, done: false}
i.return(7) // {value: 4, done: false} // 此时 顺带在 finally 代码块里执行了一次 next 方法
i.next() // {value: 5, done: false}
i.next() // {value: 7, done: true}
```

# `next()`、`throw()`、`return()` 的共同点
> next()、throw()、return()这三个方法本质上是同一件事，可以放在一起理解。它们的作用都是让 Generator 函数恢复执行，并且使用不同的语句替换 yield 表达式。

*`·next()` 是将 `yield` 表达式替换成一个值。**
```js
var g = function* (x, y) {
    let result = yield x + y;
    return result;
}

var i = g(1, 2);
i.next(); // {value: 3, done: false}

i.next(1); // {value: 1, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = 1;
// 如果 next 方法没有参数，就相当于替换成 undefined。
```

**`throw()` 是将 `yield` 表达式替换成一个 `throw` 语句。**
```js
i.throw(new Error('error')) // Uncaught Error: error
// 相当于将 let result = yield x + y
// 替换成 let result = throw(new Error('出错了'));
```

**`return()` 是将 `yield` 表达式替换成一个 `return` 语句。**
```js
i.return(2) // {value: 2, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = return 2;
```

# `yield*` 表达式
> 如果在 Generator 函数内部，调用另一个 Generator 函数。需要在前者的函数体内部，自己手动完成遍历。

```js
function* foo () {
    yield 'a';
    yield 'b';
}

function* bar () {
    yield 'x';
    for (let i of foo()) {
        console.log(i)
    }
    yield 'y';
}
for (let v of bar()) {
    console.log(v)
}
// x a b y
```
上面代码中，`foo` 和 `bar` 都是 `Generator` 函数，在 `bar` 里面调用 `foo`，就需要手动遍历 `foo`。如果有多个 `Generator` 函数嵌套，写起来就非常麻烦。

ES6 提供了 `yield*` 表达式，作为解决办法，用来在一个 `Generator` 函数里面执行另一个 `Generator` 函数。
```js
function* bar () {
    yield 'x';
    yield* foo();
    yield 'y';
}
<!-- 等同于 -->
function* bar () {
    yield 'x';
    yield 'a';
    yield 'b';
    yield 'y';
}
<!-- 等同于 -->
function* bar () {
    yield 'x';
    for (let i of foo()) {
        console.log(i)
    }
    yield 'y';
}

for (let v of bar()) {
    console.log(v)
}
// x a b y
```
对比示例
```js
function* inner () {
    yield 'hello!'
}
function* outer1 () {
    yield 'open';
    yield inner();
    yield 'close';
}
function* outer2 () {
    yield 'open';
    yield* inner();
    yield 'close';
}
var i1 = outer1();
i1.next().value // 'open'
i1.next().value // inner 遍历器对象
i1.next().value // 'close'

var i2 = outer2();
i2.next().value // 'open'
i2.next().value // 'hello!'
i2.next().value // 'close'
```
上面例子中，`outer2` 使用了 `yield*`，`outer1` 没使用。结果就是，`outer1` 返回一个遍历器对象，`outer2` 返回该遍历器对象的内部值。

从语法角度看，如果 `yield` 表达式后面跟的是一个遍历器对象，需要在 `yield` 表达式后面加上星号 `*`，表明它 **返回的是一个遍历器对象**。这被称为 `yield*` 表达式。
```js
var delegatedIterator = (function* () {
    yield 'hello!';
    yield 'bye!';
})();

var delegatingIterator = (function* () {
    yield 'greeting';
    yield* delegatedIterator;
    yield 'ok, bye';
})();

for (let v of delegatingIterator) {
    console.log(v)
}
// 'greeting'
// 'hello!'
// 'bye!'
// 'ok, bye'
```

`yield*` 后面的 `Generator` 函数（没有 `return` 语句时），等同于在 `Generator` 函数内部，部署一个 `for...of` 循环。
```js
function* concat (iter1, iter2) {
    yield* iter1;
    yield* iter2;
}
<!-- 等同于 -->
function* concat (iter1, iter2) {
    for (let value of iter1) {
        yield value;
    }

    for (let value of iter2) {
        yield value;
    }
}
```
上面代码说明，`yield*` 后面的 `Generator` 函数（没有 `return` 语句时），不过是 `for...of` 的一种简写形式，完全可以用后者替代前者。
反之，在有 `return` 语句时，则需要用 `var value = yield* iterator` 的形式获取 `return` 语句的值。
```js
var iter1 = (function* () {
    yield 1;
    yield 2;
    return 3;
})();
var iter2 = (function* () {
    yield 4;
})();

function* concat (iter1, iter2) {
    yield* iter1;
    yield* iter2;
}
for (let v of concat(iter1, iter2)) {
    console.log(v)
}
// 1 2 4

// 修改代码，打印出 return 语句的值
function* concat (iter1, iter2) {
    let value = yield* iter1;
    // 没有 return 语句（value === undefined）不执行
    if (!!value) {
        yield value;
    }
    yield* iter2;
}
for (let v of concat(iter1, iter2)) {
    console.log(v)
}
// 1 2 3 4
```

如果 `yield*` 后面跟着一个数组，由于数组原生支持遍历器，因此就会遍历数组成员。
```js
function* g () {
    yield* [1, 2, 3, 4];
}
for (let v of g()) {
    console.log(v)
}
// 1 2 3 4
// yield 命令后面如果不加星号 *，返回的是整个数组，加了星号就表示返回的是数组的遍历器对象。
```
**事实上，任何数据结构只要有 `Iterator` 接口，就可以被 `yield*` 遍历。**
```js
<!-- 示例一 -->
var obj = {
    [Symbol.iterator] () {
        var index = 0;
        return {
            next () {
                return {
                    value: index > 4 ? undefined : index++,
                    done: index > 4
                }
            }
        }
    }
}

function* g () {
    yield* obj;
}

for (let v of g()) {
    console.log(v)
}
// 0 1 2 3

<!-- 示例二 -->
function* g() {
    yield* 'hello'
}
for (let str of g()) {
    console.log(str)
}
// h e l l o
```
如果被代理的 `Generator` 函数有 `return` 语句，那么就可以向代理它的 `Generator` 函数返回数据。
```js
function* foo () {
    yield 2;
    yield 3;
    return 'foo';
}
function* bar () {
    yield 1;
    let v = yield* foo();
    console.log(`v: ${v}`)
    yield 4;
}
var it = bar();
it.next()
// {value: 1, done: false}
it.next()
// {value: 2, done: false}
it.next()
// {value: 3, done: false}
it.next()
// v: foo
// {value: 4, done: false}
it.next()
// {value: undefined, done: true}
```
上面代码在第四次调用 `next` 方法的时候，屏幕上会有输出，这是因为函数 `foo` 的 `return` 语句，向函数 `bar` 提供了返回值。

```js
function* genFuncWithReturn () {
    yield 'a';
    yield 'b';
    return 'the result';
}
function* logReturned (genObj) {
    let result = yield* genObj;
    console.log(result);
}
[...logReturned(genFuncWithReturn())]
// 'the result'
// ['a', 'b']
```
上面代码中，存在两次遍历。第一次是扩展运算符遍历函数 `logReturned` 返回的遍历器对象，第二次是 `yield*` 语句遍历函数 `genFuncWithReturn` 返回的遍历器对象。
这两次遍历的效果是叠加的，最终表现为扩展运算符遍历函数 `genFuncWithReturn` 返回的遍历器对象。所以，最后的数据表达式得到的值等于 `[ 'a', 'b' ]`。但是，
函数 `genFuncWithReturn` 的 `return` 语句的返回值 `the result`，会返回给函数 `logReturned` 内部的 `result` 变量，因此会有终端输出。

`yield*` 命令可以很方便地取出嵌套数组的所有成员。
```js
function* iterTree (tree = []) {
    if (Array.isArray(tree)) {
        for (let i = 0, len = tree.length; i < len; i++) {
            yield* tree[i];
        }
    } else {
        yield tree;
    }
}
var tree = [ 'a', ['b', 'c'], ['d', 'e'] ];

for (let v of iterTree(tree)) {
    console.log(v)
}
// a b c d e
// 以上代码只能遍历二维数组

// 数组扁平化
function* flat (arr = []) {
    for (let cur of arr) {
        if (Array.isArray(cur)) {
            yield* flat(cur)
        } else {
            yield cur;
        }
    }
}
var arr = [1, 2, [3, 4, [5, [6]]], [7]];
[...flat(arr)]  // [1, 2, 3, 4, 5, 6, 7]
```
使用 `yield*` 语句遍历完全二叉树
```js
// 二叉树构造函数
function Tree (left, label, right) {
    // 三个参数分别为：左数、当前节点、右树
    this.left = left;
    this.label = label;
    this.right = right;
}

// 中序（inorder）遍历函数
function* inorder (t) {
    if (t) {
        // 采用递归算法，所以左树和右树要用 yield* 遍历
        yield* inorder(t.left);
        yield t.label;
        yield* inorder(t.right);
    }
}

// 生成二叉树
function make (array) {
    // 判断是否为叶节点
    if (array.length === 1) {
        return new Tree(null, array[0], null);
    }

    return new Tree(make(array[0]), array[1], make(array[2]));
}
let tree = make([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]]);

// 遍历二叉树
var result = [];
for (let node of inorder(tree)) {
    result.push(node)
}
result // ["a", "b", "c", "d", "e", "f", "g"]
// 或者
[...inorder(tree)] // ["a", "b", "c", "d", "e", "f", "g"]
```

# 作为对象属性的 `Generator` 函数
如果一个对象的属性是 Generator 函数，可以简写成以下形式：
```js
var obj = {
    * myGeneratorMethod () {}
}
// 等价于
var obj = {
    myGeneratorMethod: function* () {}
}
```

# `Generator` 函数的 `this`
> Generator 函数总是返回一个遍历器对象，ES6 规定这个遍历器是 Generator 函数的实例，也继承了 Generator 函数的 prototype 对象上的方法。

```js
function* gen () {}

var iter = gen();

iter.__proto__ === gen.prototype // true

iter instanceof gen // true
```

但是，如果把 `gen` 当作普通的构造函数，并不会生效，因为 `gen` 返回的总是遍历器对象，而不是 `this` 对象。
```js
function* gen () {
    this.a = 11;
}

var obj = gen();
obj.a  // undefined

var obj = new gen(); // TypeError: gen is not a constructor
```

既然 `Generator` 函数总是返回一个遍历器对象，不能和 `new` 命令一起使用，有没有方法可以即可以使用 `next` 方法，又可以正常获取 `this` ?

下面是一个变通方法。首先，生成一个空对象，使用 `call` 方法绑定 `Generator` 函数内部的 `this`。这样，构造函数调用以后，这个空对象就是 `Generator` 函数的实例对象了。
```js
function* F () {
    this.a = 1;
    yield this.b = 2;
    yield this.c = 3;
}
var obj = {};
var f = F.call(obj);

f.next(); // {value: 2, done: false}
f.next(); // {value: 3, done: false}
f.next(); // {value: undefined, done: true}

obj // {a: 1, b: 2, c: 3}
```
上面代码中，执行的是遍历器对象 `f`，但是生成的对象实例是 `obj`，有没有办法将这两个对象统一呢？

一个办法就是将 `obj` 换成 `F.prototype`。
```js
function* F () {
    this.a = 1;
    yield this.b = 2;
    yield this.c = 3;
}
var f = F.call(F.prototype);

f.next(); // {value: 2, done: false}
f.next(); // {value: 3, done: false}
f.next(); // {value: undefined, done: true}

f.a // 1
f.b // 2
f.c // 3
```

再将 `F` 改成构造函数，就可以对它执行 `new` 命令了。
```js
function* gen () {
    this.a = 1;
    yield this.b = 2;
    yield this.c = 3;
}

function F () {
    return gen.call(gen.prototype);
}

var f = new F();

f.next(); // {value: 2, done: false}
f.next(); // {value: 3, done: false}
f.next(); // {value: undefined, done: true}

f.a // 1
f.b // 2
f.c // 3
```

# 含义
## `Generator` 与状态机
> Generator 是实现状态机的最佳结构.

```js
// 下面的clock函数就是一个状态机
var ticking = true;

function clock () {
    if (ticking) {
        console.log('Tick!')
    } else {
        console.log('Tock!');
    }
    ticking = !ticking;
}

// 使用 Generator 函数改造下
function* clock () {
    while (true) {
        console.log('Tick!')
        yield;
        console.log('Tock!')
        yield;
    }
}
```

上面的 `Generator` 实现与 ES5 实现对比，可以看到少了用来保存状态的外部变量 `ticking`，这样就更简洁，更安全（状态不会被非法篡改）、更符合函数式编程的思想，
在写法上也更优雅。`Generator` 之所以可以不用外部变量保存状态，是因为它本身就包含了一个状态信息，即目前是否处于暂停态。

## `Generator` 与协程
> 协程（coroutine）是一种程序运行的方式，可以理解成“协作的线程”或“协作的函数”。协程既可以用单线程实现，也可以用多线程实现。前者是一种特殊的子例程，后者是一种特殊的线程。

### (1) 协程与子例程的差异
> 传统的“子例程”（subroutine）采用堆栈式“后进先出”的执行方式，只有当调用的子函数完全执行完毕，才会结束执行父函数。
协程与其不同，多个线程（单线程情况下，即多个函数）可以并行执行，但是只有一个线程（或函数）处于正在运行的状态，其他线程（或函数）都处于暂停态（suspended），
线程（或函数）之间可以交换执行权。也就是说，一个线程（或函数）执行到一半，可以暂停执行，将执行权交给另一个线程（或函数），等到稍后收回执行权的时候，
再恢复执行。这种可以并行执行、交换执行权的线程（或函数），就称为协程。

从实现上看，在内存中，子例程只使用一个栈（stack），而协程是同时存在多个栈，但只有一个栈是在运行状态，也就是说，**协程是以多占用内存为代价，实现多任务的并行**。

### (2) 协程与普通线程的差异
> 不难看出，协程适合用于多任务运行的环境。在这个意义上，它与普通的线程很相似，都有自己的执行上下文、可以分享全局变量。它们的不同之处在于，
同一时间可以有多个线程处于运行状态，但是运行的协程只能有一个，其他协程都处于暂停状态。此外，普通的线程是抢先式的，到底哪个线程优先得到资源，
必须由运行环境决定，但是协程是合作式的，执行权由协程自己分配

由于 JavaScript 是单线程语言，只能保持一个调用栈。引入协程以后，每个任务可以保持自己的调用栈。这样做的最大好处，就是抛出错误的时候，可以找到原始的调用栈。
不至于像异步操作的回调函数那样，一旦出错，原始的调用栈早就结束。

Generator 函数是 ES6 对协程的实现，但属于不完全实现。Generator 函数被称为“半协程”（semi-coroutine），意思是只有 Generator 函数的调用者，
才能将程序的执行权还给 Generator 函数。如果是完全执行的协程，任何函数都可以让暂停的协程继续执行。

如果将 Generator 函数当作协程，完全可以将多个需要互相协作的任务写成 Generator 函数，它们之间使用 `yield` 表达式交换控制权。

## `Generator` 与上下文
> JavaScript 代码运行时，会产生一个全局的上下文环境（`context`，又称运行环境），包含了当前所有的变量和对象。然后，执行函数（或块级代码）的时候，
又会在当前上下文环境的 **上层**，产生一个函数运行的上下文，变成当前（`active`）的上下文，由此形成一个上下文环境的堆栈（`context stack`）。

这个堆栈是“后进先出”的数据结构，最后产生的上下文环境首先执行完成，退出堆栈，然后再执行完成它下层的上下文，直至所有代码执行完成，堆栈清空。

**`Generator` 函数不是这样**，它执行产生的上下文环境，一旦遇到 `yield` 命令，就会暂时退出堆栈，但是并不消失，里面的所有变量和对象会冻结在当前状态。
等到对它执行 `next` 命令时，这个上下文环境又会重新加入调用栈，冻结的变量和对象恢复执行。

```js
function* gen() {
  yield 1;
  return 2;
}

let g = gen();

console.log(
  g.next().value,
  g.next().value,
);
```
上面代码中，第一次执行 `g.next()` 时，`Generator` 函数 `gen` 的上下文会加入堆栈，即开始运行 `gen` 内部的代码。
等遇到 `yield 1` 时，`gen` 上下文退出堆栈，内部状态冻结。第二次执行 `g.next()` 时，`gen` 上下文重新加入堆栈，变成当前的上下文，重新恢复执行。

# 应用
> Generator 可以暂停函数执行，返回任意表达式的值。这种特点使得 Generator 有多种应用场景。

## (1) 异步操作的同步化表达

`Generator` 函数的暂停执行的效果，意味着可以把异步操作写在 `yield` 表达式里面，等到调用 `next` 方法时再往后执行。这实际上等同于不需要写回调函数了，
因为异步操作的后续操作可以放在 `yield` 表达式下面，反正要等到调用 `next` 方法时再执行。所以，**`Generator` 函数的一个重要实际意义就是用来处理异步操作，改写回调函数。**

```js
function* loadUI () {
    showLoadingScreen();
    yield loadUIDataAsynchronously();
    hideLoadingScreen();
}
var loader = loadUI();

// 加载UI
loader.next();

// 卸载UI
loader.next();
```

`Ajax` 是典型的异步操作，通过 `Generator` 函数部署 `Ajax` 操作，可以用同步的方式表达。
```js
function* main () {
    var result = yield request("http://some.url");
    var resp = JSON.parse(result);
    console.log(resp.vaue);
}

function request () {
    makeAjaxCall(url, function () {response} {
        // 因为 yield 没有返回值  因此要把请求成功的数据塞进 next 方法  传递给 result  
        it.next(response);
    })
}

var it = main();
it.next();
```

通过 `Generator` 函数逐行读取文本文件
```js
function* numbers () {
    let file = new FileReader('numbers.txt');
    try {
        while (!file.eof) {
            yield parseInt(file.readLine(), 10);
        }
    } finally {
        file.close();
    }
}
```

## (2) 控制流管理

如果有一个多步操作非常耗时，采用回调函数，可能会写成下面这样。
```js
step1(function (value1) {
  step2(value1, function(value2) {
    step3(value2, function(value3) {
      step4(value3, function(value4) {
        // Do something with value4
      });
    });
  });
});
```
采用 `Promise` 改写上面的代码。
```js
Promise.resolve(step1)
.then(step2)
.then(step3)
.then(step4)
.then(function(value4) {
    // Do something with value4
}, function (error) {
    // // Handle any error from step1 through step4
})
```
上面代码已经把回调函数，改成了直线执行的形式，但是加入了大量 `Promise` 的语法。`Generator` 函数可以进一步改善代码运行流程。
```js
function* longRunningTask (value1) {
    try {
        var value2 = yield step1(value1);
        var value3 = yield step2(value2);
        var value4 = yield step3(value3);
        var value5 = yield step4(value4);
        // Do something with value4
    } catch (e) {
        // // Handle any error from step1 through step4
    }
}

function scheduler (task) {
    var taskObj = task.next(task.value);

    // 如果Generator函数未结束，就继续调用
    if (!taskObj.done) {
        task.value = taskObj.value

        scheduler(task);
    } else {

    }
}

// 自动调用
scheduler(longRunningTask(initialValue))
```
**注意:** 上面这种做法，只适合同步操作，即所有的 `task` 都必须是同步的，不能有异步操作。因为这里的代码一得到返回值，就继续往下执行，没有判断异步操作何时完成

下面，利用 `for...of` 循环会自动依次执行 `yield` 命令的特性，提供一种更一般的控制流管理的方法。
```js
let steps = [step1Func, step2Func, step3Func];

function* gen (steps) {
    for (let i = 0, len = steps.length; i < len; i++) {
        yield steps[i]();
    }
}
```
将任务分解成步骤之后，还可以将项目分解成多个依次执行的任务。
```js
function* iterateJobs(jobs){
  for (let i = 0, len = jobs.length; i < len; i++) {
      var job = jobs[i];

      yield* iterateJobs(job.steps);
  }
}
```
最后，就可以用 `for...of` 循环一次性依次执行所有任务的所有步骤。
```js
for (let job of iterateJobs(jobs)) {
    console.log(job.id);
}
```
**再次提醒，上面的做法只能用于所有步骤都是同步操作的情况，不能有异步操作的步骤。**

`for...of` 的本质是一个 `while` 循环，所以上面的代码实质上执行的是下面的逻辑。
```js
var it = iterateJobs(jobs);
var job = it.next();

while (!job.done) {
    console.log(job.id)

    job = it.next();
}
```

## (3) 部署 Iterator 接口

> 利用 Generator 函数，可以在任意对象上部署 Iterator 接口。

```js
function* iterEntries (obj) {
    var keys = Object.keys(obj);

    for (let key of keys) {
        yield [key, obj[key]];
    }
}

var obj = {foo:3, bar: 7};

for (let [key, value] of iterEntries(obj)) {
    console.log(key, value)
}
// foo 3
// bar 7
```

## (4) 作为数据结构

> Generator 可以看作是数据结构，更确切地说，可以看作是一个数组结构，因为 Generator 函数可以返回一系列的值，这意味着它可以对任意表达式，提供类似数组的接口。

```js
function* gen () {
    try {
        yield Math.min.apply(null, [1,2]);
        yield Math.max.apply(null, [1,2]);
    } catch (e) {}
}
var it = gen();

for (let v of it) {
    console.log(v)
}
// 1
// 2
```

## 引用
* [阮一峰 ES6入门-Generator 函数的语法](http://es6.ruanyifeng.com/#docs/generator)
