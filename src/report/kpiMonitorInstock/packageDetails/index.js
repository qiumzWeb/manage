import React, {useState, useEffect, useRef, useImperativeHandle} from 'react'
import { Button } from '@/component'
import QueryList from '@/component/queryList/index'
import { tColumns} from './config'
import ExportFile from '@/component/ExportFile/index'
import Api from 'assets/api'
export default React.forwardRef(function App(props, ref) {
  const beforeSearch = (req) => {
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
        url: '/kpi/monitor/instock/getKpiInstockPackageRecordDetailList',
        method: 'post',
        attrs: {
          defineFieldCode: 'KpiMonitorInStorePackageDetails'
        }
      }}
    >
      <div slot="tools">
        <ExportFile
          params={() => ref.current.getSearchParams().data}
          beforeExport={() => ref.current.getSearchParams()}
          btnProps={{mr: 0}}
          commandKey='AE_MANAGE_INSTOCK_KPI_DETAIL'
        ></ExportFile>
      </div>
    </QueryList>
  </div>
})