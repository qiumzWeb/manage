import React, {useRef, useState} from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, tColumns, searchApiUrl, batchArriveModel, outStockNoticeModel, getOutStockNoticeUpload, getBatchArriveUpload } from './config'
import {getWid, isEmpty} from 'assets/js'
import { Message, Button, Icon, ExportFile } from '@/component'
import $http from 'assets/js/ajax';
import dayjs from 'dayjs';

export default function App(props) {
  const pageRef = useRef()
  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
    if (isEmpty(data.predictionTypes)) return '请选择预测单量类型';
  }
  const formatData = (res, params, formatData, action) => {

  }

  // 获取queryList
  function getQueryList() {
    return pageRef.current.getQueryList()
  }


  return <div className='class_flowPreTestReport_Detail'>
    <Page
      ref={pageRef}
      // 自定义查询 自定表头 code
      code="flowPreTestReportDetail"
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
        {type: 'formDialog', config: outStockNoticeModel, title: '导入出库通知', DialogWidth: 750, refresh: true,
          button: <Button><Icon type="upload"></Icon>导入出库通知</Button>,
          async onSubmit(fileData, orgData) {
            try {
              const fileList = fileData.file
              const formData = new FormData()
              Array.isArray(fileList) && fileList.forEach(file => {
                formData.append('file', file.originFileObj)
              })
              await getOutStockNoticeUpload(formData)
              Message.success('导入成功')
            } catch(e) {
              return e.message
            }
          }
        },

        {type: 'formDialog', config: batchArriveModel, title: '导入批次到达', DialogWidth: 750, refresh: true,
          button: <Button ml="10" mr="10"><Icon type="upload"></Icon>导入批次到达</Button>,
          async onSubmit(fileData, orgData) {
            try {
              const fileList = fileData.file
              const formData = new FormData()
              Array.isArray(fileList) && fileList.forEach(file => {
                formData.append('file', file.originFileObj)
              })
              await getBatchArriveUpload(formData)
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
      ]}
    >
      <div slot="tools">
        <ExportFile
          params={() => getQueryList().getSearchParams().data}
          beforeExport={() => getQueryList().getSearchParams()}
          commandKey="flowPreTestReportDetail"
        ></ExportFile>
        <Button s mr="10" onClick={() => {
          const params = getQueryList().getSearchParams().data;
          window.Router.push('/pcsProductionPlan', {
            planDate: [
              dayjs(params.currentDate).startOf('month'),
              dayjs(params.currentDate).endOf('month')
            ],
            warehouseId: params.warehouseId
          })
        }}>查看生产计划运营</Button>
        <Button s onClick={() => {
          const params = getQueryList().getSearchParams().data;
          window.Router.push('/productionPlanReportBoard', {
            dataSource: params.dataSource,
            endDateTime: dayjs(params.currentDate).endOf('month').format('YYYY-MM-DD'),
            startDateTime: dayjs(params.currentDate).startOf('month').format('YYYY-MM-DD'),
            warehouseId: params.warehouseId,
            predictionTypes: params.predictionTypes
          })
        }}>查看生产计划大盘</Button>
      </div>
    </Page>
  </div>
}