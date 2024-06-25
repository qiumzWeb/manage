import React, {useState, useEffect, useRef} from 'react'
import {Tab} from '@/component'
import Detail from './details'
import Summary from './summary'
import PackageDetail from './packageDetails'
import { getChildren } from 'assets/js/proxy-utils'
import {isTrue, sumDataCode} from 'assets/js'
import { goDetailOfFlowPicker } from './summary/config'
let searchData = null
export default function App(props) {
    const [activeKey, setActiveKey] = useState('summary')
    const packageDetailRef = useRef()
    const TabChange = (key) => {
        setActiveKey(key)
    }
    const goDetail = (record, type) => {
      let searchDatas = record.operatingDateRange && record.operatingDateRange.split("至") || [];
      const getDistrictValue = (data, key, rang) => {
          return rang.some(r => r == data.searchRangeType) ? [] : [(data[key] || 0)]
      }
      const isSum = record[sumDataCode]
      
      let params = {
          warehouseId: record.warehouseId,
          operatingTimeType: record.operatingTimeType,
          turnoverTypes: getChildren(record.turnoverType),
          districtGroupIds: isSum ? record.districtGroupIds : getDistrictValue(record, 'districtGroupId', [0, 2]),
          districtIds: isSum ? record.districtIds : getDistrictValue(record, 'districtId', [0, 1]),
          startDate: searchDatas[0],
          endDate: searchDatas[1],
          type,
          pickingMode: record.pickingMode,
          searchRangeType: record.searchRangeType,
      };
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
            <Tab.Item title="小时明细" key="details"><Detail goDetail={goDetail}></Detail></Tab.Item>
            <Tab.Item title="包裹明细" key="PackageDetail"><PackageDetail ref={packageDetailRef}></PackageDetail></Tab.Item>
        </Tab>
    </div>
}