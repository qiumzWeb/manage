import React, { useState, useEffect, useRef } from 'react'
import { Icon, Dialog } from '@/component'
import { getWid, isEmpty, getUuid } from 'assets/js'
import { getToolList, recordQueryList } from './api'
import $http from 'assets/js/ajax'
import { recordColumnsModel, recordSearchModel } from './config'
import QueryList from '@/component/queryList'
import { getRangTime } from '@/report/utils'
App.title = '工具操作'
export default function App(props) {
  const { data } = props
  const [visible, setVisible] = useState(false)
  const [selectTool, setSelectTool] = useState({})
  // 查看操作记录
  function viewRecord(record) {
    setSelectTool(record)
    setVisible(true)
  }
  // 记录加载
  function afterMounted(query) {
    query.field.setValue('action', selectTool.name)
    query.refresh()
  }
  // 记录查询前
  function beforeSearch(req) {
    const data = req.data || {}
    const time = getRangTime(data, {
      time: 'makeTime',
      start: 'startTime',
      end: 'endTime',
    })
    return {
      ...req,
      data: {
        ...data,
        ...time
      }
    }
  }
  // 记录结果
  function formatData() {

  }
  return <div>
    <div className='warn-color' style={{fontSize: 22, paddingLeft: 20, position: 'relative', top: -10, display: 'flex', alignItems: 'center'}}>
      <Icon type="warning" size="large" mr='5'></Icon>
      您的所有操作都会被记录，请谨慎操作！
      <a style={{fontSize: 14, textDecoration: 'underline', marginTop: 10}} onClick={() => viewRecord(data)}>查看操作记录</a>
    </div>
    {data.desc && <div className='linght-back' style={{padding: '10px', marginLeft: 10,}}>
      Tips：{data.desc}
    </div>}

    <Dialog
      visible={visible}
      title="操作记录"
      footer={false}
      onClose={() => setVisible(false)}
    >
      <QueryList
        toolSearch
        initSearch={false}
        afterMounted={afterMounted}
        searchModel={recordSearchModel}
        columns={recordColumnsModel}
        formatSearchParams={beforeSearch}
        formatData={formatData}
        tableOptions={{
          url: recordQueryList,
          method: 'post',
        }}
      >
      </QueryList>
    </Dialog>
  </div>

}