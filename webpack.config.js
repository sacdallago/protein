var webpack = require('webpack');

module.exports = {
    target: "node",
    entry: __dirname + '/lib/index.js',
    output: {
        path: __dirname + '/build',
        filename: 'protein-node.js',
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