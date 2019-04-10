* <script src="script.js"></script>

没有 defer 或 async，浏览器会立即加载并执行指定的脚本，“立即”指的是在渲染该 script标签之下的文档元素之前，也就是说不等待后续载入的文档元素，读到就加载并执行,会中断后续文档内容的加载；

* <script async src="script.js"></script>

有 async，异步加载脚本，等加载完毕后会立即执行脚本内容，此时会中断html文档的渲染，等待脚本执行完毕后继续渲染html文档内容

* <script defer src="myscript.js"></script>

有 defer，加载后续文档元素的过程将和 script.js 的加载并行进行（异步），但是 script.js 的执行要在所有元素解析完成之后，DOMContentLoaded 事件触发之前完成。

* 一句话，`defer` 是“渲染完再执行”，`async` 是“下载完就执行”。另外，如果有多个 `defer` 脚本，会按照它们在页面出现的顺序加载，而多个 `async` 脚本是不能保证加载顺序的。*

