import React, {useEffect, useState, useRef} from 'react'
import { Message } from '@/component'
import QueryList from '@/component/queryList'
import {searchModel, columns} from '../config/finished'
import {isEmpty} from 'assets/js'
import {getDateTimeStr, filterData, getRangTime} from '../../config'
export default function App(props) {
    const queryListRef = useRef()
    function beforeSearch(req) {
        const time = getRangTime(req.data, {
                    time: 'finishTime',
                    start: 'finishTimeStart',
                    end: 'finishTimeEnd'
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
    return <QueryList
    ref={queryListRef}
    searchModel={searchModel}
    columns={columns}
    formatSearchParams={beforeSearch}
    formatData={formatData}
    defineSearchCode="task_order_eception_finished"
    tableOptions={{
        url: '/pcsweb/task/order/exception/finished',
        method: 'post',
    }}
  >
  </QueryList>
}