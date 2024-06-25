import React, {useState, useEffect, useRef} from 'react'
import { Button, ExportFile } from '@/component'
import QueryList from '@/component/queryList/index'
import { tColumns} from './config'
import { isEmpty } from 'assets/js'
export default React.forwardRef(function App(props, ref) {
  const {goDetail} = props
  const beforeSearch = (req) => {
    if (!req.data.warehouseId) return '请选择仓库';
  }
  const formatData = (res, params, _) => {
    return {
      ...res,
      data: Array.isArray(res.data) && res.data.map(d => ({
        ...d,
        pickingMode: params.data.pickingMode
      }))
    }
  }
  function getParams() {
    return ref.current.field.getValues()
  }
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
        url: params => params.pickingMode == '7' ? 'kpi/monitor/flowPick/detail' : '/kpi/monitor/outstock/ae/manage/getKpiOutstockOrderDetailList',
        method: 'post',
        attrs: {
          defineFieldCode: 'KpiMonitorOutStorePackageDetails'
        }
      }}
    >
      <div slot="tools">
        {(queryList) => {
          const params = queryList.field.getValues();
          if (isEmpty(params) || params.pickingMode == '7') return null;
          return <ExportFile
            params={() => getParams()}
            btnProps={{mr: 0}}
            commandKey="AE_MANAGE_OUTSTOCK_KPI_DETAIL"
          ></ExportFile>
        }}
      </div>
    </QueryList>
  </div>
})