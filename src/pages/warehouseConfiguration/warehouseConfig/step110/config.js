import React from 'react';
import {  ASelect, Button, Message, NumberPicker  } from '@/component'
import $http from 'assets/js/ajax'
import { transMultipleToStr, AsyncDebounce, isEmpty, getUuid } from 'assets/js'
import API from 'assets/api'
import { getStepBaseData, InitDefaultData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import { getCountry, getCarrierType } from '@/report/apiOptions'
import { videoFormModel, videoConfigSubmit, getVideoConfigData } from '@/pcs/warehouse/component/eyeAudioConfig/config'

const isEditable = () => getStepBaseData().readOnly
const isTMall = () => {
  const data = getStepBaseData();
  return isEmpty(data.warehouseType) ? true : data.isTMall
}
const isNeedShowWarehouse = () => {
  const data = getStepBaseData();
  return isEmpty(data.warehouseType)
}


export {
  videoConfigSubmit,
  getVideoConfigData
}

// 获取合箱配置列表
export function getMergeConfigList(data) {
  return $http({
    url: API.getPackageMergeWeightConfigList,
    method: 'post',
    data: {
      pageNum: 1,
      pageSize: 1000,
      ...data,
    }
  }).then(res => {
    return (res && res.data || [{}])
  }).catch(e => {
    Message.error(e.message);
    return {}
  })
}

export const isTrueOrNot = [{"label": "是", "value": true}, {"label": "否", "value": false}];
// 拣货模式
export const pickingModeList = [
  // {"label": "请选择", "value": "0"},
  {"label": "播种式", "value": "1"},
  {"label": "摘果式", "value": "2"},
  {"label": "边拣边分", "value": "3"},
  {"label": '闪电播模式', value: '7'}
];

// 重量校验类型
export const weightDeviationTypeOptions = [
{"label": "按差异值", "value": "0"},
{"label": "按比例", "value": "1"},
]
// 是否测量体积
export const isVolumeVerifyOptions = [
  {"label": "是", "value": "1"},
  {"label": "否", "value": "0"},
]

// 基础信息
export const baseInfo = {
  warehouseId: {
    label: '仓库名称',
    component: ASelect,
    required: true,
    disabled: isEditable,
    show: isNeedShowWarehouse,
    attrs: {
      hasClear: false
    }
  },
  serviceType: {
    label: '业务类型',
    component: ASelect,
    disabled: isEditable,
    attrs: {
      placeholder: '不填则默认为全部业务类型',
      showSearch: true,
      getOptions: async() => {
        return await getCarrierType
      }
    }
  },
  areaCode: {
    label: '国家',
    required: true,
    component: ASelect,
    disabled: isEditable,
    format: transMultipleToStr,
    attrs: {
      showSearch: true,
      mode: 'multiple',
      getOptions: async() => {
        return await getCountry
      }
    }
  },
  pickingMode: {
    label: '拣货模式',
    component: ASelect,
    disabled: isEditable,
    format: transMultipleToStr,
    attrs: {
      getOptions: async() => pickingModeList,
      mode: 'multiple'
    }
  },
  isNeedBox: {
    label: '是否装箱',
    component: ASelect,
    disabled: isEditable,
    attrs: {
      isRadio: true,
      getOptions: async() => {
        return isTrueOrNot
      }
    }
  },
  isMarkMoreException: {
    label: '是否自动标记多货异常',
    component: ASelect,
    disabled: isEditable,
    attrs: {
      isRadio: true,
      getOptions: async() => {
        return isTrueOrNot
      }
    }
  },
  partCheckFlag: {
    label: '是否部分复核',
    component: ASelect,
    disabled: isEditable,
    attrs: {
      isRadio: true,
      getOptions: async() => {
        return isTrueOrNot
      }
    }
  }
  
}
// 体积，重量
export const otherGroupModel1 = {
  isWeigh: {
    label: '是否称重',
    component: ASelect,
    disabled: isEditable,
    attrs: {
      isRadio: true,
      getOptions: async() => {
        return isTrueOrNot
      },
    }
  },
  weighingType: {
    label: '称重配置',
    component: ASelect,
    show: data => data.isWeigh,
    disabled: isEditable,
    attrs: {
      getOptions: async() => {
        const list = await $http({
          url: API.getPackageMergeWeighingType,
          method: 'get',
        })
        return Array.isArray(list) && list.map(l => ({
          ...l,
          label: l.description,
          value: l.code,
          disabled: l.code == 0
        }))
      }
    }
  },
  isWeighVerify: {
    label: '是否称重校验',
    component: ASelect,
    show: data => data.isWeigh,
    disabled: isEditable,
    attrs: {
      isRadio: true,
      getOptions: async() => {
        return isTrueOrNot
      }
    }
  },
  weightDeviationType: {
    label: '称重校验类型',
    component: ASelect,
    show: data => data.isWeigh && data.isWeighVerify,
    disabled: isEditable,
    attrs: {
      getOptions: async() => {
        return weightDeviationTypeOptions
      }
    }
  },
  weightDeviationPercent: {
    label: '重量校验误差上限(按比例)',
    component: NumberPicker,
    show: data => data.isWeighVerify && data.weightDeviationType == '1',
    disabled: isEditable,
    validate: (val) => {
      if (!val || val <= 0) {
        Message.warning('重量校验误差上限(按比例)必须大于 0%')
        return false
      }
      return true
    },
    attrs: {
      min: 0,
      innerAfter: '%',
      precision: 2
    }
  },
  weightDeviationLimit: {
    label: '重量校验误差上限(按差异值)',
    component: NumberPicker,
    show: data => {
      return data.isWeighVerify && data.weightDeviationType == '0'
    },
    disabled: isEditable,
    validate: (val) => {
      if (!val || val <= 0) {
        Message.warning('重量校验误差上限(按差异值)必须大于 0')
        return false
      }
      return true
    },
    attrs: {
      min: 0,
    }
  },
  mergeAppendWeight: {
    label: '合箱附加重量(g)',
    disabled: isEditable,
    component: NumberPicker,
    attrs: {
      min: 0,
    }
  },
  weightUpper: {
    label: '包裹重量上限(g)',
    disabled: isEditable,
    show: data => data.isWeigh,
    component: NumberPicker,
    attrs: {
      min: 0,
    }
  },
  maxLengthOfSingleSide: {
    label: '包裹长上限(cm)',
    disabled: isEditable,
    component: NumberPicker,
    attrs: {
      min: 0,
    }
  },
  maxWidthOfSingleSide: {
    label: '包裹宽上限(cm)',
    disabled: isEditable,
    component: NumberPicker,
    attrs: {
      min: 0,
    }
  },
  maxHeightOfSingleSide: {
    label: '包裹高上限(cm)',
    disabled: isEditable,
    component: NumberPicker,
    attrs: {
      min: 0,
    }
  },
  isVolumeVerify: {
    label: '是否测量体积',
    component: ASelect,
    disabled: isEditable,
    show: isTMall,
    attrs: {
      hasClear: false,
      isRadio: true,
      getOptions: async({field}) => {
        return isVolumeVerifyOptions
      },
    }
  },
  isVolumeLimitInterception: {
    label: '是否材积校验',
    component: ASelect,
    disabled: isEditable,
    show: (data) => data.isVolumeVerify == '1' && isTMall(),
    attrs: {
      hasClear: false,
      isRadio: true,
      getOptions: async({field}) => {
        return isTrueOrNot
      },
    }
  },
  enableTrianglePerimeter: {
    label: '是否开启三边长/围长',
    component: ASelect,
    disabled: isEditable,
    show: (data) => data.isVolumeVerify == '1' && isTMall(),
    attrs: {
      hasClear: false,
      isRadio: true,
      getOptions: async({field}) => {
        return isTrueOrNot
      },
    }
  },
  triangleSideLimit: {
    label: '包裹三边长上限（cm）',
    disabled: isEditable,
    component: NumberPicker,
    show: (data) => data.isVolumeVerify == '1' && isTMall(),
    attrs: {
      min: 0,
      precision: 2
    }
  },
  choiceWeightUpper: {
    label: 'CHOICE重量差异上限',
    component: NumberPicker,
    disabled: isEditable,
    attrs: {
      min: 0,
    }
  }
}

// 单 票, 多票
export const otherGroupModel2 = {
  aloneTailPackageMerge: {
    label: '单包尾包直接合箱打单',
    component: ASelect,
    disabled: isEditable,
    attrs: {
      isRadio: true,
      getOptions: async() => {
        return isTrueOrNot
      }
    }
  },
  singleParcelNeedScanPackingMaterial: {
    label: '单票订单是否扫描包材',
    component: ASelect,
    disabled: isEditable,
    attrs: {
      isRadio: true,
      getOptions: async() => {
        return isTrueOrNot
      }
    }
  },
  needScanPackingMaterial: {
    label: '多票订单是否扫描包材',
    component: ASelect,
    disabled: isEditable,
    attrs: {
      isRadio: true,
      getOptions: async() => {
        return isTrueOrNot
      }
    }
  },
  defaultPackingMaterialWeight: {
    label: '多票订单包材默认重量(g)',
    component: NumberPicker,
    show: data => !data.needScanPackingMaterial,
    disabled: isEditable,
    attrs: {
      min: 0,
      precision: 0
    }
  },
  scanSinglePackageMerge: {
    label: '多票订单是否扫描单个包裹自动合箱',
    component: ASelect,
    disabled: isEditable,
    attrs: {
      isRadio: true,
      getOptions: async() => {
        return isTrueOrNot
      }
    }
  },
  userWhiteList: {
    label: '去质检合箱白名单',
    component: ASelect,
    show: data => data.scanSinglePackageMerge,
    disabled: isEditable,
    required: true,
    format: (value, { data, action }) => {
      const values = {
        inset: Array.isArray(value) && value.map(v => ({...v, value: v.userId})) || [{label: '全部', userName: '全部', value: '0', userId: '0'}],
        output: Array.isArray(value) && value || undefined
      }
      return values[action]
    },
    attrs: {
      watchKey: 'empSearch',
      allValue: '0',
      mode: 'multiple',
      showSearch: true,
      useDetailValue: true,
      filterLocal: false,
      maxTagCount: 9999,
      tagInline: false,
      fillProps: 'userName',
      placeholder: '请输入员工姓名或工号搜索',
      getOptions: AsyncDebounce(async ({field}) => {
        const list = [
          {label: '全部', userName: '全部', value: '0', userId: '0'}
        ]
        const sv = field.getValue('empSearch')
        if (!sv || !sv.length || !sv.trim()) return list
        const res = await $http({
            url: API.getJobName(sv),
            method: 'get'
        })
        return list.concat(Array.isArray(res) && res.map(r => ({
            ...r,
            label: `${r.userName || ''}${r.employeeNo && `(${r.employeeNo})` || ''}${r.loginName && `-${r.loginName}` || ''}`,
            value: r.userId
        })) || [])
      }),
      onSearch: (val, field) => {
        field.setValue('empSearch', val)
      }
    }
  },
  allowSubSeparateCountry: {
    label: '子母件拆单国家或地区',
    component: ASelect,
    disabled: isEditable,
    format: transMultipleToStr,
    show: isTMall,
    attrs: {
      showSearch: true,
      mode: 'multiple',
      getOptions: async() => {
        return await getCountry
      }
    }
  }
}

// 天眼配置 videoFormModel
export const EyeRecordModel = videoFormModel
// export const EyeRecordModel = {
//   eyeVideoSwitch: {
//     label: "是否开启天眼录制",
//     component: ASelect,
//     required: true,
//     span: 24,
//     attrs: {
//       isRadio: true,
//       defaultValue: false,
//       getOptions: async() => {
//         return isTrueOrNot
//       }
//     }
//   },
//   siteCode: {
//     label: '物理仓编码（IPC鹰眼录制设备必填）',
//     tips: "IPC鹰眼视频录制对应在智鸟平台的物理仓编码（未在智鸟平台创建物理仓的可不填）",
//     span: 24,
//     attrs: {
//       placeholder: '请输入PC设备鹰眼视频物理仓编码'
//     }
//   }
// }


// 默认配置
  // 初始化默认值
  export function getDefaultData(baseData) {
    let defaultData = {uuid: getUuid()}
    InitDefaultData([baseInfo, otherGroupModel1, otherGroupModel2], defaultData)
    Object.assign(defaultData, {
      warehouseId: baseData.warehouseId,
      warehouseName: baseData.warehouseName,
      isWeigh: false,
      weighingType: 0,
      weightUpper: 0,
      maxLengthOfSingleSide: 0,
      maxWidthOfSingleSide: 0,
      maxHeightOfSingleSide: 0,
      mergeAppendWeight: 0,
      isWeighVerify: false,
      weightVerifyType: 0,
      weightDeviationLimit: 0,
      isNeedBox: false,
      aloneTailPackageMerge: false,
      isMarkMoreException: false,
      needScanPackingMaterial: false,
      scanSinglePackageMerge: false,
      singleParcelNeedScanPackingMaterial: false,
      defaultPackingMaterialWeight: 0,
      weightDeviationType: '0',
      isVolumeVerify: '0',
      whiteList: [{label: '全部', value: '0', userId: '0'}],
      isVolumeLimitInterception: false,
      enableTrianglePerimeter: false,
      triangleSideLimit: 0,
      partCheckFlag: false,
    })
    return defaultData
  }

  // 表单group 配置
  export const groupConfig = {
    base: {title: '基础信息', model: baseInfo},
    other: {title: '重量、体积配置', model: otherGroupModel1},
    other2: {title: '单票、多票订单配置', model: otherGroupModel2},
  }
