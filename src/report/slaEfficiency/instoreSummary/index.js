import React, {useState, useEffect, useRef} from 'react'
import { Button } from '@/component'
import QueryList from '@/component/queryList/index'
import { qSearch, tColumns, goDetailsKeys, searchApi, searchSumApi } from './config'
import ExportFile from '@/component/ExportFile/index'
import API from 'assets/api'
import { getRangTime } from '@/report/utils'
import { filterNotEmptyData } from 'assets/js'
export default function App(props) {
  const {goDetail} = props
  const query = useRef()
  const beforeSearch = (req) => {
    if (!req.data.warehouseId) return '请选择仓库';
    const data = req && req.data || {}
    const time = getRangTime(data, {
      time: 'kpiEndTimeScope',
      start: 'kpiEndTimeScopeStart',
      end: 'kpiEndTimeScopeEnd',
      fmt: ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59']
    })
    if (!time['kpiEndTimeScopeStart'] || !time['kpiEndTimeScopeEnd']) return '请选择KPI考核时间'
    return {
      ...req,
      data: filterNotEmptyData({
        ...data,
        ...time,
      })
    }
  }
  const formatData = (res, params, _, action) => {
    if (action == 6 && Array.isArray(res)) {
      res.forEach(data => {
        data['packageType'] = params.data['packageType']
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
        url: searchApi,
        sumUrl: searchSumApi,
        method: 'post',
        attrs: {
          defineFieldCode: 'SLAEfficiencyInStoreSummary'
        }
      }}
    >

      <div slot="tools">
        <ExportFile
          params={() => query.current.getSearchParams().data}
          beforeExport={() => query.current.getSearchParams()}
          // btnProps={{mr: 0}}
          commandKey='INSTOCK_SLA_STATISTIC'
        ></ExportFile>
      </div>
      {Object.entries(goDetailsKeys).map(([key, type]) => {
        return <div slot="tableCell" prop={key} key={key}>
          {(val, index, record) => {
            if (val == 0) return val
            return <Button text type="link" onClick={() => goDetail(record, type.value, 1)}>{val}</Button>
          }}
        </div>
      })}
    </QueryList>
  </div>
}