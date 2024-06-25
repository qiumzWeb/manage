import React, { useRef, useState, useEffect } from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, tColumns, searchApiUrl, getChartData } from './config'
import { getWid, isEmpty } from 'assets/js'
import { Message, Button, Icon, ExportFile, Card } from '@/component'
import PieChart from './pieChart';
import { isEmptyTime } from '@/report/utils';

export default function App(props) {
  const pageRef = useRef()
  const [chartData, setChartData] = useState({})
  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
    if (isEmptyTime([data.jobDateStart, data.jobDateEnd])) return '预警日期不能为空'
    getPieChartData(data)
  }
  const formatData = (res, params, formatData, action) => {

  }
  // 获取queryList
  function getQueryList() {
    return pageRef.current.getQueryList()
  }
  // 获取查询参数
  function getSearchParams() {
    const { data }  = getQueryList().getSearchParams() || {data: {}}
    return data
  }
  // 初始化
  function afterMounted() {
  }
  // 获取饼图数据
  async function getPieChartData(params) {
    try {
      const res = await getChartData(params)
      setChartData(res || {})
    } catch(e) {
      Message.error(e.message);
    }
  }

  return <div className='class_abnormal_warn_schedule_sugges_summay'>
    <Page
      ref={pageRef}
      // 自定义查询 自定表头 code
      code="abnormal_warn_schedule_sugges_summay"
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
      tools={[]}
      // 表格操作栏配置
      operationsWidth={130}
      operations={[]}
    >
      <div slot="tools">
        <ExportFile
          params={() => getQueryList().getSearchParams().data}
          beforeExport={() => getQueryList().getSearchParams()}
          commandKey="BROADCAST_SUMMARY_FORM_EXPORT"
          btnProps={{mr: 0}}
        ></ExportFile>
      </div>
      <div slot="expand">
        <div className='flex-center' style={{justifyContent: 'space-between'}}>
          <PieChart title="各预警指标占比" data={chartData.other} total={chartData.contextTypeTotalNum}></PieChart>
          <PieChart title="有效预警占比" data={chartData.valid} total={chartData.totalWarningNum}></PieChart>
        </div>
      </div>
    </Page>
  </div>
}