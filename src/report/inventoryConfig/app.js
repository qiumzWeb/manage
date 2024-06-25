import React, { useState, useRef } from 'react'
import { Button, Dialog, Message } from '@/component'
import QueryList from '@/component/queryList/index'
import FormGroup from '@/component/FormGroup'
import { qSearch, tColumns, searchUrl, addUrl, deleteUrl, modifyUrl, editModel, groupModel } from './config'
import $http from 'assets/js/ajax'

export default function App(props) {

    // 弹窗中的数据
    const [data, setData] = useState({})
    // 弹窗是否可见
    const [visible, setVisible] = useState(false)
    // loading框是否可见
    const [loading, setLoading] = useState(false)

    const query = useRef()
    const form = useRef()

    // 查询校验
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
        } catch (e) {
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
        } catch (e) {
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
            onOk: async () => {
                try {
                    await $http({
                        url: deleteUrl + data.id,
                        method: 'delete',
                    })
                    Message.success('删除成功')
                    refresh()
                } catch (e) {
                    Message.error(e.message)
                }
            }
        })
    }

    return <div>
        {/* 查询列表 */}
        <QueryList
            ref={query}
            // 查询按钮单独一行
            toolSearch
            // 初始化不查询
            initSearch={false}
            // 查询的字段
            searchModel={qSearch}
            // 列表字段
            columns={tColumns}
            defaultValue="-"
            // 默认表头宽
            columnWidth={150}
            // 查询前的校验
            formatSearchParams={beforeSearch}
            // 表格数据处理
            formatData={formatData}
            // 表头处理
            tableOptions={{
                // 请求地址
                url: searchUrl,
                // 请求方式
                method: 'post',
            }} >
            <div slot="tools">
                <Button onClick={() => {
                    setVisible(true)
                    setData({ isAdd: true })
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
            width='900px'
            visible={visible}
            onOk={onOk}
            onClose={onClose}
            onCancel={onClose}
            okProps={{ loading }}
        >
            <FormGroup
                ref={form}
                data={data}
                group={groupModel}
            ></FormGroup>
        </Dialog>
    </div>
}