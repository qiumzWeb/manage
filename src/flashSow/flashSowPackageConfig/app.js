import React from 'react';
import Page from '@/atemplate/queryTable';
import { 
  qSearch, tColumns, searchApiUrl, getModifyPositionScanConfig,
  formModeConfig, addConfig, updateConfig, modifyConfig, storeStopTimeConfig,
  getWaveOccupiedMinTimeConfig, saveWaveOccupiedMinTimeConfig
} from './config'
import {getWid} from 'assets/js'
import { Message } from '@/component'

App.title = "闪电播集包库位配置"
export default function App(props) {

  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
  }
  const formatData = (res, params, formatData, action) => {

  }
  return <div className='flashSowPackageConfig'>
    <Page
      // 自定义查询 自定表头 code
      code="flashSow_package_config"
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
          cellProps: (rowIndex, colIndex, dataIndex, record) => {
            if (record.status != 1) {
              return {
                style: { color: '#999'}
              }
            }
          }
        }
      }}
      // 其它配置
      queryListOptions={{
        // initSearch: true
      }}
      // 工具栏配置
      tools={[
        {type: 'formDialog', config: formModeConfig, title: '新增', DialogWidth: 1400, refresh: true,
          data: {
            warehouseId: getWid(),
            isNeedScan: '1',
          },
          async onSubmit(formData, orgData){
            try {
              await addConfig(formData.list)
              Message.success('新增成功')
            } catch(e) {
              return e.message
            }
          }
        },
        {type: 'formDialog', config: modifyConfig, title: '库位码扫描配置', DialogWidth: 550, refresh: true,
          data: {
            warehouseId: getWid(),
            isNeedScan: '0'
          },
          async onSubmit(formData, orgData){
            try {
              await getModifyPositionScanConfig(formData)
              Message.success('修改成功')
            } catch(e) {
              return e.message
            }
          }
        },
        {type: 'formDialog', config: storeStopTimeConfig, title: '库位停留时长配置', refresh: true,
          data: {
            warehouseId: getWid(),
            type: '0'
          },
          async getData(data) {
            const res = await getWaveOccupiedMinTimeConfig({warehouseId: data.warehouseId, type: data.type})
            return {
              type: data.type,
              occupiedMinTime: res
            }
          },
          async onSubmit(formData, orgData){
            try {
              await saveWaveOccupiedMinTimeConfig({
                warehouseId: getWid(),
                ...formData
              })
              Message.success('库位时长配置成功')
            } catch(e) {
              return e.message
            }
          }
        }
      ]}
      // 表格操作栏配置
      operationsWidth={130}
      operations={[
        {type: 'formDialog', confirmMsg: '确定禁用该配置？', title: '禁用', refresh: true,
          show: (val, index, data) => data.status == 1,
          async onSubmit(orgData){
            try {
              await updateConfig({id: orgData.id, status: '0'})
              Message.success('禁用成功')
            } catch(e) {
              return e.message
            }
          }
        },
        {type: 'formDialog', confirmMsg: '确定启用该配置？', title: '启用', refresh: true,
          show: (val, index, data) => data.status == 0,
          async onSubmit(orgData){
            try {
              await updateConfig({id: orgData.id, status: '1'})
              Message.success('启用成功')
            } catch(e) {
              return e.message
            }
          }
        }
      ]}
    ></Page>
  </div>
}