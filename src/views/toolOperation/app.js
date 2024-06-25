import React, { useState, useEffect, useRef } from 'react'
import { Tab, Message } from '@/component'
import { isEmpty,  } from 'assets/js'
import { getToolList } from './api'
import ToolsTab from './tools'

App.title = '工具操作'
export default function App(props) {
  const [group, setGroup] = useState([])
  const [tools, setTools] = useState([])
  useEffect(() => {
    getToolList.then(list => {
      if (isEmpty(list)) return
      if (Array.isArray(list.groups)) {
        setGroup(list.groups)
      }
      if (Array.isArray(list.tools)) {
        setTools(list.tools)
      }
    }).catch(e => {
      Message.error(e.message)
    })
  }, [])
  return <div>
    <Tab defaultActiveKey={0}>
      {
        group.map((g, index) => {
          const itemBtns = tools.filter(t => t.group == g.name) || []
          return !isEmpty(itemBtns) && <Tab.Item title={g.desc} key={index}>
            <ToolsTab data={itemBtns} activeIndex={index}></ToolsTab>
          </Tab.Item> || null
        })
      }
    </Tab>
  </div>

}