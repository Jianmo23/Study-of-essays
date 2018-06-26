- 标签： `JavaScript`
- 时间： `2018-03-09`
- 更新： `2018-06-26`

## 1、基本去重方法
> 思路：定义一个新数组，并存放原数组的第一个元素，然后将原数组中的每一项和新数组的元素对比，若不同则存放在新数组中。

```js
Array.prototype.distinct = function () {
	var arr = this; // 表示数组本身
	var result = [arr[0]];
	for (var i = 0; i < arr.length; i++) {
		var isRepeat = false
		for (var j = 0; j < result.length; j++) {
			isRepeat = arr[i] === result[j];
			if (isRepeat) {
				break; // 重复则跳出循环体
			}
		}
		if (!isRepeat) {
			result.push(arr[i]);
		}
	}
	return result;
}

// 验证
var arr = [1,2,3,4,4,1,1,2,1,1,1];
arr.distinct(); // [1, 2, 3, 4]
```

## 2、先排序再去重
> 思路：先将原数组排序，再与相邻元素进行比较，如果不同则存入新数组

```js
function unique (arr) {
	if (!arr || Object.prototype.toString.call(arr) !== '[object Array]') { return []; }
	var newArr = arr.sort(); // `sort` 方法会改变原数组，并返回排序后的数组
	var result = [newArr[0]];
	for (var i = 0; i < newArr.length; i++) {
		if (newArr[i] !== result[result.length - 1]) {
			result.push(newArr[i]);
		}
	}
	return result;
}

// 验证
var arr = [1,2,3,4,4,1,1,2,1,1,1];
unique(arr); // [1, 2, 3, 4]
```

## 3、利用对象的属性去重
> 思路：每次取出原数组的元素，作为对象的属性，然后访问对象中是否存在该属性；

```js
function unique (arr) {
	var obj = {};
	var result = [];
	for (var i = 0; i < arr.length; i++) {
		if (!obj[arr[i]]) {
			result.push(arr[i]);
			obj[arr[i]] = 1;
		}
	}
	return result;
}

// 验证
var arr = [1, 2, 2, 10, '1','2', 'a', 'a', 'b', '@', '@'];
unique(arr); // [1, 2, 10, "a", "b", "@"] ???

what? 字符串和数字一样被去重了！why? `在 JavaScript 里，对象的键值只能是字符串`

解决办法：

function unique (arr) {
	var obj = {};
	var result = [];
	for (var i = 0; i < arr.length; i++) {
		var key = typeof arr[i] + '_' + arr[i];
		if (!obj[key]) {
			result.push(arr[i]);
			obj[key] = 1;
		}
	}
	return result;
}

// 验证
var arr = [1, 2, 2, 10, '1','2', 'a', 'a', 'b', '@', '@'];
unique(arr); // [1, 2, 10, "1", "2", "a", "b", "@"]
```

## 4、利用索引查询，类似方法1
> 此方法很好的避免了方法3出现的问题

```js
function unique (arr) {
	var result = [arr[0]];
	for (var i = 0; i < arr.length; i++) {
		if (result.indexOf(arr[i]) === -1) {
			result.push(arr[i]);
		}
	}
	return result;
}

// 验证
var arr = [1, 2, 2, 10, '1','2', 'a', 'a', 'b', '@', '@'];
unique(arr); // [1, 2, 10, "1", "2", "a", "b", "@"]
```

## 5、利用ES6中的Set

```js
var arr = [1, 2, 2, 10, '1','2', 'a', 'a', 'b', '@', '@'];

function unique (arr) {
	return [...new Set(arr)];
}

console.log(unique(arr)); 
```

## 6、利用Array.from
```js
var arr = [1, 2, 2, 10, '1','2', 'a', 'a', 'b', '@', '@'];

function unique (arr) {
	return Array.from(new Set(arr));
}

```
