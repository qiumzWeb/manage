import React from 'react';
import { ASelect, Input, Message, Dialog, DatePicker2  } from '@/component';
import { getWid, getStringCodeToArray } from 'assets/js';
import $http from 'assets/js/ajax';
import { getJoomReversalInstock } from '@/report/apiOptions'

// 查询接口
export const searchApiUrl = '/jobReversalPrediction/list'

// 批量导入上传
export const batchExportApiUrl = "/jobReversalPrediction/upload"

// 导入上传
export async function batchExportReason(fileData, orgData) {
  console.log(fileData, orgData, '批量上传==')
  try {
    const fileList = fileData.file
    const formData = new FormData()
    Array.isArray(fileList) && fileList.forEach(file => {
      formData.append('file', file.originFileObj)
    })
    formData.append('warehouseId', getWid())
    const res = await $http({
      url: batchExportApiUrl,
      method: 'post',
      data: formData,
      dataType: 'form',
    })
    console.log(res, 888)
    Message.success('导入成功')
  } catch(e) {
    Dialog.error({
      title: "导入失败",
      content: e.message
    })
    return false
  }
}


export const qSearch = [
  {
    warehouseId: {
      label: '仓库名称',
      defaultValue: getWid(),
      component: ASelect,
      attrs: {
        hasClear: false
      }
    },
    endMailNo: {
      label: '末端面单号',
    },
    expressNo: {
      label: '快递单号',
    },
    reasonCodeList: {
      label: '异常原因',
      component: ASelect,
      attrs: {
        mode: 'multiple',
        getOptions: async() => await getJoomReversalInstock
      }
    },
    searchTime: {
      label: '签收时间',
      fixedSpan: 24,
      component: DatePicker2.RangePicker,
      transTimeCode: ['signTimeStartTime', 'signTimeEndTime'],
      format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      }
    },
  }
]

// 列表
export const tColumns = {
  warehouseId: {
    title: '仓库名称',
    cell: val => <ASelect value={val} isDetail></ASelect>
  },
  endMailNo: {
    title: '末端面单号',
  },
  expressNo: {
    title: '快递单号'
  },
  reasonDesc: {
    title: '异常原因',
  },
  reasonCode: {
    title: '异常原因Code',
  },
  dangerKind: {
    title: '危险品种类',
  },
  signTime: {
    title: '签收时间',
  },
}


// 导入配置
export const batchExportModel = {
  file: {
    fileName: 'joomReversalInstockPkgList.xlsx',
    componentType: 'import',
  }
}