import React, {useEffect, useState } from 'react'
import { Dialog, Input, Table, Button, Message } from '@/component'
import $http from 'assets/js/ajax'
import Bus from 'assets/js/bus'
import { getWid } from 'assets/js'

export default function App(props) {
  const {data, visible, onClose } = props
  const [tableData, setTableData] = useState([])
  const [scrollToRow, setScrollToRow] = useState(10)
  const [selectRows, setSelectRows] = useState([])
  const searchChange = (val) => {
    if(!val) {
      setTableData(data.data)
    } else {
      const vals = val.split('#')
      console.log(vals, 909090)
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
      title: '未完成数',
      dataIndex: 'unPickNum'
    }
  ]
  const onOk = async() => {
    if (!selectRows.length) {
      return Message.warning('请至少选择一个任务！')
    }
    $http({
      url: '/task/order/exception/assign?warehouseId=' + getWid(),
      method: 'post',
      dataType: 'form',
      data: {
        operators: selectRows.map(s => s.employeeJobNO) + '',
        taskIds: data.selectedRows.map(s => s.id) + '',
        userId: selectRows[0].employeeId
      },
      oldApi: true
    }).then(res => {
      if (res.code === '0') {
        Message.success(res.message || '操作成功！')
      } else {
        Message.error( res.message || '操作失败')
      }
      onClose('refresh')
    })

  }
  return <Dialog
    title="分配任务"
    style={{width: 800}}
    visible={visible}
    onClose={onClose}
    onOk={onOk}
    onCancel ={onClose}
  >
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
      rowSelection={{
        onChange: (keys, rows) => {
          setSelectRows(rows)
        }
      }}
    >
      {
        columns.map((c, index) => {
          return <Table.Column key={index} {...c} ></Table.Column>
        })
      }
    </Table>
  </Dialog>
}
