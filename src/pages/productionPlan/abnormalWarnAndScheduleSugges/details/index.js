import React, {useRef, useState} from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, tColumns, searchApiUrl, getStatusModify, EditModel, detailModel } from './config'
import {getWid, isEmpty} from 'assets/js'
import { Message, Button, Icon, ExportFile } from '@/component'
import $http from 'assets/js/ajax';
import dayjs from 'dayjs';
import { isEmptyTime } from '@/report/utils';

export default function App(props) {
  const pageRef = useRef()
  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
    if (isEmptyTime([data.jobDateStart, data.jobDateEnd])) return '预警日期不能为空'
  }
  const formatData = (res, params, formatData, action) => {

  }

  // 获取queryList
  function getQueryList() {
    return pageRef.current.getQueryList()
  }


  return <div className='class_abnormal_warn_schedule_sugges_Detail'>
    <Page
      ref={pageRef}
      // 自定义查询 自定表头 code
      code="abnormal_warn_schedule_sugges_Detail"
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
      operations={[
        {type: 'formDialog', title: '编辑', DialogWidth: 750, config: EditModel, refresh: true,
          onSubmit: async(formData, orgData) => {
            try {
              await getStatusModify({
                id: orgData.id,
                ...formData
              })
              Message.success('修改成功')
            } catch (e) {
              return e.message
            }
          }
        },
        {type: 'formDialog', title: '详情', DialogWidth: 750, config: detailModel, footer: false, defaultValue: '-'} 
      ]}
    >
      <div slot="tools">
        <ExportFile
          params={() => getQueryList().getSearchParams().data}
          beforeExport={() => getQueryList().getSearchParams()}
          commandKey="BROADCAST_DETAIL_LIST_EXPORT"
          btnProps={{mr: 0}}
        ></ExportFile>
      </div>
    </Page>
  </div>
}