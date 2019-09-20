# 前端路由
## 主要有以下两种实现方案：
- [Hash](https://github.com/ZYY1923/Study-of-essays/blob/master/%E5%89%8D%E7%AB%AF%E8%B7%AF%E7%94%B1/hash.md)

- [History](https://github.com/ZYY1923/Study-of-essays/blob/master/%E5%89%8D%E7%AB%AF%E8%B7%AF%E7%94%B1/history.md)

## 缺陷
- 使用浏览器的前进，后退键时会重新发送请求，来获取数据，没有合理地利用缓存。

## 两种模式对比

| 对比点 | Hash 模式 | History 模式 |
|:-----:|:--------:|:-----------:|
| 美观性 | 带着 # 字符，较丑 | 简洁美观 |
| 兼容性 | >= ie 8，其它主流浏览器 | >= ie 10，其它主流浏览器 |
| 实用性 | 不需要对服务端做改动	 | 需要服务端对路由进行相应配合设置 |
