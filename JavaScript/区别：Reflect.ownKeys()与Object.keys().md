* 时间：`2019-07-09`
* 运行环境： `macOS 10.14.4  chrome 版本 75.0.3770.100（正式版本） （64 位）
* NodeJS：`node v12.4.0  npm v6.10.0`
* 更新时间： ``

## `Reflect.ownKeys(target)`
`Reflect.ownKeys` 方法用于返回对象的所有属性，基本等同于 `Object.getOwnPropertyNames` 与 `Object.getOwnPropertySymbols` 之和。
```js
// 对象
var obj = {
    foo: 1,
    bar: 2,
    [Symbol.for('hello')]: 3,
    [Symbol.for('world')]: 4
};
Object.getOwnPropertyNames(obj) // ["foo", "bar"]
Object.getOwnPropertySymbols(obj) // [Symbol(hello), Symbol(world)]

Reflect.ownKeys(obj) // ["foo", "bar", Symbol(hello), Symbol(world)]

// 数组
var arr = [];

Object.getOwnPropertyNames(arr) // ["length"]
Object.getOwnPropertySymbols(arr) // []

Reflect.ownKeys(arr) // ["length"]
```
**如果 `Reflect.ownKeys()` 方法的第一个参数不是对象，会报错。**


## `Object.keys(target)`
`Object.keys` 返回一个 **所有元素为字符串** 的数组，其元素来自于从给定的 `target` 上面 **可直接枚举** 的属性。
这些属性的顺序与手动遍历该对象属性时的一致。

```js
// 数组
var arr = ['a', 'b', 'c'];
Object.keys(arr) // ["0", "1", "2"]

// 对象
var obj = Object.create({}, {
    getFoo: {
        value: function () {return this.foo; }
    }
});
obj.foo = 1;
Object.keys(obj) // ["foo"]
```
**在ES5里，如果此方法的参数不是对象（而是一个原始值），那么它会抛出 TypeError。在ES2015中，非对象的参数将被强制转换为一个对象**

## 引用
- [阮一峰：Reflect](http://es6.ruanyifeng.com/#docs/reflect#Reflect-ownKeys-target)
- [阮一峰：Reflect 个人学习笔记](https://github.com/ZYY1923/Study-of-essays/blob/master/es6/Reflect.md)
- [MDN: Reflect.ownKeys](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys)
- [MDN: Object.keys](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)
