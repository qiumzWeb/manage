import React, {useState, useEffect, useRef} from 'react'
import { Button } from '@/component'
import QueryList from '@/component/queryList/index'
import { qSearch, tColumns} from './config'
import ExportFile from '@/component/ExportFile/index'
import Api from 'assets/api'
import { getRangTime } from '@/report/utils'
import { filterNotEmptyData } from 'assets/js'
export default React.forwardRef(function App(props, ref) {
  const {goDetail} = props
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
  const formatData = () => {}
  return <div>
  {/* 查询列表 */}
    <QueryList
      ref={ref}
      toolSearch
      initSearch={false}
      searchModel={qSearch}
      columns={tColumns}
      columnWidth={150}
      defaultValue="-"
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: '/sla/monitor/instock/detail',
        method: 'post',
        attrs: {
          defineFieldCode: 'SLAEfficiencyInStoreDetails'
        }
      }}
    >
      <div slot="tools">
        <ExportFile
          params={() => ref.current.getSearchParams().data}
          beforeExport={() => ref.current.getSearchParams()}
          btnProps={{mr: 0}}
          commandKey='INSTOCK_SLA_DETAIL'
        ></ExportFile>
      </div>
    
    </QueryList>
  </div>
})