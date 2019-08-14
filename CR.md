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