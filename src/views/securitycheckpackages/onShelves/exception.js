import React, {useEffect, useState } from 'react'
import { Dialog, Input, Table, Button, Message, Loading } from '@/component'
import $http from 'assets/js/ajax'
import Bus from 'assets/js/bus'
import { getWid } from 'assets/js'

export default function App(props) {
  const {data, visible, onClose } = props
  const [tableData, setTableData] = useState([])
  const [scrollToRow, setScrollToRow] = useState(10)
  const [loading, setLoading] = useState(false)
  const searchChange = (val) => {
    if(!val) {
      setTableData(data.data)
    } else {
      const vals = val.split('#')
      const newData = data.data.filter(d => vals.some(v => {
        return (d.employeeName || '').toLocaleLowerCase().includes(v.toLocaleLowerCase())
      }))
      setTableData(newData)
    }
  }
  useEffect(() => {
    setTableData(data.data || [])
  }, [data])
  useEffect(() => {
    if (visible) {
      setTableData(data.data || [])
    }
  }, [visible])
  const columns = [
    {
      title: '员工姓名',
      dataIndex: 'employeeName'
    },
    {
      title: '工号',
      dataIndex: 'employeeJobNO'
    },
    {
      title: '操作',
      dataIndex: 'make',
      cell: (val, index, record) => {
        return <Button text type='link' onClick={() => onOk(record)}>分配</Button>
      }
    }
  ]
  const onOk = async(record) => {
    setLoading(true)
    $http({
      url: '/package/securityCheck/task/allocation',
      method: 'post',
      data: {
        warehouseId: data.selectedRows[0].warehouseId,
        ids: data.selectedRows.map(s => s.id),
        employeeId: record.id
      }
    }).then(res => {
      Message.success(res.message || '操作成功！')
      onClose('refresh')
    }).catch(res => {
      Message.error( res.message || '操作失败')
    }).finally( _ => {
      setLoading(false)
    })
  }
  return <Dialog
    title="分配任务"
    style={{width: 800}}
    visible={visible}
    onClose={onClose}
    onOk={onOk}
    onCancel ={onClose}
    footer={false}
  >
    <div style={{position: 'relative'}}>
    <div style={{display: 'flex',margin: '10px 20px', alignItems: 'center'}}>
        <span>员工姓名：</span>
        <Input style={{width: 400}} placeholder="如需查询多个员工，请用#号隔开" onChange={searchChange}></Input>
    </div>
    <Table
      dataSource={tableData}
      useVirtual
      scrollToRow={scrollToRow}
      primaryKey={'employeeJobNO'}
      onBodyScroll={(start) => setScrollToRow(start)}
    >
      {
        columns.map((c, index) => {
          return <Table.Column key={index} {...c} ></Table.Column>
        })
      }
    </Table>
    <Loading visible={loading} style={{position: 'absolute', top: '40%', left: '45%'}}></Loading>
    </div>

  </Dialog>
}
