# 2019.11.11

## **参考vue-cli脚手架配置修改devtool**

dev --- devtool: "cheap-module-eval-source-map"

prod --- devtool: '#source-map',

## **优化webpack配置**

1. devServer配置更新

    ```js

    devServer: {
        /*新增*/
        clientLogLevel: 'warning',
        overlay: { warnings: false, errors: true },
        //启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
        quiet: true, 
        watchOptions: {
            poll: false,
        },
        compress: true,
        /*新增结束*/
        contentBase: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        host: "localhost",
        port: "8090",
        overlay: true, // 浏览器页面上显示错误
        // open: true, // 开启浏览器
        inline: true,//实时刷新
        // hot: true,//热加载
        // hotOnly:true
    },

    ```

2. 安装Webpack友好的错误提示插件friendly-errors-webpack-plugin

    ```base
    cnpm install friendly-errors-webpack-plugin --save-dev
    ```

    基本用法

    ```js
    const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

    var webpackConfig = {
    // ...
    plugins: [
        new FriendlyErrorsWebpackPlugin(),
    ],
    // ...
    }
    ```



# 2019.9.16

## **html修改后无法自动刷新的问题**
试着将hot注释了就可以了(应该有其它更好的办法)
```
 devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    host: "localhost",
    port: "8090",
    overlay: true, // 浏览器页面上显示错误
    // open: true, // 开启浏览器
    inline: true,//实时刷新
    // hot: true,//热加载
    // hotOnly:true
},
```


## **修复html中引入copy的静态资源目录static中的图片路径报错的问题**
参考[html-withimg-loader](https://www.npmjs.com/package/html-withimg-loader)中的查询参数

query.exclude 匹配该参数的图片路径不进行处理。例如：

{test: /.html$/, loader: 'html-withimg-loader?exclude=/upload/'},

则如：src="/upload/head.png"这个图片路径将不会被处理。暂不支持正则表达式字符串。

query.min 默认会去除html中的换行符，配置min=false可不去除

query.deep deep=false将关闭include语法嵌套子页面的功能

require('html-withimg-loader?min=false!xxx.html');
#### **修改内容**

1. 在html-withimg-loader后增加查询参数如下：
```
{ 
    loader: 'html-withimg-loader?exclude=/static/',
},
```
2.在html中引用静态资源(注意使用绝对路径，且static前需要加上斜杆“/”)
```
<img src="/static/sds.jpg" alt="">
```
---
# 2019.9.10

## **区分assets和static**

1、static目录下的文件会被直接复制到最终的打包目录下面（默认是 dist/static ），且必须使用绝对路径来引用这些文件。static中建议放一些外部第三方，自己的文件放在assets，别人的放在static中

2、assets 中的文件会经过 webpack 打包，重新编译；

注意：若把图片放在assets和static中，html页面中都可以使用；
   但是在动态绑定中，assets路径的图片会加载失败，
   因为webpack使用的是 ` commenJS ` 规范，必须使用require才可以

---
## **修复使用图片懒加载后无法打包data-src中的图片;我的图片懒加载使用的是lazysizes.js**
```
//安装html-loader
cnpm i -D html-loader
```
```
{
    test: /\.(html)$/,
    use: {
        loader: 'html-loader',
        options:{
            attrs: ['img:src', 'img:data-src']
        }
    }
},
```

## **增加路径别名配置**
```
resolve: {
    alias: {
        "@":path.resolve(__dirname, "../src"),
    }
},
```
---
# 2019.8.21

## **修复打包文件过大**
```
//修改devtool为 'cheap-source-map'
devtool: 'cheap-source-map',
```
## **修复消除冗余的css代码时样式丢失的问题**
```
//更改purifyCssWebpack配置的路径
// 消除冗余的css代码
new purifyCssWebpack({
    paths: glob.sync(path.join(__dirname, "../src/**/*.html"))
}),
```
---
# 2019.8.21
## **修复html-loader引用公共部分失败的bug**
  使用 html-withimg-loader 替代 html-loader来引用公共html代码
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