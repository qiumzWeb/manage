import React, {useState, useEffect, useRef} from 'react'
import {Tab} from '@/component'
import Detail from './details'
import Summary from './summary'
import PackageDetail from './packageDetails'
import dayjs from 'dayjs'
import { fmtTime } from '@/report/utils'
let searchData = null
export default function App(props) {
    const [activeKey, setActiveKey] = useState('summary')
    const packageDetailRef = useRef()
    const detailRef = useRef()
    const TabChange = (key) => {
        setActiveKey(key)
    }
    const goDetail = (record, type) => {
      const paramsKeys = ['warehouseId', 'bigBagType', 'preCpresCode', 'status', 'signRegion']
      if (type == 1) {
        let params = {
          createTime: [dayjs(record.createTimeStart), dayjs(record.createTimeEnd)]
        };
        paramsKeys.forEach(k => params[k] = record[k])
        searchData = params
        TabChange('details')
        setTimeout(() => {
            const detail = detailRef && detailRef.current
            if (detail) {
                getDetails(detail, {...params})
            }
        }, 500)
      }
      if (type == 2) {
        let params = {
          createTimeStart: fmtTime(record.createTimeStart, 'YYYY-MM-DD HH:mm:ss'),
          createTimeEnd: fmtTime(record.createTimeEnd, 'YYYY-MM-DD HH:mm:ss')
        };
        paramsKeys.forEach(k => params[k] = record[k])
        searchData = params
        TabChange('PackageDetail')
        setTimeout(() => {
            const detail = packageDetailRef && packageDetailRef.current
            if (detail) {
                getDetails(detail, {...params})
            }
        }, 500)
      }

  }
  function goPackageDetail(record, packageStatus) {
    const paramsKeys = ['warehouseId', 'bigBagId']
    let params = {
      packageStatus
    };
    paramsKeys.forEach(k => params[k] = record[k])
    searchData = params
    TabChange('PackageDetail')
    setTimeout(() => {
        const detail = packageDetailRef && packageDetailRef.current
        if (detail) {
            getDetails(detail, {...params})
        }
    }, 500)
  }
  function getDetails (detail, data) {
      detail.field.reset()
      detail.field.setValues(data)
      detail.refresh()
  }
    return <div>
        <Tab activeKey={activeKey} onChange={TabChange}>
            <Tab.Item title="汇总" key="summary"><Summary goDetail={goDetail}></Summary></Tab.Item>
            <Tab.Item title="大包明细" key="details"><Detail ref={detailRef} goDetail={goPackageDetail}></Detail></Tab.Item>
            <Tab.Item title="包裹明细" key="PackageDetail"><PackageDetail ref={packageDetailRef}></PackageDetail></Tab.Item>
        </Tab>
    </div>
}