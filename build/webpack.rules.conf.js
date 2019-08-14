
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
    }
];
module.exports = rules;