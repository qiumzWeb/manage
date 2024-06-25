import React, {useEffect, useState } from 'react';
import { Button, Dialog, Icon, Message, Badge } from '@/component'
import $http from 'assets/js/ajax'
import {command} from './config'
import Api from 'assets/api'
import { getWid, getResult, getObjType } from 'assets/js'
import Bus from 'assets/js/bus'
export default function ExportFile(props) {
    const { params, beforeExport, commandKey, getCommandKey, btnProps, limit, message, destroyCallback } = props
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const commandId = command[commandKey || location.pathname];
    const exportTitle = props.children || '导出Excel'
    async function dataExport() {
        const searchParams = await getResult(params)
        const dataLimit = limit ? limit : 50000
        if (getObjType(searchParams) === 'Object') {
          Object.entries(searchParams).forEach(([key, val]) => {
            typeof val === 'string' && (searchParams[key] = val.trim())
          })
        }
        let command = await getResult(commandId || getCommandKey);
        if (!command) return Message.warning('导出失败： commandKey 为空');
        const exportParams = {
          command,
          ...(searchParams || {}),
          exportRecordLimit: dataLimit || undefined,
        }
        if (!exportParams.warehouseId) {
          // return Message.warning('请选择仓库')
          exportParams.warehouseId = getWid()
        }

        delete exportParams.pageSize
        delete exportParams.pageNum

        if (typeof beforeExport === 'function') {
            const bresult = await getResult(beforeExport, exportParams);
            if (typeof bresult === 'string') {
                return Message.warning(bresult)
            }
            if (bresult === false) return
        }

        const result = await new Promise((resolve) => {
            Dialog.confirm({
                title: exportTitle,
                content: typeof message === 'string' ? message : `当前最多支持导出${dataLimit}条数据！`,
                onOk: () => {resolve(true)},
                onClose: () => resolve(false),
                onCancel: () => resolve(false)
            })
        })
        if (!result) return;

        try {
            setLoading(true)
            await $http({
                url: Api.downloadCenterHandle,
                method: 'post',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                  },
                data: {
                    command,
                    exportParams: JSON.stringify(exportParams)
                }
            })
            setVisible(true)
            let t = setTimeout(() => {
                Bus.$emit('downLoadRefresh')
                clearTimeout(t)
                t = null
            }, 100)
        } catch(e) {
            Message.error(e.message)
        } finally {
            setLoading(false)
        }
    }
    function onOk() {
        typeof destroyCallback === 'function' && destroyCallback();
        window.Router.push('/downloadcenter')
        onClose()
    }
    function onClose() {
        setVisible(false)
    }
    return commandId || typeof getCommandKey === 'function' ? <span>
        <Button mr="10" loading={loading} onClick={dataExport} type="secondary" {...btnProps}>{exportTitle}</Button>
        <Dialog
            title="导出数据"
            onClose={onClose}
            style={{width: 400}}
            visible={visible}
            footer={
                <>
                <Button mr="10" onClick={onOk}>前往下载中心</Button>
                <Button type="primary" onClick={onClose}>我知道了</Button>
                </>
            }
        >
            <div style={{lineHeight: '25px'}}>
                数据将在后台实时导出，若导出成功，导航栏下载中心图标处出现红点提示：
                <Badge count="1" mr="24">
                    <Icon defineType="download"></Icon>
                </Badge><br/>
                点击该图标即可进入下载中心将您的文件下载到本地
            </div>
        </Dialog>
    </span> : null
}