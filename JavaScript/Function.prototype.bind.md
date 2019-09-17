js 原生实现 `Function.prototype.bind`

```js
Function.prototype.bind = function () {
    if (typeof this !== 'function') {
        throw new TypeError(`${fn.name} must be a function`)
    }

    let fn = this, /* 获取当前函数 */
        args = [].slice.call(arguments),
        context = args.shift(); /* 获取第一个参数：执行上下文 */
    
    const noop = function () {};
    const fBound = function () {
        // 当用作构造函数时，继承实例属性
        if (this instanceof noop) {
            context = this;
        }

        return fn.apply(context, [...args, ...arguments])
    }

    // 原型链继承 
    if (this.prototype) {
        noop.prototype = this.prototype;
    }
    fBound.prototype = new noop();

    return fBound;
}
```

验证

构造函数调用时：
```js
function Animal (name, color) {
    this.name = name;
    this.color = color;
}
var Cat = Animal.bind(null, 'cat');
var cat = new Cat('white');

console.log(cat)
console.log(cat instanceof Cat)
console.log(cat instanceof Animal)
```

总结：
`bind` 方法的难点实现主要在于 用于构造函数时的原型链继承，除此之外使用闭包及函数的柯里话实现
