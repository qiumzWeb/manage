require('assets/scss/_base.scss')
import React from 'react'
import { getAjaxUrl } from './proxy-utils'
import moment from 'moment'
import Bus from 'assets/js/bus'
import {getWid, NavTag} from 'assets/js'
import DBStore from 'assets/js/dbStore'

// 百分比字体缩放
(function(){
  setFontSize()
  window.addEventListener('resize', setFontSize, false)
  window.px2rem = function($px) {
    return `${$px/20}rem`;
  }
  window.remForPxNum = function($px) {
    return $px * (window.innerWidth / 1920);
  }
  function setFontSize() {
    document.documentElement.style.fontSize = (window.innerWidth / 1920) * 20 + 'px';
  }
})();
// 全局注册DB
DBStore.install(React.Component)

// 挂载moment
window.moment = moment 

// 重写定时器, 自销毁处理, 防止页面放久了系统卡顿
const stout = window.setTimeout
window.setTimeout = function(fn, timer = 0) {
    let t = stout(() => {
        typeof fn === 'function' && fn()
        clearTimeout(t)
        t = null
    }, timer)
    return t
}

// 文件下载
window.downloadFile = function(path, ...args) {
    const paths = Bus.getState('routes').filter(r => r.path && r.path !== '/').map(r => r.path)
    if (paths.some(p => {
        return path.toLowerCase().startsWith(p.toLowerCase())
    })) {
        return window.open(path, ...args)
    } else {
        return window.open(getAjaxUrl(path), ...args)
    }
}

// 设置document title
window._setTitle = function (title){
    Bus.setState({currentRouteTitle: title})
    document.title = title
}

// 分页数量
window._pageSize_ = 20

// 系统卸载事件监听
window.onbeforeunload = function(event) {
  // 离开页面时缓存页签
  window.dbStore.set(NavTag, React.__localTagList)
  if (window.hasSavePreventLeave) {
    event.preventDefault();
    event.returnValue = '页面数据未保存，确定离开？';
    return "确认离开？";
  }
}

// 设置跳转
window.setCall = function(jumpCall, name) {
  name = name || jumpCall.name || 'jump'
  if (typeof jumpCall === 'function') {
    window[name] = jumpCall
  } else {
    window[name] = () => console.log('执行函数注册失败')
  }
  return () => {
    window[name] = null;
  }
}


  // 监听低码平台路由跳转
  window.addEventListener("message", function(e) {
    try {
      var data = e.data;
      if (data.path && data.state === "Router") {
        (window[data.state][data.key])(data.path);
      }
    } catch (x) {
      console.log(x)
    }
  }, false);



