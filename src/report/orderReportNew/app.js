import React, {useRef} from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, tColumns, searchApiUrl, detailModel, getConfirmSplitOrder } from './config'
import {getWid, isEmpty} from 'assets/js'
import { Message, ExportFile } from '@/component'
import { DetailDialog as OrderDetail } from '@/service/order/list'

App.title = "订单查询(汇单)"
export default function App(props) {
  const packageDetail = useRef()
  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
    const requiredCode = [
      ['createStartTime', 'createEndTime'],
      ['cutOffStartTime', 'cutOffEndTime'],
      'orderReferLogisticsCode',
      'referLogisticsCode',
      'dispatchCode'
    ]
    if (requiredCode.every(code => {
      if (Array.isArray(code)) return code.some(c => isEmpty(data[c]))
      return isEmpty(data[code])
    })) {
      return '请选择查询时间或者输入单号查询'
    }
  }
  const formatData = (res, params, formatData, action) => {

  }


  return <div className='order_report_new'>
    <Page
      // 自定义查询 自定表头 code
      code="order_report_new"
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
        tableProps: {},
      }}
      // 其它配置
      queryListOptions={{
        // initSearch: true
      }}
    >
      <div slot="tools">
        {(queryList) => {
          return <ExportFile
            params={() => queryList.getSearchParams().data}
            beforeExport={() => queryList.getSearchParams()}
            btnProps={{mr: 0}}
          ></ExportFile>
        }}
      </div>
      <div slot="tableCell" prop="orderReferLogisticsCode">
        {(val, index, record) => {
            return <a onClick={() => {
                packageDetail.current && packageDetail.current.onDialogShow(record.orderCarriageId)
            }}>{val || '-'}</a>
        }}
        </div>
    </Page>
    <OrderDetail ref={packageDetail}></OrderDetail>
  </div>
}