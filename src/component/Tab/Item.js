import React from 'react';
import { Tab } from '@alifd/next'
import { AssignProps, ProxyChild } from 'assets/js/proxy-utils'

function TabItem (props) {
  const {children, ...attrs} = props
  return <Tab.Item
    {...attrs}
  >
    <div style={{marginTop: 10}}></div>
    {ProxyChild(children)}
  </Tab.Item>
}

AssignProps(TabItem, Tab.Item)

export default TabItem