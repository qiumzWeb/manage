import React from 'react';
import Bus from 'assets/js/bus';
import OverTips from '@/component/overTips';
import { getUuid, isEmpty, getObjType, getValueOfObj } from 'assets/js';
import { Table } from '@alifd/next';

// 获取自定义表头key
export const getFieldKey = props => props && (props.fieldkey || props.index || props.dataIndex) || '';


export const getTableColumnsNode = (columns) => {
  if (isEmpty(columns) || !Array.isArray(columns)) return [];
  return columns.map((item, index) => {
    const { children, ...attrs } = item
    if (Array.isArray(children) && !isEmpty(children)) {
      const fieldKey = getFieldKey(item) || children.map((child) => getFieldKey(child));
      return <Table.Column key={index} fieldkey={fieldKey} {...attrs}>
        {getTableColumnsNode(children)}
      </Table.Column>
    } else {
      return <Table.Column key={index} {...attrs}></Table.Column>
    }
  })
}

// 获取数据源，添加uuid
export const getData = (data) => {
  if (!Array.isArray(data)) return []
  data.forEach(d => {
    if (!d.uuid) d.uuid = getUuid()
  })
  return data
}


// 内容超出 显示tips 
export const getTipsNode = (reactNode, opts = {}) => {
  const tipsProps = {
    align: 'tl',
    ...opts
  }
  return (...args) => {
    const children = typeof reactNode === 'function' ? reactNode(...args) : reactNode
    return <OverTips {...tipsProps}>
      {children}
    </OverTips>
  }
}


// 表格调试自适应处理
export function addWatchDom(callback, targetNode) {
  targetNode = targetNode || document.body
  let observer = new MutationObserver(callback);
  let timer = null
  callback()
  // 监听dom 变化 
  if (targetNode instanceof HTMLElement) {
    observer.observe(targetNode, { attributes: true, childList: true, characterData: true  });
  }

  // 监听菜单收起展开变化
  const unBus = Bus.watch('collapse', () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      callback()
      clearTimeout(timer)
    }, 500)
  })

  // 监听window resize 变化
  window.addEventListener('resize', callback, false)

  // 销毁监听事件
  return () => {
    unBus()
    observer.disconnect()
    observer = null
    window.removeEventListener('resize', callback, false)
  }
}

// 获取子列表的length
export function getChildrenListLength(arr, childKeys = ['children']) {
  let totalLength = 0;
  const getChildLength = (ar) => {
    if (Array.isArray(ar)) {
      ar.forEach(a => {
        const childrens = childKeys.reduce((r, k) => {
          if (getObjType(r) === 'Object') {
            if (!isEmpty(getValueOfObj(r, k))) {
              return getValueOfObj(r, k)
            }
            return r
          } else {
            return r
          }
        }, a)
        if (Array.isArray(childrens) && !isEmpty(childrens)) {
          getChildLength(childrens)
        } else {
          totalLength += 1;
        }
      })
    }
  }
  getChildLength(arr)
  return totalLength;
}

// 获取子列表
export function getChildrenList(arr, childKeys, listLevel) {
  let list = []
  const getChildList = (ar, currentLevel = 0) => {
    if (Array.isArray(ar) && !isEmpty(ar)) {
      ar.forEach(a => {
        if (getObjType(a) === 'Object') {
          const childrens = childKeys.reduce((r, k) => {
            if (getObjType(r) === 'Object') {
              if (!isEmpty(getValueOfObj(r, k))) {
                return getValueOfObj(r, k)
              }
              return r
            } else {
              return r
            }
          }, a)
          if (Array.isArray(childrens)) {
            if (currentLevel < listLevel) {
              getChildList(childrens, currentLevel + 1)
            } else {
              list.push(...childrens)
            }
          } else {
            list.push(null)
          }
        } else {
          list.push(null)
        }
      })
    } else {
      list.push(null)
    }
  }
  getChildList(arr)
  return list;
}




// 渲染子表
/**
 * 
 * @param {string} key 字段key   
 * @param {function} format 字段 格式化 函数
 * @param {string, Array} listKey 子列表 字段名
 * @param {number} renderLevel 字段取值 所在层级， 只有一级时 默认为 0
 */
export function renderListCell({
  key, format, listKey, renderLevel = 0
}) {
  // 高度单位值 
  const cellHeight = 40;
  return (getTips) => {
    return (val, index, record) => {
      if (isEmpty(listKey)) return getTips(typeof format == 'function' && format(record[key], index, record) || record[key] || '-')();
      // 获取自定义 子列表 字段名集合
      const renderListKey = Array.isArray(listKey) ? listKey: [listKey];
      // 获取单行的总高度量
      let listTotleLength = getChildrenListLength([record], renderListKey);
      // 获取当前 需要渲染的列表list
      const list = getChildrenList([record], renderListKey, renderLevel)
      if (isEmpty(list)) return null

      // 父盒子高度
      let boxHeight = cellHeight * listTotleLength;

      return <div ref={(ref) => {
        ref && (ref.parentElement.style.margin = 0);
      }} style={{height: boxHeight}}>
        {
          Array.isArray(list) && list.map((l, index) => {
            const isLast = index == list.length - 1
            return <div key={index} style={{
              borderBottom: isLast ? 'none' : '1px solid #e7e8ed',
              height: isEmpty(l) ? cellHeight : cellHeight * getChildrenListLength([l], renderListKey),
              display: 'flex',
              alignItems: 'center',
              padding: '0px 16px'
            }}>{
              isEmpty(l) ? null : getTips(typeof format == 'function' && format(l[key], index, record, l) || l[key] || '-')()
            }</div>
          })
        }
      </div>
    }
  }
}