import React from 'react';
import { ASelect, Input, DatePicker2, AFormTable, Message  } from '@/component';
import { getWid, getStringCodeToArray } from 'assets/js';
import $http from 'assets/js/ajax';
import { defaultSearchTime } from '@/report/utils';
import { getDistrictOptions } from '@/report/apiOptions'
import { taskStatusOptions } from '@/report/options';
import API from 'assets/api'
// 查询接口
export const searchApiUrl = '/package/transfer/manage/tmall/queryTransferTaskList'

// 新增配置接口
export const addConfigApiUrl = '/package/transfer/manage/tmall/createTransferTasks'

// 任务分配
export const taskTransferApiUrl = '/package/transfer/manage/tmall/dispatchTransferTask'

// 任务详情接口
export const taskDetailApiUrl = '/package/transfer/manage/tmall/queryTransferTaskDetailList'

// 批量导入接口
export const batchExportApiUrl = '/package/transfer/manage/tmall/batchAddTransferTask'

// 取消任务
export const cancelTransferTaskApiUrl = '/package/transfer/manage/tmall/cancelTransferTask'

// 创建任务
export function addConfig(data) {
  return $http({
    url: addConfigApiUrl,
    method: 'post',
    data
  })
}

// 批量上传
export async function batchExportTask(fileData, orgData) {
  console.log(fileData, orgData, '批量上传移库任务==')
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
      timeout: 60000,
      dataType: 'form',
    })
    console.log(res, 888)
    Message.success('导入成功')
  } catch(e) {
    return e.message
  }
}


// 分配任务
export async function getTaskAllocation(result) {
  const {data, selectRows = []} = result
  await $http({
    url: taskTransferApiUrl,
    method: 'get',
    data: {
      warehouseId: selectRows[0].warehouseId,
      taskId: selectRows[0].id,
      operator: data.employeeJobNO
    }
  })
}

// 取消任务
export async function getCancelTransferTask(data) {
  await $http({
    url: cancelTransferTaskApiUrl,
    method: 'get',
    data: {
      warehouseId: data.warehouseId,
      taskId: data.id,
    }
  })
}

// 获取任务详情列表
export async function getTaskDetail(data) {
  try {
    const res = await $http({
      url: taskDetailApiUrl,
      method: 'post',
      data: {
        warehouseId: data.warehouseId,
        taskId: data.id,
      }
    })
    return Array.isArray(res) && { list: res } || {list: []}
  } catch(e) {
    return {list : []}
  }
}


export const qSearch = [
  {
    warehouseId: {
      label: '仓库名称',
      defaultValue: getWid(),
      component: ASelect,
      attrs: {
        hasClear: false,
        onChange(val, vm, action) {
          action && vm.field.setValue('districtId', '')
        }
      }
    },
    gmtCreate: {
      label: '创建时间',
      fixedSpan: 22,
      defaultValue: defaultSearchTime,
      transTimeCode: ['queryStartTime', 'queryEndTime'],
      format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
      component: DatePicker2.RangePicker,
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      }
    },
    userIds: {
      label: '用户ID',
      // format: (val) => getStringCodeToArray(val),
      attrs: {
        // placeholder: "批量用户ID请用空格分隔"
      }
    },
    districtId: {
      label: '移库下架库区',
      component: ASelect,
      attrs: {
        showSearch: true,
        watchKey: 'warehouseId',
        getOptions: getDistrictOptions
      }
    },
    deliveryCode: {
      label: '包裹运单号'
    },
  }
]

// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
    lock: 'left'
  },
  id: {
    title: '任务ID',
  },
  userIds: {
    title: '用户ID',
    cell: (val) => val + "" 
  },
  transferPackageNum: {
    title: '移库任务\n包裹总数',
  },
  offShelvesPackageNum: {
    title: '移库下架\n包裹数量'
  },
  storageArea: {
    title: '移库下架库区',
  },
  destWarehouseName: {
    title: '移库目标仓库'
  },
  consoWarehouseCode: {
    title: '移库目标仓库\n虚仓Code'
  },
  onShelvesPackageNum: {
    title: '移库上架\n包裹数量'
  },
  destStorageArea: {
    title: '移库上架库区',
  },
  taskStatus: {
    title: '任务状态',
    cell: (val) => <ASelect isDetail value={val} getOptions={async() => taskStatusOptions} defaultValue="-"></ASelect>
  },
  operator: {
    title: '分配人员'
  },
  createTime: {
    title:'创建时间',
    width: 200,
  },
  createUser: {
    title: '创建人',
  },
}


// 新增配置
export const addFormModel = {
  warehouseId: {
    label: '仓库名称',
    required: true,
    defaultValue: getWid(),
    component: ASelect,
    attrs: {
      hasClear: false
    }
  },
  destWarehouseId: {
    label: '移库目标仓库',
    component: ASelect,
    required: true,
    attrs: {
      onChange(val, vm, action) {
        if (action) {
          vm.field.setValue('destDistrictId', '')
          vm.field.setValue('consoWarehouseCode', '')
        }
      }
    }
  },
  consoWarehouseCode: {
    label: '移库目标虚库Code',
    component: ASelect,
    required: true,
    show: data => data.warehouseId !== data.destWarehouseId,
    attrs: {
      watchKey: 'destWarehouseId',
      getOptions: async({field}) => {
        const warehouseId = field.getValue('destWarehouseId')
        const data = await $http({
          url: API.getVirtualWarehouseList,
          method: 'get',
          data: {
            pageNum: 1,
            pageSize: 20,
            warehouseId
          }
        }).then(res => {
          return res && res.data || []
        }).catch(e => [])
        return data.map(d => ({
          ...d,
          label: d.virtualWarehouseCode,
          value: d.virtualWarehouseCode
        }))
      }
    }
  },
  destDistrictId: {
    label: '移库目标库区',
    component: ASelect,
    required: true,
    attrs: {
      showSearch: true,
      watchKey: 'destWarehouseId',
      getOptions: async({field}) => {
        const warehouseId = field.getValue('destWarehouseId')
        const opt = await getDistrictOptions({field, warehouseId})
        return opt
      }
    }
  },
  userIds: {
    label: '移库包裹用户ID',
    component: Input.TextArea,
    span: 24,
    required: true,
    format: (value, { action }) => {
      const result = {
        inset: Array.isArray(value) && value.join('\n'),
        output: typeof value == 'string' && value.split(/\n|\r/)
      }
      return result[action]
    },
    attrs: {
      rows: 10,
      placeholder: '多个用户ID请使用回车换行分隔'
    }
  },
}


// 任务明细columns
export const TaskDetailColumns = {
  warehouseName: {
    title: '仓库名称'
  },
  deliveryCode: {
    title: '包裹号'
  },
  storagePosition: {
    title: '原库位'
  },
  transferOffShelvesTime: {
    title: '移库下架时间'
  },
  destWarehouseName: {
    title: '移库目标仓库名称'
  },
  destStoragePosition: {
    title: '当前库位'
  },
  transferPutAwayTime: {
    title: '移库上架时间'
  }
}
export const TaskDetailFormModel = {
  list: {
    label: '',
    span: 24,
    component: AFormTable,
    attrs: {
      columns: TaskDetailColumns,
      edit: false
    }
  }
}

// 批量导入
export const batchExportModel = {
  file: {
    fileName: 'transferUploadExcel.xlsx',
    componentType: 'import',
  }
}