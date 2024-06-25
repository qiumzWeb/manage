import React, {useState, useEffect, useRef, useImperativeHandle} from 'react'
import { Button } from '@/component'
import QueryList from '@/component/queryList/index'
import { qSearch, tColumns, searchApi, goDetailsKeys, isReject, isSign } from './config'
import { getRangTime } from '@/report/utils'
import ExportFile from '@/component/ExportFile'
import PackageDetails from './details'
export default React.forwardRef(function App(props, ref) {
  const {goDetail} = props
  const query = useRef()
  const detailsRef = useRef()
  useImperativeHandle(ref, () =>({
    field: query.current.field,
    refresh: refresh
  }))
  const beforeSearch = (req) => {
    if (!req.data.warehouseId) return '请选择仓库';
    const data = req && req.data || {}
    // 生成时间
    const createTime = getRangTime(data, {time: 'createTime', start: 'createTimeStart', end: 'createTimeEnd'})
    if (!createTime['createTimeStart'] || !createTime['createTimeEnd']) return '请选择生成时间'
    // 签收，拒收时间
    let modifyTime = {}
    if (isReject(data) || isSign(data)) {
      modifyTime = getRangTime(data, {
        time: isSign ? 'signTime' : 'rejectTime',
        start: 'modifyTimeStart',
        end: 'modifyTimeEnd'
      })
    }
    // 移入时间
    const moveTime = getRangTime(data, {time: 'moveTime', start: 'moveTimeStart', end: 'moveTimeEnd'})
    // 移出时间
    const handOverTime = getRangTime(data, {time: 'handOverTime', start: 'handOverTimeStart', end: 'handOverTimeEnd'})
    return {
      ...req,
      data: {
        ...data,
        ...createTime,
        ...modifyTime,
        ...moveTime,
        ...handOverTime
      }
    }
  }
  const formatData = (data) => {
    Object.assign(data, {
      currentPageNum: data.pageNum,
      totalRowCount: data.total,
      data: data.result
    })
  }
  function getParams() {
    return query.current.getSearchParams()
  }
  function refresh() {
    query.current.refresh()
  }
  return <div>
  {/* 查询列表 */}
    <QueryList
      ref={query}
      toolSearch
      initSearch={false}
      searchModel={qSearch}
      defaultValue="-"
      columns={tColumns}
      columnWidth={180}
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: searchApi,
        method: 'get',
        attrs: {
          defineFieldCode: 'bigPackageReportDetails'
        }
      }}
    >
      <div slot='tools'>
        <ExportFile
          params={() => getParams().data}
          commandKey="/service/bigPackageList"
          beforeExport={() => getParams()}
        >导出大包明细</ExportFile>
        <ExportFile 
          message="当前最多支持导出300个大包的小包明细数据！"
          params={() => getParams().data}
          commandKey="BIG_PACKAGE_DETAIL"
          beforeExport={() => getParams()}
          btnProps={{mr: 0}}
        >导出小包明细</ExportFile>
      </div>
      {Object.entries(goDetailsKeys).map(([key, type]) => {
        return <div slot="tableCell" prop={key} key={key}>
          {(val, index, record) => {
            {/* if (key == 'unsignedCount') {
              val = record.parcelQty - record.receivedCount - record.rejectCount;
            } */}
            if (val == 0) return val
            return <Button text type="link" onClick={() => goDetail(record, type)}>{val}</Button>
          }}
        </div>
      })}
      <div slot="tableCell" prop="make">
      {(val, index, record) => {
        return <Button text type="link" onClick={() => {
          detailsRef.current.open(record)
        }}>详情</Button>
      }}
      </div>
    </QueryList>
    <PackageDetails ref={detailsRef} refresh={refresh}></PackageDetails>
  </div>
})