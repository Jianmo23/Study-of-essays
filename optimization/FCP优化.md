- 标签： `优化`
- 时间： `2019-08-08`
- 更新： ``

## FCP 优化
> FCP (First Screen Rendering Time) 首屏渲染时间

优化首屏渲染时间这个指标，可以减少白屏时间，具体措施如下：
* 加速或减少 HTTP 请求损耗：
  
  - 使用 CDN 加载公用库，使用强缓存和协商缓存；
  
  - 使用域名收敛，小图片使用 base64 代替；
  
  - 使用 GET 请求代替 POST 请求，设置 `Access-Control-Max-Age` 减少预检请求；
  
  - 页面内跳转其他域名或请求其他域名的资源时使用浏览器 `prefetch` 预解析；
  
* 延迟加载：

  - 非重要的库、非首屏图片延迟加载；
  
  - SPA 组件懒加载；

* 减少请求内容的体积：
  
  - 开启服务器 Gzip 压缩，JS、CSS文件压缩合并；
  
  - 减少 cookie 大小；
  
  - SSR (Server Side Render) 直接输出渲染后的 HTML;

* 浏览器渲染原理：
  
  - 优化关键渲染路径，尽可能减少阻塞渲染的JS、CSS；
  
* 优化用户体验：

  - 白屏使用加载进度条、loading图、骨架屏代替；

## 引用
* [公众号：前端下午茶 前端骨架屏注入实践](https://mp.weixin.qq.com/s/j2XzwLPnalDCNaKkfjH-0Q)