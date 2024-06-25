import React, {useState, useEffect, useRef} from 'react'
import { Button, ExportFile } from '@/component'
import QueryList from '@/component/queryList/index'
import { tColumns, searchHourApi, goDetailsKeys, FlowPickSearchApi } from '../summary/config'
import { qSearch } from './config'
import { getRangDate } from '@/report/utils'
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
  const formatData = () => {}
  function getParams(data) {
    if(!data) data = query.current.field.getValues()
    if (!data.warehouseId) return '请选择仓库';
    const time = getRangDate(data, {time: 'makeTime', start: 'startDate', end: 'endDate'})
    if (!time['startDate'] || !time['endDate']) return '请选择统计时间'
    return {
      ...data,
      ...time,
      tabQueryType: '1'
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
      defaultValue="-"
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: params => params.pickingMode == '7' ? FlowPickSearchApi : searchHourApi,
        method: 'post',
        attrs: {
          defineFieldCode: 'KpiMonitorOutStoreDetails'
        }
      }}
    >
      <div slot="tools">
        {(queryList) => {
          if (queryList.field.getValues().pickingMode == '7') return null;
          return <ExportFile
          params={() => getParams()}
          beforeExport={() => getParams()}
          btnProps={{mr: 0}}
        ></ExportFile>
        }}
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