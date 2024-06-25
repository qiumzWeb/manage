import React from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, tColumns, searchApiUrl } from './config'
import {getWid, isEmpty} from 'assets/js'
import { Message, ExportFile } from '@/component'

App.title = "SKU查询"
export default function App(props) {

  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
  }
  const formatData = (res, params, formatData, action) => {

  }


  return <div className='SKU_SEARCH_report'>
    <Page
      // 自定义查询 自定表头 code
      code="SKU_SEARCH_report"
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
        tableProps: {},
        showRowSelection: true
      }}
      // 其它配置
      queryListOptions={{
        // initSearch: true
      }}
      // 工具栏配置
      // tools={[]}
      // 表格操作栏配置
      operationsWidth={130}
      // operations={[
      //   {type: 'formDialog', config: detailModel, title: '包裹明细', DialogWidth: '100%',
      //     footer: false,
      //   }
      // ]}
    >
    </Page>
  </div>
}