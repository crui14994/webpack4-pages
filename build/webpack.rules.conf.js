//分离css，webpack4推荐的分离css的插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const rules = [
    {
        // 得到jquery模块的绝对路径
        test: require.resolve('jquery'),
        // 将jquery绑定为window.jQuery
        loader: 'expose-loader?jQuery!expose-loader?$'
    },
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
        test: /\.(html)$/,
        use: {
            loader: 'html-loader',
            options: {
                attrs: ['img:src', 'img:data-src']
            }
        }
    },
    {
        test: /\.(css|scss|sass)$/,
        use: process.env.NODE_ENV === "development" ? ["style-loader", "css-loader", "sass-loader", "postcss-loader"] :
            [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
        include: /src/, //限制范围，提高打包速度
        exclude: /node_modules/
    },
    {
        test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
        use: [
            {
                loader: "url-loader",
                options: {
                    limit: 10000, //小于这个时将会已base64位图片打包处理
                    name: 'images/[name].[hash].[ext]'
                }
            },
            {
                loader: 'image-webpack-loader', // 进行图片优化
            }
        ]
    },
    {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
            limit: 10000,
            name: 'fonts/[name].[hash].[ext]',
        }
    },
    {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
            'file-loader'
        ]
    },
    {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:7].[ext]'
        }
      },

];
module.exports = rules;