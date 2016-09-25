var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        'script!jquery/dist/jquery.min.js',
        'script!material-design-lite/dist/material.min.js',
        './client'
    ],
    externals: {
        jquery: 'jQuery'
    },
    plugins: [new webpack.ProvidePlugin({'$': 'jquery', 'jQuery': 'jquery'})],
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    resolve: {
        root: __dirname,
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0']
                },
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/
            }, {
                loader: 'url?limit=100000',
                test: /\.(jpg|png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/
            }, {
                test: /\.scss$/,
                loaders: [
                    "style", "css", "sass"
                ],
                exclude: /(node_modules|bower_components)/
            }, {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }
        ]
    }
};
