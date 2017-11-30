var webpack = require('webpack');

module.exports = {
    target: "web",
    entry: __dirname + '/lib/browser.js',
    output: {
        path: __dirname + '/build',
        filename: 'protein-browser.js',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        library: 'Protein'
    },
    module: {
        loaders: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/,
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /(\.jsx|\.js)$/,
                loader: "eslint-loader",
                exclude: /node_modules/
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};