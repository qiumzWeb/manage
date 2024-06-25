import React, { useRef, useState, useEffect } from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, tColumns, searchApiUrl, formConfigModel, getConfigData, getStatusModify } from './config'
import { getWid, isEmpty } from 'assets/js'
import { Message, Button, Icon } from '@/component'
import { isEmptyTime } from '@/report/utils';

export default function App(props) {
  const pageRef = useRef()
  const [chartData, setChartData] = useState({})
  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
    if (isEmptyTime([data.startDateTime, data.endDateTime])) return '统计时间不能为空'
    if (isEmpty(data.statusType)) return '请选择统计维度'
  }
  const formatData = (res, params, formatData, action) => {
    return formatData(res, { total: Array.isArray(res) && res.length || 0, current: 1})
  }
  // 获取queryList
  function getQueryList() {
    return pageRef.current.getQueryList()
  }
  // 初始化
  function afterMounted() {
  }

  return <div className='class_delay_package_summay'>
    <Page
      ref={pageRef}
      // 自定义查询 自定表头 code
      code="delay_package_summay"
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
        afterMounted
      }}
      // 工具栏配置
      tools={[
        {type: 'formDialog', config: formConfigModel, title: '包裹滞留配置', DialogWidth: 750, refresh: true,
          data: {
            warehouseId: getWid(),
          },
          async getData({warehouseId}) {
            try {
              const res = await getConfigData()
              return {
                warehouseId,
                configList: Array.isArray(res) && res || []
              }
            } catch(e) {
              return {
                warehouseId,
                configList: []
              }
            }
            
          },
          async onSubmit(formData, {warehouseId}){
            try {
              await getStatusModify({
                warehouseId,
                ...formData,
              })
              Message.success('配置成功')
            } catch(e) {
              return e.message
            }
          }
        },
      ]}
      // 表格操作栏配置
      operationsWidth={130}
      operations={[]}
    >
    </Page>
  </div>
}