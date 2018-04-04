- 标签： `JavaScript`
- 时间： `2018-04-04`
- 更新： ``

## 常用 `console` 对象方法

```
1. console.log()

2. console.debug()  console.info()  console.warn()  console.error()

3. console.table()

4. console.time()  console.timeEnd()

5. console.assert()

6. console.count();

7. console.group()  console.groupCollapsed()  console.groupEnd()

8. console.dir()
```

**运行环境：Chrome 版本 64.0.3282.186（正式版本）**

之前只是知道 `console` 对象有其他方法，但是在代码调试中使用频率不高；相信大家用的最多的就是 `console.log()`

## 分类解析使用

**console.log()**

```js
const str1 = 'hello';

const str2 = 'world';

console.log(str1, str2); // hello world

**console.log()的参数可以有多个，输出结果以空格分割**

---------------------------------------

console.log('%d年%d月%d日', 2018, 04, 04); // 2018年4月4日

console.log('%d年%d月%d日', 2018, 4, 4); // 2018年4月4日

console.log('Math.PI = %i', 3.1415926); // Math.PI = 3

console.log('Math.PI = %f', 3.1415926); // Math.PI = 3.1415926

console.log('%s love %s', 'I', 'coding'); // I love coding

console.log('object: %o', {name: 'Yyy'}); // object: {name: "Yyy"}

console.log('%c change color', 'background:#f00; color:#fff'); // 红底白字输出：change color

**注:** 支持度不好 占位符 %c: 代表字符 %s：代表字符串
```

```
console.log() 可以使用 C 语言 printf() 风格的占位符，不过其支持的占位符种类较少，只支持字符串（%s）、整数（%d或%i）、浮点数（%f）和对象（%o）。
```

**`console.debug()`  `console.info()`  `console.warn()`  `console.error()`**

```js
<!-- 这四个方法和 console.log() 是一样的，只是输出log的颜色和图标不同 -->

console.log('log');

console.debug('debug');

console.info('info');

console.warn('warn');

console.error('error');
```
输出结果：

![GitHub set up](https://github.com/ZYY1923/Study-of-essays/blob/master/JavaScript/imgs/console.jpg)

**console.table()**

```js
var person = {
	firstName: 'yy',
	lastName: 'Z',
	info: {
		education: 'undergraduate',
		address: 'shanghai',
		details: {
	 	    age: '25'
	    }
	}
}

console.table(person);
```
输出结果：

![GitHub set up-w500](https://github.com/ZYY1923/Study-of-essays/blob/master/JavaScript/imgs/console_table.jpg)

**注意：** console.table()可以以表格的形式输出日志，不过表格只能显示二维信息，因此嵌套三层及以上的地方会显示 Object

**`console.time()`  `console.timeEnd()`**

```js
<!-- 组合使用这两个对象方法，用于记录一段代码的执行时间 -->

console.time('execution time')

var arr = [];
for (var i = 0; i < 9; i++) {
	arr.push({key: i});
}

console.timeEnd('execution time'); // execution time: 0.085205078125ms
```
**注意：** 组合使用这两个方法，测试代码被这两个方法包围，两者参数保持一致，方便正确识别和匹配代码开始和结束的位置

**console.assert()**

```js
<!-- console.assert() 类似断点，当表达式为 false 时，输出错误信息，执行停止 -->

console.assert(1==1);

console.assert(1==4);
```
输出结果：

![GitHub set up-w500](https://github.com/ZYY1923/Study-of-essays/blob/master/JavaScript/imgs/console_assert.jpg)

**console.count()**

```js
<!-- console.count() 方法可以知道某段代码被执行的次数 -->

function countTimes () {
	console.count('count');
}

for (var j = 0; j < 4; j++) {
	countTimes();
}

<!-- 
输出结果：

count: 1
count: 2
count: 3
count: 4 
-->
```

**`console.group()`  `console.groupCollapsed()`  `console.groupEnd()`**

console.log() 方法输出的结果没有层级关系，在一些需要展示层级关系的log中显得苍白无力，不过使用 `console.group()` 与 `console.groupEnd()` 或者 `console.groupCollapsed()` 与 `console.groupEnd()` 就可以达到效果；

```js
console.group(1);
console.log('1-1');
console.log('1-2');
console.log('1-3');
console.groupEnd();

console.groupCollapsed(2);
console.log('2-1');
console.log('2-2');
console.log('2-3');
console.groupEnd();
```
输出结果：

![GitHub set up-w150](https://github.com/ZYY1923/Study-of-essays/blob/master/JavaScript/imgs/console_group.jpg)

**console.dir()**

```js
Chrome:

var obj = {a: 1, b: 2, c: 3};

console.log(obj);

console.dir(obj);
```
输出结果：

![GitHub set up-w150](https://github.com/ZYY1923/Study-of-essays/blob/master/JavaScript/imgs/Chrome-console_dir.jpg)


```js
Firefox:

var obj = {a: 1, b: 2, c: 3};

console.log(obj);

console.dir(obj);
```
输出结果：

![GitHub set up-w150](https://github.com/ZYY1923/Study-of-essays/blob/master/JavaScript/imgs/Firefox-console_dir.jpg)

```
通过对比可以发现不同的浏览器，显示的方式不同，Firefox下可以将一个对象输出为一个清晰的导航树，而Chrome下是折叠的；so，这并不是代表 `console.dir()` 方法在Chrome下是鸡肋，往下看：
```

![GitHub set up-w150](https://github.com/ZYY1923/Study-of-essays/blob/master/JavaScript/imgs/Chrome-console_log_dir.jpg)

![GitHub set up-w150](https://github.com/ZYY1923/Study-of-essays/blob/master/JavaScript/imgs/Chrome-console_dir_log.jpg)

**通过对比可知：**

在 Chrome 中打印 DOM 元素时，两种方法输出的结果相差甚远。`console.log()` 会将 DOM 元素以 HTML 字符串的形式输出，而 `console.dir() ` 则会以 JSON 对象的形式输出。

## 引用

* 知乎：[JavaScript 中 console 的用法](https://zhuanlan.zhihu.com/p/23080626)

