import React, {useRef, useState, useImperativeHandle} from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, tColumns, searchApiUrl } from './config'
import {getWid, isEmpty } from 'assets/js'
import { Message, Button, Icon, ExportFile } from '@/component'
import $http from 'assets/js/ajax';
import { isEmptyTime } from '@/report/utils';

export default React.forwardRef(function App(props, ref) {
  const pageRef = useRef()
  useImperativeHandle(ref, () => {
    return {
      getSearch(params) {
        const queryList = getQueryList()
        queryList.field.reset();
        queryList.field.setValues(params)
        setTimeout(() => {
          queryList.refresh()
        }, 1000)
      }
    }
  })
  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.waveNo) return '请输入波次号';
  }
  const formatData = (res, params, formatData, action) => {
    const bigBagMessage = res && res.bigBagMessage || {}
    const newRes = []
    Object.entries(bigBagMessage).forEach(([key, value]) => {
      if (Array.isArray(value) && !isEmpty(value)) {
        newRes.push(...value.map(v => ({
          ...v,
          bigBagTime: v.bigBagTime,
          bigPackageType: key,
          warehouseId: getWid()
        })))
      }
    })
    




    return formatData(newRes, { total: Array.isArray(newRes) && newRes.length || 0, current: 1})
  }

  // 获取queryList
  function getQueryList() {
    return pageRef.current.getQueryList()
  }


  return <div className='class_sowing_package_Detail'>
    <Page
      ref={pageRef}
      // 自定义查询 自定表头 code
      code="class_sowing_package_Detail"
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
        pagination: false
      }}
      // 工具栏配置
      tools={[]}
      // 表格操作栏配置
      operationsWidth={100}
      operations={[]}
    >
    </Page>
  </div>
})