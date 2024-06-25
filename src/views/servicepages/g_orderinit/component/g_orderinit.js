import React, {useEffect, useState, useRef} from 'react'
import { Message, Button } from '@/component'
import QueryList from '@/component/queryList'
import {searchModel, columns} from '../config/g_orderinit'
import {isEmpty} from 'assets/js'
import {getDateTimeStr, filterData, getRangTime} from '../../config'
import ExceptOrderUnassign from '../../component/exceptOrderUnassign'
import $http from 'assets/js/ajax'
let currentSearchData = {}
export default function App(props) {
    const queryListRef = useRef()
    const [selectedRows, setSelectedRows] = useState([])
    const [fenPeiLoading, setFenPeiLoading] = useState(false)
    const [orderUnassignVisible, setOrderUnassignVisible] = useState(false)
    const [orderUnassignData, setOrderUnassignData] = useState([])
    const orderUnassignClose = (fresh) => {
      setOrderUnassignVisible(false)
      fresh && refresh()
    }

    function beforeSearch(req) {
        const time = getRangTime(req.data, {
                    time: 'orderCreateTime',
                    start: 'orderCreateStartTime',
                    end: 'orderCreateEndTime'
                })
        currentSearchData = {
          ...req.data,
          ...time
        }
        return {
            ...req,
            oldApi: true,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            data: filterData({
                ...req.data,
                ...time,
            })
        }
    }
    function formatData(res) {
        if (res.code != '0') {
            return res.message || '请求失败'
        }
        setSelectedRows([])
        return {
            currentPageNum: res.pageNum || 1,
            totalRowCount: res.total || 0,
            pageSize: res.pageSize || 10,
            data: res.result || []
          }
    }
    // 分配
    function fenPei() {
      if(isEmpty(selectedRows)) return Message.warning('请至少选择一条任务')
      setFenPeiLoading(true)
      $http({
          url: '/task/order/exception/allocation/employee?type=1',
          method: 'get',
          oldApi: true
      }).then(function(res){
          if (res.code === '0') {
            setOrderUnassignData({
                  code: 'orderFenpei',
                  data: res && res.dataList || [],
                  selectedRows: selectedRows
              })
              setOrderUnassignVisible(true)
          } else {
              Message.error(res.message);
          }
      }).finally(function(){setFenPeiLoading(false)})
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
          url: '/pcsservice/task/order/exception/allocation/init',
          method: 'get',
          attrs: {
            defineFieldCode: 'task_order_exception_allocation_init',
            rowSelection: {
                onChange: (keys, rows) => {
                    setSelectedRows(rows)
                },
                selectedRowKeys: selectedRows.map(m => m.id)
            }
        }
      }}
    >
      <div slot="tools">
          <Button onClick={fenPei} loading={fenPeiLoading}>分配</Button>
      </div>
    </QueryList>
      {/* 订单异常分配任务 */}
    <ExceptOrderUnassign
      visible={orderUnassignVisible}
      onClose={orderUnassignClose}
      data={orderUnassignData}
    ></ExceptOrderUnassign>
  </div>
}