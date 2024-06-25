import React from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, tColumns, searchApiUrl, detailModel, getConfirmSplitOrder } from './config'
import {getWid, isEmpty} from 'assets/js'
import { Message, ExportFile } from '@/component'

App.title = "作业明细"
export default function App(props) {

  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
    const requiredCode = [
      ['operateStartTime', 'operateEndTime'],
      'referLogisticsCode',
      'orderReferLogisticsCode',
      'dispatchCode',
    ]
    if (requiredCode.every(code => {
      if (Array.isArray(code)) return code.some(c => isEmpty(data[c]))
      return isEmpty(data[code])
    })) {
      return '请选择查询时间或者输入单号查询'
    }
  }
  const formatData = (res, params, formatData, action) => {

  }


  return <div className='package_Oprater_Detail'>
    <Page
      // 自定义查询 自定表头 code
      code="package_Oprater_Detail"
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
      }}
      // 其它配置
      queryListOptions={{
        // initSearch: true
      }}
      // 工具栏配置
      tools={[]}
    >
      <div slot="tools">
        {(queryList) => {
          return <ExportFile
            params={() => queryList.getSearchParams().data}
            beforeExport={() => queryList.getSearchParams()}
            btnProps={{mr: 0}}
          ></ExportFile>
        }}
      </div>
    </Page>
  </div>
}