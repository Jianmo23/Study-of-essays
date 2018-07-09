- 标签： `JavaScript`
- 时间： `2018-07-09`
- 更新： ``

## FileReader
```
`FileReader` 对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 `File` 或 `Blob` 对象指定要读取的文件或数据。
```
## FileReader 属性、方法及事件监听

### 属性
- `FileReader.error`: 一个[DONException](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMException)，表示在读取文件时发生的错误.
- `FileReader.readyState`: 表示 FileReader 状态的数字：

常量名 | 值 | 描述
----- | -- | ---
EMPTY | 0 | 还没有加载任何数据
LOADING | 1 | 数据正在被加载
DONE | 2 | 已完成全部的读取请求
- `FileReader.result`: 文件的内容。该属性仅在文件读取操作完成后才有效，数据格式取决于使用哪个方法来启动读取操作。

### 方法
- `FileReader.abort()`: 终止读取操作。在返回时，`readyState`属性为 `DONE`
- `FileReader.readAsArrayBuffer`: 开始读取指定的 [Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)中的内容，一旦完成，`result` 属性中保存的是被读取文件的 `ArrayBuffer` 数据对象。
- `FileReader.readAsBinaryString`: 开始读取指定的 [Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)中的内容，一旦完成，`result` 属性中保存的是被读取文件的原始二进制数据。`(已移除，用 FileReader.readAsBinaryString 代替)`
- `FileReader.readAsDataURL`: 开始读取指定的 [Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)中的内容，一旦完成，`result` 属性中将包含一个 `data: URL` 格式的字符串以表示所读取文件的内容。
- `FileReader.readAsText`: 开始读取指定的 [Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)中的内容，一旦完成，`result` 属性中将包含一个字符串以表示所读取文件的内容。

### 事件监听
* `FileReader.onabort`: 读取操作被中断时触发；
* `FileReader.onerror`: 读取操作发生错误时触发；
* `FileReader.onload`: 读取操作完成时触发；
* `FileReader.onloadstart`: 读取操作开始时触发；
* `FileReader.onloadend`: 读取操作结束时（成功或者失败）触发；
* `FileReader.onprogress`: 读取 [Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 时触发；

### 使用
* `FileReader` 读取 `file` 文件
```js
<!-- <input type="file" onchange="onChange(event)" /> -->
function onChange (evt) {
    var file = evt.target.files[0];
    var fileReader = new FileReader();
    fileReader.onload = function () {
        console.log(this.result);
    }
    fileReader.readAsText(file);
}
```

* `FileReader` 读取 `blob` 文件
```js
var buffer = new ArrayBuffer(32);
var typedArray = new Int8Array(buffer);
<!-- 操作二进制文件 -->
typedArray[0] = 97;
var blob = new Blob([typedArray], {type: 'application/octet-binary'});
var fileReader = new FileReader();
fileReader.addEventListener('loadend', function (evt) {
    console.log(evt.target.result);
});
fileReader.readAsText(blob);
```

* 'blob' 转化为 `typedArray`: 如果要把blob文件转化为二进制的数据的话，要先把blob转化为arraybuffer，然后再使用typedArray才可以编辑二进制数据；
```js
var buffer = new ArrayBuffer(32);
var typedArray = new Int8Array(buffer);
typedArray[0] = 97;
var blob = new Blob([typedArray], {type: 'application/octet-binary'});
var fileReader = new FileReader();
fileReader.addEventListener('loadend', function (evt) {
    var result = evt.target.result;
    console.log(result);
    var typedArray = new Int8Array(result);
    console.log(typedArray);
});
fileReader.readAsArrayBuffer(blob);
```

### 引用
* MDN：[FileReader](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)
