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


# 为什么装饰器不能用于函数

# core-decorators.js

# 使用装饰器实现自动发布事件

# Mixin

# Trait