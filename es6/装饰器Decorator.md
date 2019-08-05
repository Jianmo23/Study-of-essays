* 时间：`2019-08-05`
* 运行环境： `macOS 10.14.4  chrome 版本 75.0.3770.142（正式版本）（64 位）`
* NodeJS：`node v11.10.0  npm v6.10.2`
* 更新时间： ``

# 类的装饰
装饰器可以用来装饰整个类。
```js
@testable class MyTestableClass {}

function testable (target) {
    target.isTestable = true;
}

MyTestableClass.isTestable // true
```

上面代码中，`@testable` 就是一个装饰器。它修改了 `MyTestableClass` 这个类的行为，为它加上了静态属性 `isTestable`。
`testable` 函数的参数 `target` 是 `MyTestableClass` 类本身。

基本上装饰器的行为如下：
```js
@decorator class A {}

// 等同于
class A {}
A = decorator(A) || A;
```

也就是说，**装饰器是一个对类进行处理的函数。装饰器函数的第一个参数，就是所要装饰的目标类**。

如果觉得一个参数不够用，可以在装饰器外面再封装一层函数。
```js
function testable (isTestable) {
    return function (target) {
        target.isTestable = isTestable;
    }
}

@testable(true) class MyTestableClass {}
MyTestableClass.isTestable // true

@testable(false) class MyTestableClass {}
MyTestableClass.isTestable // false
```
上面代码中，装饰器 `testable` 可以接受参数，**这就等于可以修改装饰器的行为**。

**注意，装饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。
这意味着，装饰器能在编译阶段运行代码。也就是说，装饰器本质就是编译时执行的函数。**

如果想添加实例属性，可以通过目标类的 `prototype` 对象操作。
```js
function testable (target) {
    target.prototype.isTestable = true;
}
@testable class MyTestableClass {}

var obj = new MyTestableClass();
obj.isTestable // true
```

```js
//mixins.js
export function mixins (...list) {
    return function (target) {
        Object.assign(target.prototype, ...list);
    }
}

// main.js
import {mixins} from 'mixins.js';

var Foo = {
    foo () {
        console.log('foo')
    }
}
@mixins(Foo) class MyClass {}

var myclass = new MyClass();
myclass.foo() // 'foo'
```

# 方法的装饰
装饰器不仅可以装饰类，还可以装饰类的属性。
```js
// 装饰器 readonly 用来装饰“类”的 name 方法
class Person {
    @readonly name () {
        return `${this.first} ${this.last}`
    }
}
```

装饰器函数 `readonly` 一共可以接受三个参数
```js
/*
 * target: 类的原型对象
 * name: 要装饰的属性名
 *descriptor: 该属性的描述对象
 */
function readonly (target, name, descriptor) {
    // descriptor 对象原来的值为：
    // {
    //    value: specifiedFunction,
    //     enumerable: false,
    //     configurable: true,
    //     writable: true
    // }
    descriptor.writable = false;
    return descriptor;
}
readonly(Person.prototype, 'name', descriptor);
// 类似于
Object.defineProperty(Person.prototype, 'name', descriptor)
```

上面代码说明，装饰器（`readonly`）会修改属性的描述对象（`descriptor`），然后被修改的描述对象再用来定义属性。

```js
// 修改属性描述对象的 enumerable 属性，使得该属性不可遍历
class Person {
    @nonenumerable get kidCount () {
        return this.children.length;
    }
}
function nonenumerable (target, name, descriptor) {
    descriptor.enumerable = false;
    return descriptor;
}
```

```js
class Math  {
    @log add (a, b) {
        return a + b;
    }
}
function log (target, name, descriptor) {
    var oldValue = descriptor.value;
    
    // 执行时机？？？
    descriptor.value = function () {
        console.log(`Calling ${name} with ${arguments}`)
        return oldValue.apply(this, arguments);
    }
    
    return descriptor;
}

const math = new Math();
math.add(2, 4);
```
上面代码中，`@log` 装饰器的作用就是在执行原始的操作之前，执行一次 `console.log`，从而达到输出日志的目的。

装饰器有注释的作用。
```js
@testable 
class Person {
    @readonly
    @nonenumerable
    name () {
        return `${this.first}  ${this.last}`;
    }
}
```

如果 **同一个方法** 有多个装饰器，会像剥洋葱一样，**先从外到内进入，然后由内向外执行**。
```js
function dec (id) {
    console.log(`evaluated ${id}`);
    return (target, property, descriptor) => console.log(`executed ${id}`)
}
class Example {
    @dec(1)
    @dec(2)
    method () {}
}
// evaluated 1
// evaluated 2
// executed 2
// executed 1
```

上面代码中，外层装饰器 `@dec(1)`先进入，但是内层装饰器 `@dec(2)` 先执行。

**除了注释，装饰器还能用来类型检查**。所以，对于类来说，这项功能相当有用。从长期来看，它将是 JavaScript 代码静态分析的重要工具。

# 为什么装饰器不能用于函数
**装饰器只能用于类和类的方法，不能用于函数，因为存在函数提升**。

```js
var counter = 0;
var add = function () {
    counter++;
}
@add function foo () {}

// 上面的代码，意图是执行后counter等于 1，但是实际上结果是counter等于 0。
// 因为函数提升，使得实际执行的代码是下面这样。????
@add
function foo() {
}

var counter;
var add;

counter = 0;

add = function () {
  counter++;
};
```

总之，由于存在函数提升，使得装饰器不能用于函数。类是不会提升的，所以就没有这方面的问题。

另一方面，如果一定要装饰函数，可以采用 **高阶函数** 的形式直接执行。

> 高阶函数是一种函数，它接受函数作为参数或者将函数作为返回值返回。

```js
function doSomething (name) {
    console.log(`Hello, ${name}`)
}

function loggingDescriptor (wrapped) {
    return function () {
        console.log('Starting');
        const result = wrapped.apply(this, arguments);
        console.log('Finished')
        return result;
    }
}
const wrapped = loggingDescriptor(doSomething);
```

# core-decorators.js
[core-decorators.js](https://github.com/jayphelps/core-decorators) 是一个第三方模块，提供了几个常见的装饰器，通过它可以更好地理解装饰器。

# 使用装饰器实现自动发布事件
可以使用装饰器，使得对象的方法被调用时，自动发出一个事件。

```js
const postal = require('postal/lib/postal.lodash');

export default function publish (topic, channel) {
    const chnnelName = channel || '';
    const msgChannel = postal.channel(channelName);
    
    msgChannel.subscript(topic, v => {
        console.log('频道: ', channelName);
        console.log('事件: ', topic);
        console.log('数据: ', v);
    });
    
    return function (target, name, descriptor) {
        let fn = descriptor.value;
        
        descriptor.value = function () {
            let value = fn.apply(this, arguments);
            msgChannel.publish(topic, value);
        }
    }
}


class FooComponent {
    @publish('foo.some.message', 'component')
    someMethod() {
        return { my: 'data' };
    }
    @publish('foo.some.other')
    anotherMethod() {}
}

let foo = new FooComponent();

foo.someMethod();
foo.anotherMethod();
```
上面代码定义了一个名为 `publish` 的装饰器，它通过改写 `descriptor.value`，使得原方法被调用时，会自动发出一个事件。它使用的事件“发布/订阅”库是 [Postal.js](https://github.com/postaljs/postal.js)

# Mixin
在装饰器的基础上，可以实现 `Mixin` 模式。所谓 `Mixin` 模式，就是对象继承的一种替代方案，中文译为“混入”（mix in），意为在一个对象之中混入另外一个对象的方法。

```js
const Foo = {
    foo () {
        console.log('foo');
    }
}
class MyClass {}

Object.assign(MyClass.prototype, Foo);
// 等同于
function Mixins (...list) {
    return function (target) {
        Object.assign(target.prototype, ...list);
    }
}
@Mixins(foo)
class MyClass {}

var myclass = new MyClass();
myclass.foo()
```
本模块文中还有其他内容，使用class的继承实现Mixins...

# Trait
Trait 也是一种装饰器，效果与 Mixin 类似，但是提供更多功能，比如防止同名方法的冲突、排除混入某些方法、为混入的方法起别名等等。

[traits-decorator](https://github.com/CocktailJS/traits-decorator)这个第三方模块作为例子。这个模块提供的traits装饰器，不仅可以接受对象，还可以接受 ES6 类作为参数。

# 引用
* [阮一峰 ES6入门-Decorator](http://es6.ruanyifeng.com/#docs/decorator)
* [ES7 Decorator 入门解析](https://segmentfault.com/a/1190000010019412)