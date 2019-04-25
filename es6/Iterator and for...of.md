* 时间：`2019-04-25`
* 运行环境： `macOS 10.14.4  chrome 版本 73.0.3683.86（正式版本)`
* NodeJS：`node v9.2.1  npm v6.7.0`
* 更新时间： ``

## Iterator (遍历器) 概念
> 遍历器（Iterator）是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

**`Iterator` 的作用: **
* 一是为各种数据结构，提供一个统一的、简便的访问接口；

* 二是使得数据结构的成员能够按某种次序排列；

* 三是 `ES6` 创造了一种新的遍历命令 `for...of` 循环，`Iterator` 接口主要供 `for...of` 消费。

**`Iterator` 的遍历过程：**
1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。

2. 第一次调用指针对象的 `next` 方法，可以将指针指向数据结构的第一个成员。

3. 第二次调用指针对象的 `next` 方法，指针就指向数据结构的第二个成员。

4. 不断调用指针对象的 `next` 方法，直到它指向数据结构的结束位置。

每一次调用 `next` 方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含 `value` 和 `done` 两个属性的对象。
其中，`value` 属性是当前成员的值，`done` 属性是一个布尔值，表示遍历是否结束。

```js
// 模拟 next 方法
var it = makeIterator(['a', 'b']);

function makeIterator (array) {
    var nextIndex = 0;

    return {
        next () {
            return nextIndex > array.length - 1 ? {
                done: true,
                value: undefined
            } : {
                done: false,
                value: array[nextIndex++]
            }
        }
    }
}
it.next() // {done: false, value: "a"}
it.next() // {done: false, value: "b"}
it.next() // {done: true, value: undefined}
```
每一次调用 `next()` 方法都是在操作 `Iterator` 指针后移， 直到其返回对象的 `done` 属性值变为 `true`

对于遍历器对象来说，`done: false` 和 `value: undefined` 属性都是可以省略的，因此上面的 `makeIterator` 函数可以简写成下面的形式。
```js
function makeIterator (array) {
    var nextIndex = 0;

    return {
        next () {
            return nextIndex > array.length - 1 ? {
                done: true
            } : {
                value: array[nextIndex++]
            }
        }
    }
}
```
**`Iterator` 只是把接口规格加在数据结构之上，遍历器和它所遍历的数据结构是分开的！！！**

## 默认 `Iterator` 接口
> Iterator 接口的目的，就是为所有数据结构提供了一种统一的访问机制，即 for...of 循环。当使用 for...of 循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口。

ES6 规定，默认的 `Iterator` 接口部署在数据结构的 `Symbol.iterator` 属性，或者说，一个数据结构只要具有 `Symbol.iterator` 属性，就可以认为是“可遍历的”（`iterable`）。
`Symbol.iterator` 属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回一个遍历器。至于属性名 `Symbol.iterator`，它是一个表达式，
返回 `Symbol` 对象的 `iterator` 属性，这是一个预定义好的、类型为 Symbol 的特殊值，所以要放在方括号内 [传送门](http://es6.ruanyifeng.com/#docs/symbol#Symbol-iterator)

```js
var obj = {
    [Symbol.iterator]: function () {
        var nextIndex = 0;
        return {
            next () {
                return {
                    value: nextIndex > 4 ? undefined :nextIndex++,
                    done: nextIndex > 4
                }
            }
        }
    }
}

for (let value of obj) {
    console.log(value)
}
// 0, 1, 2, 3

var it = obj[Symbol.iterator]();
it.next() // {value: 0, done: false}
```

ES6 的有些数据结构原生具备 `Iterator` 接口（比如数组），即不用任何处理，就可以被 `for...of` 循环遍历。因为这些数据结构原生部署了 `Symbol.iterator` 属性

原生具备 `Iterator` 接口的数据结构有：

* `Array`
* `Map`
* `Set`
* `String`
* `TypedArray`
* 函数的 `arguments` 对象
* `NodeList` 对象

```js
// 以数组为例
var arr = ['a', 'b', 'c'];

var iter = arr[Symbol.iterator]();
iter.next() // {value: "a", done: false}
iter.next() // {value: "b", done: false}
iter.next() // {value: "c", done: false}
iter.next() // {value: undefined, done: true}

for (let value of arr) {
    console.log(value)
}
// 'a'
// 'b'
// 'c'
```

对象（`Object`）之所以没有默认部署 `Iterator` 接口，是因为对象的哪个属性先遍历，哪个属性后遍历是不确定的（对象属性具有无序性），需要开发者手动指定。
**本质上，遍历器是一种线性处理，对于任何非线性的数据结构，部署遍历器接口，就等于部署一种线性转换。** 不过，严格地说，对象部署遍历器接口并不是很必要，
因为这时对象实际上被当作 `Map` 结构使用，`ES5` 没有 `Map` 结构，而 `ES6` 原生提供了。

一个对象如果要具备可被 `for...of` 循环调用的 `Iterator` 接口，就必须在 `Symbol.iterator` 的属性上部署遍历器生成方法（**原型链上的对象具有该方法也可**）。
```js
// 类部署 Iterator 接口
class RangeIterator {
    constructor (start, stop) {
        this.start = start;
        this.stop = stop;
    }

    [Symbol.iterator] () { return this; }

    next () {
        var value = this.start;

        if (value < this.stop) {
            this.start++;
            return {
                value: value,
                done: false
            }
        }
        return {
            value: undefined,
            done: true
        }
    }
}

function range (start, stop) {
    return new RangeIterator(start, stop);
}

for (let value of range(0, 3)) {
    console.log(value)
}
// 0
// 1
// 2
```

```js
// 通过遍历器实现指针结构的例子
function Obj (value) {
    this.value = value;
    this.next = null;
}

Obj.prototype[Symbol.iterator] = function () {
    var iterator = {next};
    var current = this;

    function next () {
        if (current) {
            let value = current.value;
            current = current.next;

            return {value: value, done: false}
        }

        return {done: true}
    }

    return iterator;
}
var one = new Obj(1);
var two = new Obj(2);
var three = new Obj(3);

one.next = two;
two.next = three;

for (let value of one) {
    console.log(value)
}
// 1
// 2
// 3
```

```js
var obj = {
    data: [1, 2, 3],
    [Symbol.iterator] () {
        let index = 0,
            maxIndex = this.data.length - 1,
            current = this;

        function next () {
            // 此时内部 this 指代 Iterator 不是 obj
            return index <= maxIndex ? {value: current.data[index++], done: false} : {done: true}
        }

        return { next }
    }
}
for (let value of obj) {
    console.log(value)
}
// 1
// 2
// 3
```

对于类似数组的对象（**同时存在数值键名和 `length` 属性**），部署 `Iterator` 接口，有一个简便方法，就是 `Symbol.iterator` 方法直接引用数组的 `Iterator` 接口。
```js
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
// 或者
NodeList.prototype[Symbol.iterator] = [][Symbol.iterator];

[...document.getElementsByTagName('body')] // [body]
// 备注：NodeList 对象是类似数组的对象，本来就具有遍历接口，可以直接遍历，上述操作不影响


// 类数组对象部署 Iterator 接口
var obj = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3,
    [Symbol.iterator]: [][Symbol.iterator]
}
for (let value of obj) {
    console.log(value)
}
// a
// b
// c
```
**注意：普通对象（不是同时存在数值键名和 `length` 属性）即使部署了 `Iterator` 接口也是无效的**

具有 `Iterator` 遍历器接口，不仅可以使用 `for...of` 语法，还可以使用 `while` 语法
```js
var iter = [11, 22, 33][Symbol.iterator]();
var result = iter.next();
while(!result.done) {
    console.log(result.value);

    result = iter.next();
}
// 11
// 22
// 33
```

## 使用 `Iterator` 的场景

### 解构赋值
```js
// 对数组和 Set 结构进行解构赋值时，会默认调用Symbol.iterator方法。
let set = new Set().add('a').add('b').add('c');

let [x, y] = set;
// x = 'a', y = 'b'

let [first, ...rest] = set;
first // 'a'
rest // ['b', 'c']
```

### 扩展运算符 `···`
```js
var str = 'hello';
[...str] // ['h', 'e', 'l', 'l', 'o']

var arr = [2, 3];
[1, ...arr, 4] // [1, 2, 3, 4]
```
**只要某个数据结构部署了 `Iterator` 接口，就可以对它使用扩展运算符，将其转为数组。**

```js
var obj = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3,
    [Symbol.iterator]: [][Symbol.iterator]
}
[...obj] // ['a', 'b', 'c']
```

### `yield*`
> yield* 后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。

```js
var generator = function* () {
    yield 1;
    yield* [2, 3, 4];
    yield 5;
}
var iter =  generator();
for (let value of iter) {
    console.log(value)
}
// 1
// 2
// 3
// 4
// 5
```

### 其他场合
> 由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口

例如：
* `for...of`
* `Array.from()`
* `Map()`, `Set()`, 'WeakSet', `WeakMap`
* `Promise.race()`, `Promise.all()`

## 字符串的 `Iterator` 接口
> 字符串是一个类似数组的对象，也原生具有 Iterator 接口。

```js
var str = 'hi';
typeof str[Symbol.iterator] // 'function'

var iter = str[Symbol.iterator]();
iter.next() // {value: "h", done: false}
iter.next() // {value: "i", done: false}
iter.next() // {value: undefined, done: true}
```
## `Iterator` 接口与 `Generator` 函数
```js
var obj = {
    [Symbol.iterator]: function* () {
        yield 1;
        yield* [2, 3];
    }
}
[...obj] // [1, 2, 3]

// 或者简写
var obj = {
    *[Symbol.iterator] () {
        yield 1;
        yield* [2, 3];
    }
}
[...obj] // [1, 2, 3]
```

## 遍历器对象的 `return()`，`throw()`
> 遍历器对象除了具有 `next` 方法，还可以具有 `return` 方法和 `throw` 方法。如果你自己写遍历器对象生成函数，那么 `next` 方法是必须部署的，`return` 方法和 `throw` 方法是否部署是可选的。

**`return` 方法的使用场合是：**
* 如果 `for...of` 循环提前退出（通常是因为出错，或者有 `break` 语句），就会调用 `return` 方法。

* 如果一个对象在完成遍历前，需要清理或释放资源，就可以部署 `return` 方法。

```js
function readLinesSync (file) {
    return {
        [Symbol.iterator] () {
            return {
                next () {
                    return {done: false}
                },
                return () {
                    file.close();
                    // return方法必须返回一个对象，这是 Generator 规格决定的。
                    return { done: true }
                }
            }
        }
    }
}

// 以下情景都会用到 return 方法
// 情景一
for (let line of readLinesSync(fileName)) {
    console.log(line);
    break;
}

// 情景二
for (let line of readLinesSync(fileName)) {
    console.log(line);
    throw new Error();
}
```
上面代码中，情景一输出文件的第一行以后，就会执行 `return` 方法，关闭这个文件；情景二会在执行 `return` 方法关闭文件之后，再抛出错误。

**注意：`return` 方法必须返回一个对象，这是 `Generator` 规格决定的。**

`throw` 方法主要是配合 `Generator` 函数使用，一般的遍历器对象用不到这个方法。[传送门](http://es6.ruanyifeng.com/#docs/generator#Generator-prototype-throw)

## `for...of` 循环
一个数据结构只要部署了 `Symbol.iterator` 属性，就被视为具有 `iterator` 接口，就可以用 `for...of` 循环遍历它的成员。
也就是说，`for...of` 循环内部调用的是数据结构的 `Symbol.iterator` 方法。

可以 **直接** 使用 `for...of` 循环的数据结构有：
* `Array`

* `Set` 结构

* `Map` 结构

* 类数组对象（函数内部的 `arguments` 对象， `DOM NodeList` 对象）

* `String`

* `Generator` 对象

### 数组
> 数组原生具备 iterator 接口（即默认部署了 Symbol.iterator 属性），for...of 循环本质上就是调用这个接口产生的遍历器

```js
var arr = ['red', 'green', 'blue'];

for (let color of arr) {
    console.log(color)
}
// 'red'
// 'green'
// 'blue'

var obj = {
    [Symbol.iterator]: [][Symbol.iterator].bind(arr)
};
[...obj] // ['red', 'green', 'blue']
```

**注意：**
* `for...of` 和 `for...in` 语法在遍历数组时打印的值是不同的，前者打印内容，后者打印索引

* `for...of` 循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性。这一点跟 `for...in` 循环也不一样。

```js
var arr = ['red', 'green', 'blue'];
arr.name = 'color';

for (let item in arr) {
    console.log(item)
}
// 0
// 1
// 2
// 'name'

for (let item of arr) {
    console.log(item)
}
// 'red'
// 'green'
// 'blue'
```

### `Set`、 `Map` 结构
> Set 和 Map 结构也原生具有 Iterator 接口，可以直接使用for...of循环。

```js
var set = new Set([1,2,3]).add(4);

for (let value of set) {
    console.log(set)
}
// 1, 2, 3, 4

var map = new Map();
map.set('name', 'zyy')
map.set('age', 27)

for (let [key, value] of map) {
    console.log(key, value)
}
// name zyy
// age 27

for (let arr  of map) {
    console.log(arr)
}
// ["name", "zyy"]
// ["age", 27]
```

**使用 `for...of` 遍历 `Set` 和 `Map` 的时候应注意：**
* 遍历的顺序是按照各个成员被添加进数据结构的顺序。

* `Set` 结构遍历时，返回的是一个值，而 `Map` 结构遍历时，返回的是一个数组，该数组的两个成员分别为当前 `Map` 成员的键名和键值。

### 类似数组的对象
```js
function fn () {
    for (let value of arguments) {
        console.log(value)
    }
}
fn(1, 2, 3) // 1, 2, 3
```

### 字符串
对于字符串来说，`for...of` 循环还有一个特点，就是会正确识别 `32 位 UTF-16` 字符。
```js
var str = 'a\uD83D\uDC0A'
for (let x of str) {
  console.log(x);
}
// 'a'
// '\uD83D\uDC0A'
```

**并不是所有类似数组的对象都具有 `Iterator` 接口，一个简便的解决方法，就是使用 `Array.from` 方法将其转为数组。**
```js
var obj = {
    0: 'a',
    1: 'b',
    length: 2
}

for (let value of obj) {
    console.log(value)
}
// TypeError: obj is not iterable

for (let value of Array.from(obj)) {
    console.log(value)
}
// 'a'
// 'b'
```

**`for...in` 循环的缺点:**
* 数组的键名是数字，但是 `for...in` 循环是以字符串作为键名“0”、“1”、“2”等等。

* `for...in` 循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。

* 某些情况下，`for...in` 循环会以任意顺序遍历键名。

**对比 `for...in`，`for...of` 有一些显著的有点：**
* 有着同 `for...in` 一样的简洁语法，但是没有 `for...in` 那些缺点。

* 不同于 `forEach`（无法中途退出循环）方法，它可以与 `break`、`continue` 和 `return` 配合使用。

* 提供了遍历所有数据结构的统一操作接口。

```js
var arr = [1,2,3]
for (let index in arr) {
     if (index == 1) {
         continue;
     }
     console.log(index)
}

for (let value of arr) {
     if (value == 2) {
         break;
     }
     console.log(value)
}
```
**备注：`return` 语法只能用在函数体内，否则会报错！**




## 引用
* [阮一峰 ES6入门-Iterator 和 for...of 循环](http://es6.ruanyifeng.com/#docs/iterator)
