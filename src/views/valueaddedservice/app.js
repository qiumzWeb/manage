import React, {useEffect, useState, useRef} from 'react'
import QueryList from '@/component/queryList/index'
import {qColumns, qSearch, searchUrl, formModel, saveUrl, updateUrl, deleteUrl} from './config'
import ExportFile from '@/component/ExportFile/index'
import { Button, Dialog, Message } from '@/component'
import AForm from '@/component/AForm'
import { getWid } from 'assets/js'
import $http from 'assets/js/ajax'
ValueAddedService.title = "增值服务配置"
export default function ValueAddedService(props) {
    const [detailData, setDetailData] = useState({})
    const [visible, setVisible] = useState(false)
    const [okLoading, setOkLoading] = useState(false)
    const queryList = useRef()
    const formRef = useRef()
    useEffect(() => {
    }, [])
    // 查询前拦截
    function beforeSearch(req) {
        const {warehouseId} = req.data
        if (!warehouseId) {
            return '查询仓库名称不能为空'
        }
        return {
            ...req,
            data: getParams(req.data)
        }
    }
    // 获取查询表
    function getQueryList() {
        return queryList && queryList.current || {}
    }
    // 刷新
    function refresh() {
      getQueryList().refresh && getQueryList().refresh()
    }
    function getParams(data) {
      return {
        ...data,
      }
    }
    function getForm() {
      return formRef && formRef.current || {}
    }
    // 保存
    async function onOk() {
        const form = getForm()
        const result = await form.validate()
        if (!result) return
        const data = {
            ...detailData,
            ...form.getData()
        }
        const url = data.isAdd ? saveUrl : updateUrl
        delete data.isAdd
        setOkLoading(true)
        try {
            await $http({url, method: 'post', data})
            Message.success('保存成功')
            refresh()
            onClose()
        } catch(e) {
            Message.error(e.message || e)
        }
        setOkLoading(false)
    }
    // 关闭
    function onClose() {
      setVisible(false)
    }
    // 删除
    function deleteData(data) {
      Dialog.confirm({
        title: '确认删除该条数据？',
        onOk: async() => {
            try {
                await $http({
                    url: deleteUrl + '?id=' + data.id,
                    method: 'port',
                })
                Message.success('删除成功')
                refresh()
            } catch(e) {
                Message.error(e.message || e)
            }
        }
      })
    }
    return <div>
        <QueryList
          toolSearch
          initSearch={false}
          ref={queryList}
          // 查询配置
          searchModel={qSearch}
          // 表头配置
          columns={qColumns}
          // 格式化查询参数
          formatSearchParams={beforeSearch}
          // 格式化接口数据
          formatData={(data) => {}}
          // 配置
          tableOptions={{
            url: searchUrl,
            method: 'post'
          }}
        >
          <span slot="tools">
            <Button onClick={() => {
              setDetailData({
                isAdd: true,
                warehouseId: getWid()
              })
              setVisible(true)
            }}>新增</Button>
            <ExportFile
                btnProps={{ml: 10}}
                params={() => {
                  const data = getQueryList().field && getQueryList().field.getValues() || {}
                  return getParams(data)
                }}
                beforeExport={(data) => beforeSearch({data})}
            ></ExportFile>
          </span>
          <div slot="tableCell" prop="make">
            {(value, index, record) => {
              return <>
                <Button mr="10" text type="link" onClick={() => {
                  setDetailData(record)
                  setVisible(true)
                }}>修改</Button>
                <Button mr="10" text type="link" onClick={() => deleteData(record)}>删除</Button>
              </>
            }}
          </div>
        </QueryList>
        {/* 新增修改 */}
        <Dialog
          title={detailData.isAdd ? '新增' : '修改'}
          visible={visible}
          onOk={onOk}
          okProps={{loading: okLoading}}
          onCancel={onClose}
          onClose={onClose}
          width={800}
        >
          <AForm data={detailData} formModel={formModel} ref={formRef}></AForm>
        </Dialog>
    </div>
}