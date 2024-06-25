import React, {useState, useEffect} from 'react';
import { Tab, Button } from "@/component";
import DataQuery from "./components/dataquery";
import ModelConfig from "./components/modelconfig";
import { getUuid } from 'assets/js'

/**
 * 集运宝360工具
 * @type {string}
 */
App.title = "集运宝360";
export default function App() {
  const [queryList, setQueryList] = useState(['base'])
  const [activeKey, setActiveKey] = useState('base')
  function onChange(key) {
    setActiveKey(key)
  }
  function add() {
    const uid = getUuid()
    setQueryList(queryList.concat([uid]))
    setActiveKey(uid)
  }
  function onClose(targetKey) {
    const panes = [];
    queryList.forEach(key => {
      if (key != targetKey) {
        panes.push(key);
      }
    });
    if (targetKey == activeKey) {
      setActiveKey(panes.slice(-1)[0])
    }
    setQueryList(panes)
  }
  return (
    <div>
      <Tab
        activeKey={activeKey}
        onChange={onChange}
        onClose={onClose}
        navStyle={{paddingRight:200}}
        extra={<Button onClick={add}>添加查询窗口</Button>}
      >
        {[
          <Tab.Item key="config" title={'数据表配置'}>
            <ModelConfig />
          </Tab.Item>
        ].concat(queryList.map(query =><Tab.Item key={query}
          closeable={query != 'base'}
          title={<span>数据查询</span>}>
            <DataQuery />
          </Tab.Item>))}
      </Tab>
    </div>
  )
}
