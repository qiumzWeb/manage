import React, {useState, useEffect, useRef} from 'react'
import { Button } from '@/component'
import QueryList from '@/component/queryList/index'
import { tColumns, searchUrl} from './config'
import ExportFile from '@/component/ExportFile/index'
import Api from 'assets/api'
export default React.forwardRef(function App(props, ref) {
  const {goDetail} = props
  const beforeSearch = (req) => {
    if (!req.data.warehouseId) return '请查询仓库为空';
  }
  const formatData = () => {}
  return <div>
  {/* 查询列表 */}
    <QueryList
      ref={ref}
      toolSearch={false}
      initSearch={false}
      columns={tColumns}
      columnWidth={150}
      defaultValue="-"
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: searchUrl,
        method: 'post',
        attrs: {
          defineFieldCode: 'bigPackageReportPackageDetails'
        }
      }}
    >
    </QueryList>
  </div>
})