import React, {useState, useEffect, useRef, useImperativeHandle} from 'react'
import { Button, Dialog, Message } from '@/component'
import QueryList from '@/component/queryList/index'
import AForm from '@/component/AForm'
import API from 'assets/api'
import ExportFile from '@/component/ExportFile/index'
import { taskDistributionSearchModel, taskDistributionColumns, getDispatchTransferTask } from '../config'
import $http from 'assets/js/ajax'
import { isEmpty } from 'assets/js'
import { getRangTime} from '@/report/utils'
export default React.forwardRef(function App(props, ref) {
  const [visible, setVisible] = useState(false)
  const [selectRecord, setSelectRecord] = useState({})
  const [loading, setLoading] = useState(false)
  const query = useRef()
  useImperativeHandle(ref, () => ({
    open(data) {
      setSelectRecord(data)
      setVisible(true)
    }
  }))
  const beforeSearch = (req) => {
    return {
      ...req,
      data: {
        ...req.data,
        warehouseId: selectRecord.warehouseId
      }
    }
  }
  const formatData = (data) => {
  }
  // 分配
  async function onOk(data) {
    try {
      await $http({
        url: getDispatchTransferTask,
        method: 'get',
        data: {
          warehouseId: selectRecord.warehouseId,
          taskId: selectRecord.id,
          operator: data.employeeJobNO
        }
      })
      Message.success('分配成功')
      typeof props.refresh === 'function' && props.refresh()
      onClose()
    } catch(e) {
      Message.error(e.message)
    }
  }
  // 关闭查看详情
  function onClose() {
    setVisible(false)
  }
  return <div>
    {/* 任务详情 */}
    <Dialog
      title="任务分配"
      width={800}
      visible={visible}
      onClose={onClose}
      footer={
        <div>
          <Button onClick={onClose}>取消</Button>
        </div>
      }
    >
      <QueryList
        toolSearch={false}
        initSearch={true}
        searchModel={taskDistributionSearchModel}
        columns={taskDistributionColumns}
        formatSearchParams={beforeSearch}
        formatData={formatData}
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
    </Dialog>
  </div>
})