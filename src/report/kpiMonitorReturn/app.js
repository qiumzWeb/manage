import React, {useState, useEffect, useRef} from 'react'
import {Tab} from '@/component'
import Detail from './details'
import Summary from './summary'
import {isTrue} from 'assets/js'
import moment from 'moment'
import { getDateToRangTime } from '@/report/utils'
export default function App(props) {
    const [activeKey, setActiveKey] = useState('summary')
    const DetailRef = useRef()
    const TabChange = (key) => {
        setActiveKey(key)
    }
    const goDetail = (params, type) => {
        let detail = ''
        TabChange('details')
        setTimeout(() => {
          detail = DetailRef && DetailRef.current
          if (detail) {
            goDetails(detail, {
              detailType: type,
              warehouseId: params.warehouseId,
              startTime: params.startTime,
              endTime: params.endTime,
              timeField: params.timeField
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
            <Tab.Item title="汇总" key="summary"><Summary goDetail={goDetail}></Summary></Tab.Item>
            <Tab.Item title="包裹明细" key="details"><Detail ref={DetailRef}></Detail></Tab.Item>
        </Tab>
    </div>
}