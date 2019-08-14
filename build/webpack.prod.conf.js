const path = require('path');
const webpack = require("webpack");
const merge = require("webpack-merge");

// 清除目录等
const cleanWebpackPlugin = require("clean-webpack-plugin");
//分离css，webpack4推荐的分离css的插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpackConfigBase = require('./webpack.base.conf');

process.env.NODE_ENV = "test"

const webpackConfigProd = {
    mode: 'production', // 通过 mode 声明生产环境
    output: {
        path: path.resolve(__dirname, '../dist'),
        // 打包多出口文件
        filename: 'js/[name].[hash].js',
        publicPath: './'
    },
    plugins: [
        //删除dist目录
        new cleanWebpackPlugin(['dist'], {
            root: path.resolve(__dirname, '../'), //根目录
            // verbose Write logs to console.
            verbose: true, //开启在控制台输出信息
            // dry Use boolean "true" to test/emulate delete. (will not remove files).
            // Default: false - remove files
            dry: false,
        }),
        //将css分离出去
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash].min.css"
        }),
    ],
    module: {
        rules: []
    },

}
module.exports = merge(webpackConfigBase, webpackConfigProd);