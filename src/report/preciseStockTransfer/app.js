import React, {useState, useEffect, useRef} from 'react'
import { Button, Dialog, Message } from '@/component'
import QueryList from '@/component/queryList/index'
import AForm from '@/component/AForm'
import ExportFile from '@/component/ExportFile/index'
import TaskDetails from './component/taskDetails'
import TaskDistribute from './component/taskDistribution'
import { qSearch, tColumns, searchUrl, UpdataeTaskStatusUrl,
  addFormModel, getCreateTransferTasks, TaskDetailColumns,
  getTransferTaskDetailList
} from './config'
import $http from 'assets/js/ajax'
import { isEmpty } from 'assets/js'
import { getRangTime} from '@/report/utils'


App.title = "精准移库"
export default function App(props) {
  const [addTaskVisible, setAddTaskVisible] = useState(false)
  const [addData, setAddData] = useState({})
  const [loading, setLoading] = useState(false)
  const query = useRef()
  const form = useRef()
  const taskDetaiRef = useRef()
  const taskDistributeRef = useRef()
  const beforeSearch = (req) => {
    if (!req.data.warehouseId) return '请选择仓库';
    const time = getRangTime(req.data, {
      time: 'gmtCreate',
      start: 'queryStartTime',
      end: 'queryEndTime',
    })
    return {
      ...req,
      data: {
        ...req.data,
        ...time
      }
    }
  }
  const formatData = (res, req) => {
    const warehouseId = req && req.data && req.data.warehouseId
    return {
      ...res,
      data: Array.isArray(res.data) && res.data.map(d => {
        if (isEmpty(d.warehouseId) && !isEmpty(warehouseId)) {
          d.warehouseId = warehouseId
        }
        return d
      })
    }
  }
  // 刷新
  function refresh() {
    query.current.refresh()
  }
  // 开始作业
  async function beginTask(record) {
    taskDistributeRef.current.open(record)
  }
  // 查看任务详情
  async function checkTask(record) {
    taskDetaiRef.current.open(record)
  }
  // 新建任务
  async function addTask() {
    const result = await form.current.validate()
    if (result) {
      try {
        const formData = form.current.getData()
        if (formData.canTransferFirstPackageNum < formData.firstPackageNum) {
          return Message.warning('移库首单数不可大于可移库首单数')
        }
        setLoading(true)
        await $http({
          url: getCreateTransferTasks,
          method: 'post',
          data: formData
        })
        Message.success('创建成功')
        refresh()
        setAddTaskVisible(false)
      } catch(e) {
        Message.error(e.message)
      } finally {
        setLoading(false)
      }
    }
  }
  // 新建任务关闭
  function onAddClose() {
    setAddTaskVisible(false)
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
      <div slot="tools">
          <Button onClick={() => setAddTaskVisible(true)}>新建任务</Button>
      </div>
      <div slot="tableCell" prop="make">
        {(val, index, record) => {
          return <div>
            <Button text type='link' mr="10" onClick={() => beginTask(record)}>任务分配</Button>
            <Button text type="link" onClick={() => checkTask(record)}>查看任务</Button>
          </div>
        }}
      </div>
    </QueryList>
    {/* 新建任务 */}
    <Dialog
      title="新建任务"
      width={520}
      visible={addTaskVisible}
      onOk={addTask}
      okProps={{loading}}
      onClose={onAddClose}
      onCancel={onAddClose}
    >
      <AForm data={addData} ref={form} formModel={addFormModel}></AForm>
    </Dialog>
    {/* 任务分配 */}
    <TaskDistribute ref={taskDistributeRef} refresh={refresh}></TaskDistribute>
    {/* 任务详情 */}
    <TaskDetails ref={taskDetaiRef}></TaskDetails>
  </div>
}