* 时间：`2019-04-24`
* 运行环境： `macOS 10.14.4  chrome 版本 73.0.3683.86（正式版本)`
* NodeJS：`node v9.2.1  npm v6.7.0`
* 更新时间： ``


## slice
`slice()` 方法是从数组或字符串中截取选定的元素，不影响原数据 [传送门](http://www.w3school.com.cn/jsref/jsref_slice_array.asp)

**语法：**
```js
arrayObject.slice(start,end)
```
start: 必需。规定从何处开始选取。如果是负数，那么它规定从数组尾部开始算起的位置。也就是说，-1 指最后一个元素，-2 指倒数第二个元素，以此类推。

end: 可选。规定从何处结束选取。该参数是数组片断结束处的数组下标。如果没有指定该参数，那么切分的数组包含从 `start` 到数组结束的所有元素。如果这个参数是负数，那么它规定的是从数组尾部开始算起的元素。

```js
var str = 'hello world';
str.slice() === str // true
str.slice(-2) // 'ld'
str.slice(2) // 'llo world'
str.slice(2, 7) // 'llo w'
str.slice(3, 1) // ''
str.slice(-3, -4) // ''
str.slice(-3, -1) === str.slice(str.length - 3, str.length - 1) // true
```

## substr
`substr()` 方法可在字符串中抽取从 `start` 下标开始的指定数目的字符。[传送门](http://www.w3school.com.cn/js/jsref_substr.asp)

**语法：**
```js
stringObject.substr(start,length)
```
start: 必需。要抽取的子串的起始下标。必须是数值。如果是负数，那么该参数声明从字符串的尾部开始算起的位置。也就是说，-1 指字符串中最后一个字符，-2 指倒数第二个字符，以此类推。

length: 可选。子串中的字符数。必须是数值。如果省略了该参数，那么返回从 stringObject 的开始位置到结尾的字串。

**重要事项：ECMAscript 没有对该方法进行标准化，因此反对使用它。**

```js
var str = 'hello world';
str.substr() === str; // true
str.slice(1) // 'ello world'
str.slice(-1) // 'd'
str.substr(1, 4) // 'ello'
str.substr(-1, -4) // ''
str.substr(-4, -1) // ''

var arr = [1, 2, 3, 4, 5];
arr.slice() // [1, 2, 3, 4, 5]
arr.slice() === arr // false
arr.slice(-1) // [5]
arr.slice(1) // [2, 3, 4, 5]
arr.slice(-1, -4) // []
arr.slice(-4, -1) // [2, 3, 4]
```

## substring
`substring()`` 方法用于提取字符串中介于两个指定下标之间的字符。[传送门](http://www.w3school.com.cn/jsref/jsref_substring.asp)

**语法：**
```js
stringObject.substring(start,stop)
```
start 必需。一个非负的整数，规定要提取的子串的第一个字符在 `stringObject` 中的位置。

stop: 可选。一个非负的整数，比要提取的子串的最后一个字符在 `stringObject` 中的位置多 1。如果省略该参数，那么返回的子串会一直到字符串的结尾。

说明：
* `substring()` 方法返回的子串包括 `start` 处的字符，但不包括 `stop` 处的字符。

* 如果参数 `start` 与 `stop` 相等，那么该方法返回的就是一个空串（即长度为 0 的字符串）。如果 `start` 比 `stop` 大，那么该方法在提取子串之前会先交换这两个参数。

**`substring()` 方法不接受参数为负数！！！**

```js
var str = 'hello world';
str.substring(-1) // 'hello world'
str.substring(1) // ello world
str.substring(1, 4) // 'ell'
str.substring(-1, -4) // 'ell'
str.substring(4, 1) // 'ell'
```

## 三者区别
* `slice`, `substr`, `substring` 三者的第一个参数均表示起迟位置，其中第二个参数略有不同：
  - `slice` 第二个参数表示结束位置
  - `substr` 第二个参数表示提取长度， 如果小于等于0 返回空字符串
  - `substring` 第二个参数表示结束位置

* `slice`, `substr` 第一个参数可以为负数，表示从尾部开始， `substring` 参数不能为负，否则没效果

* `substring` 第一个参数 大于 第二个参数时，在提取子串之前会交换位置，小在前，大在后

* `slice`, `substr`, `substring` 当都只有一个正数参数时，效果相同
