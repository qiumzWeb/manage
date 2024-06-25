import Cookie from './cookie'
import localStore from './localStore'
import Bus from './bus'
import { download } from './common'
export {
  Cookie,
  localStore,
  Bus,
}

export function asyncAntiShake (request, {cxt, formatData}) {
  const requestBox = {}
  if (
      typeof request === 'function'
  ) {
      const newRequest = async function (...args) {
          const key = JSON.stringify(
            typeof formatData === 'function' &&
            formatData(...args) ||
            args
          )
          if (!requestBox[key]) {
              requestBox[key] = request.apply(cxt, args)
          }
          try {
              if (
                  typeof requestBox[key].then === 'function' &&
                  typeof requestBox[key].catch === 'function' &&
                  typeof requestBox[key].finally === 'function'
              ) {
                  const res = await requestBox[key]
                  return res
              } else {
                  return requestBox[key]
              }
          } catch (e) {
              return Promise.reject(e)
          } finally {
              delete requestBox[key]
          }
      }
      return newRequest
  } else {
      return request
  }
}

export function isType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
}

// input 输入框回车事件
export const onEnter = function (callBack) {
  return (event) => {
    const value = event.target.value
    if (event.which === 13 && value) {
        typeof callBack === 'function' && callBack(event)
    }
  }
}

// 下载excel数据
export function downloadExcel(res, name) {
    download([res], {
      fileName: name.includes('.xls') ? name : name + '.xlsx',
      mimeType: 'application/vnd.ms-excel'
    })
  }

// 下载文本数据
export function downloadTextFile(res, name) {
  download([res], {
    fileName: name,
    mimeType: 'text/plain'
  })
}
