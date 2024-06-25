import React from 'react';
import { ASelect, DatePicker2, } from '@/component';
import Page from '@/atemplate/queryTable';
import {getWid, isEmpty} from 'assets/js';
import $http from 'assets/js/ajax';
import { defaultSearchTime } from '@/report/utils'
// 查询接口
export const searchApiUrl = '/expire/task/list'

// 分配任务
export async function getTaskAllocation(result) {
  const {data, selectRows = []} = result
  await $http({
    url: '/expire/task/allocation',
    method: 'post',
    data: {
      warehouseId: selectRows[0].warehouseId,
      taskNo: selectRows.map(s => s.taskNo),
      employeeId: data.id
    }
  })
}

// 导入
export function importConfig(data) {
  return $http({
    url: '/expire/task/batchAdd',
    method: 'post',
    data: data,
    dataType: 'form',
  })
}

// 任务状态
export const getTaskStatusOptions = $http({
  url: 'expire/task/getStatusLabel',
  method: 'get',
}).then(res => {
  return res && Object.entries(res).map(([value, label]) => ({label, value})) || []
}).catch(e => [])


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
    makeTime: {
      label: '任务创建时间',
      fixedSpan: 22,
      needExpandToData: true,
      defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      transTimeCode: ['startTime', 'endTime'],
      format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      }
    },
    taskNo: {
      label: '任务编号',
    },
    status: {
      label: '任务状态',
      component: ASelect,
      attrs: {
        getOptions: async() => {
          return await getTaskStatusOptions
        }
      }
    },
  }
]

// 列表
export const tColumns = {
  warehouseId: {
    title: '仓库',
    cell: (val) => <ASelect value={val} isDetail></ASelect>,
    lock: 'left'
  },
  taskNo: {
    title: '任务编号',
  },
  taskStatus: {
    title: '任务状态',
    cell: val => <ASelect value={val} isDetail getOptions={async() => await getTaskStatusOptions}></ASelect>
  },
  operator: {
    title: '任务分配人',
  },
  allocationTime: {
    title: '任务创建时间',
  },
  finishTime: {
    title: '任务完成时间',
  },
}

// 批量导入
export const batchExportModel = {
  file: {
    fileName: 'uploadExpirePackage.xlsx',
    componentType: 'import',
  }
}

// 详情
export const detailTableModel= {
  list: {
    label: '',
    component: Page,
    span: 24,
    attrs: {
      queryListOptions: {
        pagination: false,
        initSearch: true,
        toolSearch: false
      },
      searchOptions: {
        url: '/expire/task/getDetail',
        method: 'post',
        beforeSearch: (req) => {
          const { pageProps, data, ...params } = req
          const { warehouseId, taskNo } = pageProps.field.getValues();
          return {
            ...params,
            data: {
              ...data,
              warehouseId,
              taskNo
            }
          }
        }
      },
      tableOptions: {
        model: {
          referLogisticsOrderCode: {
            title: 'LP单号',
            width: 150
          },
          deliveryCode: {
            title: '运单号',
            width: 150
          },
          weight: {
            title: '包裹重量（g）'
          },
          volume: {
            title: '包裹尺寸(cm)',
            width: 150
          },
          categoryName: {
            title: '品名'
          },
          totalPrice: {
            title: '总价值'
          },
          shelvesTime: {
            title: '上架时间'
          },
          packageStatusLabel: {
            title: '包裹状态'
          }
        },
        formatData: (res, params, formatData, action) => {
          return formatData(res || [])
        },
      },
    }
  }
}