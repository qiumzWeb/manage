import React from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, tColumns, searchApiUrl, formModelConfig, updateConfig, addConfig, deleteConfig, batchExportModel, importConfig } from './config'
import {getWid} from 'assets/js'
import { Message, Button, Icon } from '@/component'
import $http from 'assets/js/ajax';

App.title = "调度建议配置"
export default function App(props) {

  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
  }
  const formatData = (res, params, formatData, action) => {

  }
  return <div className='schedulingSuggestionConfiguration'>
    <Page
      // 自定义查询 自定表头 code
      code="scheduling_suggestion_configuration"
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
      tools={[
        {type: 'formDialog', config: formModelConfig, title: '新增', DialogWidth: 750, refresh: true,
          data: {
            warehouseId: getWid(),
            isAdd: true
          },
          async onSubmit(formData, orgData){
            try {
              await addConfig(formData)
              Message.success('新增成功')
            } catch(e) {
              return e.message
            }
          }
        },

        {type: 'formDialog', config: batchExportModel, title: '批量导入', DialogWidth: 750, refresh: true,
              button: <Button><Icon type="upload"></Icon>导入</Button>,
              async onSubmit(fileData, orgData) {
                try {
                  const fileList = fileData.file
                  const formData = new FormData()
                  Array.isArray(fileList) && fileList.forEach(file => {
                    formData.append('file', file.originFileObj)
                  })
                  formData.append('warehouseId', getWid())
                  await importConfig(formData)
                  Message.success('导入成功')
                } catch(e) {
                  return e.message
                }
              }
            }
      ]}
      // 表格操作栏配置
      operationsWidth={130}
      operations={[
        {type: 'formDialog', config: formModelConfig, DialogWidth: 750, title: '修改', refresh: true,
          async onSubmit(formData, orgData){
            try {
              await updateConfig({
                ...orgData,
                ...formData
              })
              Message.success('修改成功')
            } catch(e) {
              return e.message
            }
          }
        },
        {type: 'formDialog', confirmMsg: '确定删除该条配置？', title: '删除', refresh: true,
          async onSubmit(data){
            try {
              await deleteConfig(data)
              Message.success('删除成功')
            } catch(e) {
              return e.message
            }
          }
        },
      ]}
    ></Page>
  </div>
}