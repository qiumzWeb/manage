import React, {useState, useEffect, useRef} from 'react'
import {Tab} from '@/component'
import InstoreDetail from './instoreDetails'
import InstoreSummary from './instoreSummary'
import OutstoreDetail from './outstoreDetails'
import OutstoreSummary from './outstoreSummary'
import {isTrue} from 'assets/js'
import moment from 'moment'
import { getDateToRangTime } from '@/report/utils'
let searchData = null
export default function App(props) {
    const [activeKey, setActiveKey] = useState('InstoreSummary')
    const instoreDetailRef = useRef()
    const outstoreDetailRef = useRef()
    const TabChange = (key) => {
        setActiveKey(key)
    }
    const goDetail = (params, type, flag) => {
        searchData = params
        let detail = ''
        if (flag == 1) {
          TabChange('InstoreDetail')
          setTimeout(() => {
            detail = instoreDetailRef && instoreDetailRef.current
            if (detail) {
              goDetails(detail, {
                type,
                warehouseId: params.warehouseId,
                kpiEndTimeScope: getDateToRangTime(params.kpiEndTime),
                packageType: params.packageType
              })
            }
          }, 500)
        } else {
          TabChange('OutstoreDetail')
          setTimeout(() => {
            detail = outstoreDetailRef && outstoreDetailRef.current
            if (detail) {
              goDetails(detail, {
                type,
                warehouseId: params.warehouseId,
                kpiEndTimeScope: getDateToRangTime(params.kpiEndTime),
                turnoverType: params.turnoverType
              })
            }
          }, 500)
        }
    }
    function goDetails (detail, data) {
        detail.field.reset()
        detail.field.setValues(data)
        detail.refresh()
    }
    return <div>
        <Tab activeKey={activeKey} onChange={TabChange}>
            <Tab.Item title="入库汇总" key="InstoreSummary"><InstoreSummary goDetail={goDetail}></InstoreSummary></Tab.Item>
            <Tab.Item title="入库明细" key="InstoreDetail"><InstoreDetail ref={instoreDetailRef}></InstoreDetail></Tab.Item>
            <Tab.Item title="出库汇总" key="OutstoreSummary"><OutstoreSummary goDetail={goDetail}></OutstoreSummary></Tab.Item>
            <Tab.Item title="出库明细" key="OutstoreDetail"><OutstoreDetail ref={outstoreDetailRef}></OutstoreDetail></Tab.Item>
        </Tab>
    </div>
}