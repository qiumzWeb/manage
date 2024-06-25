import React, {useState, useEffect, useRef} from 'react'
import { Button, Dialog, Message } from '@/component'
import QueryList from '@/component/queryList/index'
import { qSearch, tColumns, formModel,searchUrl, isProdPlanConfig} from './config'
import AForm from '@/component/AForm'
import $http from 'assets/js/ajax'
import { getRangTime, getTimeToRange, getReceiver, getReceiverToStr, defaultSearchTime } from '@/report/utils'
export default function App(props) {
  const {goDetail} = props
  const [data, setData] = useState({})
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const query = useRef()
  const form = useRef()
  const beforeSearch = (req) => {
    if (!req.data.warehouseId) return '请选择仓库';
  }
  const formatData = (data) => {
    const list = data && data.data || []
    return {
      ...data,
      data: list.map(l => {
        return {
          ...l,
          timeScoped: getTimeToRange(l.timeScopeStart, l.timeScopeEnd),
          receiver: getReceiverToStr(l.receiver)
        }
      })
    }
  }
  function getParams() {
    return query.current.field.getValues()
  }
  // 保存
  async function onOk() {
    const result = await form.current.validate()
    if (result) {
      const formData = form.current.getData()
      if (isProdPlanConfig(formData)) {
        formData.timeScoped = defaultSearchTime
      }
      const time = getRangTime(formData, {time: 'timeScoped', start: 'timeScopeStart', end: 'timeScopeEnd'})
      if (!time['timeScopeStart'] || !time['timeScopeEnd']) {
        return Message.warning('请选择播报时间范围')
      }
      if (!formData.receiver.split('@')[1]) {
        return Message.warning('@提醒人不能为空')
      }
      // 处理接收方
      formData.receiver = JSON.stringify(getReceiver(formData.receiver))
      setLoading(true)
      if (data.isAdd) {
        await add({
          ...formData,
          ...time
        })
      } else {
        await modify({
          ...formData,
          ...time
        })
      }
      setLoading(false)
    }
  }
  // 新增
  async function add(data) {
    try {
      await $http({
        url: '/sys/broadcast/config/add',
        method: 'post',
        data
      })
      Message.success('新增成功')
      onClose()
      refresh()
    } catch(e) {
      Message.error(e.message)
    }
  }
  // 修改
  async function modify(modifyData) {
    try {
      await $http({
        url: '/sys/broadcast/config/update',
        method: 'post',
        data: Object.assign({}, data, modifyData)
      })
      Message.success('修改成功')
      onClose()
      refresh()
    } catch(e) {
      Message.error(e.message)
    }
  }
  // 关闭
  function onClose() {
    setVisible(false)
  }
  // 刷新
  function refresh() {
    query.current.refresh()
  }
  // 删除
  function onDelete(data) {
    Dialog.confirm({
      title: '删除',
      content: '确认删除后数据不可恢复！',
      onOk: async() => {
        try {
          await $http({
            url: '/sys/broadcast/config/delete',
            method: 'post',
            data: {
              id: data.id,
              warehouseId: data.warehouseId
            }
          })
          Message.success('删除成功')
          refresh()
        } catch(e) {
          Message.error(e.message)
        }
      }
    })
  }
  return <div>
  {/* 查询列表 */}
    <QueryList
      ref={query}
      toolSearch
      initSearch={false}
      searchModel={qSearch}
      columns={tColumns}
      columnWidth={150}
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: searchUrl,
        method: 'post',
      }}
    >
      <div slot="tools">
        <Button onClick={() => {
          setVisible(true)
          setData({isAdd: true, warehouseId: getParams().warehouseId})
        }}>新增</Button>
      </div>
      <div slot="tableCell" prop="make">
        {(val, index, record) => {
          return <div>
            <Button text type='link' mr="10" onClick={() => {
              setVisible(true)
              setData(record)
            }}>修改</Button>
            <Button text type="link" onClick={() => onDelete(record)}>删除</Button>
          </div>
        }}
      </div>
    </QueryList>
    <Dialog
      title={data.isAdd ? '新增' : '修改'}
      width={754}
      visible={visible}
      onOk={onOk}
      onClose={onClose}
      onCancel={onClose}
      okProps={{loading}}
    >
      <AForm data={data} formModel={formModel} ref={form}></AForm>
    </Dialog>
  </div>
}