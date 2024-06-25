import React, {useState, useEffect, useRef} from 'react'
import { Button } from '@/component'
import QueryList from '@/component/queryList/index'
import {  tColumns, searchApi, goDetailsKeys } from '../summary/config'
import { qSearch } from './config'
import ExportFile from '@/component/ExportFile/index'
import { getRangDate } from '@/report/utils'
import { isEmpty } from 'assets/js'
export default function App(props) {
  const {goDetail} = props
  const query = useRef()
  const beforeSearch = (req) => {
    if (!req.data.warehouseId) return '请选择仓库';
    const data = req && req.data || {}
    const time = getRangDate(data, {time: 'makeTime', start: 'startDate', end: 'endDate'})
    if (isEmpty(data.turnoverTypes)) return '请选择包裹类型'
    return {
      ...req,
      data: {
        ...data,
        ...time,
        summaryRange: '1'
      }
    }
  }
  const formatData = () => {}
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
        method: 'post',
        attrs: {
          defineFieldCode: 'KpiMonitorInStoreDetails'
        }
      }}
    >
      <div slot="tools">
        <ExportFile
          params={() => query.current.getSearchParams().data}
          beforeExport={() => query.current.getSearchParams()}
          btnProps={{mr: 0}}
        ></ExportFile>
      </div>
      {Object.entries(goDetailsKeys).map(([key, type]) => {
        return <div slot="tableCell" prop={key} key={key}>
          {(val, index, record) => {
            if (val == 0) return val
            return <Button text type="link" onClick={() => goDetail(record, type)}>{val}</Button>
          }}
        </div>
      })}
    </QueryList>
  </div>
}