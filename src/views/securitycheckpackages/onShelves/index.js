import React, { useEffect, useState, useRef } from 'react';
import { isEmpty } from 'assets/js'
import QueryList from '@/component/queryList'
import { Button, Message} from '@/component'
import { onShelvesSearch, onShelvesColumns} from './config'
import { searchUrl } from '../config'
import { getRangTime } from '@/views/servicepages/config'
import Exception from './exception'
import $http from 'assets/js/ajax'
import ImagePreview from '@/component/ImagePreview'
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
    // 分配
    function fenPei() {
        if(isEmpty(selectedRows)) return Message.warning('请至少选择一条任务')
        setFenPeiLoading(true)
        $http({
            url: `/package/securityCheck/task/employeeList?warehouseId=${currentSearchData.warehouseId}`,
            method: 'get',
        }).then(function(data){
            setOrderUnassignData({
                code: 'orderFenpei',
                data: data || [],
                selectedRows: selectedRows
            })
            setOrderUnassignVisible(true)
        }).catch(e => {
          Message.error(e.message || e)
        }).finally(function(){setFenPeiLoading(false)})
    }
    // 刷新
    function refresh() {
        queryListRef.current && queryListRef.current.refresh && queryListRef.current.refresh()
    }
    // 格式化查询参数
    function getSearchParams(req, type) {
        const time = getRangTime(req.data, {
            time: 'createTime',
            start: 'startTime',
            end: 'endTime'
        })
        // 在架缓存查询条件
        currentSearchData = req.data
        return {
            ...req,
            data: { ...req.data, type, ...time }
        }
    }
    // 渲染图片
    function renderImg(val, index, record) {
        return <ImagePreview urlList={val}></ImagePreview>
    }
    return <div>
    <QueryList
        ref={queryListRef}
        toolSearch
        initSearch={false}
        columnWidth={150}
        searchModel={onShelvesSearch}
        columns={onShelvesColumns}
        // 格式化查询参数
        formatSearchParams={(req) => {
            return getSearchParams(req, '1')
        }}
        // 格式化接口数据
        formatData={(data) => {
            setSelectedRows([])
        }}
        // 配置
        tableOptions={{
            url: searchUrl,
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
            <Button onClick={fenPei} loading={fenPeiLoading}>分配</Button>
        </div>
        <div slot="tableCell" prop="packageImgUrlList">
            {renderImg}
        </div>
        <div slot="tableCell" prop="itemImgUrlList">
            {renderImg}
        </div>
    </QueryList>

    {/* 分配任务 */}
    <Exception
      visible={orderUnassignVisible}
      onClose={orderUnassignClose}
      data={orderUnassignData}
    ></Exception>
    </div>
}