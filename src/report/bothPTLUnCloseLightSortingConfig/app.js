import React from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, tColumns, searchApiUrl, getAddConfig, getDeleteConfig, addFormModel } from './config'
import {getWid, isEmpty} from 'assets/js'
import { Message } from '@/component'

App.title = "双面PTL免拍灯播种配置"
export default function App(props) {

  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
  }
  const formatData = (res, params, formatData, action) => {

  }


  return <div className='both_PTL_UnClose_light_sorting_search'>
    <Page
      // 自定义查询 自定表头 code
      code="both_PTL_UnClose_light_sorting_search"
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
      tools={[
        {type: 'formDialog', title: '新增', config: addFormModel,
          DialogWidth: 600,
          refresh: true,
          onSubmit: async(data) => {
            try {
              await getAddConfig(data)
              Message.success('新增成功')
            } catch(e) {
              return e && e.message || '新增失败'
            }
          }
        }
      ]}
      // 表格操作栏配置
      operationsWidth={130}
      operations={[
        {type: 'formDialog',title: '删除', refresh: true,
          confirmMsg: '确定删除该员工？',
          onSubmit: async(data) => {
            try {
                await getDeleteConfig(data)
                Message.success('删除成功')
              } catch(e) {
                return e.message || '删除失败'
              }
          }
        }
      ]}
    >
    </Page>
  </div>
}