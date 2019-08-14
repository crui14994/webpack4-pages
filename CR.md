#### 消除冗余的css(需要引入一个额外包glob用于扫描路径)
```
cnpm i purifycss-webpack   purify-css  -D
const PurifyCssWebpack  = require('purifycss-webpack');
```
```
 // 在plugins中配置
 new purifyCssWebpack({
    paths: glob.sync(path.join(__dirname, "../src/pages/*/*.html"))
 }),
```
---

#### 压缩 js
```
cnpm install uglifyjs-webpack-plugin --save-dev
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
```
```
 // 在optimization中配置
optimization: {
   minimizer: [
      new UglifyJsPlugin({
            cache: true,
            parallel: true,
            // sourceMap: true // set to true if you want JS source maps
      }),
   ]
},
```
---
#### 压缩 CSS
```
cnpm i -D optimize-css-assets-webpack-plugin
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
```
```
 // 在optimization中配置
optimization: {
   minimizer: [new OptimizeCSSAssetsPlugin({})]
}
```

---
#### 清理 dist 目录
每次构建，我们的 /dist 文件夹都会保存生成的文件，然后就会非常杂乱。

通常，在每次构建前清理 /dist 文件夹，是比较推荐的做法
```
cnpm install clean-webpack-plugin --save-dev
const CleanWebpackPlugin = require('clean-webpack-plugin');
```
```
 // 在plugins中配置
new cleanWebpackPlugin(['dist'], {
   root: path.resolve(__dirname, '../'), //根目录
   // verbose Write logs to console.
   verbose: true, //开启在控制台输出信息
   // dry Use boolean "true" to test/emulate delete. (will not remove files).
   // Default: false - remove files
   dry: false,
}),
```

---
#### 加载图片与图片优化
在css引入图片运行打包发现如下错误：

```
ERROR in ./src/assets/images/test.jpg 1:0
Module parse failed: Unexpected character '�' (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
(Source code omitted for this binary file)
```
解决方案：file-loader处理文件的导入
```
cnpm install --save-dev file-loader
```
```
 // 在rules中配置
{
 test: /\.(png|svg|jpg|gif)$/,
 use: [
    'file-loader'
 ]
}
```

更进一步处理图片成 base64
```
cnpm install --save-dev url-loader
```
```
 // 在rules中配置
{
   test: /\.(png|svg|jpg|gif|jpeg|ico|woff|woff2|eot|ttf|otf)$/,
   use: [
      {
            loader: "url-loader",
            options: {
               limit: 5 * 1024, //小于这个时将会已base64位图片打包处理
               // 图片文件输出的文件夹
               publicPath: "../images",
               outputPath: "images"
            }
      }
   ]
}
```
---
#### 字体的处理（同图片）
由于 css 中可能引用到自定义的字体，处理也是跟图片一致。
```
 // 在rules中配置
{
   test: /\.(woff|woff2|eot|ttf|otf)$/,
   use: [
      'file-loader'
   ]
}
```