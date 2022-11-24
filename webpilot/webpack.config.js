const path = require("path");
const webpack = require("webpack");
const ESlintWebpackPlugin = require("eslint-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
              exclude: /(node_modules|out|static)/,
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
          // TypeORMのfaqにあるとおり握潰（FilterWarningsPluginがWebpack5で非対応のため、IgnorePluginで代用）
          ...([
            /^mongodb$/,
            /^mssql$/,
            /^mysql$/,
            /^mysql2$/,
            /^oracledb$/,
            // /^pg$/,
            /^pg-native$/,
            /^pg-query-stream$/,
            /^react-native-sqlite-storage$/,
            /^redis$/,
            /^sqlite3$/,
            /^sql.js$/,
            /^typeorm-aurora-data-api-driver$/,
            /^@sap\/hana-client$/,
            /^hdb-pool$/,
            /^@google-cloud\/spanner$/
          ].map(ign => (new webpack.IgnorePlugin({ resourceRegExp: ign })))),
          new ESlintWebpackPlugin({
            extensions: ["js", "ts"],
            fix: true
          }),
          new CopyWebpackPlugin({
            patterns: [
              { from: 'src/views', to: 'views' },
              { from: 'src/public', to: 'public' }
            ]
          })
        ],
    };
}