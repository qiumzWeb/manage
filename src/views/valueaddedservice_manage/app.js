import React, {useState, useEffect, useRef} from 'react'
import {Tab} from '@/component'
import Report from './report'
import Manage from './manage'
export default function App(props) {
    const [activeKey, setActiveKey] = useState('manage')
    const TabChange = (key) => {
        setActiveKey(key)
    }
    return <div>
        <Tab activeKey={activeKey} onChange={TabChange}>
            <Tab.Item title="管理配置" key="manage"><Manage></Manage></Tab.Item>
            <Tab.Item title="数据报表" key="report"><Report></Report></Tab.Item>
        </Tab>
    </div>
}