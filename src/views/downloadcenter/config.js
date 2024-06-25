import React from 'react'
export const fileStatus = [
  {label: '导出中', value: 'INIT'},
  {label: '导出成功', value: 'SUCC'},
  {label: '导出失败', value: 'FAIL'},
  {label: '已下载', value: 'DOWNLOAD'},
  {label: '过期失效', value: 'DUMP'},
]

export const columns = {
  fileName: {
    title: '文件名',
    width: 400,
  },
  fileStatus: {
    title: '数据状态',
    cell: (val) => {
      const text = (fileStatus.find(f => f.value == val) || {label: '--'}).label
      return <span className={`downcenter_${val}`}>{text}</span>
    }

  },
  generateTime: {
    title: '创建时间'
  },
  make: {
    title: '操作',
  }
}