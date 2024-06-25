import React, {useEffect, useState, useRef} from 'react'
import { Icon, AContextMenu } from '@/component'
import Bus from 'assets/js/bus'
import {useAliveController} from 'react-activation'
import Draggable from '@/component/Draggable'
import './index.scss'
import OverTips from '@/component/overTips'
import {NavTag, WarehouseConfigModel, RouterPositionSet } from 'assets/js'
import { warehouseMenuMap } from '@/layout/menus/config'
import { hideTagWhiteList } from './config'
// 声明初始默认值
const defaultOpenWarehouseRoute = Object.values(warehouseMenuMap)[0]
React.__localTagList = []
let __localTagListHistoryData = []
let __localTagListOpenWarehouseConfig = [{
  pathname: defaultOpenWarehouseRoute.href,
  url: defaultOpenWarehouseRoute.href,
  name: defaultOpenWarehouseRoute.text
}];
// 读取缓存
let initCache = false;
const getTagCache = window.dbStore.get(NavTag).then(list => {
  React.__localTagList = list || React.__localTagList;
  initCache = true;
  console.log('tag：初始化完成')
})

export default function _NavTag(props) {
  const [tagList, setTagList] = useState(React.__localTagList)
  const activeRef = useRef()
  const {dropScope} = useAliveController()
  const [relativeRouteKey, setRelativeRouteKey] = useState(null);
  useEffect(async() => {
    const unBus = Bus.$on('setNavTag', async(route) => {
      if (!initCache) await getTagCache;
      // 更新页签显示
      if (!React.__localTagList.some(t => {
        if (t.pathname.toLowerCase() === route.pathname.toLowerCase()) {
          t.name = route.name
          t.url = route.url
          return true
        }
        return false
      })) {
        if (!hideTagWhiteList.includes(route.pathname)) {
          // 加载白名单页签
          React.__localTagList.push({...route})
        }
      }
      // 自动销毁 超出组件 缓存
      React.__localTagList.slice(0, -15).forEach(tag => {
        dropScope(tag.url)
      });
      // 截取并显示最新15个组件
      React.__localTagList = React.__localTagList.slice(-15);
      setTagList([...React.__localTagList]);
    })
    const unWatch = Bus.watch('currentRouteTitle', async(state) => {
      if (!initCache) await getTagCache;
      React.__localTagList.forEach(tag => {
        if (isActive(tag)) {
          tag.name = state.currentRouteTitle
        }
      });
      setTagList([...React.__localTagList]);
    })
    // 一键开仓配置菜单
    const unWarehouseConfigBus = Bus.$on(WarehouseConfigModel, async(status) => {
      if (!initCache) await getTagCache;
      if (status) {
        __localTagListHistoryData = [...React.__localTagList];
        React.__localTagList = [...__localTagListOpenWarehouseConfig]
      } else {
        __localTagListOpenWarehouseConfig = [...React.__localTagList]
        React.__localTagList = [...__localTagListHistoryData];
      }
      const lastRoute = React.__localTagList.slice(-1)[0] || {
        name: '首页',
        url: '/',
        pathname: '/',
      }
      window._setTitle(lastRoute.name);
      window.Router.push(lastRoute.url);
    })
    // 路由定位监控
    const unSetRouterPositon = Bus.$on(RouterPositionSet, (routeKey) => {
      setRelativeRouteKey(routeKey)
    })
    return () => {
      unBus();
      unWatch();
      unWarehouseConfigBus();
      unSetRouterPositon();
    }
  }, [])
  // 完全匹配激活
  function isActive(tag) {
    return location.pathname.toLowerCase() === tag.pathname.toLowerCase()
  }
  // 父子群带关系激活
  function isRelationActive(tag, relativeKey = relativeRouteKey) {
    const currentRoutePath = location.pathname.toLowerCase();
    // 页签黑名单的 路由支持 关系激活
    if (hideTagWhiteList.includes(currentRoutePath) && relativeKey) {
      return [
        currentRoutePath,
        relativeKey.toLowerCase()
      ].includes(tag.pathname.toLowerCase())
    } else {
      return isActive(tag)
    }
  }
  // 关闭窗口
  function closeTag(tag, index) {
    if (isRelationActive(tag)) {
      React.__localTagList.splice(index, 1)
      const activeRoute = React.__localTagList.slice(-1)[0]
      document.title = activeRoute.name
      window.Router.push(activeRoute.url)
    } else {
      React.__localTagList.splice(index, 1)
      setTagList([...React.__localTagList])
    }
    // 清除组件缓存
    dropScope(tag.url)
  }
  // 右键菜单配置
  const contextMenuConfig = [
    {text: '关闭', onClick: (tag, index) => {
      closeTag(tag, index)
    }},
    {text: '关闭其它标签页', onClick: (tag, index) => {
      // 清除组件缓存
      React.__localTagList.filter(l => l.url !== tag.url).forEach(l => dropScope(l.url));
      // 更新list
      React.__localTagList = [tag]
      setTagList([...React.__localTagList])
      if (!isRelationActive(tag)) {
        document.title = tag.name
        window.Router.push(tag.url)
      }
    }},
    {text: '关闭右侧所有标签页', onClick: (tag, index) => {
       // 清除组件缓存
      React.__localTagList.slice(index + 1).forEach(l => {
        dropScope(l.url)
      })
      React.__localTagList = React.__localTagList.slice(0, index + 1);
      setTagList([...React.__localTagList])
      if (!React.__localTagList.some(s => isRelationActive(s))) {
        document.title = tag.name
        window.Router.push(tag.url)
      }
    }},
    {text: '关闭左侧所有标签页', onClick: (tag, index) => {
      // 清除组件缓存
      React.__localTagList.slice(0, index).forEach(l => {
        dropScope(l.url)
      })
      React.__localTagList = React.__localTagList.slice(index);
      setTagList([...React.__localTagList]);
      if (!React.__localTagList.some(s => isRelationActive(s))) {
        document.title = tag.name
        window.Router.push(tag.url)
      }
    }},
  ]

  return <Draggable
    className="layout-navbar"
    dataSource={tagList}
    onChange={data => {
      React.__localTagList = data
      setTagList(data)
    }}
  >
    {Array.isArray(tagList) && tagList.map((t, index) => {
      return <div
          key={index}
          index={index}
          className={`btn ${isRelationActive(t) && 'active' || ''}`}
          onContextMenu={(e) => e.preventDefault()}
          ref={isRelationActive(t) && activeRef || null}
        >
          <AContextMenu style={{
            display: 'flex',
            height: '100%',
          }} trigger={
            <div style={{height: '100%', display: 'flex', alignItems: 'center'}}
              onClick={() => {
                document.title = t.name
                window.Router.push(t.url)
              }}
            >
              <div className='tag_name'>
                <OverTips align="t">{t.name}</OverTips>
              </div>
            </div>
          }>
            <div>
                {
                  contextMenuConfig.map((item, menuIndex) => {
                    return <div className={`pcs-tips-selector medium ${tagList.length > 1 ? '' : 'disabled'}`} key={menuIndex} onClick={() => {
                      tagList.length > 1 && typeof item.onClick === 'function' && item.onClick(t, index, tagList)
                    }}>{item.text}</div>
                  })
                }
            </div>
          </AContextMenu>
          {tagList.length > 1 && <Icon ml="4" type="close" size="small" onClick={() => closeTag(t, index)}></Icon> || null}
        </div>
    }) || null}
  </Draggable>
}