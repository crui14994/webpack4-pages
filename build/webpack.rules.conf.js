//分离css，webpack4推荐的分离css的插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');//给css自动加浏览器兼容性前缀的插件
const rules = [
    
    {
        test: /\.js$/,
        exclude: /(node_modules)/,
        include: /src/,
        use: [
            {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env',],
                    plugins: ['@babel/transform-runtime']
                }
            }
        ]
    },
    {
        test:/\.(css|scss|sass)$/,
        use: process.env.NODE_ENV === "development" ? ["style-loader", "css-loader", "sass-loader", "postcss-loader"] :[MiniCssExtractPlugin.loader,"css-loader",{
            loader: "postcss-loader",
            options: {
                plugins: [
                    autoprefixer({
                        browsers: ['ie >= 8','Firefox >= 20', 'Safari >= 5', 'Android >= 4','Ios >= 6', 'last 4 version']
                    })
                ]
            }
        },"sass-loader"]
    }

];
module.exports = rules;