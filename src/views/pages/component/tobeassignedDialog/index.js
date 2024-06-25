import React, {useEffect, useState } from 'react'
import { Dialog, Input, Table, Button, Message } from '@/component'
import $http from 'assets/js/ajax'
import Bus from 'assets/js/bus'

export default function App(props) {
  const {data, visible, onClose } = props
  const [tableData, setTableData] = useState([])
  const [scrollToRow, setScrollToRow] = useState(10)

  const tData = data.data || [];
  // 最多展示 数量
  const showCount = 50;
  const showData = tData;
  const searchChange = (val) => {
    if(val === undefined) return
    if(!val) {
      setTableData(showData)
    } else {
      const vals = val.split('#')
      const newData = data.data.filter(d => vals.some(v => {
        return (d.employeeName || '').toLocaleLowerCase().includes(v.toLocaleLowerCase())
      }))
      setTableData(newData)
    }
  }
  useEffect(() => {
    console.log('变动')
    setTableData(showData)
    console.log(showData, 99999)
  }, [data])
  useEffect(() => {
    if (visible) {
      console.log('在变')
      setTableData(showData)
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
    {
      title: '操作',
      cell: (value, index, record) => {
        return <>
          <Button mr="20" text type="primary" onClick={async() => {
            // console.log(record, 88888)
            // return 
            $http({
              url: '/mission/allocation',
              method: 'post',
              dataType: 'form',
              data: {
                operatorIds: record.employeeId,
                waitAllocationTaskIds: data.selectedRows.map(s => s.id) + ''
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

          }}>确认分配</Button>
        </>
      }
    }
  ]
  return <Dialog
    title="分配任务"
    style={{width: 800}}
    visible={visible}
    onClose={onClose}
    footer={false}
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
    >
      {
        columns.map((c, index) => {
          return <Table.Column key={index} {...c} ></Table.Column>
        })
      }
    </Table>
  </Dialog>
}
