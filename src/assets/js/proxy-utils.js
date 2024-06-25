import React from 'react'
import { isTrue, isHttpUrl, isEmpty, getObjType } from './index'
import Bus from './bus'

/**
 * 获取子组件的名称
 * @param {reactNode} child 
 * @returns {componentName}
 */
export function getChildDisplayName(child) {
  const displayName = child.type && child.type.displayName
  const nameMatch = displayName && displayName.match(/Config\((.*)\)/)
  return nameMatch && nameMatch[1]
}

/**
 * 获取子组件
 * @param {reactChildren} children 
 * @returns {Array[children]}
 */
export function getChildren(children) {
  return Array.isArray(children) ? children.flat().filter(c => isTrue(c)) : (isTrue(children) && [children] || [])
}
/**
 * 获取插槽
 * @param {String} name 插槽名字 
 * @param {any} children 子组件
 * @returns 
 */
export function getSlotChildren(name, children) {
  return getChildren(children).filter(c => c && c.props && c.props.slot === name)
}

/**
 * 复制组件属性
 * @param {reactNode - 当前组件} to 
 * @param {reactNode - 来源组件} from 
 * @param {function - 自定义} callback 
 */
export function AssignProps(to, from, callback) {
  Object.keys(from).forEach(key => {
    // 踢除主属性，防止代理失效
    const excludeKey = ['propTypes', 'render']
    if (excludeKey.includes(key)) return
    to[key] = from[key]
    if (typeof callback === 'function') {
      callback(key, to, from)
    }
  })
}

/**
 * 代理子组件
 * @param {reactNode} child 
 * @returns {reactNode}
 */
export function ProxyChild(child) {
  const children = getChildren(child)
  return children.map((c, index) => {
    if (!c || !c.$$typeof || !c.type || !c.type.prototype) return c; // 非 class 组件不做处理
    const NChild = c.type
    // 更新老代码hook
    typeof NChild.prototype.replaceHook === 'function' && NChild.prototype.replaceHook()
    return <NChild key={index} {...c.props} ref={c.ref}></NChild>
  })
}

/**
 * 组件 样式添加 margin 配置
 * @param {*} props 
 * @returns {style}
 */
export function getMarginStyle(props) {
  const {style, mt, mr, mb, ml } = props
  const getSize = (size) => !/\d$/.test(size) ? size : `${size}px`
  const marginRight = isTrue(mr) && { marginRight: getSize(mr)} || {}
  const marginTop = isTrue(mt) && { marginTop: getSize(mt) } || {}
  const marginLeft =isTrue(ml) && { marginLeft: getSize(ml)} || {}
  const marginBottom =isTrue(mb) && { marginBottom: getSize(mb)} || {}
  return {
    ...(style || {}),
    ...marginBottom,
    ...marginLeft,
    ...marginRight,
    ...marginTop
  }
}

export const apiBase = '/pcsweb'
// 非系统路由地址 
export const isProxyUrl = url => /^\/gos|pcsweb|cone|pcsservice|pcsaudit|dingapi|pcsapiaudit|pcsfbi|pcsapiweb|pcsapiwt|pcsprocesswt|pcslogin\//.test(url)

export function getAjaxUrl(url) {
  if (!isHttpUrl(url)) {
    if (!/^\//.test(url)) {
      url = '/' + url
    }
    // if (process.env.NODE_ENV === 'development') {
        if (!isProxyUrl(url)) {
            const preApi = Bus.getState('apiBase')
            url = (preApi || apiBase) + url
        }
    // }
  }
  return url
}

// 是否在 dialog 弹窗内部
export function isInDialog(target) {
  let status = false
  let parent = target
  if (parent instanceof HTMLElement) {
    while (parent instanceof HTMLElement && parent !== document.body) {
      parent = parent.offsetParent;
      if (parent instanceof HTMLElement && parent.classList.contains('next-dialog-body')) {
        status = true
        return true
      }
    }
  }
  return status
}

// 是否在 Table 表格内部
export function isInTable(target) {
  let status = false
  let parent = target
  if (parent instanceof HTMLElement) {
    while (parent instanceof HTMLElement && parent !== document.body) {
      parent = parent.offsetParent;
      if (parent instanceof HTMLElement && parent.classList.contains('next-table-body')) {
        status = true
        return true
      }
    }
  }
  return status
}

// 获取组件内的text
export function getReactNodeTextContent(reactNode, text='') {
  if (getObjType(reactNode) == 'Promise') return reactNode
  // 处理原生 htmlNode
  const nodeType = reactNode && reactNode.type || undefined;
  const nodeTypeof = reactNode && reactNode.$$typeof || undefined;
  const nodeProps = reactNode && reactNode.props || undefined;
  const nodeChildren = nodeProps && nodeProps.children || undefined;
  if (nodeType === 'img' && !nodeChildren) {
    return nodeProps.alt || nodeProps.src;
  }
  if (!isTrue(reactNode) || !isTrue(nodeTypeof) || !isTrue(nodeChildren)) {
    if (isTrue(nodeTypeof)) {
      if (reactNode.type && reactNode.type.displayName == 'ASelect') {
        // ASelect 组件自执行提取 展示文案
        const Component = reactNode.type
        const props = reactNode.props
        const Select = new Component(props)
        return Select.getDetailCopyName()
      }
      return null
    }
    return reactNode
  }
  if (nodeType && nodeType.name == 'HelpTips') return '?';
  if (Array.isArray(nodeChildren)) {
    let str = text
    nodeChildren.forEach(c => {
      const child = getReactNodeTextContent(c)
      if (typeof child === 'string') {
        str += `${child}`
      } else {
        getReactNodeTextContent(child, str)
      }
    })
    return str
  }
  return getReactNodeTextContent(nodeChildren)
}

// 多个dom节点捆绑滚动
export function getDomBindScrollBar(doms, {type = 'left', callback} = {}) {
  if (Array.isArray(doms) && doms.every(d => d instanceof HTMLElement)) {
    const removeListeners = []
    let scrollPosition = 0
    function getWatchEvent(currentDom) {
      return function (e){
        if (typeof callback === 'function') {
          callback.call(this, e)
        }
        const players = doms.filter(f => f !== currentDom);
        const setLeft = () => {
          if (this.scrollLeft !== scrollPosition) {
            scrollPosition = this.scrollLeft
            players.forEach(p => {
              p.scrollLeft = this.scrollLeft
            })
          }
        };
        const setTop = () => {
          if (this.scrollTop !== scrollPosition) {
            scrollPosition = this.scrollTop
            players.forEach(p => {
              p.scrollTop = this.scrollTop
            })
          }
        };
        switch(type) {
          case 'top':
            setTop();
            break;
          default:
            setLeft();
            break;
        }
      }
    }
    doms.forEach(dom => {
      const watchEvent = getWatchEvent(dom)
      dom.addEventListener('scroll', watchEvent, false)
      removeListeners.push(() => {
        dom.removeEventListener('scroll', watchEvent, false)
      })
    })
    return () => {
      removeListeners.forEach(listener => listener())
    }
  }
  return () => {}
}


// 判断是否为可渲染的 react 组件
export function isComponent(component) {
  const type = getObjType(component);
  switch(type) {
    case "Object" : 
      return typeof component.render === 'function'
    case "Function" :
      return true
    default: 
      return false
  }
}

// 根据dom 节点，获取弹窗位置
export function getPopUpPosition(selectBox, PopUpPisition) {
  if (isEmpty(selectBox)) return {top: 0, left: 0}
  const triggerNodes = selectBox.children
  let { top, left, width, height, right, bottom } = selectBox.getBoundingClientRect() 
  // 子元素存在时， 若子元素超出父体，以子超出部分为准
  if (!isEmpty(triggerNodes)) {
    const childrenBoundingClientRect = [...triggerNodes].map(m => m.getBoundingClientRect());
    top = Math.min(...childrenBoundingClientRect.map(m => m.top), top);
    left = Math.min(...childrenBoundingClientRect.map(m => m.left), left);
    width = Math.max(...childrenBoundingClientRect.map(m => m.width), width);
    height = Math.max(...childrenBoundingClientRect.map(m => m.height), height);
    right = Math.max(...childrenBoundingClientRect.map(m => m.right), right);
    bottom = Math.max(...childrenBoundingClientRect.map(m => m.bottom), bottom);
  }
  // 元素不可见时， 隐藏弹窗
  if (!width || !height || (top <= 0 && bottom <= 0) || (left <= 0 && rigth <= 0)) { 
    return {display: 'none', width: 0, height: 0, top: 0, left: 0}
  }
  // 计算 最佳显示 位置 
  let position = {}
  const isTop = (t) => t <= window.innerHeight / 2
  const isLeft = l => l <= window.innerWidth / 2
  if (isTop(top) && isLeft(left))  position = { top: bottom, left: left, maxHeight: window.innerHeight - bottom };
  if (isTop(top) && !isLeft(left)) position = { top: bottom, right: window.innerWidth - right, maxHeight: window.innerHeight - bottom };
  if (!isTop(top) && isLeft(left)) position = { bottom: window.innerHeight - top, left: left, maxHeight: top};
  if (!isTop(top) && !isLeft(left)) position = { bottom: window.innerHeight - top, right: window.innerWidth - right, maxHeight: top};
  // 添加 自定义微调位置 信息
  Object.entries(position).forEach(([key, val]) => {
    position[key] = val + (PopUpPisition && PopUpPisition[key] || 0) + 'px'
  })
  position.minWidth = width+ 'px'
  position.overflow = 'auto'
  return position
}