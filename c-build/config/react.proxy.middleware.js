import adapter from 'webrtc-adapter';
import React from 'react';
// import ReactDom from 'react-dom'
// import ReactApp from 'react-dom/client'
import { getWid, getObjType } from 'assets/js';
// 代理 ReactDom.render 兼容 react < 18
// ReactDom.render = function(element, container, callback) {
//   return ReactApp.createRoot(container).render(<div ref={callback}>{element}</div>)
// }
// 代理 useEffect Hook 支持 promise
console.log('浏览器版本：', JSON.stringify(adapter.browserDetails))
React.useEffect = new Proxy(React.useEffect, {
  apply(fn, cxt, args) {
    const [callback, updateCode] = args
    let deps = updateCode
    if (Array.isArray(updateCode)) {
      deps = updateCode.map(dep => {
        try {
          // REACT deps 比较 只针对 string , 固转成 string
          return JSON.stringify(dep)
        } catch(e) {
          return dep
        }
      })
    }
    const intCall = new Proxy(callback, {
      apply(call, ctx, props) {
        return Reflect.apply(call, ctx, props)
      }
    })
    return Reflect.apply(fn, cxt, [() => {
      const destroy = intCall()
      return destroy && function () {
        switch (getObjType(destroy)) {
          case 'Promise':
            destroy.then(e => {
              if (typeof e == 'function') {
                e()
              }
            });
            break;
          case 'Function':
            destroy()
            break;
          default: break;
        }
      } || undefined
    }, deps])
  }
});
// 老代码过期 hook 更新
function __oldHookReplaceByNewHook(discardedHook = 'componentWillMount', newHook = 'componentDidMount') {
  const hasOldHook = this.hasOwnProperty(discardedHook)
  const hasNewHook = this.hasOwnProperty(newHook)
  const oldHook = this[discardedHook]
  Reflect.defineProperty(this, newHook, {
    value: new Proxy(this[newHook] || proxyRegister, {
      apply(fn, cxt, args) {
        if (discardedHook === newHook) {
          hasOldHook && Reflect.apply(fn, cxt, args)
        } else {
          hasOldHook && Reflect.apply(oldHook, cxt, args)
          hasNewHook && Reflect.apply(fn, cxt, args)
        }
        return Reflect.apply(proxyRegister, cxt, args)
      }
    })
  })
  function proxyRegister() {
    // 全局数据处理
  }
  if (discardedHook === newHook) return
  Reflect.deleteProperty(this, discardedHook)
}

Reflect.defineProperty(React.Component.prototype, 'replaceHook', {
  value: __oldHookReplaceByNewHook
});

Reflect.defineProperty(React.Component.prototype, 'getWid', {
  value: function() {
    const warehouseId = getWid()
    return warehouseId && +warehouseId || ''
  }
});
