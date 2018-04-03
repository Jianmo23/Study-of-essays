- 标签： `JavaScript`
- 时间： `2018-04-02`
- 更新： `2018-04-02`

## `this` 指向什么

`this` 指向调用者，函数在创建的时候是无法确定 `this` 指向的，在调用的时候才能确定，谁调用就指向谁。

----------

不逼逼，上代码：

```js
var username = 'Zyy';

function getUsername () {
	console.log(this.username);
}

getUsername(); // Zyy

window.getUsername(); // Zyy

此时调用者是 window，因此 `this` 指向 window

---------------------------------------

var obj = {
	username: 'Yyy',
	getUsername () {
		console.log(this.username);
	}
}

obj.getUsername(); // Yyy

此时调用者是 obj，因此 `this` 指向 obj

---------------------------------------

var obj1 = {
    a:1,
    b:{
        func:function(){
            console.log(this.a); 
            console.log(this);
        }
    }
}

obj1.b.func();

输出结果：
undefined
{func: ƒ}

这个函数中包含多个对象，虽然这个函数是被最外层的对象 obj1 所调用，但是 this 指向的也只是它上一级的对象，即使该对象中不含有需要的属性

---------------------------------------

var obj2 = {
    a:1,
    b:{
        a:11,
        func:function(){
            console.log(this.a); 
            console.log(this);
        }
    }
}

obj2.b.func();

输出结果：
11
{a: 11, func: ƒ}

此时调用者是 obj.b 这个对象，因此 `this` 指向 obj.b

var func2 = obj2.b.func;

func2();

输出结果：

undefined
Window

虽然 func 函数被 对象 b 引用，但是赋值给了变量 func2, 此时调用 func2 函数的是 window 对象，因此 `this` 指向 window
```

## 构造函数中的 `this`

还是用代码说话：
```js
function Fn () {
	this.user = 'Zyy';
}

var fn1 = new Fn();

console.log(fn1.user); // Zyy

fn1具有 user 属性的原因是 new 关键字改变了 this 的指向，将 this 指向了实例化对象 fn1
```

**当 `this` 碰到 `return`**

```js
function Fn1 () {
	this.user = 'Yyy';
	return {};
}

var instance1 = new Fn1;

console.log(instance1.user); // undefined

---------------------------------------

function Fn2 () {
	this.user = 'Yyy';
	return function () {};
}

var instance2 = new Fn2;

console.log(instance2.user); // undefined

---------------------------------------

function Fn3 () {
	this.user = 'Yyy';
	return 1;
}

var instance3 = new Fn3;

console.log(instance3.user); // Yyy

---------------------------------------

function Fn4 () {
	this.user = 'Yyy';
	return undefined;
}

var instance4 = new Fn4;

console.log(instance4.user); // Yyy

---------------------------------------

function Fn5 () {
	this.user = 'Yyy';
	return null;
}

var instance5 = new Fn5;

console.log(instance5.user); // Yyy

typeof null // object

---------------------------------------
总结：

如果返回值是一个对象，那么 this 指向的就是那个返回的对象；如果返回值不是一个对象那么 this 还是指向函数的实例（其实说「对象」不如说是引用数据类型）。

有一点需要注意：null 虽然属于对象，但是 this 仍然指向函数的实例，因为 null 比较特殊；
---------------------------------------
```

## 总结

* `this` 永远指向的最后调用它的对象，也就是谁调用的它；

*  new 操作符会改变函数内部 this 的指向

## 补充：

* 在严格模式下，默认的 `this` 不再是 `window`，而是 `undefined`。

## 引用：

* [SegmentFault: JS 中 `this` 关键字详解](https://segmentfault.com/a/1190000003046071)

