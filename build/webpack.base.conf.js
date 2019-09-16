const path = require('path');
const webpack = require("webpack");
const glob = require("glob"); //glob，这个是一个全局的模块，动态配置多页面会用得着
// html模板
const htmlWebpackPlugin = require("html-webpack-plugin");
//静态资源输出
const copyWebpackPlugin = require("copy-webpack-plugin");

// 获取ruls
const rules = require("./webpack.rules.conf.js");

// 获取html-webpack-plugin参数的方法
let getHtmlConfig = function (name, chunks) {
    return {
        // template: 'html-withimg-loader!'+path.resolve(__dirname,  `../src/pages/${name}/index.html`),
        template: path.resolve(__dirname, `../src/pages/${name}/index.html`),
        filename: `${name}.html`,
        inject: true,
        hash: true, //开启hash  ?[hash]
        chunks: chunks,
        minify: process.env.NODE_ENV === "development" ? false : {
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: true, //折叠空白区域 也就是压缩代码
            removeAttributeQuotes: true, //去除属性引用
        },
    };
};

//动态添加入口
function getEntry(PAGES_DIR) {
    var entry = {};
    //读取src目录所有page入口
    glob.sync(PAGES_DIR + '**/*.js').forEach(function (name) {
        var start = name.indexOf('pages/') + 4;
        var end = name.length - 3;
        var eArr = [];
        var n = name.slice(start, end);
        n = n.split('/')[1];
        eArr.push(name);
        eArr.push('babel-polyfill');//引入这个，是为了用async await，一些IE不支持的属性能够受支持，兼容IE浏览器用的
        entry[n] = eArr;
    })
    return entry;
}
let entrys = getEntry('./src/pages/');

module.exports = {
    entry: entrys,
    module: {
        rules: [...rules]
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "../src"),
        }
    },
    plugins: [
        //静态资源输出
        new copyWebpackPlugin([{
            from: path.resolve(__dirname, "../static"),
            to: 'static',
            ignore: ['.*']
        }]),
    ],
    optimization: {
        splitChunks: {  //分割代码块
            cacheGroups: {  //缓存组 缓存公共代码
                commons: {  //公共模块 
                    name: "commons",
                    chunks: "initial",  //入口处开始提取代码
                    minSize: 0,      //代码最小多大，进行抽离
                    minChunks: 2,    //代码复 2 次以上的抽离
                },
                vendor: {   // 抽离第三方插件
                    test: /node_modules/,   // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor',  // 打包后的文件名，任意命名    
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10
                },
            }
        }
    },
}

//修改自动化配置页面
var htmlArray = [];
Object.keys(entrys).forEach(function (element) {
    htmlArray.push({
        _html: element,
        title: '',
        chunks: ['vendor', 'commons', element]
    })
})

//自动生成html模板
htmlArray.forEach((element) => {
    module.exports.plugins.push(new htmlWebpackPlugin(getHtmlConfig(element._html, element.chunks)));
})