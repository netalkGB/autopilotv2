const path = require("path");
const webpack = require("webpack");
const ESlintWebpackPlugin = require("eslint-webpack-plugin");
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

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
          // TypeORMのfaqにあるとおり握潰
          new FilterWarningsPlugin({
            exclude: [/mongodb/, /mssql/, /mysql/, /mysql2/, /oracledb/, /pg/, /pg-native/, /pg-query-stream/, /react-native-sqlite-storage/, /redis/, /sqlite3/, /sql.js/, /typeorm-aurora-data-api-driver/, /@sap\/hana-client/, /hdb-pool/, /@google-cloud\/spanner/]
          }),
          // Module not found: Error: Can't resolve 'pg-native'なので握潰（なくても動く）
          new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/}),
          new ESlintWebpackPlugin({
            extensions: ["js", "ts"],
            fix: true
          })
        ]
    };
}