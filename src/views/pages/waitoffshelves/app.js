import React, {useEffect, useState, useRef} from 'react'
import { Message, Button, Dialog } from '@/component'
import QueryList from '@/component/queryList'
import {searchModel, columns} from './config'
import {isEmpty} from 'assets/js'
import {getDateTimeStr, filterData, getRangTime} from '../config'
import $http from 'assets/js/ajax'
export default function App(props) {
    const queryListRef = useRef()
    const [selectedRows, setSelectedRows] = useState([])
    function beforeSearch(req) {
        return {
            ...req,
            oldApi: true,
            data: filterData({
                ...req.data,
                ...getRangTime(req.data, {
                    time: 'jobTime',
                    start: 'jobStartTime',
                    end: 'jobEndTime'
                }),
                ...getRangTime(req.data, {
                    time: 'orderCreateTime',
                    start: 'orderStartCreateTime',
                    end: 'orderEndCreateTime'
                }),
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
    // 取消分配任务
    function cancelLanjie() {
        if(isEmpty(selectedRows)) return Message.warning('请至少选择一条任务')
        Dialog.confirm({
            title: '确定要取消分配任务吗？',
            onOk: function() {
                return new Promise(function(resolve, reject){
                    $http({
                        url: '/mission/waitoffshelves/reset',
                        method: 'post',
                        dataType: 'form',
                        data: {
                            idList: selectedRows.map(function(r){ return r.id})
                        },
                        oldApi: true
                    }).then(res => {
                        var msg = res.code === '0' ? res.message || '操作成功' : res.code + ':' + (res.message || '操作失败');
                        if (res.code === '0') {
                            Message.success(msg);
                            refresh();
                        } else {
                            Message.error(msg);
                        }
                        resolve()
                    }).finally(e=> {
                        reject()
                    })
                })
            }
        })
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
            url: '/pcsweb/mission/waitoffshelves/list',
            method: 'get',
            attrs: {
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
            <Button onClick={cancelLanjie}>取消分配任务</Button>
        </div>
    </QueryList>
    </div>
}