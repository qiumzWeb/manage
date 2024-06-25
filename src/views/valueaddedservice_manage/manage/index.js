import React, {useEffect, useState, useRef } from 'react'
import Page from '@/atemplate/queryTable'
import { Message, Dialog } from "@/component"
import { 
  qColumns, qSearch, taskFinishConfig, auditImageConfig, detailModel
} from './config'
import {
  searchUrl, getLogList, getTaskAllocation, getTaskFinish, getAuditPicture
} from './api'
import { isEmpty, getObjType, isHttpUrl } from 'assets/js'

ValueAddedServiceManage.title="增值服务管理"

export default function ValueAddedServiceManage() {
  function formatData(res) {
    if (res && Array.isArray(res.data)) {
      res.data = res.data.map(d => ({
        ...d,
        fileUrl : typeof d.imgUrls === 'string' && d.imgUrls.split(';').filter(f => {
          // 过滤非 http协议 地址 
          return isHttpUrl(f)
        }).map(u => ({url: u})) || [],
      }))
    }
  }
  return <div>
    <Page
      // 自定义查询 自定表头 code
      code="valueaddedservice_manage_config"
    // 查询配置
      searchOptions={{
        url: searchUrl,
        method: 'post',
        model: qSearch
      }}
      // 表格配置
      tableOptions={{
        model: qColumns,
        showRowSelection: true,
        formatData
      }}
      // 工具栏配置
      tools={[
        { type: 'fenpeiTask', title: '分配', onSubmit: getTaskAllocation },
        { type: 'formDialog', title: '退款完结', config: taskFinishConfig, DialogWidth: 500, refresh: true,
          beforeShow: ({selectRows}) => {
            if (isEmpty(selectRows)) return "请选择需要异常的任务";
            if (selectRows.some(s => [-1, -2, 5].includes(s.status))) {
              return '已取消，已完结，已退款的订单不允许再操作完成'
            }
          },
          getData: ({selectRows}) => {
            const formData = {}
            const firstRow = !isEmpty(selectRows) && Array.isArray(selectRows) && selectRows[0]
            if (getObjType(firstRow) === 'Object') {
              Object.assign(formData, firstRow)
              formData.ids = selectRows.map(s => s.id)
            }
            return formData
          },
          onSubmit: async(data) => {
            try {
              await getTaskFinish(data)
              Message.success('任务退款完结成功')
            } catch(e) {
              return e.message
            }
          }
        },
      ]}
      // 表格操作栏配置
      operationsWidth={130}
      operations={[
        { type: 'formDialog', title: '详情', getData: getLogList, defaultValue: '-', config: detailModel, DialogWidth: 760, refresh: true },
        { type: 'formDialog', title: '照片审核', config: auditImageConfig, DialogWidth: 770, refresh: true,
          // {
          //   "0": "已生成",
          //   "1": "已分配",
          //   "2": "作业中",
          //   "3": "异常",
          //   "4": "已作业",
          //   "5": "已完结",
          //   "-1": "已退款",
          //   "-2": "已取消"
          // }
          // 异常, 已完结, 已退款, 未审核 显示 照片审核 按钮 
          show: (val, index, record) => record.auditStatus != 1 && [3, 5, -1].some(s => record.status == s),
          onSubmit: async (data) => {
            const { fileUrl } = data
            if (isEmpty(fileUrl)) return '请先上传照片';
            if (!Array.isArray(fileUrl)) return '无效的照片信息';
            try {
              const result = await new Promise(resolve => {
                Dialog.confirm({
                  title: '提示',
                  content: '确定审核通过？ 确认通过后，照片将不可修改',
                  onOk: () => resolve(true),
                  onClose: () => resolve(false),
                  onCancel: () => resolve(false)
                })
              })
              if (result === false) return false
              await getAuditPicture(data)
              Message.success('审核成功')
            } catch(e) {
              return e.message
            }
          }
        },
      ]}
      // queryList 组件相关配置
      queryListOptions={{ }}
    ></Page>
  </div>

}
