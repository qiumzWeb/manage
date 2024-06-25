import React,{ useRef } from 'react'
import { DialogButton, queryList as QueryList, Button, Message } from '@/component'
import API from 'assets/api/index'
import { isEmpty, getResult } from 'assets/js'
// 分配任务查询条件
export const taskDistributionSearchModel = {
  employeeName: {label: '员工姓名'},
  employeeJobNO: {label: '员工登录名'},
  sbtn: true
}
// 分配任务columns
export const taskDistributionColumns = {
  employeeName: {title: '员工姓名'},
  employeeJobNO: {title: '员工登录名'},
  make: {title: '操作'}
}

export default function FenpeiButton (option){
  const {queryListRefresh, ...attrs } = option;
  const rows = useRef([])
  const Dialog = useRef()
  const beforeSearch = (req) => {
    const selectRecord = Array.isArray(rows.current) && (rows.current[0] || {}) || {}
    return {
      ...req,
      data: {
        ...req.data,
        warehouseId: selectRecord.warehouseId
      }
    }
  }
  // 分配
  async function onOk(data) {
    try {
      const result = await Dialog.current.submit({selectRows: rows.current, data})
      !result && Message.success('分配成功')
    } catch(e) {
      Message.error(e.message)
    }
  }
  return <DialogButton
    ref={Dialog}
    {...attrs}
    beforeShow={({selectRows, data}) => {
      if (Array.isArray(selectRows) && isEmpty(selectRows)) return '请选择需要分配的任务'
      rows.current = selectRows || [data]
    }}
    DialogWidth={800}
    refresh={queryListRefresh}
    footer={{ok: false}}
    content={<div>
      <QueryList
        toolSearch={false}
        initSearch={true}
        searchModel={taskDistributionSearchModel}
        columns={taskDistributionColumns}
        formatSearchParams={beforeSearch}
        smallPageSize={true}
        tableOptions={{
          url: API.searchEmployeeList,
          method: 'get',
        }}
      >
      <div slot="tableCell" prop="make">
        {
          (val, index, record) => <Button type='link' text onClick={() => onOk(record)}>确认分配</Button>
        }
      </div>
      </QueryList>
    </div>}
  >{option.button}</DialogButton>
}