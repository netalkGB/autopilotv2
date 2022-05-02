const path = require("path");
const webpack = require("webpack");
const ESlintWebpackPlugin = require("eslint-webpack-plugin");

module.exports = (_, argv) => {
  const mode = argv.mode === 'development' ? 'development' : 'production'
    return {
        entry: "./src/index.ts",
        mode,
        target: 'node',
        cache: true,
        optimization: {
          minimize: true,
        },
        module: {
          rules: [
            {
              test: /(\.js$|\.ts$)/,
              exclude: /(node_modules|out)/,
              loader: "ts-loader",
            },
            {
              test: /\.node$/,
              use: 'node-loader'
            }
          ]
        },
        resolve: {
          extensions: ['.ts', '.js', '.json', '.node'],
          alias: {
            '~': path.resolve(__dirname, 'src/')
          }
        },
        output: {
          path: path.resolve(__dirname, "out/"),
          publicPath: "/out/",
          filename: "index.js"
        },
        plugins: [
          new ESlintWebpackPlugin({
            extensions: ["js", "ts"],
            fix: true
          })
        ]
    };
}