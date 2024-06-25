import React, {useEffect, useState, useRef} from 'react'
import { Message, Button } from '@/component'
import QueryList from '@/component/queryList'
import {searchModel, columns} from './config'
import {isEmpty} from 'assets/js'
import {getDateTimeStr, filterData, getRangTime} from '../config'
import $http from 'assets/js/ajax'
import Tobeassigned from '../component/tobeassignedDialog'
export default function App(props) {
    const queryListRef = useRef()
    const [selectedRows, setSelectedRows] = useState([])
    const [fenPeiLoading, setFenPeiLoading] = useState(false)
    const [cancelLoading, setCancelLoading] = useState(false)
    const [addLoading, setAddLoading] = useState(false)
    const [toBeassignVisible, setToBeassignVisible] = useState(false)
    const [toBeassignData, setTobeassignData] = useState({})
    const toBeassignClose = (fresh) => {
      setToBeassignVisible(false)
      fresh && refresh()
    }
    function beforeSearch(req) {
        return {
            ...req,
            url: req.url + `?warehouseId=${req.data.warehouseId}`,
            oldApi: true,
            data: filterData({
                ...req.data,
                warehouseId: undefined,
                ...getRangTime(req.data, {
                    time: 'taskTime',
                    start: 'startTime',
                    end: 'endTime'
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
    // 分配
    function fenPei() {
        if(isEmpty(selectedRows)) return Message.warning('请至少选择一条任务')
        setFenPeiLoading(true)
        $http({
            url: '/baseData/employeeList?roadWayIds=' + selectedRows.reduce(function(a, b){
                if (!a.includes(b.roadwayId)) {
                    a.push(b.roadwayId);
                }
                return a;
            }, []),
            method: 'get',
            oldApi: true
        }).then(function(res){
            if (res.code === '0') {
                setTobeassignData({
                    code: 'fenpei',
                    data: res && res.dataList || [],
                    selectedRows: selectedRows
                })
                setToBeassignVisible(true)
            } else {
                Message.error(res.message);
            }
        }).finally(function(){setFenPeiLoading(false)})
    }
    // 取消拦截
    function cancelLanjie() {
        if(isEmpty(selectedRows)) return Message.warning('请至少选择一条任务')
        setCancelLoading(true)
        $http({
            url: '/mission/waitallocation/updateIntercept',
            method: 'post',
            dataType: 'form',
            data: {
                interceptStatus: 0,
                waitAllocationTaskIds: selectedRows.map(function(r){return r.id}).join(',')
            },
            oldApi: true
        }).then(res => {
            var msg = res.code === '0' ? res.message || '操作成功' : res.code + ':' + (res.message || '操作失败');
            if (res.code === '0') {
                Message.success(msg);
                refresh()
            } else {
                Message.error(msg);
            }
        }).finally(e => {
            setCancelLoading(false)
        })
    }
    // 添加拦截
    function addLanjie() {
        if(isEmpty(selectedRows)) return Message.warning('请至少选择一条任务')
        setAddLoading(true)
        $http({
            url: '/mission/waitallocation/updateIntercept',
            method: 'post',
            dataType: 'form',
            data: {
                interceptStatus: 1,
                waitAllocationTaskIds: selectedRows.map(function(r){return r.id}).join(',')
            },
            oldApi: true
        }).then(res => {
            var msg = res.code === '0' ? res.message || '操作成功' : (res.message || '操作失败');
            if (res.code === '0') {
                Message.success(msg);
                refresh();
            } else {
                Message.error(msg);
            }
        }).finally(e => {
            setAddLoading(false)
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
            url: '/pcsweb/mission/waitallocation/list',
            method: 'post',
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
            <Button mr="10" onClick={fenPei} loading={fenPeiLoading}>分配</Button>
            <Button mr="10" onClick={cancelLanjie} loading={cancelLoading}>取消拦截</Button>
            <Button onClick={addLanjie} loading={addLoading}>添加拦截</Button>
        </div>
    </QueryList>
    {/* 分配 */}
    <Tobeassigned
      visible={toBeassignVisible}
      onClose={toBeassignClose}
      data={toBeassignData}
    ></Tobeassigned>
    </div>
}