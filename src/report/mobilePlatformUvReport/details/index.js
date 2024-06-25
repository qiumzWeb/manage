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
    if (isEmptyTime([data.queryStartTime, data.queryEndTime])) return '统计时间不能为空'
  }
  const formatData = (res, params, formatData, action) => {

  }

  // 获取queryList
  function getQueryList() {
    return pageRef.current.getQueryList()
  }


  return <div className='mobile_platform_uv_report_Detail'>
    <Page
      ref={pageRef}
      // 自定义查询 自定表头 code
      code="mobile_platform_uv_report_Detail"
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
          btnProps={{mr: 0}}
        ></ExportFile>
      </div>
    </Page>
  </div>
}