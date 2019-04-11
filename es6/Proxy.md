* 时间：`2019-04-10`
* 运行环境： `macOS 10.14.4  chrome 版本 73.0.3683.86（正式版本)`
* 更新时间： `2019-04-18`

# Proxy
```
Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。
```
## 语法
```js
var proxy = new Proxy(target, handler);
* target: 拦截的目标对象， Object || function
* handler: 定制拦截行为，

** 如果handler没有设置任何拦截，那就等同于直接通向原对象。**
```
## 拦截器方法
```js
var proxy = new Proxy({}, {
    <!-- 拦截对象属性的读取 -->
    get (target, prop[, receiver]) {},
    <!-- 拦截对象属性的设置 -->
    set (target, prop, value[, receiver]) {
        /* 内部返回一个布尔值，否则严格模式下会报错
         */
    },
    <!-- 拦截 propKey in proxy的操作 -->
    has (target, prop) {
        /* 内部返回布尔值
         */
    },
    <!-- 拦截 delete proxy[propKey]的操作 -->
    deleteProperty (target, prop) {
        /* 内部返回布尔值
         */
    },
    <!-- 拦截 Object.getOwnPropertyNames(proxy), Object.getOwnPropertySymbols(proxy), Object.keys(proxy), for...in循环 -->
    ownKeys (target) {
        /* 内部返回一个数组
         * 该方法返回目标对象所有自身的属性的属性名
         * ** Object.keys() 仅返回目标对象自身的可遍历属性 **
         */
    },
    <!-- 拦截 Object.getOwnPropertyDescriptor(proxy, propKey), Object.getOwnPropertyDescriptors()  -->
    getOwnPropertyDescriptor (target, prop) {
        /* 返回属性的描述对象
         */
    },
    <!-- 拦截 Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs) -->
    defineProperty (target, prop, desc) {
        /*
         */
    },
    <!-- 拦截 Object.preventExtensions(proxy) -->
    preventExtensions (target) {
        /* 内部返回布尔值
         */
    },
    <!-- 拦截 Object.getPrototypeOf(proxy) -->
    getPrototypeOf (target) {
        /* 内部返回一个对象
         */
    },
    <!-- 拦截 Object.isExtensible(proxy) -->
    isExtensible (target) {
        /* 返回布尔值
         */
    },
    <!-- 拦截 Object.setPrototypeOf(proxy, proto) -->
    setPrototypeOf (target, proto) {
        /* 返回布尔值
         */
    },
    <!-- target: Function 拦截函数的调用、call和apply操作 -->
    apply (target, bindingObject, args) {
        /* 例如：
         * proxy(...args)
         * proxy.call(obj, ...args)
         * proxy.apply(obj, args)
         */
    },
    <!-- target: Function 拦截 Proxy 实例作为构造函数调用的操作 -->
    construct (target, args[, newTarget]) {
        /* 例如：
         * new proxy(...args)
         */
    }
});
```
## 拦截器方法注意事项
### get(target, prop[, receiver])
target: 目标对象；
prop: 属性名；
receiver: proxy示例本身（严格地说，是操作行为所针对的对象；

注意：
* 如果对象中一个属性是不可配置且不可写(`configurable === false && writable === false`)，则拦截器不能修改该属性，否则通过Proxy对象访问该属性会报错；
```js
var obj = Object.defineProperty({}, 'foo', {
    value: 123,
    configurable: false,
    enumerable: true,
    writable: false
});

var proxy = new Proxy(obj, {
    get (target, prop) {
        // 改写
        return '123';
    }
});
proxy.foo // TypeError
```
### set(target, prop, value[, receiver])

* 如果目标对象自身的某个属性，不可写且不可配置(`configurable === false && writable === false`)，那么set方法将不起作用。
* 严格模式下，set代理如果没有返回true，就会报错。
```js
var obj = Object.defineProperty({}, 'foo', {
    value: 123,
    configurable: false,
    enumerable: true,
    writable: false
});
var proxy = new Proxy(obj, {
    set (target, prop, value) {
        target[prop] = value;
        return true;     
    }
});
proxy.foo = 456;
proxy.foo // 123

'use strict';
const handler = {
  set: function(obj, prop, value, receiver) {
    obj[prop] = value;
    // 没有下面这一行，都会报错 TypeError
    return true;
  }
};
const proxy = new Proxy({}, handler);
proxy.foo = 'bar';
```
### has(target, prop)
* 如果目标对象不可配置或者禁止扩展，这时has拦截会报错。
* has方法拦截的是 `HasProperty` 操作，而不是 `HasOwnProperty` 操作，即has方法不判断一个属性是对象自身的属性，还是继承的属性（in 运算符也是一样）。
* 虽然 `for...in` 循环也用到了in运算符，但是has拦截对`for...in` 循环不生效。

```js
var obj = {
    a: 1
};
Object.preventExtensions(obj);
var proxy = new Proxy(obj, {
    has (target, prop) {
        return false;
    }
});

'a' in proxy; // TypeError
// 解释：如果某个属性不可配置（或者目标对象不可扩展），则 has 方法就不得“隐藏”（即返回false）目标对象的该属性


var stu1 = {name: '张三', score: 59};
var stu2 = {name: '李四', score: 80};

var handler = {
    has (target, prop) {
        if (prop === 'score' && target[prop] < 60) {
            console.log(`${target.name} 不及格`);
            return false;
        }

        return prop in target;
    }
};
var p1 = new Proxy(stu1, handler);
var p2 = new Proxy(stu2, handler);

'score' in p1; // 张三 不及格; false;
'score' in p2; // true

for (let key in p1) {
    console.log(key, p1[key]);
}
// name 张三
// score 59
// 未触发拦截器 has 方法
```

### deleteProperty(target, prop)
* `deleteProperty` 方法用于拦截 `delete` 操作，如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除
* 目标对象自身的不可配置（`configurable`）的属性，不能被 `deleteProperty` 方法删除，否则报错。
```js
var target = Object.defineProperties({}, {
    _name: {
        value: 'yy',
        configurable: true,
        writable: true,
        enumerable: true
    },
    age: {
        value: 27,
        configurable: false,
        writable: true,
        enumerable: true
    }
});
function invariant (target, prop, action) {
    if (prop[0] === '_') {
        throw new Error(`Invalid attempt to ${action} private "${prop}" property.`)
    } else if (!Object.getOwnPropertyDescriptor(target, prop).configurable) {
        console.log(`Property ${prop} is not configurable`);
    }
}
var proxy = new Proxy(target, {
    deleteProperty (target, prop) {
        invariant(target, prop, 'delete');
        return delete target[prop];
    }
});
delete proxy._name // Error: Invalid attempt to delete private "_name" property.
delete proxy.age // Property age is not configurable; false;
```

### ownKeys(target)
该方法用来拦截对象自身属性的读取操作。具体来说，拦截以下操作：
* `Object.getOwnPropertyNames()`
* `Object.getOwnPropertySymbols()`
* `Object.keys()`
* `for...in 循环`

** 注意：**
1. 使用 `Object.keys` 方法时，有三类属性会被ownKeys方法自动过滤，不会返回:
   _ 目标对象上不存在的属性
   _ 属性名为 `Symbol` 值
   _ 不可遍历（`enumerable`）的属性
2. `ownKeys` 方法返回的数组成员，只能是字符串或 `Symbol` 值。如果有其他类型的值，或者返回的根本不是数组，就会报错。
3. 如果目标对象自身包含不可配置的属性，则该属性必须被 `ownKeys` 方法返回，否则报错。
4. 如果目标对象是不可扩展的（non-extensible），这时 `ownKeys` 方法返回的数组之中，必须包含原对象的所有属性，且不能包含多余的属性，否则报错。

```js
var target = {
    a: 1,
    [Symbol.for('secret')]: 2,
};
Object.defineProperty(target, 'foo', {
    value: 3,
    enumerable: false,
    writable: true,
    configurable: true
});
var proxy = new Proxy(target, {
    ownKeys (target) {
        return ['name', Symbol('2'), 'foo', 'a'];
    }
});
Object.keys(proxy) // ['a']
```

### getOwnPropertyDescriptor(target, prop)
* 返回一个属性描述对象或者undefined。

```js
var proxy = new Proxy({
    name: 'zyy',
    _age: 27
}, {
    getOwnPropertyDescriptor (target, prop) {
        console.log('proxy handler: getOwnPropertyDescriptor');
        return prop[0] === '_' ? undefined : Object.getOwnPropertyDescriptor(target, prop);
    }
});
Object.getOwnPropertyDescriptor(proxy, 'name'); // Object
Object.getOwnPropertyDescriptor(proxy, '_age'); // undefined
Object.getOwnPropertyDescriptor(proxy, 'age'); // Object
Object.getOwnPropertyDescriptors(proxy); // Object
```

### defineProperty(target, prop, desc)
* 如果目标对象不可扩展（non-extensible），则 `defineProperty` 不能增加目标对象上不存在的属性，否则会报错
* 如果目标对象的某个属性不可写（`writable`）或不可配置（`configurable`），则 `defineProperty` 方法不得改变这两个设置。
```js
var proxy = new Proxy({}, {
    defineProperty (target, prop, desc) {
        return false;
    }
});
Object.defineProperty(proxy, 'foo', {
    value: 1
}); // Error
proxy.foo = 1
proxy.foo // undefined
// 解释：defineProperty方法返回false，导致添加新属性总是无效。


var target = {
    age: 27
};
Object.preventExtensions(target);
var proxy = new Proxy(target, {
    defineProperty (target, prop, desc) {
        return true;
    }
});
proxy.name = 'yy'
proxy.age // 27
proxy.name = 'yy' // TypeError
```

### preventExtensions(target)
* 该方法必须返回一个布尔值，否则会被自动转为布尔值。
* 该方法有一个限制，只有目标对象不可扩展时（`即Object.isExtensible(proxy)为false`），`proxy.preventExtensions`才能返回true，否则会报错。
- 为了防止报错，会在方法内部手动调用下 `Object.preventExtensions(target);`

 ```js
var proxy = new Proxy({}, {
     preventExtensions (target) {
         // Object.preventExtensions(target);

         return true
     }
 });
 Object.preventExtensions(proxy) // TypeError
 ```

### getPrototypeOf(target)
getPrototypeOf 主要用来拦截获取对象原型，具体来说，拦截下面这些操作：
* Object.prototype.__proto__
* Object.prototype.isPrototypeOf()
* Object.getPrototypeOf()
* Reflect.getPrototypeOf()
* instanceof

** 注意： **
* `getPrototypeOf` 方法的返回值必须是对象或者null，否则报错。
* 如果目标对象不可扩展（non-extensible）， `getPrototypeOf` 方法必须返回目标对象的原型对象。

### isExtensible(target)
* 该方法只能返回布尔值，否则返回值会被自动转为布尔值。
* 这个方法有一个强限制，它的返回值必须与目标对象的 `isExtensible` 属性保持一致，否则就会抛出错误。

```js
var proxy = new Proxy({}, {
    isExtensible (target) {
        return false;
    }
});
Object.isExtensible(proxy) //TypeError
```

### setPrototypeOf(target, proto)
* 该方法只能返回布尔值，否则会被自动转为布尔值。
* 如果目标对象不可扩展（`non-extensible`），`setPrototypeOf` 方法不得改变目标对象的原型。
```js
var proxy = new Proxy(Object.preventExtensions({}), {
    setPrototypeOf (target, proto) {
        return true;
    }
})
Object.setPrototypeOf(proxy, {}); // TypeError
```

### apply(target, bindingObject, args)
target: 目标对象；
bindingObject: 目标对象的上下文对象（this）；
args: 目标对象的参数数组；

```js
var proxy = new Proxy(function (l, r) {
    return l + r;
}, {
    apply (target, obj, args) {
        // question ？
        return Reflect.apply(...arguments) * 2;
    }
});
proxy(1, 2) // 6
proxy.call(null, 5, 6); // 22
proxy.apply(null, [5, 6]); // 22
```

### construct(target, args[, newTarget])
target: 目标对象；
args: 构造函数的参数对象；
newTarget: 创造实例对象时，new 命令作用的构造函数（下例中p）；

```js
var newTarget;
var p = new Proxy(function () {}, {
    construct (target, args, newTarget) {
        newTarget = newTarget;
        console.log(`In Proxy handler, construct function is called`);
        console.log(newTarget)
        return {value: args[0] * 2}
    }
});
var p1 = new p(1, 2, 3); // In Proxy handler, construct function is called
p1.value // 2
newTarget === p // false; question ?
```
** 注意：**
* `construct` 方法返回的必须是一个对象，否则会报错。

## Proxy.revocable
```
Proxy.revocable的一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。
```

```js
// Proxy.revocable 方法返回一个可取消的 Proxy 实例
var {proxy, revoke} = Proxy.revocable({}, {});
proxy.foo = 123;
proxy.foo // 123

revoke();
proxy.foo // Uncaught TypeError: Cannot perform 'get' on a proxy that has been revoked
```

## this 问题
```
虽然 Proxy 可以代理针对目标对象的访问，但它不是目标对象的透明代理，即不做任何拦截的情况下，也无法保证与目标对象的行为一致。主要原因就是在 Proxy 代理的情况下，目标对象内部的this关键字会指向 Proxy 代理。
```
```js
var _name = new WeakMap();
var t1, t2;
class Person {
    constructor (name) {
        t1 = this;
        _name.set(this, name);
    }
    get name () {
        t2 = this;
        return _name.get(this);
    }
}
var person =  new Person('yy');
// 调用取值器函数，赋值t2
person.name // 'yy'
t1 === t2 // true
t1 === person // true
person === t2 // true

var proxy =  new Proxy(person, {});
// 调用取值器函数，赋值t2
proxy.name // undefined
t1 === person // true
t2 !== t1 // true
t2 !== person // true
t2 === proxy // true
```

## 引用
* [阮一峰 ES6入门-Proxy](http://es6.ruanyifeng.com/#docs/proxy)
* 掘金：[Proxy详解，运用与Mobx](https://juejin.im/post/5c170b556fb9a049ee805bdc)
