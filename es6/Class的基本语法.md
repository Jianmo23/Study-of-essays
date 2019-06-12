* 时间：`2019-07-02`
* 运行环境： `macOS 10.14.4  chrome 版本 75.0.3770.100（正式版本） （64 位）
* NodeJS：`node v12.4.0  npm v6.9.0`
* 更新时间： ``

# 简介
```js
//ES5
function Point (x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype.toString = function () {
    return '(' + this.x + ',' + this.y + ')'
}
Point === Point.prototype.constructor // true

//ES6
class Point {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    } // 没有逗号分割！ 没有逗号分割！ 没有逗号分割！
    // 前面不需要加上 function 这个关键字
    toString () {
        return `(${this.x},${this.y})`
    }
}
Point === Point.prototype.constructor // true
typeof Point // function
```

事实上，类的所有方法都定义在类的 `prototype` 属性上面。
```js
class Point {
    constructor () {}
    toString () {}
}
// 等同于
Point.prototype = {
    constructor () {},
    toString () {}
}
```

`Object.assign` 方法可以很方便地一次向类添加多个方法。
```js
class Point {
    constructor () {}
}
Object.assign(Point.prototype, {
    toString () {},
    toValue () {}
})
```

**ES6中，类的内部所有定义的方法，都是不可枚举的（non-enumerable）**
```js
// ES6
class Point {
    constructor () {}
    toString () {}
}

Object.keys(Point.prototype) // []
Object.getOwnPropertyNames(Point.prototype) // ["constructor", "toString"]

// ES5
function Point () {}
Point.prototype.toString = function () {}
Object.keys(Point.prototype) // ["toString"] 可以发现这和 ES6 有区别！
Object.getOwnPropertyNames(Point.prototype) // ["constructor", "toString"]
```

## `constructor` 方法
`constructor` 方法是类的默认方法，通过 `new` 命令生成对象实例时，自动调用该方法。
一个类必须有 `constructor` 方法，如果没有显式定义，一个空的 `constructor` 方法会被默认添加。
```js
class Point {}
// 等同于
class Point {
    constructor () {}
}
```

`constructor` 方法默认返回实例对象（即 `this`），完全可以指定返回另外一个对象
```js
class Foo {
    constructor () {
        return Object.create(null)
    }
}
new Foo() instanceof Foo // false
```
**类必须使用 `new` 调用，否则会报错**

## 类的实例
生成类的实例的写法，与 ES5 完全一样，也是使用 `new` 命令

与 ES5 一样，实例的属性除非显式定义在其本身（即定义在 `this` 对象上），否则都是定义在原型上（即定义在 `class` 上）
```js
class Point {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }
    toString () {
        return `(${this.x},${this.y})`
    }
}
var p = new Point(1, 2);
p.hasOwnProperty('x') // true
p.hasOwnProperty('y') // true
p.hasOwnProperty('toString') // false
p.__proto__.hasOwnProperty('toString') // true
```

与 ES5 一样，类的所有实例共享一个原型对象。
```js
var p1 = new Point(1, 2);
var p2 = new Point(2, 3);

p1.__proto__ === p2.__proto__ // true
```
这也意味着，可以通过实例的 `__proto__` 属性为“类”添加方法。

> __proto__ 并不是语言本身的特性，这是各大厂商具体实现时添加的私有属性，虽然目前很多现代浏览器的 JS 引擎中都提供了这个私有属性，
但依旧不建议在生产中使用该属性，避免对环境产生依赖。生产环境中，我们可以使用 Object.getPrototypeOf 方法来获取实例对象的原型，然后再来为原型添加方法/属性。
```js
var p1 = new Point(1, 2);
var p2 = new Point(2, 3);
var proto = Object.getPrototypeOf(p1);
proto.say = function () { return 'hello'; }
p2.say() // 'hello'
```

## 取值函数（getter）和存值函数（setter）
与 ES5 一样，在“类”的内部可以使用 `get` 和 `set` 关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为

```js
class MyClass {
    get prop () {
        return 'getter'
    }
    set prop (value) {
        console.log('setter: ', value);
    }
}
var ins = new MyClass();
ins.prop // 'getter'
ins.prop = 222 // 'setter: 222'
```

存值函数和取值函数是设置在属性的 `Descriptor` 对象上的
```js
var descriptor = Object.getOwnPropertyDescriptor(MyClass.prototype, 'prop')
{
    configurable: true,
    enumerable: false, /* 上面提到过：class中声明的属性和方法不可枚举 */
    get: f prop(),
    set: f prop()
}
// 疑问：descriptor.writable = undefined ????
```

## Class 表达式
与函数一样，类也可以使用表达式的形式定义。

```js
const MyClass = class Me {
    getClassName () {
        return Me.name;
    }
}
var myClass = new MyClass();
myClass.getClassName() // 'Me'
MyClass.name // 'Me'
Me.name // 'ReferenceError: Me is not defined'
```
**需要注意的是，这个类的名字是 `Me`，但是 `Me` 只在 Class 的内部可用，指代当前类。在 Class 外部，这个类只能用 `MyClass` 引用。**

如果类的内部没用到的话，可以省略 `Me`。
```js
const MyClass = class {}
```

采用 Class 表达式，可以写出立即执行的 Class。
```js
const person = new class {
    constructor (name) {
        this.name = name;
    }
    sayName () {
        return this.name;
    }
}('zyy');
person.sayName() // 'zyy'
```

## 注意点
### 严格模式
类和模块的内部，默认就是严格模式，所以不需要使用 `use strict` 指定运行模式。只要你的代码写在类或模块之中，就只有严格模式可用。考虑到未来所有的代码，其实都是运行在模块之中，所以 ES6 实际上把整个语言升级到了严格模式。

### 不存在提升
类不存在变量提升（hoist），这一点与 ES5 完全不同。养成习惯，先声明在调用。

如果 class 的声明存在提升，下面的情况就会报错
```js
let Foo = class {}
class Bar extends Foo {}
// 目前是不报错的，如果存在提升，Foo 就找不到，因为 let 关键字不存在变量提升！！！
```

### name 属性
由于本质上，ES6 的类只是 ES5 的构造函数的一层包装，所以函数的许多特性都被 Class 继承，包括 `name`属性。

**`name` 属性总是返回紧跟在 `class` 关键字后面的类名**

## Generator 方法
如果某个方法之前加上星号（`*`），就表示该方法是一个 Generator 函数。
```js
class Foo {
    constructor (...args) {
        this.args = args;
    }
    *[Symbol.iterator] () {
        for (let arg of this.args) {
            yield arg;
        }
    }
}

for (let v of new Foo('hello', 'world')) {
    console.log(v)
}
// 'hello'
// 'world'
```

### `this` 的指向
类的方法内部如果含有 `this`，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。

```js
class Logger {
    printName (name = 'there') {
        this.print(`Hello ${name}`)
    }
    print (text) {
        console.log(text)
    }
}
var logger = new Logger();
var {printName} = logger;
printName() // TypeError: Cannot read property 'print' of undefined
```
上面代码中，`printName` 方法中的 `this`，默认指向 `Logger` 类的实例。但是，如果将这个方法提取出来单独使用，`this` 会指向该方法运行时所在的环境（由于 `class` 内部是严格模式，所以 `this` 实际指向的是 `undefined` ），从而导致找不到 `print` 方法而报错。

解决方式如下：
```js
// 绑定 this
class Logger {
    constructor () {
        this.printName = this.printName.bind(this);
    }
    printName (name = 'there') {
        this.print(`Hello ${name}`)
    }
    print (text) {
        console.log(text)
    }
}
var logger = new Logger();
var {printName} = logger;
printName() // 'Hello there'

// 使用箭头函数
class Obj {
    constructor () {
        this.getThis = () => this;
    }
}
var obj = new Obj();
obj.getThis() === obj // true
// 备注：本例如何使用剪头函数实现？

// 使用 Proxy: 获取方法的时候，自动绑定 this。
function selfish (target) {
    const cache = new WeakMap();
    const handler = {
        get (target, key) {
            var value = Reflect.get(target, key);
            if (typeof value !== 'function') {
                return value;
            }
            if(!cache.has(value)) {
                cache.set(value, value.bind(target))
            }

            return cache.get(value);
        }
    }

    const proxy = new Proxy(target, handler);

    return proxy;
}

var {printName} = selfish(new Logger());
printName() // 'Hello there'
```

# 静态方法
> 类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上 static 关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。

```js
class Foo {
    static className () {
        return Foo.name;
    }
}
var foo = new Foo();
foo.className() // TypeError: foo.className is not a function
Foo.className() // 'Foo'
```

**注意，如果静态方法包含 `this` 关键字，这个 `this` 指的是类，而不是实例。**
```js
class Foo {
    static bar () {
        this.baz();
    }
    static baz () {
        console.log('我是静态方法')
    }
    baz () {
        console.log('我是原型方法')
    }
}
Foo.bar() // '我是静态方法'
```
可以看出类的静态方法名和原型方法名可以相同

**父类的静态方法，可以被子类继承**
```js
class Foo {
    static className () {
        return 'hello'
    }
}

class Bar extends Foo {
    static classMethod () {
        // super 对象在子类中指代父类
        return super.className() + ', yy'
    }
}
Bar.className() // 'hello'
Bar.classMethod() // 'hello, yy'
```

# 实例属性的新写法
实例属性除了定义在 `constructor()` 方法里面的 `this` 上面，也可以定义在类的最顶层。

```js
class IncreasingCounter {
    _count = 0; // 带分号， 前面不需要加 this
    // 等同于
    // constructor () {
    //     this._count = 0;
    // }
    get value () {
        return this._count;
    }
    increment () {
        this._count++;
    }
}
var counter = new IncreasingCounter();
counter.value // 0
```
这种新写法的好处是，所有实例对象自身的属性都定义在类的头部，看上去比较整齐，一眼就能看出这个类有哪些实例属性。

```js
class Foo {
    bar = 'hello';
    baz = "world";
}
var foo = new Foo();
foo // {bar: "hello", baz: "world"}
```

# 静态属性
静态属性指的是 Class 本身的属性，即 `Class.propName`，而不是定义在实例对象（`this`）上的属性。

```js
class Foo {}
Foo.prop = 1;
```
目前，只有这种写法可行，因为 ES6 明确规定，Class 内部只有静态方法，没有静态属性。
现在有一个提案提供了类的静态属性，写法是在实例属性法的前面，加上 `static` 关键字。

```js
class Foo {
    static prop = 1;
    constructor () {
        console.log(Foo.prop)
    }
}
var foo = new Foo() // 1
Foo.prop // 1
foo.prop // undefined
```

# 私有方法和私有属性
私有方法和私有属性，是只能在类的内部访问的方法和属性，外部不能访问。这是常见需求，有利于代码的封装，但 **ES6 不提供私有方法和私有属性，只能通过变通方法模拟实现**。

一种做法是在命名上加以区别。
```js
class Widget {
    // public
    foo () {
        this._bar();
    }
    // private
    _bar () {}
}
```
上述代码中，`_bar` 方法前面的下划线，表示这是一个只限于内部使用的私有方法。但是，这种命名是不保险的，在类的外部，还是可以调用到这个方法。

另一种方法就是将私有方法移出模块，因为模块内部的所有方法都是对外可见的。
```js
class Widget {
    // public
    foo (...args) {
        bar.apply(this, args);
    }
}

function bar () {}
```

还有一种方法是利用 `Symbol` 值的唯一性，将私有方法的名字命名为一个 `Symbol` 值。
```js
const bar = Symbol('bar');
const snaf = Symbol('snaf');

export default class MyClass {
    // public
    foo () {
        this[bar](baz)
    }
    [bar](baz) {
        return this[snaf] = baz;
    }
}
```
上面代码中，`bar` 和 `snaf` 都是 `Symbol` 值，一般情况下无法获取到它们，因此达到了私有方法和私有属性的效果。但是也不是绝对不行，`Reflect.ownKeys()` 依然可以拿到它们。
```js
Reflect.ownKeys(MyClass.prototype) // ["constructor", "foo", Symbol(bar)]
```

# 私有属性的提案
目前，有一个提案，为 `class` 加了私有属性。方法是在属性名之前，使用 `#` 表示

```js
class IncreasingCounter {
    #count = 0;
    get value () {
        return this.#count;
    }
    increment () {
        this.#count++;
    }
}
var counter = new IncreasingCounter();
counter.value // 0
counter.#count // SyntaxError: Undefined private field undefined: must be declared in an enclosing class
```

```js
class Point {
    #x;
    constructor (x = 0) {
        this.#x = x;
    }
    get x () {
        return this.#x;
    }
    set x (value) {
        this.#x = value;
    }
}
var p = new Point();
p.x // 0
p.x = 100;
p.x // 100
```
上面代码中，`#x` 就是私有属性，在 `Point` 类之外是读取不到这个属性的。由于井号 `#` 是属性名的一部分，使用时必须带有 `#` 一起使用，所以 `#x` 和 `x` 是两个不同的属性。

这种写法不仅可以写私有属性，还可以用来写私有方法。
```js
class Foo {
    #a;
    #b;
    constructor (a, b) {
        this.#a = a;
        this.#b = b;
    }
    #sum () { // 本次测试chrome暂不支持该语法
        return this.#a + this.#b;
    }
    printSum () {
        console.log(this.#sum())
    }
}
var foo = new Foo();
foo.printSum()
```

另外，私有属性也可以设置 `getter` 和 `setter` 方法。
```js
class Counter {
    #xValue = 0;
    constructor () {
    }
    get #x () {
        return this.#xValue
    }
    set #x (value) {
        this.#xValue = value
    }
}
```

**私有属性不限于从 `this` 引用，只要是在类的内部，实例也可以引用私有属性。**
```js
class Foo {
    #privateProp = 42;
    static getPrivatePropValue (foo) {
        return foo.#privateProp;
    }
}
Foo.getPrivatePropValue(new Foo) // 42
```

私有属性和私有方法前面，也可以加上 `static` 关键字，表示这是一个静态的私有属性或私有方法。只能在内部调用，外部调用就会报错。
个人理解：不知道这个特性有啥用，等待以后解答？

# `new.target` 特性
`new` 是从构造函数生成实例对象的命令。ES6 为 `new` 命令引入了一个 `new.target` 属性，**该属性一般用在构造函数之中，返回 `new` 命令作用于的那个构造函数，即构造函数本身**。
如果构造函数不是通过 `new` 命令或 `Reflect.construct()` 调用的，`new.target` 会返回 `undefined`，因此这个属性可以用来确定构造函数是怎么调用的。

```js
function Person (name) {
    if (new.target !== undefined) {
        this.name = name;
    } else {
        throw new Error('必须使用 new 命令生成实例')
    }
}
var p1 = new Person('yy'); // {name: "yy"}
var p2 = Reflect.construct(Person, ['zy']); // {name: "zy"}
var p3 = Person.call(null, 'yy'); // Error: 必须使用 new 命令生成实例
```

Class 内部调用 `new.target`，返回当前 Class。

**需要注意的是，子类继承父类时，`new.target` 会返回子类**
```js
class Rectangle {
    constructor (length, width) {
        console.log(new.target === Rectangle, new.target === Square);
        this.length = length;
        this.width = width;
    }
}
class Square extends Rectangle {
    constructor (length, width) {
        super(length, width)
    }
}
new Rectangle(3, 4) // true, false
new Square(3, 3) // false, true
```

利用这个特点，可以写出不能独立使用、必须继承后才能使用的类。
```js
class Rectangle {
    constructor (length, width) {
        if (new.target === Square) {
            this.length = length;
            this.width = width;
        } else {
            throw new Error('本类不能实例化');
        }
    }
}
class Square extends Rectangle {
    constructor (length, width) {
        super(length, width)
    }
}
new Rectangle(3, 4) // Error: 本类不能实例化
new Square(3, 3) // {length: 3, width: 3}
```

**注意，在函数外部，使用 `new.target` 会报错**。

# 引用
* [阮一峰 ES6入门-Class的基本语法](http://es6.ruanyifeng.com/#docs/class)
* [segmentfault ES6 Class 继承与 super](https://segmentfault.com/a/1190000015565616)
