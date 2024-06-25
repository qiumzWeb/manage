import React, {useState, useEffect, useRef} from 'react'
import { Button } from '@/component'
import QueryList from '@/component/queryList/index'
import { qSearch, tColumns, searchApi, goDetailsKeys } from './config'
import ExportFile from '@/component/ExportFile/index'
import API from 'assets/api'
import { getRangTime, fmtTime } from '@/report/utils'
let createTime = []
export default function App(props) {
  const {goDetail} = props
  const query = useRef()
  const beforeSearch = (req) => {
    if (!req.data.warehouseId) return '请选择仓库';
    const data = req && req.data || {}
    createTime = data.createTime
    const time = getRangTime(data, {time: 'createTime', start: 'createTimeStart', end: 'createTimeEnd'})
    if (!time['createTimeStart'] || !time['createTimeEnd']) return '请选生成时间'
    return {
      ...req,
      data: {
        ...data,
        ...time,
      }
    }
  }
  const formatData = (res) => {
    res && Array.isArray(res.data) && res.data.forEach(d => {
      d.createTimeStart = fmtTime(createTime[0], 'YYYY-MM-DD HH:mm:ss')
      d.createTimeEnd = fmtTime(createTime[1], 'YYYY-MM-DD HH:mm:ss')
    })
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
      defaultValue='-'
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: searchApi,
        method: 'post',
        attrs: {
          defineFieldCode: 'bigPackageReport'
        }
      }}
    >
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