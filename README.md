## 2019.9.10
1. 区分assets和static
2. 修复使用图片懒加载后无法打包data-src中的图片
3. 增加路径别名配置

>### 区分assets和static

1、static目录下的文件会被直接复制到最终的打包目录下面（默认是 dist/static ），且必须使用绝对路径来引用这些文件。static中建议放一些外部第三方，自己的文件放在assets，别人的放在static中

2、assets 中的文件会经过 webpack 打包，重新编译；

注意：若把图片放在assets和static中，html页面中都可以使用；
   但是在动态绑定中，assets路径的图片会加载失败，
   因为webpack使用的是 ` commenJS ` 规范，必须使用require才可以

---
>### 修复使用图片懒加载后无法打包data-src中的图片;我的图片懒加载使用的是lazysizes.js
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

> ### 增加路径别名配置
```
resolve: {
    alias: {
        "@":path.resolve(__dirname, "../src"),
    }
},
```
---
## 2019.8.21
1. 修复打包文件过大
2. 修复消除冗余的css代码时样式丢失的问题

>### 修复打包文件过大
```
//修改devtool为 'cheap-source-map'
devtool: 'cheap-source-map',
```
>### 修复消除冗余的css代码时样式丢失的问题
```
//更改purifyCssWebpack配置的路径
// 消除冗余的css代码
new purifyCssWebpack({
    paths: glob.sync(path.join(__dirname, "../src/**/*.html"))
}),
```
---
## 2019.8.21
>### 修复html-loader引用公共部分失败的bug
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