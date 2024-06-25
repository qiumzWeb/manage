import React, {useState, useEffect, useRef} from 'react'
import { Button } from '@/component'
import QueryList from '@/component/queryList/index'
import { tColumns, searchApiUrl} from './config'
import ExportFile from '@/component/ExportFile/index'
export default React.forwardRef(function App(props, ref) {

  const beforeSearch = (req) => {
    console.log(req, 999)
    if (!req.data.warehouseId) return '请选择仓库';
  }
  const formatData = () => {}
  return <div>
  {/* 查询列表 */}
    <QueryList
      ref={ref}
      toolSearch={false}
      initSearch={false}
      columns={tColumns}
      columnWidth={150}
      defaultValue="-"
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: searchApiUrl,
        method: 'post',
        attrs: {
          defineFieldCode: 'KPI_REVERSAL_STATISTIC_DETAIL'
        }
      }}
    >
      <div slot="tools">
        <ExportFile
          params={() => ref.current.getSearchParams().data}
          beforeExport={() => ref.current.getSearchParams()}
          btnProps={{mr: 0}}
          commandKey='KPI_REVERSAL_STATISTIC_DETAIL'
        ></ExportFile>
      </div>
    </QueryList>
  </div>
})