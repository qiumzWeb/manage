import React, {useEffect, useState, useRef} from 'react'
import { Message, Button } from '@/component'
import QueryList from '@/component/queryList'
import {searchModel, columns} from './config'
import {isEmpty} from 'assets/js'
import {getDateTimeStr, filterData, getRangTime} from '../config'
import { DetailDialog } from '@/service/package/list.jsx'
export default function App(props) {
    const queryListRef = useRef()
    const packageDetail = useRef()
    function beforeSearch(req) {
        const time = getRangTime(req.data, {
            time: 'createTime',
            start: 'createTimeStart',
            end: 'createTimeEnd'
        })
        // if (
        //     isEmpty(time.createTimeStart) ||
        //     isEmpty(time.createTimeEnd)
        // ) return '请选择生成起止时间'
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
    return <div>
        <QueryList
        ref={queryListRef}
        searchModel={searchModel}
        columns={columns}
        columnWidth={120}
        formatSearchParams={beforeSearch}
        formatData={formatData}
        tableOptions={{
            url: '/pcsservice/statistic/prealert/package/list',
            method: 'get',
        }}
    >
        <div slot="tableCell" prop="packageDetail_make">
            {(val, index, record) => {
            return <Button text type="link" onClick={() => {
                packageDetail.current && packageDetail.current.onDialogShow(record.id)
            }}>详情</Button>
            }}
        </div>
    </QueryList>
    <DetailDialog ref={packageDetail}/>
    </div>
}