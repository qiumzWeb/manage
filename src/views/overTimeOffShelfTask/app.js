import React from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, tColumns, searchApiUrl, getTaskAllocation, batchExportModel, importConfig, detailTableModel } from './config'
import {getWid} from 'assets/js'
import { Message, Button, Icon } from '@/component'
import $http from 'assets/js/ajax';

App.title = "超期包裹下架任务"
export default function App(props) {

  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
  }
  const formatData = (res, params, formatData, action) => {
  }
  return <div className='class_over_time_offshelf_task'>
    <Page
      // 自定义查询 自定表头 code
      code="over_time_offshelf_task"
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
        showRowSelection: true,
        formatData,
      }}
      // 其它配置
      queryListOptions={{
        // initSearch: true
      }}
      // 工具栏配置
      tools={[
        { type: 'fenpeiTask', title: '分配', onSubmit: getTaskAllocation },
        {type: 'formDialog', config: batchExportModel, title: '导入', DialogWidth: 750, refresh: true,
              button: <Button><Icon type="upload"></Icon>导入</Button>,
              async onSubmit(fileData, orgData) {
                try {
                  const fileList = fileData.file
                  const formData = new FormData()
                  Array.isArray(fileList) && fileList.forEach(file => {
                    formData.append('expirePackageFile', file.originFileObj)
                  })
                  // formData.append('warehouseId', getWid())
                  await importConfig(formData)
                  Message.success('导入成功')
                } catch(e) {
                  return e.message
                }
              }
            }
      ]}
      // 表格操作栏配置
      operationsWidth={100}
      operations={[
        {
          type: 'formDialog',
          config: detailTableModel,
          DialogWidth: 1200,
          title: '任务详情',
          footer: false
        },
      ]}
    ></Page>
  </div>
}