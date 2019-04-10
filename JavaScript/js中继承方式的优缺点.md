## 继承种类
* 类式继承
* 构造函数式继承
* 组合式继承
* 原型继承
* 寄生式继承
* 寄生组合式继承

```js
function Person (country) {
	this.country = country;
	Person.prototype.myCountry = function () {
		console.log(`my country is ${this.country}`);
	}
}

function Me (name, age) {
	this.name = name;
	this.age = age;
	Me.prototype.say = function () {
		console.log(`my name is ${this.name}, my age is ${this.age}`);
	}
}
var me = new Me('yyy', 26);
console.log(me);
console.log(me.__proto__ === Me.prototype); // true
console.log(me.__proto__.__proto__ === Object.prototype); // true
console.log(me.constructor === Me); // true
console.log(me instanceof Me); // true
```

### 类式继承
描述：将一个构造函数的实例化对象作为另一个构造函数的原型对象
* 优点:
- 

* 缺点:
- 在原型链上创建了属性，导致多个子类的实例将共享同一个父类的属性，会互相影响；
- 篡改了__proto__,导致 me.__proto__ === Me.prototype 和 me instanceof Me 不成立！
```js
function Person (country) {
	this.country = country;
	Person.prototype.myCountry = function () {
		console.log(`my country is ${this.country}`);
	}
}
<!-- 验证缺点一 -->
function Me (name, age) {
	this.name = name;
	this.age = age;
}
Me.prototype = new Person();
var m1 = new Me('zyy', 26);
var m2 = new Me('yyy', 25);
console.log(m1.country) // undefined
console.log(m2.country) // undefined
m2.__proto__.country = 'china';
console.log(m1.country) // china


<!-- 验证缺点二 -->
function Me (name, age, country) {
	this.name = name;
	this.age = age;
	var prototype = new Person(country);
	prototype.say = function () {
		console.log(`my name is ${this.name}, my age is ${this.age}`);
	}
	this.__proto__ = prototype;
}
var me = new Me('yyy', 26, 'china');
console.log(me);
console.log(me.constructor); // Person
console.log(me.__proto__); // Person
console.log(me.__proto__ === Me.prototype); // false
console.log(me.__proto__.__proto__ === Person.prototype) // true

```

### 构造函数式继承
描述：通过call 或者 apply 方法实现继承父类属性
* 优点 
- 继承了父类属性且各子类的同名属性互不影响；

* 缺点
- 只能继承父类属性，不能继承父类方法；
```js
function Person (country) {
	this.country = country;
	Person.prototype.myCountry = function () {
		console.log(`my country is ${this.country}`);
	}
}
function Me (name, age, country) {
	this.name = name;
	this.age = age;
	Person.call(this, country)
	// 或者
	// Person.apply(this, arguments);
}

var m1 = new Me('zyy', 26, 'china');
var m2 = new Me('yyy', 25, 'HK');
console.log(m1); // Me {name: "zyy", age: 26, country: "china"}
console.log(m2); // Me {name: "yyy", age: 25, country: "HK"}
console.log(m1.myCountry) // undefined
console.log(m2.myCountry) // undefined

```

### 组合式继承
描述：结合类式继承 和 构造函数式继承两种方式
* 优点
- 继承了父类的属性和方法；
* 缺点
- 父类构造函数被执行了两次；
- 依旧无法动态传参给父类；
- 仍然篡改了__proto__,导致 me.__proto__ === Me.prototype 和 me instanceof Me 不成立！
```js
function Person (country) {
	this.country = country;
	Person.prototype.myCountry = function () {
		console.log(`my country is ${this.country}`);
	}
}
function Me (name, age, country) {
	this.name = name;
	this.age = age;
	Person.apply(this, arguments);
}
Me.prototype = new Person();

var me = new Me('zyy', 26, 'china');
console.log(me) // Me {name: "zyy", age: 26, country: "zyy"}

console.log(me.constructor); // Person
console.log(me.__proto__); // Person
console.log(me.__proto__ === Me.prototype); // false
console.log(me.__proto__.__proto__ === Person.prototype) // true
```

### 原型继承
描述：原型继承实际上是对类式继承的一种封装，只不过是定义了一个干净的中间件；
* 优点
-
* 缺点
-
```js
function createObject (o) {
	var f = function () {};
	f.prototype = o;
	return new f();
}
//  类似ES6中的Object.create()

function Person (country) {
	this.country = country;
	Person.prototype.myCountry = function () {
		console.log(`my country is ${this.country}`);
	}
}
function Me (name, age) {
	this.name = name;
	this.age = age;
}
Me.prototype = createObject(new Person ());

var me = new Me('zyy', 26, 'china');
console.log(me)

```

### 寄生式继承
描述：寄生继承是依托于一个对象而生的一种继承方式，因此称之为寄生
* 优点
* 缺点

### 寄生组合式继承
* 优点
* 缺点
```js
// 寄生组合式继承的核心方法
function inherit (child, parent) {
	// 继承父类的原型
	var p = Object.create(parent.prototype);
	// 重写子类的原型
    child.prototype = p;
    // 重写被污染的子类的constructor
    p.constructor = child;
}

// GithubUser, 父类
function GithubUser(username, password) {
    let _password = password 
    this.username = username 
}

GithubUser.prototype.login = function () {
    console.log(this.username + '要登录Github，密码是' + _password)
}

// GithubUser, 子类
function JuejinUser(username, password) {
    GithubUser.call(this, username, password) // 继承属性
    this.articles = 3 // 文章数量
}

// 实现原型上的方法
inherit(JuejinUser, GithubUser)

// 在原型上添加新方法
JuejinUser.prototype.readArticle = function () {
    console.log('Read article')
}

var  juejinUser1 = new JuejinUser('zyy', 123);
console.log(juejinUser1)


```

## 引用
* [万物皆空之 JavaScript 原型](https://juejin.im/post/5a944f485188257a804aba6d)
* [深入JavaScript继承原理](https://juejin.im/post/5a96d78ef265da4e9311b4d8)