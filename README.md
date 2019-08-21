#### 2019.8.21
1. 修复打包文件过大
2. 修复消除冗余的css代码时样式丢失的问题

修复打包文件过大
```
//修改devtool为 'cheap-source-map'
devtool: 'cheap-source-map',
```
修复消除冗余的css代码时样式丢失的问题
```
//更改purifyCssWebpack配置的路径
// 消除冗余的css代码
new purifyCssWebpack({
    paths: glob.sync(path.join(__dirname, "../src/**/*.html"))
}),
```
---
#### 2019.8.21
1. 使用 html-withimg-loader 替代 html-loader
```
//修改html-webpack-plugin的配置
//template: `./src/pages/${name}/index.html`,

template: 'html-withimg-loader!'+path.resolve(__dirname,  `../src/pages/${name}/index.html`),
```
```
//修改html的引入方式
//<%= require('html-loader!../../common/header.html') %> 

#include("../../common/header.html")
```
参考：
[url-loader不能处理html中引入的图片问题的解决方案](https://blog.csdn.net/logan_LG/article/details/82082442)
[npm地址](https://www.npmjs.com/package/html-withimg-loader)