import React from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, tColumns, searchApiUrl } from './config'
import {getWid} from 'assets/js'
import { Message } from '@/component'

App.title = "未汇波尾包大包查询"
export default function App(props) {

  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
    if (!data.startTime || !data.endTime) return '请选择统计时间范围'
  }
  const formatData = (res, params, formatData, action) => {

  }
  return <div className='flashSowTailPackageSearch'>
    <Page
      // 自定义查询 自定表头 code
      code="flashSow_un_tail_big__package_search"
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
        formatData,
        tableProps: {}
      }}
      // 其它配置
      queryListOptions={{
        // initSearch: true
      }}
      // 工具栏配置
      // tools={[]}
      // 表格操作栏配置
      operationsWidth={130}
      // operations={[]}
    ></Page>
  </div>
}