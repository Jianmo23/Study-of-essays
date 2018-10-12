- 标签 `CSS`
- 时间 `2018-10-12`
- 更新 ``

## position 属性值简介
![GitHub set up](https://github.com/ZYY1923/Study-of-essays/blob/master/css/imgs/position属性值简介.jpeg)

* 直接用例子说话，本文测试使用设备： Mac， Google Chrome 版本 69.0.3497.100（正式版本）

### 首先交代下基础样式
```
<style>
    *, *::after, *::before {
    	margin: 0;
    	padding: 0;
    }
    .f0 {
    	font-size: 0 !important;
    }
    .wrap {
    	border: 1px solid #f40;
    	text-align: center;
    }
    .p15 {
    	padding: 15px;
    }
    .relative {
    	position: relative;
    }
    .absolute {
    	position: absolute;
    }
    .fixed {
    	position: fixed;
    }
    .fl {
    	float: left;
    }
    .fr {
    	float: right;
    }
    .clear {
    	clear: both;
    }
    .box {
    	width: 33.3%;
    	line-height: 4;
    }
    .box1 {
    	background-color: #ff0000;
    }
    .box2 {
    	background-color: #00ff00;
    }
    .box3 {
    	background-color: #0000ff;
    }
    .big {
    	width: 200px;
    	height: 200px;
    	border: 5px solid #000;
    	padding: 10px;
    }
    .small {
    	width: 50px;
    	height: 50px;
    	border: 5px solid #000;
    	padding: 10px;
    }
</style>
```

* 默认 position: static

```
<p class="p15">默认 position: static;</p>
<div class="f0 wrap">
	<span class="box box1">box1</span>
	<span class="box box2">box2</span>
	<span class="box box3">box3</span>
</div>
```
![GitHub set up](https://github.com/ZYY1923/Study-of-essays/blob/master/css/imgs/position-static.jpg)

正常的文档流，没问题，不过明明设置了宽度，为什么没有作用？原因是内联元素无法设置宽高，有没有办法那，请往下看！

* position: relative

```
<p class="p15">position: relative;</p>
<div class="f0 wrap">
	<span class="box box1">box1</span>
	<span class="box box2 relative" style="left: 10px;top:50%">box2</span>
	<span class="box box3">box3</span>
</div>
```
![GitHub set up](https://github.com/ZYY1923/Study-of-essays/blob/master/css/imgs/position-relative.jpg)

可以看出，relative 定位是相对于正常文档流中位置偏移的.不过为什么top设置百分比偏移量不起作用那？原因是父元素没有设置确定的高度，尝试设置高度看一下效果吧

* position: absolute

```
<p class="p15">position: absolute;</p>
<div class="f0 wrap relative">
	<span class="box box1">box1</span>
	<span class="box box2 absolute" style="left: 10px;top:50%">box2</span>
	<span class="box box3">box3</span>
</div>
```
![GitHub set up](https://github.com/ZYY1923/Study-of-essays/blob/master/css/imgs/position-absolute.jpg)

从效果可以看出：absolute 定位是根据最近一级非static定位父元素来偏移的；还有那？宽度起作用了，so，方法一

* position: fixed;

fixed 定位没什么可说的，根据浏览器视口设置偏移量，不过IOS系统暂不支持该语法；

*重点来了，她们之间有什么影响那*

* relative, absolute 设置百分比偏移量

```
<p class="p15">relative, absolute 设置百分比偏移量</p>
<div class="box1 relative big">
	<div class="box2 absolute small" style="left:100%;top:100%"></div>
</div>
```
![GitHub set up](https://github.com/ZYY1923/Study-of-essays/blob/master/css/imgs/position-relative-absolute.jpg)

看出什么了？ 当存在边框，内边距时，absolute 100%偏移时不包含边框，只是相对于 content 进行偏移！

* absolute, absolute 设置百分比偏移量

```
<p class="p15">absolute, absolute 设置百分比偏移量</p>
<div class="box1 absolute big">
	<div class="box2 absolute small" style="left:100%;top:100%"></div>
</div>
```
![GitHub set up](https://github.com/ZYY1923/Study-of-essays/blob/master/css/imgs/position-absolute-absolute.jpg)

同上！当存在边框，内边距时，absolute 100%偏移时不包含边框，只是相对于 content 进行偏移！

### 总结

* relative 定位时 如果设置百分比偏移量，记得在父元素设置确定的高度；
* 定位之间配合使用时，注意偏移的基准线在哪；
* 内联元素设置宽高要使其生效，absolute, fixed 定位不失为一种方法，其他方法诸如：display: inline-block/block; float, 

### 引用

* [CSS 最核心的几个概念](https://mp.weixin.qq.com/s/3YSAX8SRU6H6VuXHqyUVUQ)

[demo 传送门](https://github.com/ZYY1923/Study-of-essays/blob/master/css/imgs/demo-position.html)






