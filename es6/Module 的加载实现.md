* 时间：`2019-05-09`
* 运行环境： `macOS 10.14.4  chrome 版本 73.0.3683.86（正式版本)`
* NodeJS：`node v9.2.1  npm v6.7.0`
* 更新时间： ``

# 浏览器加载
## 传统方法
HTML 网页中，浏览器通过 `<script>` 标签加载 JavaScript 脚本。
```js
<!-- 页面内嵌的脚本 -->
<script type="application/javascript">
  // module code
</script>

<!-- 外部脚本 -->
<script type="application/javascript" src="path/to/myModule.js">
</script>
```
由于浏览器脚本的默认语言是 JavaScript，因此可以省略 `type="application/javascript"`。

**默认情况下，浏览器是同步加载 JavaScript 脚本，即渲染引擎遇到 `<script>` 标签就会停下来，等到执行完脚本，再继续向下渲染。如果是外部脚本，还必须加入脚本下载的时间。**

如果脚本体积很大，下载和执行的时间就会很长，因此造成浏览器堵塞，用户会感觉到浏览器“卡死”了，没有任何响应。这显然是很不好的体验，所以浏览器允许脚本异步加载，下面就是两种异步加载的语法。
```js
<script src="path/to/myModule.js" defer></script>
<script src="path/to/myModule.js" async></script>
```
`defer` 与 `async` 的区别是：

`defer` 要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行；

`async` 一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。

一句话，`defer` 是“渲染完再执行”，`async` 是“下载完就执行”。

另外，如果有多个 `defer` 脚本，会按照它们在页面出现的顺序加载，而多个 `async` 脚本是不能保证加载顺序的。

## 加载规则
浏览器加载 ES6 模块，也使用<script>标签，但是要加入type="module"属性。
```js
<script type="module" src=""></script>
```
浏览器对于带有 `type="module"` 的 `<script>`，都是异步加载，不会造成堵塞浏览器，即等到整个页面渲染完，再执行模块脚本，
等同于打开了 `<script>` 标签的 `defer` 属性。
```js
<script type="module" src=""></script>
// 等同于
<script type="module" src="" defer></script>
```
如果网页有多个 `<script type="module">`，它们 **会按照在页面出现的顺序依次执行**。

`<script>` 标签的 `async` 属性也可以打开，这时只要加载完成，渲染引擎就会中断渲染立即执行。执行完成后，再恢复渲染。
```js
<script type="module" src="" async></script>
```
一旦使用了 `async` 属性，`<script type="module">` 就不会按照在页面出现的顺序执行，而是只要该模块加载完成，就执行该模块。

ES6 模块也允许内嵌在网页中，语法行为与加载外部脚本完全一致。
```js
<script type="module">
import utils from './utils.js';
// some coed
</script>
```

**对于加载外部的模块脚本，有几点需要注意：**

- 代码是在模块作用域之中运行，而不是在全局作用域运行。模块内部的顶层变量，外部不可见。

- 模块脚本自动采用严格模式，不管有没有声明 `use strict`。

- 模块之中，可以使用 `import` 命令加载其他模块（**`.js` 后缀不可省略，需要提供绝对 URL 或相对 URL**），也可以使用 `export` 命令输出对外接口。

- 模块之中，顶层的 `this` 关键字返回 `undefined`，而不是指向 `window`。也就是说，在模块顶层使用 `this` 关键字，是无意义的。

- 同一个模块如果加载多次，将只执行一次。

```js
// 示例模块内部代码
import utils from './xx.js';

const x = 1;

x === window.x // false
this === undefined // true
```

利用顶层的 `this` 等于 `undefined` 这个语法点，可以侦测当前代码是否在 ES6 模块之中。
```js
const isModuleScript = this === undefined;
```

# ES6 模块与 CommonJS 模块的差异
**ES6 模块与 CommonJS 模块完全不同:**

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用；

- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口；

第二个差异是因为 CommonJS 加载的是一个对象（即 `module.exports` 属性），该对象只有在脚本运行完才会生成。
而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
```js
// node.js
var counter  = 3;

function incCounter () {
    counter++
}

module.exports = {
    counter,
    incCounter
}


//node2.js
var mod = require('./node.js');

console.log(mod.counter);

mod.incCounter();

console.log(mod.counter);

// 执行
node ./node2.js
// 输出
// 3
// 3
```
上面代码说明，模块加载以后，它的内部变化就影响不到输出了。这是因为 `mod.counter` 是一个 **原始类型的值，会被缓存**。除非写成一个函数，才能得到内部变动后的值。
```js
// node.js
var counter  = 3;

function incCounter () {
    counter++
}

module.exports =
    // 输出的 counter 属性实际上是一个取值器函数
    get counter () {
        return counter;
    },
    incCounter
}

// 执行
node ./node2.js
// 输出
// 3
// 4
```

ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令 `import`，就会生成一个只读引用。
等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的 `import` 有点像 Unix 系统的“符号连接”，原始值变了，`import` 加载的值也会跟着变。
因此，**ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块**。
```js
// libs.js
var counter  = 3;

function incCounter () {
    counter++
}

export {
    counter,
    incCounter
}

// index.js
import {counter, incCounter} from './libs.js';

console.log(counter); // 3

incCounter();

console.log(counter); // 4
```
上面代码表明，**ES6 模块不会缓存运行结果，而是动态地去被加载的模块取值，并且变量总是绑定其所在的模块**。

由于 ES6 输入的模块变量，只是一个“符号连接”，所以这个变量是只读的，对它进行重新赋值会报错。
```js
// lib.js
export let obj = {};

// main.js
import { obj } from './lib';

obj.prop = 123; // OK
obj = {}; // TypeError
// 因为变量 obj 指向的地址是只读的，不能重新赋值!!!
```

**`export` 通过接口，输出的是同一个值。不同的脚本加载这个接口，得到的都是相同的**。

# Node 加载
## 概述
> Node 对 ES6 模块的处理比较麻烦，因为它有自己的 CommonJS 模块格式，与 ES6 模块格式是不兼容的。目前的解决方案是，将两者分开，ES6 模块和 CommonJS 采用各自的加载方案。

Node 要求 ES6 模块采用 `.mjs` 后缀文件名。也就是说，只要脚本文件里面使用 `import` 或者 `export` 命令，那么就必须采用 `.mjs` 后缀名。
`require` 命令不能加载 `.mjs` 文件，会报错，只有 `import` 命令才可以加载 `.mjs` 文件。反过来，`.mjs` 文件里面也不能使用 `require` 命令，必须使用 `import`。

目前，这项功能还在试验阶段。安装 Node v8.5.0 或以上版本，要用 `--experimental-modules` 参数才能打开该功能。
```js
node --experiental-modules my-app.mjs
```

为了与浏览器的 `import` 加载规则相同 (**浏览器的 `import` 加载规则？？？**)，Node 的 `.mjs` 文件支持 URL 路径。
```js
// node-es6.mjs
import './foo?query=1'
```
上面代码中，脚本路径带有参数 `?query=1`，Node 会按 URL 规则解读。**同一个脚本只要参数不同，就会被加载多次，并且保存成不同的缓存**。
由于这个原因，只要文件名中含有`:`、`%`、`#`、`?`等特殊字符，最好对这些字符进行转义。

目前，**Node 的 `import` 命令只支持加载本地模块（`file:`协议），不支持加载远程模块**。

如果模块名不含路径，那么 `import` 命令会去 `node_modules` 目录寻找这个模块。
```js
import 'bar'
import 'abc/123'
```

如果模块名包含路径，那么 `import` 命令会按照路径去寻找这个名字的脚本文件。
```js
import 'file:///etc/config/app.json';
import './foo';
import './foo?search';
import '../bar';
import '/baz';
```

如果脚本文件省略了后缀名，比如 `import './foo'`，Node 会依次尝试四个后缀名：
`./foo.mjs`、
`./foo.js`、
`./foo.json`、
`./foo.node`。
如果这些脚本文件都不存在，Node 就会去加载 `./foo/package.json` 的 `main` 字段指定的脚本。如果 `./foo/package.json` 不存在或者没有 `main` 字段，
那么就会依次加载:
`./foo/index.mjs`、
`./foo/index.js`、
`./foo/index.json`、
`./foo/index.node`
如果以上四个文件还是都不存在，就会抛出错误。

最后，**Node 的 `import` 命令是异步加载，这一点与浏览器的处理方法相同**。

## 内部变量
ES6 模块应该是通用的，同一个模块不用修改，就可以用在浏览器环境和服务器环境。为了达到这个目标，**Node 规定 ES6 模块之中不能使用 CommonJS 模块的特有的一些内部变量**。

首先，就是 `this` 关键字。ES6 模块之中，顶层的 `this` 指向 `undefined`；
CommonJS 模块的顶层 `this` 指向当前模块，这是两者的一个重大差异。

其次，以下这些顶层变量在 ES6 模块之中都是不存在的：
- `arguments`

- `require`

- `module`

- `exports`

- `__filename`

- `__dirname`

如果你一定要使用这些变量，有一个变通方法，就是写一个 CommonJS 模块输出这些变量，然后再用 ES6 模块加载这个 CommonJS 模块。
但是这样一来，该 ES6 模块就不能直接用于浏览器环境了，所以 **不推荐这样做**。
```js
// expose.js
module.exports = {__dirname}

// use.mjs
import expose from './expose.js'
const = {__dirname} = expose
```

## CommonJS 模块加载 ES6 模块
CommonJS 模块加载 ES6 模块，不能使用 `require` 命令，而要使用 `import()` 函数。**ES6 模块的所有输出接口，会成为输入对象的属性**。

```js
// es.mjs
let foo = { bar: 'my-default' };
export default foo;

// cjs.js
const es_module = await import('./es.mjs')
// es_namespace = {
//   get default() {
//     ...
//   }
// }

es_module.default // { bar: 'my-default' }
```

```js
// es.js
export let foo = {bar: 'my-default'}
export {foo as bar}
export function f () {}
export class c {}

// cjs.js
const es_namespace = await import('./es')
// es_namespace = {
//   get foo() {return foo;}
//   get bar() {return foo;}
//   get f() {return f;}
//   get c() {return c;}
// }
```

# 循环加载
> “循环加载”（circular dependency）指的是，a 脚本的执行依赖 b 脚本，而 b 脚本的执行又依赖 a 脚本。

```js
// a.js
var b = require('b')

// b.js
var a = require('a')
```
通常，**“循环加载”表示存在强耦合，如果处理不好，还可能导致递归加载，使得程序无法执行，因此应该避免出现**。

对于 JavaScript 语言来说，目前最常见的两种模块格式 CommonJS 和 ES6，处理“循环加载”的方法是不一样的，返回的结果也不一样。

## CommonJS 模块的加载原理
CommonJS 的一个模块，就是一个脚本文件。`require` 命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。
```js
{
  id: '...',
  exports: { ... },
  loaded: true,
  ...
}
```
上面代码就是 Node 内部加载模块后生成的一个对象。
该对象的 `id` 属性是模块名，
`exports` 属性是模块输出的各个接口，
`loaded` 属性是一个布尔值，表示该模块的脚本是否执行完毕，其他属性暂时省略。

以后需要用到这个模块的时候，就会到 `exports` 属性上面取值。即使再次执行 `require` 命令，也不会再次执行该模块，而是到缓存之中取值。
也就是说，**CommonJS 模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存**。

## CommonJS 模块的循环加载
CommonJS 模块的重要特性是加载时执行，即脚本代码在 `require` 的时候，就会全部执行。
**一旦出现某个模块被"循环加载"，就只输出已经执行的部分，还未执行的部分不会输出**。

```js
// a.js
exports.done = false;
var b = require('./b.js'); // 注意，此时 a.js 代码就停在这里，等待 b.js 执行完毕，再往下执行。
console.log('在 a.js 之中，b.done = %j', b.done);
exports.done = true;
console.log('a.js 执行完毕');

// b.js
exports.done = false;
var a = require('./a.js');
console.log('在 b.js 之中，a.done = %j', a.done);
exports.done = true;
console.log('b.js 执行完毕');

// main.js
var a = require('./a.js');
var b = require('./b.js');
console.log('在 main.js 之中, a.done=%j, b.done=%j', a.done, b.done);

// 执行 main.js
node main.js
// 在 b.js 之中，a.done = false
// b.js 执行完毕
// 在 a.js 之中，b.done = true
// a.js 执行完毕
// 在 main.js 之中, a.done=true, b.done=true
```
上面的代码证明了两件事。
一是，在 `b.js` 之中，`a.js` 没有执行完毕，只执行了第一行。
二是，`main.js` 执行到第二行时，不会再次执行 `b.js`，而是输出缓存的 `b.js` 的执行结果，

总之，**CommonJS 输入的是被输出值的拷贝，不是引用**。

另外，由于 CommonJS 模块遇到循环加载时，返回的是当前已经执行的部分的值，而不是代码全部执行后的值，两者可能会有差异。所以，输入变量的时候，必须非常小心。
```js
var a = require('a'); // 安全的写法
var foo = require('a').foo; // 危险的写法

exports.good = function (arg) {
  return a.foo('good', arg); // 使用的是 a.foo 的最新值
};

exports.bad = function (arg) {
  return foo('bad', arg); // 使用的是一个部分加载时的值
};
```

## ES6 模块的循环加载
ES6 处理“循环加载”与 CommonJS 有本质的不同。ES6 模块是动态引用，如果使用 `import` 从一个模块加载变量（即 `import foo from 'foo'`），
那些变量不会被缓存，而是成为一个指向被加载模块的引用，**需要开发者自己保证，真正取值的时候能够取到值**。

```js
// a.mjs
import {bar} from './b';
console.log('a.mjs');
console.log(bar);
export let foo = 'foo';

// b.mjs
import {foo} from './a';
console.log('b.mjs');
console.log(foo);
export let bar = 'bar';


// 执行
node --experimental-modules a.mjs
// b.mjs
// ReferenceError: foo is not defined
```

ES6 循环加载是怎么处理的。首先，执行 `a.mjs` 以后，引擎发现它加载了 `b.mjs`，因此会优先执行 `b.mjs`，然后再执行 `a.mjs`。
接着，执行 `b.mjs` 的时候，已知它从 `a.mjs` 输入了 `foo` 接口，这时不会去执行 `a.mjs`，而是认为这个接口已经存在了，继续往下执行。
执行到第三行 `console.log(foo)` 的时候，才发现这个接口根本没定义，因此报错。

解决这个问题的方法，就是让 `b.mjs` 运行的时候，`foo` 已经有定义了。这可以通过将 `foo` 写成函数来解决。
```js
// a.mjs
import {bar} from './b';
console.log('a.mjs');
console.log(bar());
function foo () { return 'foo'}
export {foo}

// b.mjs
import {foo} from './a';
console.log('b.mjs');
console.log(foo());
function bar () { return 'bar'}
export {bar}

// 执行
node --experimental-modules a.mjs
// b.mjs
// foo
// a.mjs
// bar
```
这是因为函数具有提升作用，在执行 `import {bar} from './b'` 时，函数 `foo` 就已经有定义了，所以 `b.mjs` 加载的时候不会报错。这也意味着，如果把函数 `foo` 改写成函数表达式，也会报错。
**疑问：虽然函数声明具有变量提升的效果，可是在执行 `import {bar} from './b'` 时，加载 `b.mjs` 时， `a.mjs` 中的 `foo` 还没有执行 `export` 怎么就不报错了？**

## ES6 模块的转码
浏览器目前还不支持 ES6 模块，为了现在就能使用，可以将其转为 ES5 的写法。除了 Babel 可以用来转码之外，还有以下两个方法，也可以用来转码。

## ES6 module transpiler
```js
// install
npm install  -g  es6-module-transpiler

// 转码 ES6 文件
compile-modules convert file1.js file2.js

// -o 参数可以指定转码后的文件
compile-modules convert -o out.js file1.js
```

## SystemJS
它是一个垫片库（polyfill），可以在浏览器内加载 ES6 模块、AMD 模块和 CommonJS 模块，将其转为 ES5 格式。它在后台调用的是 Google 的 `Traceur` 转码器。

```js
// 使用时，先在网页内嵌入 `system.js` 文件
<script src="system.js"></script>

// 然后，使用 System.import 方法加载模块文件。
<script>
  System.import('./app.js');
</script>
```

需要注意的是，`System.import` 使用异步加载，返回一个 `Promise` 对象，可以针对这个对象编程。下面是一个模块文件。
```js
// app/es6-file.js:
export class q {
  constructor() {
    this.es6 = 'hello';
  }
}

<script>

System.import('app/es6-file').then(function(m) {
  console.log(new m.q().es6); // hello
});

</script>
```

# 引用
* [阮一峰 ES6入门-Module 的j加载实现](http://es6.ruanyifeng.com/#docs/module-loader)
* [《JavaScript 模块的循环加载》批注](https://zhuanlan.zhihu.com/p/27159745)
* [JavaScript模块化（ES Module/CommonJS/AMD/CMD）](https://www.jianshu.com/p/da2ac9ad2960)
