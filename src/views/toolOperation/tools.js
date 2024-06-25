import React, { useState, useEffect, useRef } from 'react'
import { Tab, Input, } from '@/component'
import ToolRecord from './record'
import SearchTool from './search'
import { ToolComponentConfig } from './config'

App.title = '工具操作'
export default function App(props) {
  const { data, activeIndex } = props
  const [activeKey, setActiveKey] = useState('')
  // 获取参数表单配置
  function getFormModel(parameters) {
    const model = {}
    if (Array.isArray(parameters)) {
      parameters.forEach(p => {
        const isTextarea = p.uiType == 'textarea'
        const ToolComponent = ToolComponentConfig[p.uiType] || Input
        const isReturn = p.valueSeparator
        model[p.name] = {
          ...p,
          label: p.label || p.name,
          component: ToolComponent,
          required: p.require,
          span: isTextarea ? 24 : 12,
          attrs: {
            placeholder: isReturn ? '多个请使用回车换行分隔' : '请输入',
            rows: 20,
            getOptions: async() => p.options || []
          }
        }
      })
    }
    return model
  }
  return <div>
    <Tab
      animation={false}
      type="wrapped"
      tabPosition="left"
      navStyle={{height: 'calc(100vh - 250px)', overflow: 'auto'}}
      activeKey={activeKey || (data[0].name + '-' + activeIndex + '-' + 0)}
      onChange={(key) => {
        console.log(key)
        setActiveKey(key)
      }}
    >
      {data.map((item, index) => {
        const formModel = getFormModel(item.parameters || [])
        return <Tab.Item title={item.label} key={item.name + '-' + activeIndex + '-' + index}>
          <ToolRecord data={item}></ToolRecord>
          <SearchTool formModel={formModel} data={item}></SearchTool>
        </Tab.Item>
      })}
    </Tab>
  </div>

}