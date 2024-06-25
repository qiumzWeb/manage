import React, { useRef } from 'react'
import QueryList from '@/component/queryList/index'
import { qSearch, tColumns, searchApiUrl } from './config'
import ExportFile from '@/component/ExportFile/index'
import dayjs from 'dayjs'

export default function App(props) {
  const query = useRef()
  const beforeSearch = (req) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
    if (!data['startTime'] || !data['endTime']) return '请选择统计时间'
    if (dayjs(data['startTime']).add(90, 'day') < dayjs(data['endTime'])) return '统计起止时间范围最大支持选择90天';
  }
  
  return <div>
    {/* 查询列表 */}
    <QueryList
      ref={query}
      toolSearch
      initSearch={false}
      searchModel={qSearch}
      columns={tColumns}
      defaultValue='-'
      formatSearchParams={beforeSearch}
      tableOptions={{
        url: searchApiUrl,
        method: 'post',
        attrs: {
          defineFieldCode: 'aeDriftMonitor'
        }
      }}
    >
      <div slot="tools">
          <ExportFile
              params={() => query.current.getSearchParams().data || {}}
              beforeExport={() => query.current.getSearchParams()}
              btnProps={{mr: 0}}
              commandKey='AE_DRIFT_MONITOR'>
          </ExportFile>
      </div>
    </QueryList>
  </div>
}