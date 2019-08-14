const path = require('path');
const webpack = require("webpack");
const glob = require("glob");
// html模板
const htmlWebpackPlugin = require("html-webpack-plugin");
//静态资源输出
const copyWebpackPlugin = require("copy-webpack-plugin");
// 获取ruls
const rules = require("./webpack.rules.conf.js");

// 获取html-webpack-plugin参数的方法
let getHtmlConfig = function (name, chunks) {
    return {
        template: `./src/pages/${name}/index.html`,
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
    plugins: [
        //静态资源输出
        new copyWebpackPlugin([{
            from: path.resolve(__dirname, "../src/assets"),
            to: './assets',
            ignore: ['.*']
        }]),
    ]
}

//修改自动化配置页面
var htmlArray = [];
Object.keys(entrys).forEach(function (element) {
    htmlArray.push({
        _html: element,
        title: '',
        chunks: [element]
    })
})

//自动生成html模板
htmlArray.forEach((element) => {
    module.exports.plugins.push(new htmlWebpackPlugin(getHtmlConfig(element._html, element.chunks)));
})