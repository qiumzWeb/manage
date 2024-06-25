import React, {useRef, useState} from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, tColumns, searchApiUrl, batchArriveModel, outStockNoticeModel, getOutStockNoticeUpload, getBatchArriveUpload } from './config'
import {getWid} from 'assets/js'
import { Message, Button, Icon, ExportFile } from '@/component'
import { getCalendarTableData } from '@/report/utils';
import $http from 'assets/js/ajax';
import dayjs from 'dayjs';

export default function App(props) {
  const pageRef = useRef()
  const loadingRef = useRef();
  const beforeSearch = (req, action, vm) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
  }
  const formatData = (res, params, formatData, action) => {
    return formatData(getCalendarTableData(res || [], {timeKey: 'jobDate', currentMonth: params.data.currentDate}))
  }
  // 获取queryList
  function getQueryList() {
    return pageRef.current.getQueryList()
  }

  async function TabSearchDate(dirFlag) {
    if (loadingRef.current) return;
    loadingRef.current = true
    await new Promise(resolve => {
      const queryList = getQueryList();
      const data = (queryList.searchParams || {}).data;
      const currentDate = data.currentDate;
      const dateConfig = {
        "-1": dayjs(currentDate).subtract(1, 'month'),
        '0': dayjs(),
        "1": dayjs(currentDate).add(1, 'month'),
      }
      queryList.refresh({
        jobDateStart: dateConfig[dirFlag]
      }, resolve)
    })
    loadingRef.current = false
  }

  return <div className='class_flowPreTestReport_Summary'>
    <Page
      ref={pageRef}
      // 自定义查询 自定表头 code
      code="flowPreTestReportSummary"
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
          cellProps: function () {
            return {
              className: 'pcs-calendar-table-cell'
            }
          }
        }
      }}
      // 其它配置
      queryListOptions={{
        pagination: false,
        showIndex: false,
        initSearch: true,
        defaultTableData: getCalendarTableData([], {timeKey: 'jobDate', currentMonth: dayjs()}),
        bottomTools: <div className='flex-center' style={{
          justifyContent: 'center',
          height: '100%',
          width: '100%,'
        }}>
          <Button s mr="30" onClick={async() => await TabSearchDate(-1)}><Icon type="arrow-double-left" />上一个月</Button>
          <Button p mr="30" onClick={async() => await TabSearchDate(0)}>本月</Button>
          <Button s onClick={async() => await TabSearchDate(1)}>下一个月<Icon type="arrow-double-right" /></Button>
        </div>
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
          commandKey="flowPreTestReportSumary"
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
            warehouseId: params.warehouseId
          })
        }}>查看生产计划大盘</Button>
      </div>
    </Page>
  </div>
}