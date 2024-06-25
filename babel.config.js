var glob = require('glob');
var path = require('path')

// 驼峰转小写中划线
function upperToLine(name) {
  if (typeof name !== 'string') return name;
  return name
    .replace(/(?:[A-Z])/g, function ($1, $2) {
      return '-' + $1.toLocaleLowerCase();
    })
    .replace(/^\-/, '');
}

// 获取 项目组件
var componentUi = []
glob.sync(path.join(__dirname, './src/component/**/index.js')).forEach(function (entry){
  var fileName = entry.split('/component/')[1].replace('index.js', '').split('/')[0]
  fileName && componentUi.push(fileName)
})

// 获取 fusion 组件
var alifdNextUI = []
glob.sync(path.join(__dirname, `./node_modules/@alifd/next/lib/**/style.js`)).forEach(function (entry){
  var fileName = entry.split('/@alifd/next/lib/')[1].replace(`style.js`, '').split('/')[0]
  fileName && alifdNextUI.push(fileName)
})

// 获取组件路径
function getPath (name, file) {
  const componentName = componentUi.find(n => {
    return (upperToLine(n).toLowerCase()) === name.toLowerCase()
  })
  // 输出结果为 style 的 name
  if (componentName) {
    return `@/component/${componentName}`
  } else {
    return `@alifd/next/lib/${name}`
  }
  
}

// 获取组件Style
function getStyle (name, file) {
  var componentName = upperToLine(name.split('/').pop()).toLowerCase()
  return alifdNextUI.includes(componentName) ? `@alifd/next/lib/${componentName}/style` : false
}


module.exports = {
  "presets": [
    [
      "@babel/preset-env", {
        "useBuiltIns": "usage",
        "corejs": 3.22
      }
    ],
    "@babel/preset-react",
    "@babel/preset-flow"
  ],
  "plugins": [
    [
      'import',
      {
        "libraryName": "@alifd/next",
        "libraryDirectory": "lib",
        "style": true
      }
    ],
    [
      'import',
      {
        "libraryName": "@/component",
        "customName": getPath,
        "style": getStyle
      },
      '@/component'
    ],
    // keepalive 插件
    "react-activation/babel"
  ]
}
