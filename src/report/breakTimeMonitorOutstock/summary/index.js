import React, {useState, useEffect, useRef} from 'react'
import { Button } from '@/component'
import QueryList from '@/component/queryList/index'
import { qSearch, tColumns, searchApiUrl, goDetailsKeys, searchSumApiUrl } from './config'
import ExportFile from '@/component/ExportFile/index'
export default function App(props) {
  const {goDetail} = props
  const query = useRef()
  const beforeSearch = (req) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
    if (!data['startTime'] || !data['endTime']) return '请选择统计时间'
  }
  const formatData = (res, params, _, action) => {
    if (action == 6 && Array.isArray(res)) {
      res.forEach(data => {
        data['turnoverType'] = params.data['turnoverType']
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
      columnWidth={150}
      defaultValue="-"
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: searchApiUrl,
        sumUrl: searchSumApiUrl,
        method: 'post',
        attrs: {
          defineFieldCode: 'breakTimeMonitorOutstockSummary'
        }
      }}
    >
      <div slot="tools">
        <ExportFile
          params={() => query.current.getSearchParams().data}
          beforeExport={() => query.current.getSearchParams()}
        ></ExportFile>
      </div>
      {Object.entries(goDetailsKeys).map(([key, type]) => {
        return <div slot="tableCell" prop={key} key={key}>
          {(val, index, record) => {
            if (val == 0 || !val) return val || 0;
            return <Button text type="link" onClick={() => goDetail(record, type.value)}>{val}</Button>
          }}
        </div>
      })}
    </QueryList>
  </div>
}