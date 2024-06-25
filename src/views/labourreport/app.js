import React, {useEffect, useState, useRef} from 'react'
import QueryList from '@/component/queryList/index'
import {qColumns, qSearch, searchUrl} from './config'
import ExportFile from '@/component/ExportFile/index'
import moment from 'moment'
export default function Labourreport(props) {
    const queryList = useRef()
    useEffect(() => {
    }, [])
    function beforeSearch(req) {
        const {warehouseId, taskTime} = req.data
        console.log(req, 9999)
        if (!warehouseId || !taskTime) {
            return '查询仓库名称或操作日期不能为空'
        }
        return {
            ...req,
            data: getParams(req.data)
        }
    }
    function getQueryList() {
        return queryList && queryList.current || {}
    }
    function getParams(data) {
      const [start, end] = data.taskTime
      console.log(data.taskTime)
      function fmt(t) {
        return t && t.format && t.format('YYYY-MM-DD HH:mm:ss') || t
      }
      return {
        ...data,
        // taskTime: undefined,
        taskStartTime: fmt(start),
        taskEndTime: fmt(end)
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
                limit={100000}
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