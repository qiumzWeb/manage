import React, {useEffect, useState, useRef} from 'react'
import { Message } from '@/component'
import QueryList from '@/component/queryList'
import {searchModel, columns} from '../config/g_orderfinished'
import {isEmpty} from 'assets/js'
import {getDateTimeStr, filterData, getRangTime} from '../../config'
export default function App(props) {
    const queryListRef = useRef()
    function beforeSearch(req) {
        const time = getRangTime(req.data, {
                    time: 'completeTime',
                    start: 'completeStartTime',
                    end: 'completeEndTime'
                })
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
        return {
            currentPageNum: res.pageNum || 1,
            totalRowCount: res.total || 0,
            pageSize: res.pageSize || 10,
            data: res.result || []
          }
    }
    return <QueryList
    ref={queryListRef}
    searchModel={searchModel}
    columns={columns}
    formatSearchParams={beforeSearch}
    formatData={formatData}
    tableOptions={{
        url: '/pcsservice/task/order/exception/allocation/finished',
        method: 'get',
        attrs: {
          defineFieldCode: 'task_order_exception_allocation_finished'
        }
    }}
  >
  </QueryList>
}