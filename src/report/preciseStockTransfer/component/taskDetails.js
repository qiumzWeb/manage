import React, {useState, useEffect, useRef, useImperativeHandle} from 'react'
import { Button, Dialog, Message } from '@/component'
import QueryList from '@/component/queryList/index'
import AForm from '@/component/AForm'
import ExportFile from '@/component/ExportFile/index'
import { TaskDetailColumns, getTransferTaskDetailList } from '../config'
import $http from 'assets/js/ajax'
import { isEmpty } from 'assets/js'
import { getRangTime} from '@/report/utils'
export default React.forwardRef(function App(props, ref) {
  const [visible, setVisible] = useState(false)
  const [selectRecord, setSelectRecord] = useState({})
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
        warehouseId: selectRecord.warehouseId,
        taskId: selectRecord.id
      }
    }
  }
  const formatData = (data) => {
    return {
      data: data || []
    }
  }
  // 刷新
  function refresh() {
    query.current.refresh()
  }
  // 关闭查看详情
  function onClose() {
    setVisible(false)
  }
  return <div>
    {/* 任务详情 */}
    <Dialog
      title="任务明细"
      width={520}
      visible={visible}
      onClose={onClose}
      footer={
        <div>
          <Button mr='10' onClick={onClose}>取消</Button>
          <ExportFile params={{}}></ExportFile>
        </div>
      }
    >
      <QueryList
        toolSearch={false}
        initSearch={true}
        pagination={false}
        columns={TaskDetailColumns}
        formatSearchParams={beforeSearch}
        formatData={formatData}
        tableOptions={{
          url: getTransferTaskDetailList,
          method: 'post',
        }}
      >
      </QueryList>
    </Dialog>
  </div>
})