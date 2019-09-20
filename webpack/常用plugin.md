列举常用的 webpack plugin：

- `CommonsChunkPlugin`: 将 chunks 相同的模块代码提取成公共js

- `CleanWebpackPlugin`: 清理构建目录 

- `ExtractTextWebpackPlugin`: 将 css 文件从 bundle 文件里提取成一个独立的 css 文件 

- `CopyWebpackPlugin`: 将文件或者文件夹拷贝到构建的输出目录中 

- `HtmlWebpackPlugin`: 创建 html 文件去承载输出的 bundle 

- `UglifyjsWebpackPlugin`: 压缩 js 

- `ZipWebpackPlugin`: 将打包出的资源生成 zip 包 
