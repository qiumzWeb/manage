import React, {useState, useEffect, useRef} from 'react'
import { Button } from '@/component'
import QueryList from '@/component/queryList/index'
import { qSearch, tColumns, searchApi, goDetailsKeys, searchSumApi } from './config'
import ExportFile from '@/component/ExportFile/index'
import { getRangDate, getRangTime } from '@/report/utils'
import { isEmpty } from 'assets/js'
export default function App(props) {
  const {goDetail} = props
  const query = useRef()
  const beforeSearch = (req) => {
    if (!req.data.warehouseId) return '请选择仓库';
    const data = req && req.data || {}
    let time = {}
    if (data.operatingTimeType != '3') {
      time = getRangTime(data, {time: 'makeTime1', start: 'startDate', end: 'endDate'})
      delete data.makeTime
    } else {
      time = getRangDate(data, {time: 'makeTime', start: 'startDate', end: 'endDate'})
      delete data.makeTime1
    }
    if (isEmpty(time['startDate']) || isEmpty(time['endDate'])) return '请输入统计时间'
    if (isEmpty(data.turnoverTypes)) return '请选择包裹类型'
    return {
      ...req,
      data: {
        ...data,
        ...time,
        summaryRange: '0'
      }
    }
  }
  const formatData = (res, params, format, action) => {
    // 处理汇总数据
    if (action == 6 && Array.isArray(res)) {
      res.forEach(data => {
        data['packageType'] = params.data['turnoverTypes']
        data['districtGroupIds'] = params.data['districtGroupList']
        data['districtIds'] = params.data['districtList']
      })
    }
  }
  function getParams() {
    return query.current.field.getValues()
  }

  return <div>
  {/* 查询列表 */}
    <QueryList
      ref={query}
      toolSearch
      initSearch={false}
      searchModel={qSearch}
      columns={tColumns}
      columnWidth={180}
      defaultValue="-"
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: searchApi,
        sumUrl: searchSumApi,
        method: 'post',
        attrs: {
          defineFieldCode: 'KpiMonitorInStoreSummary'
        }
      }}
    >
      <div slot="tools">
        <ExportFile
          params={() => query.current.getSearchParams().data}
          beforeExport={() => query.current.getSearchParams()}
          // btnProps={{mr: 0}}
        ></ExportFile>
      </div>
      {Object.entries(goDetailsKeys).map(([key, type]) => {
        return <div slot="tableCell" prop={key} key={key}>
          {(val, index, record) => {
            if (val == 0) return val
            if (!val) return '-'
            return <Button text type="link" onClick={() => goDetail(record, type)}>{val}</Button>
          }}
        </div>
      })}
    </QueryList>
  </div>
}