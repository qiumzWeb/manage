import React, {useState, useEffect, useRef} from 'react'
import { Button } from '@/component'
import QueryList from '@/component/queryList/index'
import { qSearch, tColumns, defaultSearchTime, getTime} from './config'
import ExportFile from '@/component/ExportFile/index'
import dayjs from 'dayjs'
export default function App(props) {
  const {goDetail} = props
  const query = useRef()
  const [params, setParams] = useState({})
  const beforeSearch = (req) => {
    const [s, e] = req.data.markingTime || []
    if (!req.data.warehouseId) return '请选择仓库';
    if (!s || !e) return '请选择统计时间范围';
    if (dayjs(s).add(31, 'day') < e) return '统计起止时间范围最大支持选择31天';
    req.data.markingTimeS = s
    req.data.markingTimeE = e
    setParams({...(req.data || {})})
    delete req.data.markingTime
  }
  const formatData = () => {}
  return <div>
  {/* 查询列表 */}
    <QueryList
      ref={query}
      toolSearch
      initSearch={false}
      searchModel={qSearch}
      columns={tColumns}
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: '/job/abnormalPackage/total/list',
        method: 'post',
        attrs: {
          defineFieldCode: 'abnormalMonitorSummary'
        }
      }}
    >
      <div slot="tools">
        <ExportFile params={() => ({
          markingTimeS: defaultSearchTime[0],
          markingTimeE: defaultSearchTime[1],
          ...params
        })} commandKey="jobAbnormalPackageTotal" btnProps={{mr: 0}}></ExportFile>
      </div>
      <div slot="tableCell" prop="toatlNum">
        {(val, index, record) => {
          return <Button type="link" text onClick={() => {
            goDetail(record)
          }}>{val}</Button>
        }}
      </div>
    </QueryList>
  </div>
}