import React, {useState, useEffect, useRef} from 'react'
import ReactDOM from 'react-dom'
import QueryList from '@/component/queryList'
import { getColumnsModel, getSearchModel } from './config'
import { isTrue, getObjType } from 'assets/js'
import Bus from 'assets/js/bus'
import { Message } from '@/component'

export default function App(props) {
  const {qSearch, tColumns, tableOptions, getRes, ...attrs} = props
  const [rowSelectedKeys, setRowSelectedKeys] = useState([])
  const queryList = useRef()
  // 查询条件处理
  const beforeSearch = (request) => {
    console.log(request)
    const data = {}
    Object.entries(request.data).forEach(([key, val]) => {
      if (isTrue(val)) {
        if (getObjType(val) === 'Object' && typeof val.format === 'function' && getObjType(+val) === 'Number') {
          val = val.format('YYYY-MM-DD HH:mm:ss')
        }
        data[key] = val
      }
    })
    return {
      ...request,
      data,
      oldApi: true,
      headers: {
        "Content-Type": tableOptions.contentType || "application/x-www-form-urlencoded;charset=utf-8"
      },
    }
  }
  // 查询结果处理
  const formatData = (res) => {
    typeof getRes === 'function' && getRes(res)
    setRowSelectedKeys([])
    if (res.code != '0') {
      Message.error(res.message || '请求失败')
    }
    return {
      currentPageNum: res.pageNum || 1,
      totalRowCount: res.total || 0,
      pageSize: res.pageSize || 10,
      data: res.result || []
    }
  }
  useEffect(() => {
    const unBus = Bus.$on('iframeTableRefresh', () => {
      queryList.current && queryList.current.refresh && queryList.current.refresh()
    })
    return () => {
      unBus()
    }
  }, [])
  const tars = tableOptions && tableOptions.attrs || {}
  const rowSelection = tars.rowSelection || {}
  return <QueryList
    ref={queryList}
    {...attrs}
    toolSearch
    initSearch={false}
    searchModel={getSearchModel(qSearch)}
    columns={getColumnsModel(tColumns)}
    formatSearchParams={beforeSearch}
    formatData={formatData}
    tableOptions={{
      ...tableOptions,
      attrs: {
        ...tars,
        rowSelection: {
          ...rowSelection,
          onChange: (keys, rows) => {
            setRowSelectedKeys(keys)
            typeof rowSelection.onChange === 'function' && rowSelection.onChange(keys, rows)
          },
          selectedRowKeys: rowSelectedKeys
        }
      }
    }}
  >
  </QueryList>
}

App.register = function registerQueryList(ref, callBack){
  const iframe = ref.current
  const doc = iframe && iframe.contentDocument
  const win = iframe && iframe.contentWindow
  const dom = doc.querySelector('.content-wrapper');
  const div = doc.createElement('div')
  win.QueryList = function(props) {
    typeof callBack === 'function' && callBack(props)
    // dom.appendChild(div)
    // parent = parent || div
    // ReactDOM.render(
    //   <App {...props}></App>,
    //   parent
    // )
  }
}