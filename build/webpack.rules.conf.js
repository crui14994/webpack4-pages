//分离css，webpack4推荐的分离css的插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const rules = [
    {
        test: /\.js$/,
        exclude: /(node_modules)/,
        include: /src/, //限制范围，提高打包速度
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
        test: /\.(css|scss|sass)$/,
        // use: process.env.NODE_ENV === "development" ? ["style-loader", "css-loader", "sass-loader", "postcss-loader"] :[MiniCssExtractPlugin.loader,"css-loader",{
        //     loader: "postcss-loader",
        //     options: {
        //         plugins: [
        //             autoprefixer({
        //                 browsers: ['ie >= 8','Firefox >= 20', 'Safari >= 5', 'Android >= 4','Ios >= 6', 'last 4 version']
        //             })
        //         ]
        //     }
        // },"sass-loader"]
        use: process.env.NODE_ENV === "development" ? ["style-loader", "css-loader", "sass-loader", "postcss-loader"] :
            [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
        include: /src/, //限制范围，提高打包速度
        exclude: /node_modules/
    },
    {
        test: /\.(png|svg|jpg|gif|jpeg|ico|woff|woff2|eot|ttf|otf)$/,
        use: [
            {
                loader: "url-loader",
                options: {
                    limit: 5 * 1024, //小于这个时将会已base64位图片打包处理
                    // 图片文件输出的文件夹
                    publicPath: "../images",
                    outputPath: "images",
                    name: '[name].[hash].[ext]'
                }
            }
        ]
    },
    {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
            'file-loader'
        ]
    }

];
module.exports = rules;