* node v11.10.0
* npm 6.7.0

ES6 处理“循环加载”与 CommonJS 有本质的不同。**ES6模块是动态引用**，如果使用 `import` 从一个模块加载变量，那些变量不会被缓存，
而是成为一个指向被加载模块的引用，需要开发者自己保证，真正取值的时候能够取到值。

举例一：
```js
// a.js
import {bar} from './b.js';
console.log('a.js');
console.log(bar);
export let foo = 'foo';

// b.js
import {foo} from 'a.js';
console.log('b.js');
console.log(foo);
export let bar = 'bar';
```
以上两段代码组成了循环加载，首先执行 `a.js`：

由代码可知，`a.js` 的第一行是加载 `b.js` ，因此会首先执行 `b.js` ，而 `b.js` 的第一行又是加载 `a.js` ，这时候 `a.js` 已经开始执行了，所以不会`重复执行`，而是往下继续执行 `b.js` ，因此会输出 `b.js` 。

接着 `b.js` 要打印出来变量 `foo`，因为此时 `a.js` 尚未完全执行完，获取不到 `foo`，因此会打印 `undefined`。`b.js` 执行完毕，继续执行 `a.js` ，正常执行就OK

```js
// 打印结果
// b.js
// undefined
// a.js
// bar
```

然后执行 `b.js`，同理输出：

```js
// 打印结果
// a.js
// undefined
// b.js
// foo
```

举例二：
```js
// a.js
import {bar} from './b.js';
export function foo () {
	console.log('foo');
	bar();
	console.log('foo执行完毕')
}
foo();

// b.js
import {foo} from './a.js';
export function bar () {
	console.log('bar');
	if(Math.random() > 0.5) {
		foo()
	}
}
```
按照 CommonJS 规范，上面的代码是没法执行的。a先加载b，然后b又加载a，这时a还没有任何执行结果，所以输出结果为null，即对于b.js来说，变量foo的值等于null，后面的foo()就会报错。

上面代码中，a.js之所以能够执行，原因就在于`ES6加载的变量，都是动态引用其所在的模块。只要引用存在，代码就能执行。`

执行顺序解释：
```js
// a.js
// 这一行建立一个引用，
// 从`b.js`引用`bar`
import {bar} from './b.js';

export function foo() {
  // 执行时第一行输出 foo
  console.log('foo');
  // 到 b.js 执行 bar
  bar();
  console.log('执行完毕');
}
foo();


// b.js
// 建立`a.js`的`foo`引用
import {foo} from './a.js';

export function bar() {
  // 执行时，第二行输出 bar
  console.log('bar');
  // 递归执行 foo，一旦随机数
  // 小于等于0.5，就停止执行
  if (Math.random() > 0.5) {
    foo();
  }
}
```
but，使用babel-node ./a.js 会报错？`Cannot read property 'foo' of undefined`


## 引用
* [Module 的加载实现](https://www.jianshu.com/p/fe1b7f1367b7?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)
































