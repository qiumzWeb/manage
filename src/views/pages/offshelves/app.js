import React, {useEffect, useState, useRef} from 'react'
import { Message, Dialog, Button, Table } from '@/component'
import QueryList from '@/component/queryList'
import {searchModel, columns, offshelvesColumns} from './config'
import {isEmpty} from 'assets/js'
import {getDateTimeStr, filterData, getRangTime} from '../config'
import Offshelves from '../component/offshelvesDialog'
import $http from 'assets/js/ajax'
export default function App(props) {
    const queryListRef = useRef()
    const [offshelvesDetailVisible, setOffshelvesDetailVisible] = useState(false)
    const [offshelvesTableData, setOffshelvesTableData] = useState([])
    const [offshelvesSelectRows, setOffshelvesSelectRows] = useState([])
    const [offshelvesVisible, setOffshelvesVisible] = useState(false)
    const [offshelvesData, setOffshelvesData] = useState([])
    const offshelvesClose = (fresh) => {
      setOffshelvesVisible(false)
      fresh && refresh()
    }
    function beforeSearch(req) {
        const time = getRangTime(req.data, {
                    time: 'jobTime',
                    start: 'jobStartTime',
                    end: 'jobEndTime'
                })
        return {
            ...req,
            url: req.url + `?warehouseId=${req.data.warehouseId}`,
            oldApi: true,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
              },
            data: filterData({
                ...req.data,
                warehouseId: undefined,
                ...time,
            })
        }
    }
    function formatData(res) {
        if (res.code != '0') {
            return res.message || '请求失败'
        }
        return {
            currentPageNum: res.pageNum || 1,
            totalRowCount: res.total || 0,
            pageSize: res.pageSize || 10,
            data: res.result || []
          }
    }
          // 刷新
    function refresh() {
        queryListRef.current && queryListRef.current.refresh && queryListRef.current.refresh()
    }
    return <div>
        <QueryList
            ref={queryListRef}
            searchModel={searchModel}
            columns={columns}
            formatSearchParams={beforeSearch}
            formatData={formatData}
            tableOptions={{
                url: '/pcsweb/task/offShelvesTask/list',
                method: 'post',
            }}
        >
            <div slot="tableCell" prop="make">
              {(val, index, record) => {
                return <Button text type="link" onClick={async() => {
                  setOffshelvesDetailVisible(true)
                  const res = await $http({
                    url: '/task/waitOffShelvesMission/list',
                    method: 'get',
                    data: {
                      page: 1,
                      waveNo: record.waveNo,
                      operateUser: record.operateUser
                    },
                    oldApi: true
                  })
                  if (res.code == '0') {
                    setOffshelvesTableData(res.result || [])
                  } else {
                    setOffshelvesTableData([])
                  }
                }}>详情</Button>
              }}
            </div> 
        </QueryList>
    {/* 下架作业单分配任务 */}
      <Dialog
        visible={offshelvesDetailVisible}
        style={{width: 800}}
        title="信息"
        footer={<Button type="primary" onClick={async() => {
          if (!offshelvesSelectRows.length) {
            return Message.warning('请选择分配数据')
          }
          const row = offshelvesSelectRows.reduce((a, b) => {
            if (!a) return a
            if (a.id === b.id) {
              return a
            } else {
              return false
            }
          })
          if (row) {
            const res = await $http({
              url: '/baseData/employeeList?roadWayIds=' + row.id,
              method: 'get',
              oldApi: true
            })
            if (res.code == '0') {
              setOffshelvesData({data: res.dataList || [], selectedRows: [row]})
              setOffshelvesVisible(true)
              setOffshelvesDetailVisible(false)
            } else {
              setOffshelvesData({data: [], selectedRows: []})
            }
          } else {
            Message.error('您选择的有不同的巷道id，请重新选择！')
          }
        }}>分配</Button>}
        onClose={() => {setOffshelvesDetailVisible(false)}}
      >
        <Table dataSource={offshelvesTableData}
          rowSelection={{
            onChange: (keys, rows) => {
              setOffshelvesSelectRows(rows)
            },
            selectedRowKeys: offshelvesSelectRows.map(s => s.id)
          }}
        >
          {offshelvesColumns.map((c, index) => {
            return <Table.Column {...c} key={index}></Table.Column>
          })}
        </Table>
      </Dialog>
        <Offshelves
            visible={offshelvesVisible}
            onClose={offshelvesClose}
            data={offshelvesData}
        ></Offshelves>
  </div>
}