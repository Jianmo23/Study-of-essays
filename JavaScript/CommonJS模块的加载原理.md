* node v11.10.0
* npm 6.7.0

`CommonJS` 的一个模块，就是一个脚本文件。require命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。

```js
{
	id: '...',
	exports: { ... },
	loaded: true,
	...
}
```

上面代码就是Node内部加载模块后生成的一个对象。
id: 模块名，
exports: 模块输出的各个接口，
loaded: 布尔值，表示该模块的脚本是否执行完毕

***************************************
以后需要使用该模块时直接从 `exports` 属性上取值，即使再次使用 `require` 加载也不会再次执行该模块，而是从缓存中取；也就是说，CommonJS模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存。
***************************************

## CommonJS 模块的循环加载
`CommonJS 模块` 的重要特性是加载时执行，即脚本代码在require的时候，就会全部执行。一旦出现某个模块被"循环加载"，
**就只输出已经执行的部分，还未执行的部分不会输出**。

```js
// a.js
module.exports.done = false;
var b = require('./b.js');
console.log('在 a.js 之中，b.done = %j', b.done);
module.exports.done = true;
console.log('a.js 执行完毕');

// b.js
exports.done = false;
var a = require('./a.js');
console.log('在 b.js 之中，a.done = %j', a.done);
exports.done = true;
console.log('b.js 执行完毕');
```
`node a.js` 执行 a.js 文件：
`a.js` 首先输出 `done` 变量，然后加载 `b.js` 文件，此时 `a.js` 暂停执行，转而执行 `b.js` 并等待其执行完毕后，才能恢复继续执行 `a.js`

因此，执行输出为：
```js
// 在 b.js 之中，a.done = false
// b.js 执行完毕
// 在 a.js 之中，b.done = true
// a.js 执行完毕
```

`node b.js` 执行 b.js 文件： 
同理，`b.js` 也是首先输出变量 `done` ， 然后加载 `a.js` 文件，此时 `b.js` 文件暂停执行，转而执行 `a.js` 并等待其执行完毕后，才能恢复继续执行 `b.js`

因此，执行输出为：
```js
// 在 a.js 之中，b.done = false
// a.js 执行完毕
// 在 b.js 之中，a.done = true
// b.js 执行完毕
```

综合验证如下：

```js
// main.js
var a = require('a.js');
var b = require('b.js');
console.log('在 main.js 之中, a.done=%j, b.done=%j', a.done, b.done);
```

`node main.js` 执行 mainjs 文件：
```js
// 在 b.js 之中，a.done = false
// b.js 执行完毕
// 在 a.js 之中，b.done = true
// a.js 执行完毕
// 在 main.js 之中, a.done=true, b.done=true
```

由此验证了两件事：

1. 遇到循环加载时，只会获取已经执行的部分；因为在 `require('a.js')` 后，转交执行权，执行 `a.js` 文件，在输出 `done = false`， 又去 `require('b.js')`，再次转交执行权，转而执行 `b.js`， 此时 `a.js` 缓存的执行结果只有 `exports.done = false` ，所以第一行输出的是 `在 b.js 之中，a.done = false`；

2. 在 `main.js` 中，执行到 `var b = require('b.js')` 时，不会再次加载 `b.js` 文件，而是直接输出缓存中该文件的执行结果，即 `b.js` 中的第四行 `exports.done = true`；

**总之，CommonJS输入的是被输出值的拷贝，不是引用！**

另外，由于 `CommonJS模块` 遇到循环加载时，返回的是当前已经执行的部分的值，而不是代码全部执行后的值，两者可能会有差异。所以，
输入变量的时候，必须非常小心

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

上面代码中， 如果发生循环加载的话，`require('a').foo` 的值有可能会被后面改写， 改用 `require('a')` 会安全一些！

## 引用
* [Module 的加载实现](https://www.jianshu.com/p/fe1b7f1367b7?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)



























