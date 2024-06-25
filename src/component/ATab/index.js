import React, {useState, useEffect, useRef} from 'react'
import {Tab} from '@/component'
import { getUuid, isEmpty, getObjType } from 'assets/js'
import { isComponent } from 'assets/js/proxy-utils'
export default function ATab(props) {
  const { value, onChange, children, ...attrs } = props
  const newValue = getTabItemList()
  const [tabItem, setTabItem] = useState(newValue)
  const [activeKey, setActiveKey] = useState(newValue[0]?.key)

  useEffect(() => {
    setTabItem(newValue)
  }, [value])

  // 设置tabList
  function getTabItemList() {
    if (Array.isArray(value)) {
      return value.filter(f => !isEmpty(f)).map((v, index) => {
        const key = v.key || getUuid(index);
        const title = v.title || '  ';
        const Component = isComponent(v.item) ? v.item
                        : isComponent(v) ? v
                        : () => {};
      
        return { key, Component, title, ref: useRef() }
      })
    }
    return []
  }
  // 变动
  const TabChange = (key) => {
    setActiveKey(key)
    typeof onChange === 'function' && onChange(key)
  }
  return <div className='pcs-a-tab'>
      <Tab {...attrs} activeKey={activeKey} onChange={TabChange}>
        {tabItem.map((Item) => {
          return <Tab.Item
            title={Item.title}
            key={Item.key}
          >
          <Item.Component
            {...attrs}
            setTab={TabChange}
            key={Item.key}
            name={Item.title}
            ref={Item.ref}
            items={tabItem}
          ></Item.Component>
        </Tab.Item>
        })}
        {children}
      </Tab>
  </div>
}