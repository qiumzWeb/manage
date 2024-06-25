import React, {useEffect, useState } from 'react'
import { Dialog, Input, Table, Button, Message } from '@/component'
import $http from 'assets/js/ajax'
import Bus from 'assets/js/bus'

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
      title: '未拣货数',
      dataIndex: 'unPickNum'
    },
    {
      title: '熟练度',
      dataIndex: 'proficiencyDegree'
    },
  ]
  return <Dialog
    title="分配任务"
    style={{width: 800}}
    visible={visible}
    onClose={onClose}
    footer={<Button mr="20" text type="primary" onClick={async() => {
      if (!selectRows.length) return Message.warn('请选择员工')
      $http({
        url: '/mission/reallocation',
        method: 'post',
        data: {
          operatorIds: selectRows.map(s => s.employeeJobNO) + '',
          waitOffShelvesTaskIds: data.selectedRows.map(s => s.id) + ''
        },
        oldApi: true
      }).then(res => {
        if (res.code === '0') {
          Bus.$emit('iframeTableRefresh')
          Message.success('分配成功！')
        } else {
          Message.error('分配失败')
        }
        onClose('refresh')
      })

    }}>确认分配</Button>}
  >
    <div style={{display: 'flex',margin: '10px 20px', alignItems: 'center'}}>
        <span>员工姓名：</span>
        <Input style={{width: 400}} placeholder="如需查询多个员工，请用#号隔开" onChange={searchChange}></Input>
    </div>
    <Table
      dataSource={tableData}
      useVirtual
      scrollToRow={scrollToRow}
      onBodyScroll={(start) => setScrollToRow(start)}
      rowSelection={{
        onChange: (keys, rows) => {
          setSelectRows(rows)
        },
        selectedRowKeys: selectRows.map(s => s.employeeJobNO)
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
