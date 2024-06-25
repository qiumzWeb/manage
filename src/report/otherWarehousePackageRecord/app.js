import React, {useRef} from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, tColumns, searchApiUrl } from './config'
import {getWid, isEmpty} from 'assets/js'
import { Message, ExportFile } from '@/component'

App.title = "非本仓包裹登记查询"
export default function App(props) {
  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
    const requiredCode = [
      ['startTime', 'endTime'],
      'deliveryCode',
    ]
    if (requiredCode.every(code => {
      if (Array.isArray(code)) return code.some(c => isEmpty(data[c]))
      return isEmpty(data[code])
    })) {
      return '请选择查询时间或者输入包裹号查询'
    }
  }
  const formatData = (res, params, formatData, action) => {

  }


  return <div className='huidan_abnormal_task'>
    <Page
      // 自定义查询 自定表头 code
      code="huidan_abnormal_task"
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