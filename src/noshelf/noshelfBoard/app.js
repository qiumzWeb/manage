import React, {useState} from 'react';
import { Message, Card, Tab } from '@/component'
import BoardList from './boardList'
import SortingWall from './sortingWall'
export default function App(props) {
  const [activeKey, setActiveKey] = useState('boardList')
  function onChange(key) {
    setActiveKey(key)
  }
  return <Tab activeKey={activeKey} onChange={onChange}>
    <Tab.Item title="数据看板" key="boardList">
        <BoardList isActive={activeKey == 'boardList'}></BoardList>
    </Tab.Item>
    <Tab.Item title="分拣墙" key='sortingWall'>
      <SortingWall isActive={activeKey == 'sortingWall'}></SortingWall>
    </Tab.Item>
  </Tab>
}