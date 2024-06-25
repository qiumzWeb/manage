import React, {useState, useEffect, useRef} from 'react'
import { Button, Dialog, Message } from '@/component'
import QueryList from '@/component/queryList/index'
import { qSearch, tColumns ,searchUrl, addUrl, deleteUrl, modifyUrl } from './config'
import baseModel from './editConfig/base'
import computeParamsModel from './editConfig/computeParams'
import $http from 'assets/js/ajax'
import FormGroup from '@/component/FormGroup/index'
import ExportFile from '@/component/ExportFile/index'
export default function App(props) {
  const [data, setData] = useState({})
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const query = useRef()
  const form = useRef()
  const beforeSearch = (req) => {
    if (!req.data.warehouseId) return '请选择仓库';
  }
  const formatData = (data) => {
  }
  function getParams() {
    return query.current.field.getValues()
  }

  // 保存
  async function onOk() {
    const result = await form.current.getData()
    if (result) {
      result.segmentConfig = {
        configNodeList: result.configNodeList
      }
      delete result.configNodeList
      console.log(result, '成功')
      setLoading(true)
      if (data.isAdd) {
        await add(result)
      } else {
        await modify(result)
      }
      setLoading(false)
    }
  }
    // 新增
    async function add(data) {
      try {
        await $http({
          url: addUrl,
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
          url: modifyUrl,
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
            url: deleteUrl.replace('{id}', data.id),
            method: 'post',
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
          setData({isAdd: true, warehouseId: getParams().warehouseId, kpiType: '1', isEnable: '0'})
        }}>新增</Button>
        <ExportFile
          params={() => query.current.getSearchParams().data}
          beforeExport={() => query.current.getSearchParams()}
          btnProps={{mr: 0, ml: 10}}
        ></ExportFile>
      </div>
      <div slot="tableCell" prop="make">
        {(val, index, record) => {
          return <div>
            <Button text type='link' mr="10" onClick={() => {
              setVisible(true)
              record.configNodeList = record.segmentConfig && record.segmentConfig.configNodeList || []
              setData(record)
            }}>修改</Button>
            <Button text type="link" onClick={() => onDelete(record)}>删除</Button>
          </div>
        }}
      </div>
    </QueryList>
    <Dialog
      title={data.isAdd ? '新增' : '修改'}
      width='100%'
      visible={visible}
      onOk={onOk}
      onClose={onClose}
      onCancel={onClose}
      okProps={{loading}}
    >
      <FormGroup
        ref={form}
        data={data}
        group={{
          base: { title: '时长考核基础信息', model: baseModel },
          instock: { title: data => data.kpiType == '1' ? '入库时长考核计算参数' : '出库时长考核计算参数', model: computeParamsModel },
          // outstock: { title: '出库时长考核计算参数', model: computeParamsModel, show: data => data.kpiType == '2' },
        }}
      ></FormGroup>
    </Dialog>
  </div>
}