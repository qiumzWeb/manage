import React, {useState, useEffect, useRef} from 'react'
import { Button } from '@/component'
import QueryList from '@/component/queryList/index'
import { qSearch, tColumns } from './config'
import ExportFile from '@/component/ExportFile/index'
import { filterNotEmptyData } from 'assets/js'
import API from 'assets/api'
const goDetailsKeys = {
  'instockTotalPackageCount': '10',
  'totalPackageCount': '15'
}
export default function App(props) {
  const {goDetail} = props
  const query = useRef()
  const beforeSearch = (req) => {
    if (!req.data.warehouseId) return '请选择仓库';
    let url = req.url
    let data = req.data || {pageNum: '', pageSize: ''}
    req.url = url.replace("{warehouseId}",data.warehouseId) + "?pageNum=" + data.pageNum + "&pageSize=" + data.pageSize
    req.data = filterNotEmptyData(req.data)
  }
  const formatData = () => {}
  function getParams() {
    return filterNotEmptyData(query.current.field.getValues())
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
      formatSearchParams={beforeSearch}
      formatData={formatData}
      defaultValue="-"
      tableOptions={{
        url: API.queryStorageCapacityReportList,
        method: 'post',
        attrs: {
          defineFieldCode: 'storageCapacitySummary'
        }
      }}
    >
      <div slot="tools">
        <ExportFile params={() => ({
          ...getParams()
        })} btnProps={{mr: 0}}></ExportFile>
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