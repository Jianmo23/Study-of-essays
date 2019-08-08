- 标签： `网络请求`
- 时间： `2019-08-08`
- 更新： ``

## `Access-Control-Max-Age`
> 因为浏览器的同源策略，浏览器会限制从脚本发起的跨域 HTTP 请求（如异步请求GET, POST, PUT, DELETE, OPTIONS等），因此浏览器会向所请求的服务器发起两次请求，第一次是浏览器使用 OPTIONS 方法发起一个预检请求（preflight request）用来获知服务器是否允许该跨域请求：允许则发起第二次真正的请求；不允许则拦截第二次请求。第二次才是真正的异步请求。

`Access-Control-Max-Age` 这个响应首部表示 `preflight request`（预检请求）的返回结果（即 `Access-Control-Allow-Methods` 和 `Access-Control-Allow-Headers` 提供的信息）可以被缓存多久。

`Access-Control-Max-Age` 用来指定预检请求的有效期，单位为秒，在此期间不用发出另一条预检请求。

在 Firefox 中，上限是 24 小时（即 86400 秒）。

在 Chromium 中则是 10 分钟（即 600 秒），Chromium 同时规定了一个默认值 5 秒。

如果值为 -1，则表示禁用缓存，每一次请求都需要提供预检请求，即用 OPTIONS 请求进行检测

**注意：
`Access-Control-Max-Age` 的设置针对完全一样的 url，如果url加上路径参数，其中一个 url 的 `Access-Control-Max-Age` 设置对另一个 url 没有效果！！！**