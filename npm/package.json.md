* 时间：`2019-05-22`
* 运行环境： `macOS 10.14.4  chrome 版本 73.0.3683.86（正式版本)`
* NodeJS：`node v9.0.0  npm v6.7.0`
* 更新时间： ``

本篇只介绍 `package.json` 中各字段的含义，用于个人学习；具体的注意事项暂且不提，可根据具体某一个字段查询。引用文件里也有介绍
```js
{
    /* 用于发布 package 的包名 */
    "name": "",
    /* 用于发布 package 的版本号 */
    "version": "",
    /* 备注：
     * name（包名） 和 version（版本号） 共同组成了一个被认为是完全唯一的标识符。
     * package 的更改应该伴随着 version（版本号）的更改
     * 如果不计划发布 package，name 和 version 字段是可选的
     */

     /* description 字段用于添加描述。是一个字符串。这有助于人们发现你的 package，当使用 npm search 时，它会在其中列出这个信息。*/
     "description": "",
     /* keywords 用于放置关键字。它可以是一个字符串数组。这有助于人们发现你的 package，当使用 npm search 时，它会在其中列出这个信息。*/
     "keywords": [],
     /*项目主页的 url*/
     "homepage": "",
     /* 项目 issue 提交的地址 url 和 / 或报告问题的 email 地址。这些对那些使用了你的包但是遇到问题的人很有帮助。*/
     /* 可以指定一个或两个值。 如果只想提供 url，可以将 “bugs” 的值指定为简单字符串而不是对象。
       如果提供了 url，npm bugs <package-name> 命令将会使用这个 url。*/
     "bugs": {
         "url": "https://github.com/owner/project/issues",
         "email": "project@hostname.com"
     },
     /* 许可证，这样人们就知道他们是否允许使用这个 package，以及你对你的 package 的任何限制。*/
     /* 如果你不希望授予他人任何条款下使用私有的或未发布包的权利："license": "UNLICENSED" */
     /* 还可以考虑设置 “private”: true 以防止意外发布 */
     "license": "",
     /* 开发人员 */
     /* email 和 url 都是可选的 */
     /* npm 还用你的 npm 用户信息设置顶级“维护者”字段。 */
     /* 可以将这些缩短为一个字符串，npm 会为你解析它:
     "name <email> (url)" */
     "author": {
         "name": "",
         "email": "",
         "url": ""
     },
     /* 开发人员数组 */
     "contributors": [],
     /* 可选的 files 字段是一个文件模式数组，描述了将 package 作为依赖项安装时要包含的条目。
        详情看 [引用2] */
     "files": "",
     /* main 字段是模块的 ID，是程序的主要入口。是一个文件路径 */
     /* 对于大多数模块来说，拥有一个 main 字段指定的主要入口是最有意义的，通常不会有太多其他内容。 */
     "main": "",
     /* 如果您的模块要在客户端使用，则应使用浏览器字段而不是 main 字段。 这有助于提示用户它可能依赖于 Node.js 模块中不可用的基元 */
     "browser": "",
     /* 该字段是命令名到本地文件名的映射。 在安装时，npm 会将该文件符号链接到用于全局安装的 prefix(前缀)/bin，
        或者用于本地安装的 ./node_modules/.bin/ 详情看 [引用2] */
     "bin": "",
     /* 指定单个文件或一个文件名数组以供 linux 下的 man 程序查找文档地址。 */
     "man": "",
     /*
      * directories.lib 指定 lib 文件位置，lib 文件夹没有任何特殊功能，但它是有用的元信息。
      * directories.bin 详情看 [引用2]
      * directories.man
      * directories.doc
      * directories.example
      * directories.test
      */
     "directories": {},
     /* 指明你的代码被托管在何处，这对那些想要参与到这个项目中的人来说很有帮助。如果 git 仓库在 github 上，用 npm docs 命令将会找到你。 */
     /* url 应该是公开且可用的(可能是只读的)，这个 url 应该可以被版本控制系统不经修改地处理。不应该是一个在浏览器中打开的 html 项目页面，这个 url 是给计算机使用的。 */
     "repository": {
         "type": "git",
         "url": "https://github.com/npm/cli.git"
     },
     /* “scripts” 属性是一个包含脚本命令的字典，这些命令在包的生命周期中的不同时间运行。 key 是生命周期事件，value 是运行的命令。 */
     "scripts": {},
     /* “config” 对象可用于设置 scripts 中使用的配置参数，这些参数在升级过程中保持不变。npm config set/get name:key */
     "config": {},
     /* dependencies 是一个对象，指定了依赖项包名和其版本范围的映射。版本范围是一个字符串，其中包含一个或多个空格分隔的描述符。
        dependencies 也可以使用压缩包或 git URL 来识别依赖关系。 详情看 [引用2] */
     "dependencies": {},
     /* 用来放置别人在下载和使用你的模块时，可能不希望或不需要下载和构建你使用的外部测试或文档框架。 */
     "devDependencies": {},
     /* 有时候你希望表示程序包与主机工具或库的兼容性，而不一定要求此主机。就是做一些插件开发，它们往往是在核心依赖库的某个版本的基础上开发的 详情看 [引用2] */
     "peerDependencies": {},
     /* 这定义了发布包时要捆绑的包名数组。
        如果您需要在本地保存 npm 包或通过单个文件下载使它们可用，您可以通过在 bundledDependencies 数组中指定包名并执行 npm pack，将包打包到压缩文件中。 */
     "bundledDependencies": [],
     /* 如果可以使用依赖项，但是如果无法找到或无法安装，您希望 npm 继续，那么您可以将它放在 optionalDependencies 对象中。
        这是包名称到版本或 URL 的映射，就像 dependencies 对象一样。 不同之处在于构建失败不会导致安装失败。
        optionalDependencies 中的条目将覆盖 dependencies 中相同名称的条目，因此通常最好只放在一个位置。 */
     "optionalDependencies": {},
     /* 指定你的项目运行环境所使用的 node 或者 npm 版本 */
     /* 除非用户设置了 engine-strict 配置标志，否则此字段仅供参考，并且仅在将在你的包安装为依赖项时才会产生警告。 */
     "engines": {
         "node": "",
         "npm": ""
     },
     /* 指定模块将在哪些操作系统上运行
       也可以使用操作系统黑名单来替代白名单，只要在前面加个’!’
       主机操作系统由 process.platform 确定 */
     "os": ["linux", "!win32"],
     /* 如果你的代码只在某些 cpu 架构上运行，你可以指明是哪些个。
        和 os 一样，你可以使用黑名单
        cpu 架构可以由 process.arch 确定 */
     "cpu": [],
     /* 如果你在 package.json 中设置 “private”: true，那么 npm 就会拒绝发布它。
       这个一个防止意外发布私有仓库的方法。如果你希望确保给定的包只发布到特定的注册表（例如，内部注册表），那么使用下面描述的 publishConfig 字段在发布时覆盖 registry 配置参数。  */
     "private": true,
     /* 这是一组在发布时将会用的配置集合 */
     "publishConfig": {}
}
```

## 引用
* [npm-package.json](https://docs.npmjs.com/files/package.json)
* [译：npm 的 package.json 处理的细节](https://linxiaoru.github.io/2018/12/24/npm-%E7%9A%84-package-json-%E5%A4%84%E7%90%86%E7%9A%84%E7%BB%86%E8%8A%82/)
* [npm 中文文档](https://www.npmjs.com.cn/)
