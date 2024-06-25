import React, {useState, useEffect, useRef} from 'react'
import { Button, ExportFile } from '@/component'
import QueryList from '@/component/queryList/index'
import { qSearch, tColumns, searchApi, goDetailsKeys, searchSumApi, FlowPickSearchApi, FlowPickSearchSumApi } from './config'
import API from 'assets/api'
import { getRangDate, getRangTime } from '@/report/utils'
import { isEmpty } from 'assets/js'
export default function App(props) {
  const {goDetail} = props
  const query = useRef()
  const beforeSearch = (req) => {
    const data = getParams(req.data)
    if (typeof data === 'string') return data
    return {
      ...req,
      data
    }
  }
  const formatData = (res, params, _, action) => {
    if (action == 6 && Array.isArray(res)) {
      res.forEach(data => {
        data['turnoverType'] = params.data['turnoverTypes']
        data['districtGroupIds'] = params.data['districtGroupList']
        data['districtIds'] = params.data['districtList']
      })
    }
  }
  function getParams(data) {
    if (!data) {
      data = query.current && query.current.field && typeof query.current.field.getValues === 'function' && query.current.field.getValues() || {};
    }
    if (!data.warehouseId) return '请选择仓库';
    let time = {}
    if (data.operatingTimeType != '1') {
      time = getRangTime(data, {time: 'makeTime1', start: 'startDate', end: 'endDate'})
      delete data.makeTime
    } else {
      time = getRangDate(data, {time: 'makeTime', start: 'startDate', end: 'endDate'})
      delete data.makeTime1
    }
    if (isEmpty(time['startDate']) || isEmpty(time['endDate'])) return '请选择统计时间'
    if (isEmpty(data.turnoverTypes)) return '请选择包裹类型'
    return {
      ...data,
      ...time,
      tabQueryType: '0'
    }
  }
  return <div>
  {/* 查询列表 */}
    <QueryList
      ref={query}
      toolSearch
      initSearch={false}
      searchModel={qSearch}
      columns={tColumns}
      columnWidth={140}
      defaultValue='-'
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: params => params.pickingMode == '7' ? FlowPickSearchApi : searchApi,
        sumUrl: params => params.pickingMode == '7' ? FlowPickSearchSumApi : searchSumApi,
        method: 'post',
        attrs: {
          defineFieldCode: 'KpiMonitorOutStoreSummary'
        }
      }}
    >
      <div slot="tools">
        {(queryList) => {
          if (queryList.field.getValues().pickingMode == '7') return null;
          return <ExportFile params={() => getParams()} beforeExport={() => getParams()}></ExportFile>
        }}
      </div>
      {Object.entries(goDetailsKeys).map(([key, type]) => {
        return <div slot="tableCell" prop={key} key={key}>
          {(val, index, record) => {
            if (isEmpty(val)) return '-'
            if (val == 0) return val
            return <Button text type="link" onClick={() => goDetail(record, type)}>{val}</Button>
          }}
        </div>
      })}
    </QueryList>
  </div>
}