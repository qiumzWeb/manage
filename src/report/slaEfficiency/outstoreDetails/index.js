import React, {useState, useEffect, useRef} from 'react'
import { Button } from '@/component'
import QueryList from '@/component/queryList/index'
import { qSearch, tColumns, searchApiUrl} from './config'
import ExportFile from '@/component/ExportFile/index'
import Api from 'assets/api'
import { getRangTime } from '@/report/utils'
import { filterNotEmptyData } from 'assets/js'
export default React.forwardRef(function App(props, ref) {
  const {goDetail} = props
  const beforeSearch = (req) => {
    if (!req.data.warehouseId) return '请选择仓库';
    // if (moment(s).add(90, 'day') < moment(e)) return '统计起止时间范围最大支持选择90天';
    const data = req && req.data || {}
    const time = getRangTime(data, {
      time: 'kpiEndTimeScope',
      start: 'kpiEndTimeScopeStart',
      end: 'kpiEndTimeScopeEnd',
      fmt: ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59']
    })
    // if (!time['kpiEndTimeScopeStart'] || !time['kpiEndTimeScopeEnd']) return '请选择统计时间'
    const result = getParam(req.data)
    if (typeof result == 'string') return result
    return {
      ...req,
      data: filterNotEmptyData({
        ...req.data,
        ...time
      })
    }
  }
  const formatData = () => {}
  function getParam(data) {
    if (!data) {
      data = ref.current.field.getValues()
    }
    // 二段LP
    data.orderLogisticsCode = data.orderLogisticsCode && data.orderLogisticsCode.split(' ').filter(d => d && d.trim()) || undefined
    if (data.orderLogisticsCode && data.orderLogisticsCode.length > 20) return '二段LP最多输入20个'
    delete data.lp
    // 二段订单号
    data.delegationNo = data.delegationNo && data.delegationNo.split(' ').filter(d => d && d.trim()) || undefined
    if (data.delegationNo && data.delegationNo.length > 20) return '二段订单号最多输入20个'
    return data
  }
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
        url: searchApiUrl,
        method: 'post',
        attrs: {
          defineFieldCode: 'SLAEfficiencyOutStoreDetails'
        }
      }}
    >
      <div slot="tools">
        <ExportFile
          params={() => ref.current.getSearchParams().data}
          beforeExport={() => ref.current.getSearchParams()}
          btnProps={{mr: 0}}
          commandKey='OUT_STOCK_SLA_DETAIL'
        ></ExportFile>
      </div>
    </QueryList>
  </div>
})