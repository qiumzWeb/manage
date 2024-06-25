import React, {useState, useEffect, useRef} from 'react'
import {Tab} from '@/component'
import Detail from './detail'
import Summary from './board'
export default function App(props) {
    const [activeKey, setActiveKey] = useState('summary')
    const DetailRef = useRef()
    const TabChange = (key) => {
        setActiveKey(key)
    }
    const goDetail = (params, type) => {
        let detail = ''
        TabChange('details')
        console.log(params, 9999)
        setTimeout(() => {
          detail = DetailRef && DetailRef.current
          if (detail) {
            goDetails(detail, {
              warehouseId: params.warehouseId,
              startTime: params.startTime,
              endTime: params.endTime,
              detailType: params.detailType,
              content: params.content,
              contentShort: params.contentShort
            })
          }
        }, 500)
    }
    function goDetails (detail, data) {
        detail.field.reset()
        detail.field.setValues(data)
        detail.refresh()
    }
    return <div>
        <Tab activeKey={activeKey} onChange={TabChange}>
            <Tab.Item title="汇总看板" key="summary"><Summary goDetail={goDetail}></Summary></Tab.Item>
            <Tab.Item title="包裹明细" key="details"><Detail ref={DetailRef}></Detail></Tab.Item>
        </Tab>
    </div>
}