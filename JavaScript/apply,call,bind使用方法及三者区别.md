- 标签： `JavaScript`
- 时间： `2018-04-02`
- 更新： `2018-04-02`

## 使用方法：
### apply
```js
var name = 'Zyy';
var obj = {
	name: 'Yyy'
};
function getName () {
	console.log(this.name);
}

getName(); // Zyy

getName.apply(obj); // Yyy

--------------------------

function summation (a, b) {
	console.log('sum = ' + (a + b));
}

summation.apply(null,[1,2]); // sum = 3

summation.apply(null, 1, 2); // Uncaught TypeError: CreateListFromArrayLike called on non-object
```

### call
```js
var name = 'Zyy';
var obj = {
	name: 'Yyy'
};
function getName () {
	console.log(this.name);
}

getName(); // Zyy

getName.call(obj); // Yyy

--------------------------

function summation (a, b) {
	console.log('sum = ' + (a + b));
}

summation.call(null,[1,2]); // sum = 1,2undefined 可以想想为什么是这个结果！！！

summation.call(null, 1, 2); // sum = 3

```

### bind
```js
var name = 'Zyy';
var obj = {
	name: 'Yyy'
};
function getName () {
	console.log(this.name);
}

getName(); // Zyy

getName.bind(obj); 

<!-- 
打印结果：
getName() {
	console.log(this.name);
}
-->

var fun = getName.bind(obj); 

func(); // Yyy

--------------------------

function summation (a, b) {
	console.log('sum = ' + (a + b));
}

summation.bind(null,[1,2]);  

<!-- 
打印结果：
summation(a, b) {
	console.log('sum = ' + (a + b));
}
-->
var func1 = summation.bind(null,[1,2]);

func1(); // sum = 1,2undefined

--------------------------

summation.bind(null, 1, 2); 

<!-- 
打印结果：
summation(a, b) {
	console.log('sum = ' + (a + b));
}
-->
var func2 = summation.bind(null,1,2);

func2(); // sum = 3

--------------------------

function log (a, b, c) {
	console.log('log : ' + a + '--' + b + '--' + c);
}

var func3 = log.bind(null, 10);

func3(); // log :10--undefined--undefined

func3(5, 6); // log : 10--5--6

```

## 共同点：
* `call` ， `apply` 与 `bind` 都是为了改变某个函数的执行上下文而存在的，即函数内部 `this` 的指向；

* `call` ， `apply` 与 `bind` 方法的第一个参数都是代表 `this` 的指向；


## 区别：
* `apply` 方法第二个参数必须是一个 `数组`，作为执行函数的参数；

* `call` 方法第二，三，四... n个参数，作为执行函数的参数（也就是必须全部列举出来）；

* `bind` 方法第二，三，四... n个参数，作为执行函数的参数（也就是必须全部列举出来），但是要注意的是，参数是按照形参的顺序进行的；

* `bind` 会创建一个新函数，称为绑定函数；并把 `bind` 方法中第一个参数作为 `this`;

* `bind` 与 `call` ， `apply` 两者最大的不同是：`bind` 不会立即调用，而另外两者会；
