import React from 'react';
import { ASelect, Input, NumberPicker } from '@/component';
import {getWid, isEmpty} from 'assets/js';
import $http from 'assets/js/ajax';
// 查询接口
export const searchApiUrl = '/sys/trunk/train/config/pageList'

// 新增
export function addConfig(data) {
  return $http({
    url: '/sys/trunk/train/config/create',
    method: 'post',
    data
  })
}

// 更新
export function updateConfig(data) {
  return $http({
    url:`/sys/trunk/train/config/modify`,
    method: 'post',
    data
  })
}

// 删除
export function deleteConfig(data) {
  return $http({
    url:'/sys/trunk/train/config/delete',
    method: 'post',
    data
  })
}

// 导入
export function importConfig(data) {
  return $http({
    url: '/sys/trunk/train/config/upload',
    method: 'post',
    data: data,
    dataType: 'form',
  })
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
    channelCodeList: {
      label: '渠道代码',
    },
    trunkName: {
      label: '干线仓目的地',
    },
    trunkPartner: {
      label: '干线仓CP'
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
  channelCodeList: {
    title: '渠道代码',
  },
  trunkCode: {
    title: '干线仓Code'
  },
  trunkName: {
    title: '干线仓目的地',
  },
  trunkPartner: {
    title: '干线仓CP',
  },
  aging: {
    title: '时效',
  },
  packingType: {
    title: '装箱/装袋'
  },
  trainType: {
    title: '车辆类型'
  },
  truckLoad: {
    title: '装载量'
  },
  bagNumberLimit: {
    title: "单个大包上限值"
  }
}

// 新增 / 修改
export const formModelConfig = {
  warehouseId: {
    label: '仓库名称',
    required: true,
    component: ASelect,
    disabled: true,
  },
  trunkCode: {
    label: '干线仓Code',
    required: true,
    disabled: data => !data.isAdd
  },
  trunkName: {
    label: '干线仓目的地',
    required: true,
    disabled: data => !data.isAdd
  },
  channelCodeList: {
    label: '渠道代码',
    required: true,
    component: Input.TextArea,
    validate: (value, data, setError) => {
      if (typeof value === "string") {
        const list = value.trim().split(/\,|\，/).filter(l => l);
        if (isEmpty(list)) {
          setError('渠道代码不能为空')
          return false
        } else {
          if (list.some((l, i) => {
            const vn = l.split('/');
            if (!vn[1]) {
              setError(`渠道格式不正确，格式必须为 渠道编码/渠道名称，多个以逗号分隔`)
              return true
            }
            if (/[^a-zA-Z0-9\_\-]/.test(vn[0])) {
              setError("渠道编码必须为 大小写字母、数字、下划线、中划线的组合")
              return true
            }
            return false
          })) {
            return false
          }
        }
        return true
      } else {
        setError("渠道代码格式不正确")
        return false
      }
      
    },
    span: 24,
    attrs: {
      placeholder: '如：渠道1编码/渠道1名称，渠道2编码/渠道2名称, 多个请以逗号分隔',
      rows: 4
    }
  },
  trunkPartner: {
    label: '干线仓CP',
    required: true,
  },
  aging: {
    label: '时效',
    required: true,
    component: NumberPicker,
    attrs: {
      min: 0,
    }
  },
  packingType: {
    label: '装箱/装袋',
    required: true,
  },
  bagNumberLimit: {
    label: "单个大包上限值",
    required: true,
    component: NumberPicker,
    attrs: {
      min: 0,
    }
  },
  trainType: {
    label: '车辆类型',
    required: true,
  },
  truckLoad: {
    label: '装载量',
    required: true,
    component: NumberPicker,
    attrs: {
      min: 0,
    }
  },

}

// 批量导入
export const batchExportModel = {
  file: {
    fileName: 'trunkTrainUploadExcel.xlsx',
    componentType: 'import',
  }
}