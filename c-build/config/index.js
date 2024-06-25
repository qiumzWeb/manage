var path = require('path')
var buildEnv = require('../../env')
module.exports = {
    build: {
        assetsRoot: path.resolve(__dirname, '../../build'),
        assetsSubDirectory: 'static',
        assetsPublicPath: buildEnv.rootPath,
        assetsDllChunks: {
            ['ali-vendor_alifd']: ['react', 'react-dom', 'react-router', 'react-router-dom', 'react-activation', 'moment','axios'],
        },
        assetsChunks: {
            react_echarts: ['echarts', 'zrender'],
            vendor_tools: ['@alifd'],
        },
        cachesDllDirectory: {
          type: 'filesystem',
          name: buildEnv.buildCacheRoot,
          // 开启压缩
          compression: 'gzip',
          buildDependencies: {
            config: [
              "./c-build/config/index.js",
              "./c-build/config/webpack.base.conf.js",
              "./c-build/config/webpack.prod.conf.js",
              "./c-build/config/loaders.js",
              "./env.js"
            ]
          }
        },
    },
    dev: {
        port: 8888,
        eslint: false,
        assetsDallPath: path.resolve(__dirname, '../../static/js/'),
        assetsDllOutPath: path.resolve(__dirname, '../../dll/'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        cachesDllDirectory: {
          type: 'filesystem',
          name: 'local_development',
          buildDependencies: {
            config: [
              "./c-build/config/index.js",
              "./c-build/config/webpack.base.conf.js",
              "./c-build/config/webpack.prod.conf.js",
              "./c-build/config/loaders.js",
              "./env.js"
            ]
          }
        },
        proxyTable: {
            '/pcsweb':{
                "target":'https://pre-pcs-manage.wt.cainiao.com/',
                "changeOrigin": true,
                "pathRewrite":{'^/pcsweb':''},
                "secure": false,
            },
            '/gos': {
                target: 'https://pre-api.gos.cainiao.com/',
                changeOrigin: true,
                secure: false
            },
            '/pcsapiweb': {
                target: 'https://pre-pcs-web.wt.cainiao.com/',
                changeOrigin: true,
                "pathRewrite":{'^/pcsapiweb':''},
                secure: false
            },
            '/pcsfbi': {
                target: 'https://pre-pcs-manage.wt.cainiao.com/',
                changeOrigin: true,
                "pathRewrite":{'^/pcsfbi':''},
                secure: false
            },
            '/dingapi': {
              target: 'https://pre-pcs-manage.wt.cainiao.com/',
              changeOrigin: true,
              secure: false
            },
            '/pcsservice': {
                // "target":'https://pre-pcs-service.wt.cainiao.com/',
                "target":'https://pre-pcs-manage.wt.cainiao.com/',
                "changeOrigin": true,
                "pathRewrite":{'^/pcsservice':''},
                "secure": false,
            },
            '/pcsapiwt': {
              "target":'https://pre-pcs-api.wt.cainiao.com/',
              "changeOrigin": true,
              "pathRewrite":{'^/pcsapiwt':''},
              "secure": false,
            },
            '/pcsapiaudit': {
              "target":'https://xms-monitor-stage.i4px.com/',
              "changeOrigin": true,
              "pathRewrite":{'^/pcsapiaudit':''},
              "secure": false,
            },
            '/cone': {
              "target":'https://pre-cn-x-gateway.cainiao.com',
              "changeOrigin": true,
              "secure": false,
            },
            '/pcsprocesswt': {
              "target":'https://pre-pcs-process.wt.cainiao.com/',
              "changeOrigin": true,
              "pathRewrite":{'^/pcsprocesswt':''},
              "secure": false,
            },
            '/pcslogin': {
              "target":'https://cnlogin.cainiao.com/',
              "changeOrigin": true,
              "pathRewrite":{'^/pcslogin':''},
              "secure": false,
            }
		  },
        cssSourceMap: false
    }
}
