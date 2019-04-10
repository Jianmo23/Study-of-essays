<!-- https://www.ibm.com/developerworks/cn/web/1306_jiangjj_jsinstanceof/ -->

```js
function instance_of (L, R) {
	// L 表示左表达式，R 表示右表达式
	// 获取原型
	var O = R.prototype;
	// 获取隐式原型
	L = L.__proto__;

	while (true) {
		if (L === null) { return false; }
		if (L === O) { return true; }
		L = L.__proto__;
	}
}
```