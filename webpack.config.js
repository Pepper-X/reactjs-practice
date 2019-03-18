const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
});

const OptimizeJsPlugin = require("optimize-js-plugin");

var environment = process.env.NODE_ENV;

var plugins = [htmlPlugin];

if (environment === "production") {
    plugins.push(new OptimizeJsPlugin({
        sourceMap: false
    }));
}

module.exports = {
    entry: './src/index.jsx',

    resolve: {
        extensions: ['.js', '.jsx']
    },
    
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    //stats: "verbose",
    plugins: plugins
};