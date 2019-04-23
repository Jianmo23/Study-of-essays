* 时间：`2019-04-18`
* 运行环境： `macOS 10.14.4  chrome 版本 73.0.3683.86（正式版本)`
* 更新时间： `2019-04-18`

## 概述
`Reflect` 对象的设计目的：
1. 将`Object`对象的一些明显属于语言内部的方法（比如`Object.defineProperty`），放到`Reflect`对象上。现阶段，某些方法同时在`Object`和`Reflect`对象上部署，未来的新方法将只部署在`Reflect`对象上。也就是说，从`Reflect`对象上可以拿到语言内部的方法。
2. 修改某些`Object`方法的返回结果，让其变得更合理。比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而`Reflect.defineProperty(obj, name, desc)`则会返回`false`
3. 让`Object`操作都变成函数行为。某些`Object`操作是命令式，比如`name in obj` 和 `delete obj[name]`，而`Reflect.has(obj, name)` 和 `Reflect.deleteProperty(obj, name)`让它们变成了函数行为。
4. `Reflect`对象的方法与`Proxy`对象的方法一一对应，只要是`Proxy`对象的方法，就能在`Reflect`对象上找到对应的方法。这就让`Proxy`对象可以方便地调用对应的`Reflect`方法，完成默认行为，作为修改行为的基础。也就是说，不管`Proxy`怎么修改默认行为，你总可以在`Reflect`上获取默认行为。

```js
<!-- 案例一 -->
var target = {};
var proxy = new Proxy(target, {
    set (target, prop, value, receiver) {
        var isSuccessful = Reflect.set(target, prop, value, receiver);

        if (isSuccessful) {
            console.log(`Property ${prop} on ${target} set to ${value}`)
        }

        return isSuccessful;
    }
});
proxy.name = 'zyy';
// target // {name: 'zyy'}
// proxy // Proxy {name: 'zyy'}

<!-- 案例二 -->
var obj = {
    age: 27
};
var loggedObj = new Proxy(obj, {
    get(target, prop, receiver) {
        console.log(`get: ${target} - ${prop}`)
        return Reflect.get(target, prop, receiver);
    },
    deleteProperty (target, prop) {
        console.log(`delete: ${target} - ${prop}`)
        return Reflect.deleteProperty(target, prop);
    },
    has (target, prop) {
        console.log(`has: ${target} - ${prop}`)
        return Reflect.has(target, prop);
    }
});

// 'age' in loggedObj // true
// loggedObj.name // 27
// delete loggedObj.age // true
// obj // {}

<!-- 案例三 -->
// old
Function.prototype.apply.call(Math.floor, null, [1.75]) // 1
Function.prototype.call.apply(Math.floor, [null, 1.75]) // 1
Function.prototype.apply.apply(Math.floor, [null, [1.75]]) // 1
Function.prototype.call.call(Math.floor, null, 1.75) // 1
// new
Reflect.apply(Math.floor, null, [1.75]) // 1
```
## Reflect 静态方法
* `Reflect.apply(target, thisArg, args)`
* `Reflect.construct(target, args)`
* `Reflect.get(target, prop, receiver)`
* `Reflect.set(target, prop, value, receiver)`
* `Reflect.defineProperty(target, prop, desc)`
* `Reflect.deleteProperty(target, prop)`
* `Reflect.has(target, prop)`
* `Reflect.ownKeys(target)`
* `Reflect.isExtensible(target)`
* `Reflect.preventExtensions(target)`
* `Reflect.getOwnPropertyDescriptor(target, prop)`
* `Reflect.getPrototypeOf(target)`
* `Reflect.setPrototypeOf(target, prototype)`

### Reflect.get(target, prop, receiver)
```
Reflect.get方法查找并返回target对象的prop属性，如果没有该属性，则返回undefined。
```
**注意：**
* 如果 `prop` 属性部署了读取函数（`getter`），则读取函数内部的 `this` 绑定 `receiver`
* 如果第一个参数不是对象，方法会报错

```js
<!-- 验证一 -->
var obj = {
    foo: 1,
    bar: 2,
    get baz () {
        return this.foo + this.bar;
    }
};

Reflect.get(obj, 'foo') // 1
Reflect.get(obj, 'bar') // 2
Reflect.get(obj, 'baz') // 3

var myReceiver = {
    foo: 10,
    bar: 2
}
Reflect.get(obj, 'baz', myReceiver) // 12

<!-- 验证二 -->
Reflect.get(1, 'foo') // TypeError: Reflect.get called on non-object
```

### Reflect.set(target, prop, value, receiver)
```
Reflect.set方法设置target对象的name属性等于value，成功返回 true，反之，返回 false
```
**注意：**
* 如果 `prop` 属性设置了赋值函数（`setter`），则赋值函数的 `this` 绑定 `receiver`。
* 如果 `Proxy` 对象和 `Reflect` 对象联合使用，前者拦截赋值操作，后者完成赋值的默认行为，而且传入了 `receiver`，那么 `Reflect.set` 会触发 `Proxy.defineProperty` 拦截。
* 如果第一个参数不是对象，`Reflect.set` 会报错。

```js
<!-- 雅验证一 -->
var obj = {
    foo: 1,
    set bar (value) {
        this.foo = value;
    }
}
Reflect.set(obj, 'foo', 2) // true
obj.foo // 2

var myReceiver = {
    foo: 0
}
Reflect.set(obj, 'bar', 4, myReceiver);
myReceiver.foo // 4

<!-- 验证二 -->
var proxy = new Proxy({
    name: 'yyy'
}, {
    set (target, prop, value, receiver) {
        console.log('set')
        Reflect.set(target, prop, value, receiver);
    },
    defineProperty (target, prop, desc) {
        console.log('defineProperty')
        console.log(desc)
        Reflect.defineProperty(target, prop, desc);
    }
});
proxy.name = 'zyy'
// set, defineProperty, zyy
<!-- 验证不传入receiver -->
var proxy = new Proxy({
    name: 'yyy'
}, {
    set (target, prop, value, receiver) {
        console.log('set')
        Reflect.set(target, prop, value);
    },
    defineProperty (target, prop, desc) {
        console.log('defineProperty')
        console.log(desc)
        Reflect.defineProperty(target, prop, desc);
    }
});
proxy.name = 'zyy'
// set 'zyy'

**因此，Proxy 和 Reflect 联合使用时，在 Proxy.set 方法内部， Reflect.set 方法只有传入 receiver 参数才会触发 Proxy.defineProperty 方法**
**解释：Proxy.set 方法的 receiver 参数总是指向当前 Proxy 实例（本例中指 proxy），因此 Reflect.set 一旦传入 receiver 参数，就相当于将属性赋值到 receiver 上，即 Proxy 实例，由此会触发 Proxy.defineProperty 方法；反之，Proxy.set 内部的 Reflect.set 不传入 receiver 则不会**

<!-- 验证三 -->
Reflect.set(1, 'age', 27) // TypeError: Reflect.set called on non-object
```
### Reflect.has(target, prop)
```
Reflect.has方法对应name in obj里面的in运算符。
```
**注意：**
*  如果第一个参数不是对象，则 `Reflect.has` 和 `in` 操作会报错

```js
var obj = {
    age: 27
};
// old
'age' in obj // true
// new
Reflect.has(obj, 'age') // true
<!-- 验证 -->
Reflect.has(1, 'a') // TypeError: Reflect.has called on non-object
'a' in 1 // TypeError: Cannot use 'in' operator to search for 'a' in 1
```
### Reflect.deleteProperty(target, prop)
```
Reflect.deleteProperty方法等同于delete obj[name]，用于删除对象的属性。
```
**注意：**
* `Reflect.deleteProperty` 方法返回一个布尔值；如果删除成功或者被删除的属性不存在，返回 `true`； 删除失败，被删除属性依然存在， 返回 `false`

```js
var obj = {
    name: 'yy'
}
<!-- 删除不存在属性 -->
Reflect.deleteProperty(obj, 'age') // true
delete obj.age // true

<!-- 删除存在属性 -->
Reflect.deleteProperty(obj, 'name') // true
delete obj.name // true

<!-- 删除失败 -->
var obj = {age: 27}
Object.seal(obj)

Reflect.deleteProperty(obj, 'name') // true
Reflect.deleteProperty(obj, 'age') // false
```
### Reflect.construct(target, args)
```
Reflect.construct方法等同于new target(...args)，这提供了一种不使用new，来调用构造函数的方法。
```
**注意：**
* `args` 参数需为数组

```js
function Greeting (name) {
    this.name = name
}
// old
var greeting = new Greeting('zhangsan')
// new
var greeting = Reflect.construct(Greeting, ['zhangsan'])
```
### Reflect.getPrototypeOf(target)
```
Reflect.getPrototypeOf方法用于读取对象的__proto__属性，对应Object.getPrototypeOf(obj)。
```
```js
function FancyThing () {}
var obj = new FancyThing();
// old
Object.getPrototypeOf(obj) === FancyThing.prototype // true
// new
Reflect.getPrototypeOf(obj) === FancyThing.prototype // true

<!-- 延伸：两者区别 -->
// Object.getPrototypeOf() 的参数不是对象时， 参数会被转化为对象，然后再运行
// Reflect.getPrototypeOf() 的参数不是对象时，直接报错

<!-- 验证 -->
Object.getPrototypeOf(1) // Number {...}
Reflect.getPrototypeOf(1) // Reflect.getPrototypeOf called on non-object
```
### Reflect.setPrototypeOf(target, prototype)
```
Reflect.setPrototypeOf方法用于设置目标对象的原型（prototype），对应Object.setPrototypeOf(obj, newProto)方法。它返回一个布尔值，表示是否设置成功。
```
**注意：**
* 如果无法设置目标对象的原型（比如，目标对象禁止扩展），`Reflect.setPrototypeOf` 方法返回 `false`。
* 如果第一个参数不是对象，`Object.setPrototypeOf` 会返回第一个参数本身，而 `Reflect.setPrototypeOf` 会报错。
* 如果第一个参数是 `undefined` 或 `null`，`Object.setPrototypeOf` 和 `Reflect.setPrototypeOf` 都会报错。

```js
var obj = {}
// old
Object.setPrototypeOf(obj, Array.prototype) // Array {}
// new
Reflect.setPrototypeOf(obj, Array.prototype) // true
obj.length // 0

<!-- 验证一 -->
Reflect.setPrototypeOf({}, null) //  true
Reflect.setPrototypeOf(Object.seal({}), null) //  false

<!-- 验证二 -->
Object.setPrototypeOf(1, {}) // 1
Reflect.setPrototypeOf(1, {}) // TypeError: Reflect.setPrototypeOf called on non-object

<!-- 验证三 -->
Object.setPrototypeOf(null, {}) // TypeError: Object.setPrototypeOf called on null or undefined
Object.setPrototypeOf(undefined, {}) // TypeError: Object.setPrototypeOf called on null or undefined
Reflect.setPrototypeOf(null, {}) // TypeError: Reflect.setPrototypeOf called on non-object
Reflect.setPrototypeOf(undefined, {}) // TypeError: Reflect.setPrototypeOf called on non-object
```
### Reflect.apply(target, thisArg, args)
```
Reflect.apply方法等同于Function.prototype.apply.call(func, thisArg, args)，用于绑定this对象后执行给定函数。
```
一般来说，如果要绑定一个函数的 `this` 对象，可以这样写 `fn.apply(obj, args)`，但是如果函数定义了自己的 `apply` 方法，就只能写成 `Function.prototype.apply.call(fn, obj, args)`，采用 `Reflect` 对象可以简化这种操作。

```js
var params = [1, 2, 3, 4]
// old
var youngest = Math.min.apply(null, params) // 1
var oldest = Math.max.apply(null, params) // 4
var type = Object.prototype.toString.call(youngest) // [object Number]
// new
var youngest = Reflect.apply(Math.min, null, params)
var oldest = Reflect.apply(Math.max, null, params)
var type = Reflect.apply(Object.prototype.toString, youngest, [])
```
### Reflect.defineProperty(target, prop, desc)
```
Reflect.defineProperty方法基本等同于Object.defineProperty，用来为对象定义属性。未来，后者会被逐渐废除，请从现在开始就使用Reflect.defineProperty代替它。
```
**注意：**
* 如果 `Reflect.defineProperty` 的第一个参数不是对象，就会抛出错误

```js
Reflect.defineProperty(1, 'a', 1) // TypeError: Reflect.defineProperty called on non-object

var target = {}
var proxy = new Proxy(target, {
    defineProperty (target, prop, desc) {
        console.log('defineProperty')
        return Reflect.defineProperty(target, prop, desc);
    }
});
proxy.a = 1

target // {a: 1}
```
### Reflect.getOwnPropertyDescriptor(target, prop)
```
Reflect.getOwnPropertyDescriptor基本等同于Object.getOwnPropertyDescriptor，用于得到指定属性的描述对象，将来会替代掉后者。
```

`Object.getOwnPropertyDescriptor` 与 `Reflect.getOwnPropertyDescriptor` 区别：
* 如果第一个参数不是对象，`Object.getOwnPropertyDescriptor` 不报错，返回 `undefined`，而 `Reflect.getOwnPropertyDescriptor` 会抛出错误，表示参数非法。

```js
<!-- 验证 -->
Object.getOwnPropertyDescriptor(1, 'a') // undefined
Reflect.getOwnPropertyDescriptor(1, 'a') // TypeError: Reflect.getOwnPropertyDescriptor called on non-object
```
### Reflect.isExtensible(target)
```
Reflect.isExtensible方法对应Object.isExtensible，返回一个布尔值，表示当前对象是否可扩展。
```

**注意：**
* 如果参数不是对象，`Object.isExtensible` 会返回 `false`，因为非对象本来就是不可扩展的，而 `Reflect.isExtensible` 会报错。

```js
Object.isExtensible(1) // false
Reflect.isExtensible(1) // TypeError: Reflect.isExtensible called on non-object
```
### Reflect.preventExtensions(target)
```
Reflect.preventExtensions对应Object.preventExtensions方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功。
```

**注意：**
* 如果参数不是对象，`Object.preventExtensions` 在 `ES5` 环境报错，在 `ES6` 环境返回传入的参数，而 `Reflect.preventExtensions` 会报错。

```js
// ES6
Object.preventExtensions(1) // 1
// new
Reflect.preventExtensions(1) // TypeError: Reflect.preventExtensions called on non-object
```
### Reflect.ownKeys(target)
```
Reflect.ownKeys方法用于返回对象的所有属性，基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和。
```

```js
var obj = {
    a: 1,
    b: 2,
    [Symbol.for('foo')] : 3,
    [Symbol.for('bar')] : 4
}
Object.getOwnPropertyNames(obj) // ["a", "b"]
Object.getOwnPropertySymbols(obj) // [Symbol(foo), Symbol(bar)]
Reflect.ownKeys(obj) // ["a", "b", Symbol(foo), Symbol(bar)]
```
## 使用 Proxy 实现观察者模式
```
观察者模式（Observer mode）指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行。
```
```js
var queuedObservers = new Set();

var observe = fn => queuedObservers.add(fn);

var observable = obj => new Proxy(obj, {set});

function set (target, prop, value, receiver) {
    const result = Reflect.set(target, prop, value, receiver);

    queuedObservers.forEach(observer => observer())    

    return result;
}
```

## 引用
* [阮一峰 ES6入门-Reflect](http://es6.ruanyifeng.com/#docs/reflect)
