var path = require('path')
var devMode = process.env.NODE_ENV !== 'production'
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
var utils = require('../utils')
var buildEnv = require('../../env')
module.exports = [
  {
    test: /\.jsx?$/,
    use: [
      {
        loader: "thread-loader",
        // 有同样配置的 loader 会共享一个 worker 池
        options: {
          // 产生的 worker 的数量，默认是 (cpu 核心数 - 1)，或者，
          // 在 require('os').cpus() 是 undefined 时回退至 1
          // workers: 3,

          // 一个 worker 进程中并行执行工作的数量
          // 默认为 20
          workerParallelJobs: 60,
    
          // 额外的 node.js 参数
          workerNodeArgs: ['--max-old-space-size=1024'],
    
          // 允许重新生成一个僵死的 work 池
          // 这个过程会降低整体编译速度
          // 并且开发环境应该设置为 false
          poolRespawn: false,
    
          // 闲置时定时删除 worker 进程
          // 默认为 500（ms）
          // 可以设置为无穷大，这样在监视模式(--watch)下可以保持 worker 持续存在
          poolTimeout: 2000,

          // 池分配给 worker 的工作数量
          // 默认为 200
          // 降低这个数值会降低总体的效率，但是会提升工作分布更均一
          // poolParallelJobs: 50,

          // 池的名称
          // 可以修改名称来创建其余选项都一样的池
          name: "node-build-pool"
        },
      },
      'babel-loader'
    ],
    exclude: /node_modules/,
  },
  {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    use: [
        {
          loader: 'url-loader',
          options: {
              limit: 1024,
              outputPath: 'imgs',
          }
        }
    ],
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    use: [
        {
          loader: 'url-loader',
          options: {
              limit: 10000,
              name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
        }
    ],
  },
  {
    test: /\.(sa|sc|c)ss$/,
    use: [
      devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
      "css-loader",
      "postcss-loader",
      {
        loader: "sass-loader",
        options: {
          additionalData: `@import "assets/scss/_theme.scss";$version: ${buildEnv.version.replace(/\./g, '_')};`,
          implementation: require('sass'),
          sassOptions: {
            fiber: false,
          },
        }
      }
    ],
  },
]