import React, { useRef, useState, useEffect } from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, tColumns, searchApiUrl, getBatchDetail, singleSearchApiUrl } from './config'
import { getWid, isEmpty } from 'assets/js'
import { Message, Button, Icon } from '@/component'
import { isEmptyTime } from '@/report/utils';

export default function App(props) {
  const { setTab, items } = props;
  const pageRef = useRef();

  // 查询前拦截
  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!isEmpty(data.batchNo)) {
      return {
        ...req,
        url: singleSearchApiUrl,
        data: {
          ...data,
          warehouseId: getWid()
        }
      }
    }
  }

  // 返回数据处理
  const formatData = async (res, params, formatData, action) => {
    let newRes = []
    if (res.batchMessage) {
      newRes = [res.batchMessage]
    } else {
      const batchList = res && res.batchNoList || []
      newRes = await getBatchDetail(batchList)
    }
    return formatData(newRes, { total: Array.isArray(newRes) && newRes.length || 0, current: 1})
  }

  // 获取queryList
  function getQueryList() {
    return pageRef.current.getQueryList()
  }

  // 初始化
  function afterMounted() {
  }

  return <div className='class_sowing_batch_summay'>
    <Page
      ref={pageRef}
      // 自定义查询 自定表头 code
      code="class_sowing_batch_summay"
    // 查询配置
      searchOptions={{
        url: searchApiUrl,
        method: 'post',
        model: qSearch,
        beforeSearch
      }}
      // 表格配置
      tableOptions={{
        model: tColumns,
        formatData,
      }}
      // 其它配置
      queryListOptions={{
        // initSearch: true
        afterMounted,
        pagination: false
      }}
      // 工具栏配置
      tools={[]}
      // 表格操作栏配置
      operationsWidth={130}
      operations={[]}
    >
      <div slot="tableCell" prop="batchNo">
        {(val, index, record) => {
          return <a onClick={() => {
              setTab('wave');
              setTimeout(() => {
                const detailRef = items.find(it => it.key === 'wave').ref
                detailRef.current.getSearch({
                  batchNo: val
                })
              }, 500)
          }}>{val}</a>
        }}
      </div>
    </Page>
  </div>
}