import React, {useState, useEffect, useRef} from 'react'
import { Button, Dialog, Message } from '@/component'
import QueryList from '@/component/queryList/index'
import { qSearch, tColumns, searchUrl, UpdataeTaskStatusUrl} from './config'
import $http from 'assets/js/ajax'
import { isEmpty } from 'assets/js'
import { getRangTime} from '@/report/utils'
export default function App(props) {
  const [data, setData] = useState({})
  const query = useRef()
  const form = useRef()
  const beforeSearch = (req) => {
    if (!req.data.warehouseId) return '请选择仓库';
    const time = getRangTime(req.data, {
      time: 'gmtCreate',
      start: 'gmtCreateStart',
      end: 'gmtCreateEnd',
    })
    return {
      ...req,
      data: {
        ...req.data,
        ...time
      }
    }
  }
  const formatData = (data) => {
  }
  // 刷新
  function refresh() {
    query.current.refresh()
  }
  // 开始作业
  async function beginTask(record) {
    const status = record.taskStatus
    try {
      const result = await new Promise((resolve) => {
        // 已完成
        if (status == '2') {
          Dialog.confirm({
            title: '提示',
            content: '当前任务已完成, 是否重新开始作业？',
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
            onClose: () => resolve(false)
          })
        } else {
          Dialog.confirm({
            title: '提示',
            content: '确认开始作业？',
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
            onClose: () => resolve(false)
          })
        }
      })
      if (result) {
        await $http({
          url: UpdataeTaskStatusUrl,
          method: 'post',
          data: {
            ...record,
            taskStatus: 1
          }
        })
        Message.success('作业已开始')
        refresh()
      }
    } catch(e) {
      Message.error(e.message)
    }
  }
  // 完成作业
  async function finishTask(record) {
    const status = record.taskStatus
    try {
      const result = await new Promise((resolve) => {
        // 已完成
        Dialog.confirm({
          title: '提示',
          content: '确认完成作业？',
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
          onClose: () => resolve(false)
        })
      })
      if (!result) return;
      await $http({
        url: UpdataeTaskStatusUrl,
        method: 'post',
        data: {
          ...record,
          taskStatus: 2
        }
      })
      Message.success('作业已完成')
      refresh()
    } catch(e) {
      Message.error(e.message)
    }
  }
  return <div>
  {/* 查询列表 */}
    <QueryList
      ref={query}
      toolSearch
      initSearch={false}
      searchModel={qSearch}
      columns={tColumns}
      columnWidth={150}
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: searchUrl,
        method: 'post',
      }}
    >
      <div slot="tableCell" prop="make">
        {(val, index, record) => {
          // record.taskStatus  任务实操状态,-1:待生成；0:已生成；1：进行中；2：已完成
          const isStart = !([0, 2].every(s => s != record.taskStatus));
          const isEnd = !([1].every(s => s != record.taskStatus));
          return <div>
            {isStart && <Button s disabled={!isStart} mr="10" onClick={() => beginTask(record)}>开始作业</Button>}
            {isEnd && <Button p warning disabled={!isEnd} onClick={() => finishTask(record)}>完成作业</Button>}
          </div>
        }}
      </div>
    </QueryList>
  </div>
}