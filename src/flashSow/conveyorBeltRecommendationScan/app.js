import React from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, tColumns, searchApiUrl, formModeConfig, addConfig, updateConfig, deleteConfig } from './config'
import {getWid} from 'assets/js'
import { Message } from '@/component'

App.title = "传送带顶扫推荐限制配置"
export default function App(props) {

  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
  }
  const formatData = (res, params, formatData, action) => {

  }
  return <div className='conveyorBeltRecommendationScan'>
    <Page
      // 自定义查询 自定表头 code
      code="conveyor_belt_recommendation_scan"
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
        {type: 'formDialog', config: formModeConfig, title: '新增', DialogWidth: 600, refresh: true,
          data: {
            warehouseId: getWid(),
            isNeedScan: '1',
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
      ]}
      // 表格操作栏配置
      operationsWidth={130}
      operations={[
        {type: 'formDialog', config: formModeConfig, title: '修改', refresh: true, DialogWidth: 600,
          async onSubmit(fromData, orgData){
            try {
              await updateConfig({...orgData, ...fromData})
              Message.success('修改成功')
            } catch(e) {
              return e.message
            }
          }
        },
        {type: 'formDialog', confirmMsg: '确定删除该配置？', title: '删除', refresh: true,
          async onSubmit(orgData){
            try {
              await deleteConfig({id: orgData.id })
              Message.success('删除成功')
            } catch(e) {
              return e.message
            }
          }
        }
      ]}
    ></Page>
  </div>
}