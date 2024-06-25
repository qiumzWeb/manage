import React, {useState, useEffect, useRef} from 'react'
import Page from '@/atemplate/queryTable'
import { qSearch, tColumns, searchApiUrl } from './config'
import ExportFile from '@/component/ExportFile/index'
export default function App(props) {
  const queryPage = useRef()
  const beforeSearch = (req) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
    if (!data.startTime || !data.endTime) return '统计时间范围不能为空'
  }
  const formatData = (res, params, formatData, action) => {
  }
  function getParams() {
    const queryTable = queryPage.current.getQueryList()
    return queryTable && queryTable.getSearchParams().data
  }
  return <div>
    <Page
      ref={queryPage}
      // 自定义查询 自定表头 code
      code="service_handover_list"
    // 查询配置
      searchOptions={{
        url: searchApiUrl,
        method: 'post',
        model: qSearch,
        beforeSearch
      }}
      // 表格配置
      tableOptions={{
        model: tColumns,
        formatData
      }}
    >
      <div slot="tools">
        <ExportFile
          params={() => getParams()}
          beforeExport={() => getParams()}
          btnProps={{mr: 0}}
        ></ExportFile>
      </div>
    </Page>
  </div>
}