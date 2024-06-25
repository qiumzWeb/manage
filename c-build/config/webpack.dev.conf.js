var webpack = require('webpack')
var { merge } = require('webpack-merge')
var config = require('../config')
var path = require('path')
var baseWebpackConfig = require('./webpack.base.conf')
var ESLintPlugin = require('eslint-webpack-plugin')
var devConf = merge(baseWebpackConfig, {
    devtool: false, // 是否生成 sourceMap 文件
    entry: [path.resolve(__dirname, '../dev-client.js')],
    output: {
        publicPath: config.dev.assetsPublicPath,
    },
    cache: config.dev.cachesDllDirectory,
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProgressPlugin(),
    ]
})
if (config.dev.eslint) {
  devConf.plugins.push(new ESLintPlugin({
    context: path.resolve(__dirname, '../../src'),
    exclude: ['src/pcs', 'src/service'],
    failOnError: false,
    lintDirtyModulesOnly: true,
    extensions: ['js', 'jsx', 'ts', 'tsx'],
  }))
}
module.exports = devConf;
