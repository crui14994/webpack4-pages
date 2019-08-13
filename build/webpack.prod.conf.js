const path = require('path');
const webpack = require("webpack");
const merge = require("webpack-merge");

const webpackConfigBase = require('./webpack.base.conf');

process.env.NODE_ENV = "test"

const webpackConfigProd = {
    mode: 'production', // 通过 mode 声明生产环境
    output: {
        path: path.resolve(__dirname, '../dist'),
        // 打包多出口文件
        filename: './js/[name].[hash].js',
        publicPath: './'
    },
    plugins: [
        
    ],
    module: {
        rules: []
    },

}
module.exports = merge(webpackConfigBase, webpackConfigProd);