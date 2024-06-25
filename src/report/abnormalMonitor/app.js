import React, {useState, useEffect, useRef} from 'react'
import {Tab} from '@/component'
import DataBoard from './dataBoard'
import NormalDetail from './details'
import NormalSummary from './summary'
import {isTrue} from 'assets/js'
import moment from 'moment'
import dayjs from 'dayjs'
import { getDateToRangTime, getAliWeekValues, getAliWeekRange } from '@/report/utils'
let searchData = null
export default function App(props) {
    const [activeKey, setActiveKey] = useState('dataBoard')
    const detailRef = useRef()
    const TabChange = (key) => {
        setActiveKey(key)
    }
    const goDetail = (params, type) => {
        if (type == 1) {
          if (params.makingTime) {
            // 看板
            const aliWeekValue =  getAliWeekRange(dayjs(+dayjs('1970-01-01 00:00:00') + Number(params.makingTime) * 7 * 24 * 60 * 60 * 1000))
            const timeOpt = {
              1: getDateToRangTime(params.makingTime),
              2: aliWeekValue.map(a => dayjs(a)),
              3: [dayjs(params.makingTime).startOf('month'), dayjs(params.makingTime).endOf('month')],
            }
            params.markingTime = timeOpt[params.showRangeType] || []
          } else {
            params.markingTime = []
          }
          params.confirmedStatusCodeList = isTrue(params.confirmType) && [params.confirmType] || []
        } else {
          // 汇总
          const [s, e] = (params.intervalTime || '').split('~')
          params.markingTimeS = s && moment(s) || ''
          params.markingTimeE = e && moment(e) || ''
          params.markingTime = [params.markingTimeS, params.markingTimeE]
          params.confirmedStatusCodeList = isTrue(params.confirmedType) && [params.confirmedType] || []
        }
        searchData = params
        TabChange('details')
        setTimeout(() => {
            const detail = detailRef && detailRef.current
            if (detail) {
                getDetails(detail, {...params})
            }
        }, 500)
    }
    function getDetails (detail, data) {
        data.markNodeTypeCodeList = isTrue(data.markNodeType) && [data.markNodeType] || []
        data.packageTypeCodeList= isTrue(data.packageType) && [data.packageType] || []
        detail.field.reset()
        detail.field.setValues(data)
        detail.handleSearch()
    }
    return <div>
        <Tab activeKey={activeKey} onChange={TabChange}>
            <Tab.Item title="数据看板" key="dataBoard"><DataBoard goDetail={(record) => goDetail(record, 1)}></DataBoard></Tab.Item>
            <Tab.Item title="汇总" key="summary"><NormalSummary goDetail={(record) => goDetail(record, 2)}></NormalSummary></Tab.Item>
            <Tab.Item title="明细" key="details"><NormalDetail ref={detailRef}></NormalDetail></Tab.Item>
        </Tab>
    </div>
}