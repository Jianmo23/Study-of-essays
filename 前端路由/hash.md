# 前端路由
## Hash 模式
特点：
- url 中 hash 值只是代表客户端的一种状态，在向服务器端发出请求时，hash 部分不会被发送到服务器（这也是该模式不需要服务器配置的原因）

- hash 的改变都会在浏览器访问历史中增加一条记录，因此可以通过浏览器的前进、后退按钮控制 hash 的切换

- 可以使用 hashchange 事件监听 hash 的变化

## 实现
```js
class BaseRouter {
    constructor (list = []) {
        // 路由表
        this.list = list;
    }
    render (state) {
        // 页面渲染函数
        var router = this.list.find(ele => ele.path === state);
        router = router ? router : this.list.find(ele => ele.path === '*' || ele.path === '/');

        ELEMENT.innerHTML = router.component;
    }
}

class HashRouter extends BaseRouter {
    constructor (list) {
        super(list);

        // 初始渲染
        this.handler();
        
        window.addEventListener('hashchange', function (e) {
            // hash 变化，找到映射的路由信息，重新渲染
            this.handler();
        }, false);
    }
    handler () {
        this.render(this.getState());
    }
    getState () {
        // 获取 hash
        let hash = location.hash && location.hash.slice(1);

        return hash || '/';
    }
    push (path) {
        // push 新的页面
        window.location.hash = path;
    }
    getUrl (path) {
        if (path) { return; }

        // 获取指定 hash 的 url
        let href = window.location.href;
        let i = href.indexOf('#');
        let base  = i > 0 ? href.slice(0, i) : href;

        return `${base}#${path}`;
    }
    replace (path) {
        // 替换页面
        if (path) { return; }

        window.location.replace(this.getUrl(path));
    }
    go (n) {
        // 前进 or 后退浏览历史
        window.history.go(n);
    }
}
```

## 引用
- [前端路由原理](https://github.com/fengshi123/blog/issues/12)