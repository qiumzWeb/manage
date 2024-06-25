import React, { useState, useRef } from 'react'
import { Button, Dialog, Message } from '@/component'
import QueryList from '@/component/queryList/index'
import AForm from '@/component/AForm'
import { qSearch, tColumns, searchUrl, addUrl, deleteUrl, modifyUrl, formModel } from './config'
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

    const formatData = (req) => {
        // return {
        //     ...req,
        //     data: [{
        //         "id": 1,
        //         "warehouseId": 10012001,
        //         "name": "测试配置",
        //         "type": 0,
        //         "recommendTail": 1,
        //         "validateTail": 1,
        //         "sortingConfig": null,
        //         "sortingConfigInfo": null,
        //         "status": 1,
        //         "creator": "2208872357099",
        //         "updater": "2208872357099",
        //         "gmtCreate": "2023-03-09 10:44:22",
        //         "gmtModified": "2023-03-09 10:44:22",
        //         "deleteStatus": 0,
        //         "uuid": "jf3p1cvgbun51gr24ek7v",
        //         "index": 1,
        //         "recommendTime": [
        //             {
        //                 "uuid": "0p6oel22njdj1gr24f8a0",
        //                 "startEndTime": [
        //                     "2023-03-08T18:00:00.000Z",
        //                     "2023-03-08T20:00:00.000Z"
        //                 ],
        //                 "startTime": "02:00:00",
        //                 "endTime": "04:00:00"
        //             },
        //             {
        //                 "uuid": "9elgs5ce8o6c1gr24fefg",
        //                 "startEndTime": [
        //                     "2023-03-08T22:00:00.000Z",
        //                     "2023-03-09T10:00:00.000Z"
        //                 ],
        //                 "startTime": "06:00:00",
        //                 "endTime": "18:00:00"
        //             }
        //         ]
        //     }]
        // }
    }

    function getParams() {
        return query.current.field.getValues()
    }

    // 保存
    async function onOk() {
        const isValidate = await form.current.validate()
        if (!isValidate) return
        const result = form.current.getData();
        // 校验起始时间
        if (checkTimeIntervalFailed(result.recommendTime)) {
            return
        }
        setLoading(true)
        if (data.isAdd) {
            await add(result)
        } else {
            await modify(result)
        }
        setLoading(false)
    }

    /**
   * 校验时间区间是否失败
   */
    function checkTimeIntervalFailed(timeRang) {
        if (timeRang && Array.isArray(timeRang) && timeRang.length > 0) {
            if (timeRang.some((t, i) => i > 0 && timeRang[i - 1].startEndTime[1] > t.startEndTime[0])) {
                Message.warning('推荐上一时间段结束时间不能大于下一时间段开始时间')
                return true
            }
        }
        return false
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
            title={data.isAdd ? '新增尾包集分配置' : '修改尾包集分配置'}
            width='750px'
            visible={visible}
            onOk={onOk}
            onClose={onClose}
            onCancel={onClose}
            okProps={{ loading }}
        >
            <AForm data={data} formModel={formModel} ref={form}></AForm>
        </Dialog>
    </div>
}