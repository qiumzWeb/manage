import React, {useState, useEffect, useRef} from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Message, Nav, Icon, Card } from '@/component'
import Bus from 'assets/js/bus'
import { _menus_, BusMenuMap, isEmpty, deepForEach, WarehouseConfigModel, RouterPositionSet } from 'assets/js'
import {pathReg, getUrl, getId, getTitle, getParentId, getChildren, toUrl, getSelectedScrollIntoView} from './utils'
import {icons, warehouseStepMenu, warehouseMenuMap} from './config'
import loadMenu from './loadMenu'
import { isProxyUrl } from 'assets/js/proxy-utils'
let isMenuClick = false;
const isProd = location.hostname === 'pcs-admin.wt.cainiao.com';
let isWarehouseConfigModel = false;
export default function MenuTree(props) {
  const history = useHistory()
  const routerProps = useLocation()
  const [menuTree, setMenuTree] = useState([])
  const [openKey, setOpenKey] = useState([])
  const {collapse, ...attrs} = props
  const {pathname} = history.location
  const [selectedKey, setSelectedKey] = useState(pathname)
  const getResPonseMenuPosition = useRef();
  // 实时更新Bus 绑定事件
  getResPonseMenuPosition.current = getMenuPosition
  useEffect(async () => {
    // 监控菜单收起按钮
    const unBus = Bus.watch('collapse', (state) => {
      if (state.collapse && openKey) {
        setOpenKey(false)
      }
    })
    // 一键开仓配置菜单
    const unWarehouseConfigBus = Bus.$on(WarehouseConfigModel, (status) => {
      isWarehouseConfigModel = status
      if (status) {
        loadOpenWarehouseMenuTree()
      } else {
        window.dbStore.get(_menus_).then(MTree => {
          if (MTree) setMenuTree(MTree);
        })
      }
      getResPonseMenuPosition.current()
    })
    // 路由变动监控
    const unSetRouterPositon = Bus.$on(RouterPositionSet, (routeKey) => {
      setSelectedKey(routeKey)
      getResPonseMenuPosition.current(routeKey)
    })
    // 读取缓存菜单
    const mens = await window.dbStore.get(_menus_)
    if (mens) setMenuTree(mens)
    // 加载菜单
    loadMenu(mens, {
      routerProps,
      setOpenKey,
      setMenuTree
    })
    return () => {
      unBus();
      unWarehouseConfigBus()
      unSetRouterPositon()
    }
  }, [])
  useEffect(() => {
    getMenuPosition()
  }, [pathname])
  // 根据路由定位菜单展开项
  function getMenuPosition(sk = pathname) {
    if (isMenuClick || collapse) {
      isMenuClick = false
      return
    }
    let menuMap = Bus.getState(BusMenuMap)
    if (isWarehouseConfigModel) {
      menuMap = warehouseMenuMap
    }
    if (!menuMap) {
      // 菜单未初始化完时， 监听等待====
      Bus.watch(BusMenuMap, (state) => {
        menuMap = state[BusMenuMap]
        setMenuPosition()
      })
    } else {
      setMenuPosition()
    }
    // 设置定位
    function setMenuPosition() {
      if (menuMap[sk]) {
        const keys = []
        const getKeys = (menu) => {
          if (!menu) return
          const k = getParentId(menu) && toUrl(getParentId(menu))
          if (!k) return
          keys.unshift(k)
          if (menuMap[k]) {
            getKeys(menuMap[k])
          }
        }
        getKeys(menuMap[sk])
        setOpenKey(keys);
        if (sk === pathname) {
          window._setTitle(getTitle(menuMap[pathname]));
        }
      }
      // 滚动到可视区域
      getSelectedScrollIntoView()
    }

  }
  // 加载一键开仓菜单树
  function loadOpenWarehouseMenuTree () {
    setMenuTree(deepForEach(warehouseStepMenu, {
      childrenCode: 'childrens',
      callBack: (m, parent) => {
        // 生成菜单keys 层级
        if (!parent) {
          m.openKeys = [toUrl(getId(m))]
        } else {
          m.openKeys = [...parent.openKeys, toUrl(getId(m))]
        }
        if (m.href === routerProps.pathname) {
          window._setTitle(getTitle(m))
          setOpenKey(m.openKeys)
        }
      }
    }))
  }
  // 渲染菜单树
  const getMenus = (menu, isChild) => {
    if (!Array.isArray(menu)) return null
    return menu.map((m, i) => {
      if (m.show === false) return null;
      // 生产环境对测试菜单隐藏
      if (isProd && m.onlineHide) return null;
      let menuUrl = getUrl(m) && getUrl(m).replace(pathReg, '')
      const getIcon = (id) => icons[id] ? (icons[id].icon || icons.default.icon) : (isChild ? null : icons.default.icon)
      let style = { margin: 0 }
      if (isChild) {
        style = !collapse ? {
          margin: '0 0 0 26px'
        } : { 
          margin: '5px 10px'
        }
      }
      return Array.isArray(getChildren(m)) && !isEmpty(getChildren(m)) ? <Nav.SubNav
        icon={getIcon(m.id)} key={toUrl(menuUrl || getId(m))}
        label={getTitle(m)}
        className="next-menu-item-list"
        style={style}
      >
        {!collapse && <div className='next-menu-sidebar-left-line'></div>}
        {getMenus(getChildren(m), true)}
      </Nav.SubNav>: <Nav.Item icon={getIcon(m.id)}  key={toUrl(menuUrl || getId(m))} onClick={
        () => {
          document.title = getTitle(m)
          if (/^https?:\/\//.test(menuUrl)) {
            window.open(menuUrl, '_blank')
          } else if (isProxyUrl(menuUrl)) {
            window.open(window.location.origin + menuUrl, '_blank')
          } else {
            history.push(menuUrl)
          }
          isMenuClick = true
        }
      }
      className="pcs-next-menu-item"
      style={style}
      >{getTitle(m)}</Nav.Item>
    }).filter(f => f)
  }
  return <div>
    <Nav
      // type="primary"
      inlineIndent={4}
      type="secondary"
      style={{height: 'auto'}}
      embeddable
      selectedKeys={selectedKey || pathname}
      openKeys={openKey}
      onOpen={(key, opt) => {
        setOpenKey(key)
      }}
      {...attrs}
    >
      {getMenus(menuTree)}
    </Nav>
</div>
}
