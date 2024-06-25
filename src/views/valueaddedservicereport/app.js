import React, {useEffect, useState, useRef} from 'react'
import QueryList from '@/component/queryList/index'
import {qColumns, qSearch, searchUrl} from './config'
import ExportFile from '@/component/ExportFile/index'
import { Button, Message } from '@/component'
import moment from 'moment'
ValueAddedServiceReport.title = "增值服务报表"
export default function ValueAddedServiceReport(props) {
    const queryList = useRef()
    useEffect(() => {
    }, [])
    // 查询前拦截
    function beforeSearch(req) {
        const {warehouseId} = req.data
        if (!warehouseId) {
            return '查询仓库名称不能为空'
        }
        return {
            ...req,
            data: getParams(req.data)
        }
    }
    // 获取查询表
    function getQueryList() {
        return queryList && queryList.current || {}
    }
    // 刷新
    function refresh() {
      getQueryList().refresh && getQueryList().refresh()
    }
    function getParams(data) {
      const {time, ...params} = data
      const [start, end] = Array.isArray(time) && time || []
      const getTimeStr = (t) => t && t.format && t.format('YYYY-MM-DD HH:mm:ss')
      return {
        startTime: getTimeStr(start),
        endTime: getTimeStr(end),
        ...params,
      }
    }
    return <div>
        <QueryList
          toolSearch
          initSearch={false}
          ref={queryList}
          // 查询配置
          searchModel={qSearch}
          // 表头配置
          columns={qColumns}
          // 格式化查询参数
          formatSearchParams={beforeSearch}
          // 格式化接口数据
          formatData={(data) => {}}
          // 配置
          tableOptions={{
            url: searchUrl,
            method: 'post'
          }}
        >
          <span slot="tools">
            <ExportFile
                btnProps={{mr: 0}}
                params={() => {
                  const data = getQueryList().field && getQueryList().field.getValues() || {}
                  return getParams(data)
                }}
                beforeExport={(data) => beforeSearch({data})}
            ></ExportFile>
          </span>
        </QueryList>
    </div>
}