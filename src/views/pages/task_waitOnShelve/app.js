import React, {useEffect, useState, useRef} from 'react'
import { Message } from '@/component'
import QueryList from '@/component/queryList'
import {searchModel, columns} from './config'
import {isEmpty} from 'assets/js'
import {getDateTimeStr, filterData, getRangTime} from '../config'
export default function App(props) {
    const queryListRef = useRef()
    function beforeSearch(req) {
        const time = getRangTime(req.data, {
                    time: 'orderCreateTime',
                    start: 'orderCreateTimeBegin',
                    end: 'orderCreateTimeEnd'
                })
        // if (
        //     isEmpty(time.orderCreateTimeBegin) ||
        //     isEmpty(time.orderCreateTimeEnd)
        // ) return '请选择包裹起止时间'
        return {
            ...req,
            oldApi: true,
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
        url: '/pcsweb/mission/waitOnShelves/list',
        method: 'get',
    }}
  >
  </QueryList>
}