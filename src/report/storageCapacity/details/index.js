import React, {useState, useEffect, useRef, useImperativeHandle} from 'react'
import { Button } from '@/component'
import QueryList from '@/component/queryList/index'
import { qSearch, tColumns} from './config'
import ExportFile from '@/component/ExportFile/index'
import { filterNotEmptyData } from 'assets/js'
import Api from 'assets/api'
let skipSelectTimeCheck = false
let cacheData = ''
export default React.forwardRef(function App(props, ref) {
  const query = useRef()
  const beforeSearch = (req) => {
    if (!req.data.warehouseId) return '请选择仓库';
    // if (moment(s).add(90, 'day') < moment(e)) return '统计起止时间范围最大支持选择90天';
    const result = getParam(req.data)
    if (typeof result === 'string') return result
    const { pageNum, pageSize, ...searchData } = req.data
    // 判断是否是由汇总跳转查询
    if (cacheData && JSON.stringify(searchData) !== cacheData) {
      skipSelectTimeCheck = false
    }
    if (!cacheData) {
      cacheData = JSON.stringify(searchData)
    }
    req.data.skipSelectTimeCheck = skipSelectTimeCheck
    req.data = filterNotEmptyData(req.data)
  }
  useImperativeHandle(ref, () => ({
    search: (data, flag) => {
      const field = getQuery().field
      field.resetToDefault()
      skipSelectTimeCheck = flag
      cacheData = ''
      field.setValues(data)
      getQuery().refresh()
    }
  }))
  function getQuery() {
    return query && query.current
  }
  const formatData = () => {}
  function getParam(data) {
    if (!data) {
      data = query.current.field.getValues()
    }
    // 一段LP
    data.referLogisticsLPList = data.lp && data.lp.split(' ') || undefined
    if (data.referLogisticsLPList && data.referLogisticsLPList.length > 10) return '一段LP最多输入10个'
    delete data.lp
    // 一段运单号
    data.mailNoList = data.mailNo && data.mailNo.split(' ') || undefined
    if (data.mailNoList && data.mailNoList.length > 10) return '一段运单号最多输入10个'
    delete data.mailNo
    // 在库天数校验， 最多10位数，最多一位小数
    const reg = /^\d{0,10}([\b]*|\.|\.\d{0,1}|$)$/
    if(data.storedDay && !reg.test(data.storedDay)) return '在库天数格式有误'
    // // 时间
    // const [s, e] = data.warEntryTime || []
    // const [a, b] = data.onShelvesTime || []
    // // 入库日期
    // data.warEntryTimeStart = s || undefined
    // data.warEntryTimeEnd = e || undefined
    // delete data.warEntryTime
    // // 上架日期
    // data.onShelvesTimeStart = a || undefined
    // data.onShelvesTimeEnd = b || undefined
    // delete data.onShelvesTime
    return data
  }
  return <div>
  {/* 查询列表 */}
    <QueryList
      ref={query}
      toolSearch
      initSearch={false}
      searchModel={qSearch}
      columns={tColumns}
      defaultValue="-"
      defaultParams={{
        storedDayCompare: 'eq'
      }}
      columnWidth={150}
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: Api.getOnShelvesPackageDetailList,
        method: 'post',
        attrs: {
          defineFieldCode: 'storageCapacityDetails'
        }
      }}
    >
      <div slot="tools">
        <ExportFile params={() => ({
            ...getParam(),
            skipSelectTimeCheck,
          })}
          commandKey="STORAGE_CAPACITY_VISIBLE_DETAIL_EXPORT"
          beforeExport={() => getParam()}
          btnProps={{mr: 0}}
        ></ExportFile>
      </div>
    </QueryList>
  </div>
})