import React, {useState, useEffect, useRef} from 'react'
import {Tab} from '@/component'
import Detail from './details'
import Summary from './summary'
import PackageDetail from './packageDetails'
import {isTrue, sumDataCode} from 'assets/js'
import moment from 'moment'
let searchData = null
export default function App(props) {
    const [activeKey, setActiveKey] = useState('summary')
    const detailRef = useRef()
    const TabChange = (key) => {
        setActiveKey(key)
    }
    const goDetail = (record, type) => {
        let searchDatas = record.operatingDateRange && record.operatingDateRange.split("至") || [];
        // let serviceTypeEnumList = this.state.serviceTypeEnumList;
        const getDistrictValue = (data, key) => {
            const config = {
              districtGroupId: [0, 2, 3, 4],
              districtId: [0, 1, 3, 4]
            }
            const rang = config[key] || []
            return rang.some(r => r == data.searchRangeType) ? [] : [(data[key] || 0)]
        }
        const isSum = record[sumDataCode]
        let params = {
            warehouseId: record.warehouseId,
            districtGroupIds: isSum ? record.districtGroupIds : getDistrictValue(record, 'districtGroupId'),
            districtIds: isSum ? record.districtIds  : getDistrictValue(record, 'districtId'),
            operatingTimeType: record.operatingTimeType,
            startDate: searchDatas[0],
            endDate: searchDatas[1],
            // serviceTypeEnumList: serviceTypeEnumList,
            searchRangeType: record.searchRangeType,
            turnoverType: isSum ? undefined : record.packageType,
            turnoverTypes: isSum ? record.packageType: undefined,
            type
        };
        searchData = params
        TabChange('PackageDetail')
        setTimeout(() => {
            const detail = detailRef && detailRef.current
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
            <Tab.Item title="包裹明细" key="PackageDetail"><PackageDetail ref={detailRef}></PackageDetail></Tab.Item>
        </Tab>
    </div>
}