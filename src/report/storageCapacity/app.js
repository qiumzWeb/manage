import React, {useState, useEffect, useRef} from 'react'
import {Tab} from '@/component'
import Detail from './details'
import Summary from './summary'
import {isTrue} from 'assets/js'
import moment from 'moment'
let searchData = null
const districtGroup = [
    {label: '全仓维度', value: '0', key: '' },
    {label: '库区组维度', value: '1', key: 'warehouseDistrictGroup', relativeKey: 'entityName'},
    {label: '库区维度', value: '2', key: 'warehouseDistrictIdList', relativeKey: 'entityId'},
    {label: '巷道维度', value: '3', key: 'storeLaneWayList', relativeKey: 'entityName'},
    {label: '库区类型', value: '4'},
  ]
export default function App(props) {
    const [activeKey, setActiveKey] = useState('summary')
    const detailRef = useRef()
    const TabChange = (key) => {
        setActiveKey(key)
    }
    const goDetail = (params, packageStatus) => {
        searchData = params
        TabChange('details')
        setTimeout(() => {
            const detail = detailRef && detailRef.current
            if (detail) {
                getDetails(detail, {...params, packageStatus})
            }
        }, 500)
    }
    function getDetails (detail, data) {
        const searchData = {
            warehouseId: data.warehouseId,
            packageStatus: data.packageStatus
        }
        const sd = (districtGroup.find(d => d.value == data.entityTypeIntValue) || {})
        if (sd && sd.key) {
            searchData[sd.key] = data.entityTypeIntValue == '1' ? data[sd.relativeKey] : [data[sd.relativeKey]]
        }
        detail.search(searchData, true)
    }
    return <div>
        <Tab activeKey={activeKey} onChange={TabChange}>
            <Tab.Item title="汇总" key="summary"><Summary goDetail={goDetail}></Summary></Tab.Item>
            <Tab.Item title="明细" key="details"><Detail ref={detailRef}></Detail></Tab.Item>
        </Tab>
    </div>
}