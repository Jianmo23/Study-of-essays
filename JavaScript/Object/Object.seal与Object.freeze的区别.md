## Object.seal()
```
Object.seal()方法封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要可写就可以改变。
```

### 描述
```
通常，一个对象是可扩展的（可以添加新的属性）。密封一个对象会让这个对象变的不能添加新属性，且所有已有属性会变的不可配置。属性不可配置的效果就是属性变的不可删除，以及一个数据属性不能被重新定义成为访问器属性，或者反之。但属性的值仍然可以修改。尝试删除一个密封对象的属性或者将某个密封对象的属性从数据属性转换成访问器属性，结果会静默失败或抛出TypeError（在严格模式 中最常见的，但不唯一）。

不会影响从原型链上继承的属性。但 __proto__ 属性的值也会不能修改。

返回被密封对象的引用。
```

```js
var o = {
	name: 'zyy'
}
// 此时是可扩展的
console.log(Object.isExtensible(o)) // true

console.log(Object.getOwnPropertyDescriptor(o, 'name'))
/* 输出对象：object
 * object.configurable = true
 * object.enumerable = true
 * object.value = 'zyy'
 * object.writable = true
 */

// 调用Object.seal() 密封
var o2 = Object.seal(o);
console.log(o2 === o) // true
console.log(Object.isSealed(o)) // true

// 此时不可扩展
console.log(Object.isExtensible(o)) // false
console.log(Object.getOwnPropertyDescriptors(o))
/* 输出对象：object
 * object.name = o_name
 * o_name.configurable = false (改变)
 * o_name.enumerable = true
 * o_name.value = 'zyy'
 * o_name.writable = true
 */

// 测试如下
// 可以修改属性值
o.name = 'YYY';
console.log(o.name) // 'YYY'

// 不可删除已有属性
console.log(delete o.name) // false
console.log(o.name) // 'YYY'

// 不可扩展
o.age = 27;
console.log(o) // {name: 'YYY'}

// 不可配置
Object.defineProperty(o, 'age', {
	configurable: true,
	writable: false,
	value: 27,
	enumerable: false
}); // TypeError: Cannot define property age, object is not extensible

console.log(o) // {name: 'YYY'}

var obj = {
	a: 1,
	b: {
		bb: 2
	}
}

// 密封一个对象，如果该对象的属性值还是对象 则不会影响到它
Object.seal(obj)
Object.isSealed(obj) // true
Object.isExtensible(obj) // false
Object.isSealed(obj.b) // false
Object.isExtensible(obj.b) // true
```

### 注意
```
在ES5中，如果这个方法的参数不是一个（原始）对象，那么它将导致TypeError。在ES2015中，非对象参数将被视为已被密封的普通对象，会直接返回它。
```

```js
Object.seal(1);
// TypeError: 1 is not an object (ES5 code)

Object.seal(1);
// 1
```

## Object.freeze()
```js
Object.freeze() 方法可以冻结一个对象。一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改。freeze() 返回和传入的参数相同的对象。
```

### 描述
```
被冻结对象自身的所有属性都不可能以任何方式被修改。任何修改尝试都会失败，无论是静默地还是通过抛出TypeError异常（最常见但不仅限于strict mode）。

数据属性的值不可更改，访问器属性（有getter和setter）也同样（但由于是函数调用，给人的错觉是还是可以修改这个属性）。**如果一个属性的值是个对象，则这个对象中的属性是可以修改的，除非它也是个冻结对象。数组作为一种对象，被冻结，其元素不能被修改。没有数组元素可以被添加或移除。**

这个方法返回传递的对象，而不是创建一个被冻结的副本。

```

```js
var person = {
	name: 'yyy',
	age: 27
}
console.log(Object.isExtensible(person)) // true
console.log(Object.isFrozen(person)) // false

// 冻结
Object.freeze(person);
console.log(Object.isExtensible(person)) // false
console.log(Object.isFrozen(person)) // true

console.log(Object.getOwnPropertyDescriptor(person, 'age'));
/* 输出对象：object
 * object.configurable = false (改变)
 * object.enumerable = true
 * object.value = 27
 * object.writable = false (改变)
 */

// 不可写
person.age = 100
console.log(person) // {name: "yyy", age: 27}

// 不可添加
person.isMarried = false;
console.log(person) // {name: "yyy", age: 27}

// 不可删除
delete person.name
console.log(person) // {name: "yyy", age: 27}

// 不可更改配置
Object.defineProperty(person, 'age', {
	configurable: true,
	writable: false,
	value: 27,
	enumerable: false
}) // TypeError: Cannot redefine property: age

var obj = {
	a: 1,
	b: {
		bb: 2
	}
}

// 冻结一个对象，如果该对象的属性值还是对象 则不会影响到它
Object.freeze(obj)
Object.isFrozen(obj) // true
Object.isExtensible(obj) // false
Object.isFrozen(obj.b) // false
Object.isExtensible(obj.b) // true

// 冻结数组也是一样
```

### 注意
 ```
 在ES5中，如果这个方法的参数不是一个对象（一个原始值），那么它会导致 TypeError。在ES2015中，非对象参数将被视为要被冻结的普通对象，并被简单地返回。
 ```
* 示例如上 * 

## 二者对比如下

### 相同点
* 调用 `Object.seal(o)` 和 `Object.freeze(o)` 后， `Object.isExtensible(o)` 均返回 false
* 调用 `Object.seal(o)` 和 `Object.freeze(o)` 后，如果属性值为对象，则不会影响这个对象
* 调用 `Object.seal(o)` 和 `Object.freeze(o)` 后，对象均不可配置，不可删除已有属性，不可添加新属性
* 调用 `Object.seal(o)` 和 `Object.freeze(o)` 后，调用 `Object.getOwnPropertyDescriptor(o, prop)` 返回的对象中 `configurable = false`

### 不同点
在原有属性均可写的前提下：
* 调用 `Object.seal(o)` 后，调用 `Object.getOwnPropertyDescriptor(o, prop)` 返回的对象中 `writable = true`, 已有属性可写
* 调用 `Object.freeze(o)` 后，调用 `Object.getOwnPropertyDescriptor(o, prop)` 返回的对象中 `writable = false`，已有属性不可写







































