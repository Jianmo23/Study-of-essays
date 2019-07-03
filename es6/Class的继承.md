* 时间：`2019-07-09`
* 运行环境： `macOS 10.14.4  chrome 版本 75.0.3770.100（正式版本） （64 位）
* NodeJS：`node v12.4.0  npm v6.9.0`
* 更新时间： ``

# 简介
Class 可以通过 `extends` 关键字实现继承，这比 **ES5 的通过修改原型链实现继承**，要清晰和方便很多。

```js
class Point {
}
class ColorPoint extends Point {}
Point === ColorPoint // false
```
因为没有部署代码，此时这两个类是一样的，等于是复制了一个 `Point` 类， 不过两个类是不相等的

```js
class Point {
}
class ColorPoint extends Point {
    constructor (x, y, color) {
        super(x, y); // 调用父类的constructor(x, y)
        this.color = color;
    }
    toString () {
        return this.color + ' ' + super.toString(); // 调用父类的toString()
    }
}
```
上面代码中，`constructor` 方法和 `toString` 方法之中，都出现了 `super` 关键字，它在这里表示父类的构造函数，用来新建父类的 `this` 对象。

**注意：在子类中， 如果显示定义 `constructor`， 则其中必须执行 `super()` 用来构建 `this` 对象，否则报错；未定义时，默认执行 `super()`**

子类必须在 `constructor` 方法中调用 `super` 方法，否则新建实例时会报错。
这是因为子类自己的 `this` 对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。
如果不调用 `super` 方法，子类就得不到 `this` 对象。

ES5 继承 和 ES6 继承的区别：
- ES5 的继承，实质是先创造子类的实例对象 `this`，然后再将父类的方法添加到 `this` 上面（`Parent.apply(this)`）。
- ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到 `this` 上面（所以必须先调用 `super` 方法），然后再用子类的构造函数修改 `this`。

如果子类没有定义 `constructor` 方法，这个方法会被默认添加。也就是说，不管有没有显式定义，任何一个子类都有 `constructor` 方法。
```js
class ColorPoint extends Point {
}
// 等同于
class ColorPoint extends Point {
    constructor (...args) {
        super(...args)
    }
}
```

另一个需要注意的地方是，在子类的构造函数中，只有调用 `super` 之后，才可以使用 `this` 关键字，否则会报错。
这是因为 **子类实例的构建，基于父类实例**，只有 `super` 方法才能调用父类实例。

```js
var p = new ColorPoint();
p instanceof ColorPoint // true
p instanceof Point // getPrivatePropValue

// 验证 『子类实例的构建，基于父类实例』
p.__proto__.__proto__ === Point.prototype // true
```

父类的静态方法，也会被子类继承
```js
class Point {
    static toString () {
        console.log('this is the static method toString');
    }
}
class Child extends Point {}

Child.toString() // this is the static method toString
```

# `Object.getPrototypeOf()`
Object.getPrototypeOf方法可以用来从子类上获取父类。

```js
Object.getPrototypeOf(Child) === Point // true
```
因此，**可以使用这个方法判断，一个类是否继承了另一个类**。

# `super` 关键字
`super` 这个关键字，既可以当作函数使用，也可以当作对象使用。在这两种情况下，它的用法完全不同。

**第一种情况，`super` 作为函数调用时，代表父类的构造函数**。ES6 要求，子类的构造函数必须执行一次 `super` 函数。

```js
class A {}
class B extends A {
    constructor (...args) {
        super(...args);
        // 等同于
        // A.prototype.constructor.call(this, ...args)
        // or
        // A.prototype.constructor.apply(this, args)
    }
}
```
注意，`super` 虽然代表了父类 `A` 的构造函数，但是返回的是子类 `B` 的实例，
即 `super` 内部的 `this` 指的是 `B` 的实例，因此 `super()` 在这里相当于 `A.prototype.constructor.call(this)`。

```js
class A {
    constructor () {
        console.log(new.target.name);
    }
}
class B extends A {
    constructor (...args) {
        super(...args);
    }
}
new A() // 'A'
new B() // 'B'
```
上面代码中，`new.target` 指向当前正在执行的函数。可以看到，在 `super()` 执行时，它指向的是子类 `B` 的构造函数，而不是父类 `A` 的构造函数。也就是说，`super()` 内部的 `this` 指向的是 `B`。

**作为函数使用时，`super()` 只能用在子类的构造函数之中，用在其他地方就会报错**


**第二种情况，`super` 作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类**。
```js
class A {
    p () {
        return 2;
    }
}
class B extends A {
    constructor () {
        super();
        super.p()
        // 等同于
        A.prototype.p()
    }
}
new B()
```

这里需要注意，由于 `super` 指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过 `super` 调用的。
```js
class A {
    constructor () {
        this.a = 1
    }
}
class B extends A {
    get b () {
        return super.a
    }
}
new B().b // undefined
```

如果属性定义在父类的原型对象上，`super` 就可以取到。
```js
class A {}
A.prototype.a = 2;

class B extends A {
    constructor () {
        super();
        console.log(super.a)
    }
}
new B() // 2
```

ES6 规定，**在子类普通方法中通过 `super` 调用父类的方法时，方法内部的 `this` 指向当前的子类实例**。
```js
class A {
    x = 1;
    print () {
        console.log(this.x)
    }
}
class B extends A {
    constructor () {
        super();
        this.x = 2;
    }
    m () {
        super.print()
        // 等同于
        super.print.call(this)
    }
}
new B().m() // 2
```
上面代码中，`super.print()` 虽然调用的是 `A.prototype.print()`，但是 `A.prototype.print()` 内部的 `this` 指向子类 `B` 的实例，导致输出的是 `2`，而不是 `1`。
也就是说，实际上执行的是 `super.print.call(this)`。

由于 `this` 指向子类实例，所以如果通过 `super` 对某个属性赋值，这时 `super` 就是 `this`，赋值的属性会变成子类实例的属性。
```js
class A {}
class B extends A {
    constructor () {
        super();
        this.x = 1;
        super.x = 2; // 等同于  this.x = 2;
        console.log(super.x) // 等同于 A.protottype.x 返回 undefined
        console.log(this.x) // 2
    }
}
new B() // {x: 2}
```

如果 `super` 作为对象，用在静态方法之中，这时 `super` 将指向父类，而不是父类的原型对象。
```js
class A {
    static myMethod () {
        console.log('static')
    }
    myMethod () {
        console.log('instance')
    }
}
class B extends A {
    static myMethod () {
        super.myMethod() // 此时 super 指向父类
    }
    myMethod () {
        super.myMethod() // 此时 super 指向父类的原型对象
    }
}
B.myMethod() // 'static'
new B().myMethod() // 'instance'
```

另外，在子类的静态方法中通过 `super` 调用父类的方法时，方法内部的 `this` 指向当前的子类，而不是子类的实例。
```js
class A {
    x = 1;
    static print () {
        console.log(this.x);
    }
}
class B extends A {
    x = 2;
    static x = 100;
    static m () {
        super.print(); //  此时父类静态方法中的 this 指向子类，而不是之类的实例
    }
}
B.m() // 100
```

注意，使用 `super` 的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错。
```js
class A {}
class B extends A {
    constructor () {
        super();
        console.log(super) // 报错
    }
}
```

最后，由于对象总是继承其他对象的，所以 **可以在任意一个对象中，使用 `super` 关键字**。
```js
var obj = {
    toString () {
        console.log(super.__proto__ === Object.prototype) // true
        return super.toString();
    }
}
obj.toString()
```

# 类的 `prototype` 属性和 `__proto__` 属性
大多数浏览器的 ES5 实现之中，每一个对象都有 `__proto__` 属性，指向对应的构造函数的 `prototype` 属性。
Class 作为构造函数的语法糖，同时有 `prototype` 属性和 `__proto__` 属性，因此同时存在两条继承链。

- 子类的 `__proto__` 属性，表示构造函数的继承，总是指向父类。

- 子类 `prototype` 属性的 `__proto__` 属性，表示方法的继承，总是指向父类的 `prototype` 属性

```js
class A {}
class B extends A {}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```

这样的结果是因为，类的继承是按照下面的模式实现的。
```js
class A {}
class B {}

// B 的实例继承 A 的原型 （备注：文档说 B 的实例继承 A 的实例，个人感觉不合适）
Object.setPrototypeOf(B.prototype, A.prototype)
// B 继承 A 的静态方法
Object.setPrototypeOf(B, A);

B.prototype.__proto__ === A.prototype // true
B.__proto__ === A // true
```

`Object.setPrototypeOf` 的实现：
```js
Object.setPrototypeOf = function (obj, proto) {
    obj.__proto__ = proto;

    return obj;
}
```

这两条继承链，可以这样理解：
- 作为一个对象，子类（`B`）的原型（`__proto__` 属性）是父类（`A`）；

- 作为一个构造函数，子类（`B`）的原型对象（`prototype` 属性）是父类的原型对象（`prototype` 属性）的实例。

```js
B.prototype = Object.create(A.prototype);
// 等同于
B.prototype.__proto__ = A.prototype;
```

`extends` 关键字后面可以跟多种类型的值。
```js
class A extends B {}
```

上面代码的 `A`，只要是一个有 `prototype` 属性的函数，就能被 `B`继承。
由于函数都有 `prototype` 属性（除了 `Function.prototype` 函数），因此 `A` 可以是任意函数。

**第一种，子类继承 Object 类**
```js
class A extends Object {}

A.__proto__ === Object // true
A.prototype.__proto__ === Object.prototype // true
```
这种情况下，`A` 其实就是构造函数 `Object` 的复制，`A` 的实例就是 `Object` 的实例。


**第二种情况，不存在任何继承。**
```js
class A {}

A.__proto__ === Function.prototype // true
A.prototype.__proto__ === Object.prototype // true
```

# 原生构造函数的继承
原生构造函数是指语言内置的构造函数，通常用来生成数据结构。ECMAScript 的原生构造函数大致有下面这些:
- Boolean()
- Number()
- String()
- Array()
- Date()
- Function()
- RegExp()
- Error()
- Object()

以前，这些原生构造函数是无法继承的，比如，不能自己定义一个 `Array` 的子类
```js
function MyArray () {
    Array.apply(this, arguments);
}
MyArray.prototype = Object.create(Array.prototype, {
    constructor: {
        value: MyArray,
        writable: true,
        configurable: true,
        enumerable: true
    }
})
```

但是，这个类的行为与 `Array` 完全不一致。

```js
var colors = new MyArray(); // {}
colors[0] = 'red'; // 此时 colors = {0: 'red'}
colors.length; // 0

colors.length = 0; // 此时 colors = {0: 'red'}，length 未被添加
colors[0]; // 'red'
```

之所以会发生这种情况，是因为 **子类无法获得原生构造函数的内部属性，通过 `Array.apply()` 或者分配给原型对象都不行。原生构造函数会忽略 `apply` 方法传入的 `this`，也就是说，原生构造函数的 `this` 无法绑定，导致拿不到内部属性。**

**ES5 是先新建子类的实例对象 `this`，再将父类的属性添加到子类上，由于父类的内部属性无法获取，导致无法继承原生的构造函数。**

比如，`Array` 构造函数有一个内部属性 `[[DefineOwnProperty]]`，用来定义新属性时，更新 `length` 属性，这个内部属性无法在子类获取，导致子类的 `length` 属性行为不正常。

```js
// 想让一个普通对象继承 Error 对象
var e = {};
Object.getOwnPropertyNames(Error.call(e)) // ["stack"]

Object.getOwnPropertyNames(e) // []
```
上面代码中，我们想通过 `Error.call(e)` 这种写法，让普通对象 `e` 具有 `Error` 对象的实例属性。
但是，`Error.call()` 完全忽略传入的第一个参数，而是返回一个新对象，`e` 本身没有任何变化。这证明了 **`Error.call(e)` 这种写法，无法继承原生构造函数**。


ES6 允许继承原生构造函数定义子类，因为 **ES6 是先新建父类的实例对象 `this`，然后再用子类的构造函数修饰 `this`，使得父类的所有行为都可以继承。**

```js
class MyArray extends Array {
    constructor (...args) {
        super(...args);
    }
}
var arr = new MyArray();
arr[0] = 12;
arr.length // 1

arr.length = 0;
arr[0] // undefined
```
上面代码定义了一个 `MyArray` 类，继承了 `Array` 构造函数，因此就可以从 `MyArray` 生成数组的实例。这意味着，**ES6 可以自定义原生数据结构（比如 `Array`、`String` 等）的子类，这是 ES5 无法做到的**。

**`extends` 关键字不仅可以用来继承类，还可以用来继承原生的构造函数**。因此可以在原生数据结构的基础上，定义自己的数据结构。
```js
// 定义了一个带版本功能的数组
class VersionedArray extends Array {
    constructor () {
        super();
        this.history = [[]];
    }
    commit () {
        this.history.push(this.slice());
    }
    revert () {
        this.splice(0, this.length, ...this.history[this.history.length - 1])
    }
}
var x = new VersionedArray();
x.push(...[1, 2]);
x.history // [[]]

x.commit()
x.history // [[], [1, 2]]

x.revert()
x //
```
上面代码中，`VersionedArray` 会通过 `commit` 方法，将自己的当前状态生成一个版本快照，存入 `history` 属性。
`revert` 方法用来将数组重置为最新一次保存的版本。除此之外，`VersionedArray` 依然是一个普通数组，所有原生的数组方法都可以在它上面调用。

```js
// 自定义 Error 子类的例子，用来定制报错时的行为。
class ExtendableError extends Error {
    constructor (message) {
        super();
        this.message = message;
        this.stack = (new Error()).stack;
        this.name = this.constructor.name;
    }
}

class MyError extends ExtendableError {
    constructor (m) {
        super(m);

    }
}

var myError =  new MyError(11);
myError.message // 11
myError.stack //
myError.name // MyError
myError instanceof Error // true
```

**注意，继承 `Object` 的子类，有一个行为差异**。
```js
class NewObj extends Object {
    constructor () {
        super(...arguments);
    }
}
var o = new NewObj({attr: true}); // {}
o.attr === true //  false
```
上面代码中，`NewObj` 继承了 `Object`，但是无法通过 `super` 方法向父类 `Object` 传参。
这是因为 **ES6 改变了 `Object` 构造函数的行为，一旦发现 `Object` 方法不是通过 `new Object()` 这种形式调用，ES6 规定 `Object` 构造函数会忽略参数**。

# Mixin 模式的实现
Mixin 指的是多个对象合成一个新的对象，新对象具有各个组成成员的接口

```js
var a = {
    aa: 1
};
var b = {
    bb: 2
}
var c = {...a, ...b} // {aa: 1, bb: 2}
```

```js
// 将多个类的接口“混入”（mix in）另一个类
function mix (...mixins) {
    class Mix {
        constructor () {
            for (let mixin of mixins) {
                copyProperties(this, new mixin()) // 拷贝实例属性
            }
        }
    }

    for (let mixin of mixins) {
        copyProperties(Mix, mixin); // 拷贝静态属性
        copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性
    }

    return Mix;
}

function copyProperties (target, source) {
    for (let key of Reflect.ownKeys(source)) {
        if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
            let desc = Object.getOwnPropertyDescriptor(key);
            Object.DefineOwnProperty(target, key, desc);
        }
    }
}
```






































# 引用
* [阮一峰 ES6入门-Class的继承](http://es6.ruanyifeng.com/#docs/class-extends)
