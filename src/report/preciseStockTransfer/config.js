import React from 'react'
import { DatePicker2, NumberPicker, Message } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import { defaultCurrentTime } from '@/report/utils'
import API from 'assets/api'
import $http from '@/assets/js/ajax'
import { getDistrictOptions } from '@/report/apiOptions'
import { taskStatusOptions } from '@/report/options';
// 查询接口
export const searchUrl = '/package/transfer/manage/queryTransferTaskList'
// 查询推荐库区
export const getTransferSuggestInfo = '/package/transfer/manage/queryTransferSuggestInfo'
// 创建任务任务
export const getCreateTransferTasks = '/package/transfer/manage/createTransferTasks'
// 查询任务包裹 信息
export const getTransferTaskDetailList = '/package/transfer/manage/queryTransferTaskDetailList'
// 分配任务
export const getDispatchTransferTask = '/package/transfer/manage/dispatchTransferTask'

// 开始作业完成作业接口
export const UpdataeTaskStatusUrl = '/jobWaveTask/update'


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
    gmtCreate: {
      label: '创建时间',
      fixedSpan: 22,
      defaultValue: defaultCurrentTime,
      component: DatePicker2.RangePicker,
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        timePanelProps: {
          format: 'HH:mm:ss'
        },
        showTime: true,
      }
    },
    districtId: {
      label: '库区名称',
      component: ASelect,
      attrs: {
        showSearch: true,
        watchKey: 'warehouseId',
        getOptions: getDistrictOptions,
      }
    },
    taskId: {
      label: '任务号',
    },
    containerCode: {
      label: '容器号',
    },
  }
]

// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
    lock: 'left'
  },
  storageArea: {
    title: '移库库区',
  },
  firstPackageNumLimit: {
    title: '库区首单上限',
  },
  canTransferFirstPackageNum: {
    title: '可移库首单数',
  },
  suggestDestStorageArea: {
    title: '建议目标库区',
  },
  destFirstPackageNumLimit: {
    title: '目标库区首单上限',
  },
  transferPackageNum: {
    title: '移库包裹数',
  },
  destStorageArea: {
    title: '实际移库库区',
  },
  id: {
    title: '任务ID',
  },
  containerCode: {
    title: '容器号',
  },
  taskStatus: {
    title: '任务状态',
    width: 100,
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
  make: {
    title: '操作',
    width: 200,
    lock: 'right'
  }
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
  sourceDistrictId: {
    label: '移库库区',
    component: ASelect,
    required: true,
    attrs: {
      showSearch: true,
      watchKey: 'warehouseId',
      getOptions: getDistrictOptions,
      onChange: (val, {field, setLoading}) => {
        if (val) {
          const warehouseId = field.getValue('warehouseId')
          setLoading(true, 'medium')
          $http({
            url: getTransferSuggestInfo,
            method: 'get',
            data: {
              warehouseId,
              districtId: val
            }
          }).then(d => {
            field.setValues({
              canTransferFirstPackageNum: d.canTransferFirstPackageNum,
              suggestDistrictId: d.suggestDistrictId
            })
          }).catch(e => {
            Message.error(e.message)
            field.setValues({
              canTransferFirstPackageNum: '',
              suggestDistrictId: ''
            })
          }).finally(e => {
            setLoading(false)
          })
        }
      }
    }
  },
  canTransferFirstPackageNum: {
    label: '可移库首单数',
    disabled: true,
    required: true,
    attrs: {
      placeholder: '通过移库库区查询获得'
    }
  },
  suggestDistrictId: {
    label: '建议目标库区',
    component: ASelect,
    disabled: true,
    required: true,
    attrs: {
      detail: true,
      placeholder: '通过移库库区查询获得',
      watchKey: 'warehouseId',
      getOptions: getDistrictOptions,
    }
  },
  destDistrictId: {
    label: '实际移库库区',
    component: ASelect,
    required: true,
    attrs: {
      showSearch: true,
      watchKey: 'warehouseId',
      getOptions: getDistrictOptions,
    }
  },
  firstPackageNum: {
    label: '移库首单数',
    required: true,
    component: NumberPicker
  }
}


// 任务明细columns
export const TaskDetailColumns = {
  deliveryCode: {
    title: '包裹号'
  },
  storagePosition: {
    title: '库位号'
  }
}
// 分配任务查询条件
export const taskDistributionSearchModel = {
  employeeName: {
    label: '员工姓名'
  },
  employeeJobNO: {
    label: '员工登录名'
  },
  sbtn: true
}
// 分配任务columns
export const taskDistributionColumns = {
  employeeName: {
    title: '员工姓名'
  },
  employeeJobNO: {
    title: '员工登录名'
  },
  make: {
    title: '操作',
  }
}