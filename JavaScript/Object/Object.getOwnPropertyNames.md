* 时间：`2019-07-09`
* 运行环境： `macOS 10.14.4  chrome 版本 75.0.3770.100（正式版本） （64 位）
* NodeJS：`node v12.4.0  npm v6.10.0`
* 更新时间： ``

## `Object.getOwnPropertyNames()`
`Object.getOwnPropertyNames()` 方法返回一个由指定对象的所有自身属性的属性名（**包括不可枚举属性但不包括Symbol值作为名称的属性**）组成的数组。

数组中枚举属性的顺序与通过 `for...in` 循环（或 `Object.keys`）迭代该对象属性时一致。数组中不可枚举属性的顺序未定义。

```js
// 数组
var arr = ['a', 'b'];
Object.getOwnPropertyNames(arr) // ["0", "1", "length"]

// 类数组对象
var obj = { 0: "a", 1: "b", 2: "c"};
Object.getOwnPropertyNames(obj // ["0", "1", "2"]

// 对象
var obj = Object.create({}, {
    getFoo: {
        value: function () { return this.foo; },
        enumerable: false
    }
});
obj.foo = 1;
Object.getOwnPropertyNames(obj) // ["getFoo", "foo"]
Object.keys(obj) // ["foo"]
```

**在 ES5 中，如果参数不是一个原始对象类型，将抛出一个 TypeError  异常。在 ES2015 中，非对象参数被强制转换为对象 。**

## 引用
- [MDN: Object.getOwnPropertyNames](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames)
