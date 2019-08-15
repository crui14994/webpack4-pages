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
cnpm install image-webpack-loader --save-dev
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
      },
      {
            loader: 'image-webpack-loader', // 进行图片优化
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

---
#### webpack4.x 提取公共代码
当一部分代码需要反复被用到，反复请求浪费资源，将公共代码 抽离，需要时读取缓存即可

webpack4 最大的改动就是废除了CommonsChunkPlugin 引入了 optimization.splitChunks
```
//splitChunks//常用配置
splitChunks: {
    chunks: "async”,//默认作用于异步chunk，值为all/initial/async/function(chunk),值为function时第一个参数为遍历所有入口chunk时的chunk模块，chunk._modules为chunk所有依赖的模块，通过chunk的名字和所有依赖模块的resource可以自由配置,会抽取所有满足条件chunk的公有模块，以及模块的所有依赖模块，包括css
    minSize: 30000,  //表示在压缩前的最小模块大小,默认值是30kb
    minChunks: 1,  // 表示被引用次数，默认为1；
    maxAsyncRequests: 5,  //所有异步请求不得超过5个
    maxInitialRequests: 3,  //初始话并行请求不得超过3个
   automaticNameDelimiter:'~',//名称分隔符，默认是~
    name: true,  //打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔
    cacheGroups: { //设置缓存组用来抽取满足不同规则的chunk,下面以生成common为例
       common: {
         name: 'common',  //抽取的chunk的名字
         chunks(chunk) { //同外层的参数配置，覆盖外层的chunks，以chunk为维度进行抽取
         },
         test(module, chunks) {  //可以为字符串，正则表达式，函数，以module为维度进行抽取，只要是满足条件的module都会被抽取到该common的chunk中，为函数时第一个参数是遍历到的每一个模块，第二个参数是每一个引用到该模块的chunks数组。自己尝试过程中发现不能提取出css，待进一步验证。
         },
        priority: 10,  //优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中
       minChunks: 2,  //最少被几个chunk引用
       reuseExistingChunk: true，//  如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
       enforce: true  // 如果cacheGroup中没有设置minSize，则据此判断是否使用上层的minSize，true：则使用0，false：使用上层minSize
       }
    }
}
```
1. chunks: 表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
2. minSize: 表示在压缩前的最小模块大小，默认是30kb；
3. minChunks: 表示被引用次数，默认为1；
4. maxAsyncRequests: 最大的按需(异步)加载次数，默认为1；
5. maxInitialRequests: 最大的初始化加载次数，默认为1；
6. name: 拆分出来块的名字(Chunk Names)，默认由块名和hash值自动生成，如果是true，将自动生成基于块和缓存组键的名称。如果是字符串或函数将允许您使用自定义名称。如果名称与入口点名称匹配，则入口点将被删除。
7. automaticNameDelimiter:'',名称分隔符，默认是
8. cacheGroups: 缓存组。

在此次多页配置中配置如下：
```
optimization: {
        splitChunks: {  //分割代码块
            cacheGroups: {  
               //抽离自己编写的脚本的公共代码（css，js）
                commons: {  //公共模块 
                    name: "commons",
                    chunks: "initial",  //入口处开始提取代码
                    minSize: 0,      //代码最小多大，进行抽离
                    minChunks: 2,    //代码复 2 次以上的抽离
                },
                vendor: {   
                   // 抽离第三方插件
                    test: /node_modules/,   // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor',  // 打包后的文件名，任意命名    
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10
                }
            }
        }
    },
```
修改多页面配置的chunks为
```
Object.keys(entrys).forEach(function (element) {
    htmlArray.push({
        _html: element,
        title: '',
        //增加'vendor','commons'
        chunks: ['vendor','commons', element]
    })
})
```