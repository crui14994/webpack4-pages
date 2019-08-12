const path = require('path');
const webpack = require("webpack");
const glob = require("glob");
// html模板
const htmlWebpackPlugin = require("html-webpack-plugin");

// 获取html-webpack-plugin参数的方法
let getHtmlConfig = function (name, chunks) {
	return {
		template: `./src/pages/${name}/index.html`,
		filename: `${name}.html`,
		inject: true,
		hash: true, //开启hash  ?[hash]
		chunks: chunks
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
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'js/[name]-bundle.js',
    },
	module: {
	},
	plugins: [
    ],
    mode:"development"
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