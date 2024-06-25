import React from 'react';
import Page from '@/atemplate/queryTable';
import {
  qSearch, tColumns, searchApiUrl, addConfig,
  getTaskAllocation, addFormModel, TaskDetailFormModel,
  getTaskDetail, batchExportModel, batchExportTask, getCancelTransferTask
} from './config'
import {getWid} from 'assets/js'
import { Message, ExportFile } from '@/component'

App.title = "移库任务"
export default function App(props) {

  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
    if (!data.queryStartTime || !data.queryEndTime) return '请选择创建时间范围'
  }
  const formatData = (res, params, formatData, action) => {

  }
  return <div className='stockeTransferTask'>
    <Page
      // 自定义查询 自定表头 code
      code="stockeTransferTask_search"
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
        {type: 'formDialog', config: addFormModel, title: '新建任务', DialogWidth: 760, refresh: true,
          async onSubmit(formData, orgData) {
            try {
              await addConfig(formData)
              Message.success('创建任务成功')
            } catch(e) {
              return e.message
            }
          }
        },
        {type: 'formDialog', config: batchExportModel, title: '批量导入', DialogWidth: 750, refresh: true,
          onSubmit: batchExportTask
        }
      ]}
      // 表格操作栏配置
      operationsWidth={200}
      operations={[
        { type: 'fenpeiTask', title: '分配', onSubmit: getTaskAllocation,
          show: (val, index, record) => record.taskStatus != -1
        },
        {type: 'formDialog', config: TaskDetailFormModel, title: '查看任务', DialogWidth: '100%', footer: false, 
          async getData(data) {
            return getTaskDetail(data)
          }
        },
        {
          type: 'formDialog', title: '取消任务', confirmMsg: '确认取消任务? 取消任务后将无法进行分配', refresh: true,
          show: (val, index, record) => record.taskStatus == '0',
          onSubmit: getCancelTransferTask
        }
      ]}
    >
      <div slot="tools">
        {(queryList) => {
          return <ExportFile
            params={() => queryList.getSearchParams().data}
            beforeExport={() => queryList.getSearchParams()}
            btnProps={{mr: 0, ml: 10}}
          ></ExportFile>
        }}
      </div>
    </Page>
  </div>
}