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