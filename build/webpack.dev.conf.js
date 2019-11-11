const path = require('path');
const webpack = require("webpack");
const merge = require("webpack-merge");
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin'); // 友好的错误提示插件
const webpackConfigBase = require('./webpack.base.conf');


const webpackConfigDev = {
    mode: 'development', // 通过 mode 声明开发环境
    devtool: "cheap-module-eval-source-map",
    output: {
        path: path.resolve(__dirname, '../dist'),
        // 打包多出口文件
        filename: '[name].bundle.js',
        publicPath: '/',
    },
    devServer: {
        clientLogLevel: 'warning',
        quiet: true,
        watchOptions: {
            poll: false,
        },
        compress: true,
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
    plugins: [
        //热更新
        new webpack.HotModuleReplacementPlugin(),
        // 友好的错误提示插件
        new FriendlyErrorsPlugin(),

    ],

}
module.exports = merge(webpackConfigBase, webpackConfigDev);
