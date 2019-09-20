# 前端路由
## History 模式
hash 虽然也很不错，但使用时都需要加上 `#`，并不是很美观。因此到了 HTML5，又提供了 History API 来实现 URL 的变化。其中做最主要的 API 有以下两个：
- `history.pushState()`: 新增一个历史记录

- `history.repalceState()`: 替换当前的历史记录

**这两个 API可以在不进行刷新的情况下，操作浏览器的历史纪录。**


特点：
- `pushState` 和 `repalceState` 的标题（第二个参数）：一般浏览器会忽略，最好传入 `null`；

- 可以使用 `popstate` 事件来监听 url 的变化；

- `history.pushState()` 或 `history.replaceState()` 不会触发 `popstate` 事件，需要手动触发页面渲染；

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

class HistoryRouter extends BaseRouter {
    constructor (list) {
        super(list);

        this.handler();

        window.addEventListener('popstate', function (e) {
            this.handler();
        }, false)
    }
    handler () {
        this.render(this.getState());
    }
    getState () {
        return location.pathname || '/';
    }
    push (path) {
        window.history.pushState(null, null, path);
        // 手动触发
        this.handler();
    }
    replace (path) {
        window.history.replaceState(null, null, path);
        // 手动触发
        this.handler();
    }
    go (n) {
        window.history.go(n);
    }
}
```

## 引用
- [前端路由原理](https://github.com/fengshi123/blog/issues/12)