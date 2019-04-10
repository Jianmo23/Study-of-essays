## 常见的web攻击方式
* XSS：跨站脚本攻击
* CSRF: 跨站请求伪造

## XSS (Cross Site Scripting)
```
XSS(Cross Site Scripting)跨站脚本攻击，为了不和层叠样式表(Cascading Style Sheets, CSS)的缩写混淆，故将跨站脚本攻击缩写为XSS。恶意攻击者往Web页面里插入恶意Script代码，当用户浏览该页之时，嵌入其中Web里面的Script代码会被执行，从而达到恶意攻击用户的目的。
```

### 引用
* [XSS跨站脚本攻击](https://www.cnblogs.com/phpstudy2015-6/p/6767032.html)

## CSRF (Cross Site Request Forgery)
```
CSRF（Cross-site request forgery）跨站请求伪造，也被称为“One Click Attack”或者Session Riding，通常缩写为CSRF或者XSRF，是一种对网站的恶意利用。尽管听起来像跨站脚本（XSS），但它与XSS非常不同，XSS利用站点内的信任用户，而CSRF则通过伪装成受信任用户的请求来利用受信任的网站。与XSS攻击相比，CSRF攻击往往不大流行（因此对其进行防范的资源也相当稀少）和难以防范，所以被认为比XSS更具危险性。
```

### 影响因素
CSRF攻击依赖下面的假定：
* 攻击者了解受害者所在的站点
* 攻击者的目标站点具有持久化授权cookie或者受害者具有当前会话cookie
* 目标站点没有对用户在网站行为的第二授权

### CSRF防御
* 通过 referer、token 或者 验证码 来检测用户提交
* 尽量不要在页面的链接中暴露用户隐私信息
* 对于用户修改删除等操作最好都使用post 操作
* 避免全站通用的cookie，严格设置cookie的域