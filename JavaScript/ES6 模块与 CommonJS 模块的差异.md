* node v11.10.0
* npm 6.7.0

## ES6 模块与 CommonJS 模块的差异

讨论 Node 加载 ES6 模块之前，必须了解 `ES6 模块` 与 `CommonJS 模块` 完全不同。

### 差异
它们有两个重大差异:
1. `CommonJS 模块` 输出的是一个值得拷贝，`ES6 模块` 输出的是值得引用；

2. `CommonJS 模块` 是运行时加载，`ES6 模块` 是编译时输出接口；

### 差异一解释
`CommonJS 模块` 输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。

```js
// node 环境测试
// node.js
var counter = 3;

function incCounter () {
	counter++;
	console.log('incCounter - counter: ', counter);
}

module.exports = {
	counter: counter,
	incCounter: incCounter
}

// node-app.js
var mod = require('./node.js');

console.log(mod.counter); // 3

mod.incCounter(); // incCounter - counter: 4

console.log(mod.counter); // 3
```
由代码测试可知，`node.js` 模块加载以后，它的内部变化就无法影响 `mod.counter` 了。这是因为 `mod.counter` 是一个原始类型的值，会被缓存下来。除非写成一个函数，才能得到内部比那懂后的值。

```js
// 上述代码修改如下
// node.js
var counter = 3;

function incCounter () {
	counter++;
	console.log('incCounter - counter: ', counter);
}

module.exports = {
	// 输出取值器函数
	get counter () {
		console.log('get counter: ', counter);
		return counter;
	},
	incCounter: incCounter
}

// node-app.js
var mod = require('./node.js');

console.log(mod.counter); 
// get counter: 3
// 3

mod.incCounter(); // incCounter - counter: 4

console.log(mod.counter); 
// get counter: 4
// 4
```
输出一个 `取值器函数` 后，执行后发现就可以正常获取内部变量 `counter` 的变动了。

```
`ES6 模块` 的运行机智与 `CommonJS` 不一样。JS引擎对脚本静态解析的时候，遇到模块加载命令 `import`，就会生成一个 `只读引用`。等到脚本真正执行的时候，再根据这个 `只读引用` 到被加载的模块里面去取值。换句话说，ES6 的 `import` 有点像 Unix 系统的“符号连接”，原始值变了，`import` 加载的值也会跟着变。因此 `ES6 模块` 是 `动态引用`，并且不会缓存值，模块里面的变量绑定其所在的模块。 
```

```js
// m1.js
export var foo = 'bar';

setTimeout(foo => foo = 'baz', 500);

// m2.js
import {foo} from './m1.js';

console.log(foo); // bar
setTimeout(() => console.log(foo), 500) // // bar

// 执行
// babel-node ./m2.js
```

通过babel转义执行，发现两次输出都是一样的，也就是说没有动态的去被加载的模块取值 *why???*

还有个问题，项目内安装 `babel-cli`, 根目录配置 `.babelrc` 文件后， 在使用 `babel-node` 的时候， 控制台输出 `zsh: command not found: babel-node`, 解决方案是 `./node_modules/.bin/babel-node m2.js`

```js
// m1.js
export let obj = {};

// m2.js
import {obj} from './m1.js';
obj.prop = 123; 
obj = {}; // TypeError： "obj" is read-only
```
执行后发现可以给对象添加属性，但不能为对象重新赋值，说明 `obj` 指向的地址是只读的，不能重新赋值；类似使用 `const` 创建了一个常量


### 差异二解释
第二个差异是因为 `CommonJS` 加载的是一个对象（即 `module.exports`），该对象只有在脚本运行完才会生成。而 `ES6 模块` 不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

## 引用
* [Module 的加载实现](https://www.jianshu.com/p/fe1b7f1367b7?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)
