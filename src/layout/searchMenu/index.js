import React, {useEffect, useState, useRef} from 'react';
import { Input, ATipsCard, Icon  } from '@/component';
import Bus from 'assets/js/bus';
import { BusMenuMap, isEmpty } from 'assets/js';
import { onEnter } from 'assets/js/utils'
import {pathReg, getUrl, getId, getTitle, getParentId, getChildren, toUrl,} from '@/layout/menus/utils';
import { isProxyUrl } from 'assets/js/proxy-utils';
import { useHistory, useLocation } from 'react-router-dom'
const isProd = location.hostname === 'pcs-admin.wt.cainiao.com';
export default function SearchMenu(props) {
  const history = useHistory()
  const [menuOptions, setMenuOptions] = useState([])
  const [visible, setVisible] = useState(false)
  const busMenuMap = useRef([])
  const searchInput = useRef()
  // 初始化菜单
  useEffect(() => {
    const unWatch = Bus.watch(BusMenuMap, (state) => {
      const menuMap = state[BusMenuMap]
      busMenuMap.current = []
      Object.entries(menuMap).forEach(([key, item]) => {
        if (
          !/^\/\d+$/.test(key) &&
          item.show !== false &&
          !(isProd && item.onlineHide)
        ) {
          const parentTitle = item.openKeys.length > 1 && getTitle(menuMap[item.openKeys[0]])
          item.label = getTitle(item) + (parentTitle && `【${parentTitle}】` || '')
          busMenuMap.current.push(item)
        }
      })
    })
    return () => {
      unWatch()
    }
  }, [])
  // 跳转页面
  function getJumpPage(m) {
    let menuUrl = getUrl(m) && getUrl(m).replace(pathReg, '')
    document.title = getTitle(m)
    if (/^https?:\/\//.test(menuUrl)) {
      window.open(menuUrl, '_blank')
    } else if (isProxyUrl(menuUrl)) {
      window.open(window.location.origin + menuUrl, '_blank')
    } else {
      history.push(menuUrl)
    }
    setVisible(false)
  }
  // 搜索变动
  function onSearchChange(val) {
    const value = typeof val === 'string' && val.trim() || ''
    if (!value) return
    const menuData = busMenuMap.current
    const filterData = menuData.filter(m => getTitle(m).toLowerCase().includes(value.toLowerCase()))
    filterData.sort((a, b) => {
      const reg = new RegExp(`^\\${value}`, 'i')
      const A = reg.test(getTitle(a));
      const B = reg.test(getTitle(b))
      const compaire = {
        [(A && B) || (!A && !B)]: 0,
        [!A && B]: 1,
        [A && !B ]: -1
      }
      return compaire[true]
    })
    setMenuOptions(filterData)
    setVisible(true)
  }

  return <div {...props}>
    <ATipsCard
      visible={visible}
      // PopUpPisition={{top: 10}}
      onClose={() => setVisible(false)}
      trigger={
        <Input
          ref={searchInput}
          placeholder='搜索菜单'
          innerBefore={
            <Icon type="search" style={{ margin: 4 ,color: '#d3d3d3'}} />
          }
          onFocus={() => {
            if (isEmpty(menuOptions)) {
              setVisible(false)
            } else {
              setVisible(true)
            }
          }}
          onKeyDown={onEnter(() => {
            const selectMenu = menuOptions[0]
            getJumpPage(selectMenu)
          })}
          onChange={onSearchChange}
        ></Input>
    }>
      <div style={{background: '#fff', color: '#333'}}>
        {menuOptions.map((m, index) => {
          if (!m) return null
          return <div className={`pcs-tips-selector ${index == 0 && 'active' || ''}`} key={m.key} onClick={
            () => {getJumpPage(m)}
          }>
            {m.label}
          </div>
        })}
      </div>
    </ATipsCard>

  </div>
}
