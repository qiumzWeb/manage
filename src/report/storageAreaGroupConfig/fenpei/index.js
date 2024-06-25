import React, {useState, useEffect, useRef, useImperativeHandle} from 'react'
import { Button, Dialog, Message } from '@/component'
import QueryList from '@/component/queryList/index'
import { tColumns, searchUrl } from './config'
import AForm from '@/component/AForm'
import $http from 'assets/js/ajax'
import { isEmpty } from 'assets/js'
import API from 'assets/api'
export default React.forwardRef(function App(props, ref) {
  const [data, setData] = useState({})
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const query = useRef()
  const form = useRef()
  const beforeSearch = (req) => {
    req.data ={ groupId: data.groupId } 
  }
  const formatData = (data) => {
    data.data = data.districtList
    if (Array.isArray(data.data)) {
      setSelectedRows(data.data.filter(s => s.isAllocation == 'Y'))
    }
  }
  useImperativeHandle(ref, () => ({
    open: (data) => {
      setData(data)
      setVisible(true)
      setTimeout(() => {
        refresh()
      }, 0)
    }
  }))
  // 保存
  async function onOk() {
    setLoading(true)
    try{
      await $http({
        url: API.assignWarehouseDistrict,
        method: 'post',
        data: {
          warehouseId: data.warehouseId,
          groupId: data.groupId,
          groupName: data.groupName,
          selectedDistrictId: selectedRows.map(s => s.id) + ''
        }
      })
      Message.success('分配成功')
      setSelectedRows([])
      onClose()
      typeof props.callBack == 'function' && props.callBack()
    } catch(e) {
      Message.error(e.message)
    }
    setLoading(false)
  }

  // 关闭
  function onClose() {
    setVisible(false)
  }
  // 刷新
  function refresh() {
    query.current.refresh()
  }
  return <div>
    <Dialog
      title='分配库区'
      width={1000}
      visible={visible}
      onOk={onOk}
      onClose={onClose}
      onCancel={onClose}
      okProps={{loading}}
    >
      <div style={{fontSize: 16, fontWeight: 'bold'}}>
        <span>仓库名称：{data.warehouseName}</span>
        <span style={{marginLeft: 100}}>库区组简称: {data.groupName}</span>
      </div>
      {/* 查询列表 */}
      <QueryList
        ref={query}
        toolSearch={false}
        initSearch={false}
        pagination={false}
        columns={tColumns}
        defaultValue="-"
        formatSearchParams={beforeSearch}
        formatData={formatData}
        tableOptions={{
          url: searchUrl,
          method: 'post',
          attrs: {
            rowSelection: {
              onChange: (keys, rows) => {
                  setSelectedRows(rows)
              },
              selectedRowKeys: selectedRows.map(m => m.id)
          }
          }
        }}
      >
      </QueryList>
    </Dialog>
  </div>
})