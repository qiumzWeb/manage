import React from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, tColumns, searchApiUrl, batchExportModel, batchExportReason } from './config'
import {getWid} from 'assets/js'
import { Message } from '@/component'

App.title = "逆向退件原因"
export default function App(props) {

  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
  }
  const formatData = (res, params, formatData, action) => {

  }
  return <div className='reverse_return_goods_reason'>
    <Page
      // 自定义查询 自定表头 code
      code="reverse_return_goods_reason_search"
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
      tools={[
        {type: 'formDialog', config: batchExportModel, title: '导入', DialogWidth: 750, refresh: true,
          footer: {ok: '上传'},
          onSubmit: batchExportReason
        }
      ]}
      // 表格操作栏配置
      operationsWidth={130}
      // operations={[]}
    ></Page>
  </div>
}