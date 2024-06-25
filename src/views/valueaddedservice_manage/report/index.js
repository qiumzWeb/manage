import React, {useState, useEffect, useRef} from 'react'
import Page from '@/atemplate/queryTable'
import { qSearch, tColumns, searchApiUrl } from './config'

export default function App(props) {
  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
    if (!data.startTime || !data.endTime) return '统计时间范围不能为空'
    return {
      ...req,
      data: {
        ...req.data,
        type: action == '6' ? 'ALL' : 'DETAIl'
      }
    }
  }
  const formatData = (res, params, formatData, action) => {
    if (action == 6) {
      res.statusLabel = "总量：" + res.totalCount
      return [res]
    }
    return formatData(res)
  }
  return <div>
    <Page
      // 自定义查询 自定表头 code
      code="valueaddedservice_manage_report"
    // 查询配置
      searchOptions={{
        url: searchApiUrl,
        sumUrl: searchApiUrl,
        method: 'post',
        model: qSearch,
        // searchBtnText: '查询明细',
        sumButtonText: '查询汇总',
        beforeSearch
      }}
      // 表格配置
      tableOptions={{
        model: tColumns,
        formatData
      }}
      queryListOptions={{
        initSearch: true
      }}
    ></Page>
  </div>
}