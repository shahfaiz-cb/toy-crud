const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const Dotenv = require("dotenv-webpack")

const OUT_DIR = "build"
const PORT = 3001

module.exports = {
    entry: "./src/main.tsx",

    output: {
        path: path.resolve(__dirname, OUT_DIR),
        clean: true,
        filename: "bundle.js"
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader"
                ],
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
        new Dotenv({
            silent: true,
            allowEmptyValues: true
        })
    ],

    devServer: {
        port: PORT,
        historyApiFallback: true,
        hot: true,
    },

    mode: "development"
}