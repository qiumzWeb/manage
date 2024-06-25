import React, {useRef, useState} from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, tColumns, searchApiUrl } from './config'
import {getWid, isEmpty } from 'assets/js'
import { Message, Button, Icon, ExportFile } from '@/component'
import $http from 'assets/js/ajax';
import { isEmptyTime } from '@/report/utils';

export default function App(props) {
  const pageRef = useRef()
  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
    // 包裹号，订单号，统计时间，三选一
    if (isEmptyTime([data.startTime, data.endTime])) return "日志发起时间不能为空"
  }
  const formatData = (res, params, formatData, action) => {

  }

  // 获取queryList
  function getQueryList() {
    return pageRef.current.getQueryList()
  }


  return <div className='class_shift_manager_report_defail'>
    <Page
      ref={pageRef}
      // 自定义查询 自定表头 code
      code="shift_manager_report_defail"
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
        tableProps: {
          primaryKey: 'uuid'
        }
      }}
      // 其它配置
      queryListOptions={{
        // initSearch: true
      }}
      // 工具栏配置
      tools={[]}
      // 表格操作栏配置
      operationsWidth={100}
      operations={[]}
    >
      <div slot="tools">
        <ExportFile
          params={() => getQueryList().getSearchParams().data}
          beforeExport={() => getQueryList().getSearchParams()}
          commandKey="SHIFT_MANAGE_DETAIL"
          btnProps={{mr: 0}}
        ></ExportFile>
      </div>
    </Page>
  </div>
}