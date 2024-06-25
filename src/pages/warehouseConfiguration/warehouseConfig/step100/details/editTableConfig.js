import React from 'react';
import {TimePicker2, NumberPicker, AFormTable, Message} from '@/component'
import ASelect from '@/component/ASelect'
import * as opt from './options'
import {getWarehouseDistrictList} from './config'
import moment from 'moment'
import $http from 'assets/js/ajax'
import API from 'assets/api'
import {getWid, _uid, isEmpty, transMultipleToStr, _getName} from 'assets/js'
import { getStepBaseData, setStepBaseData, saveStepNode, InitDefaultData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import { getWavePackageType } from '@/report/apiOptions'
import { packagePlan, timeEfficiencyTypeOptions, AutoWavePackageAttrOptions } from '@/report/options'

const isEditTable = () => !getStepBaseData().readOnly;


export const getTimes = (timeStr) => {
  return timeStr && moment(moment().format(`YYYY-MM-DD ${timeStr}`))
}

// 获取库区列表
export const getDictionaryData = ({warehouseId}) => new Promise(resolve => {
  $http({
    url: API.getDistrictScopeList,
    method: 'get',
    data: {
      districtType: '2',
      warehouseId: warehouseId
    }
  }).then(data => {
    let list = data && data.data || []
    resolve(list.map(l => ({
      ...l,
      value: l.code,
      label: l.name
    })))
  })
})

// 体积汇波配置
export const volumeColumns = {
  startVolume: {
    title: '体积下限（m³）',
    required: true,
    width: 200,
    component: NumberPicker,
    attrs: { min: 0, max: 99999, precision: 6},
    edit: true
  },
  endVolume: {
    title: '体积上限（m³）',
    required: true,
    width: 200,
    component: NumberPicker,
    attrs: { min: 0, max: 99999, precision: 6},
    edit: true
  },
  waveOrderCount: {
    title: '波次订单数量',
    required: true,
    width: 200,
    component: NumberPicker,
    attrs: { precision: 0 },
    edit: true
  },
}

// 汇波筛选条件配置
export const packageAttrColumns = {
  goodsType: {
    title: '包裹类型',
    required: true,
    width: 200,
    component: ASelect,
    attrs: {
      mode: 'multiple',
      getOptions: async() => {
        return await getWavePackageType
      }
    },
    edit: true
  },
  consoType: {
    title: '集运类型(不填默认为全部类型)',
    // required: true,
    width: 200,
    component: ASelect,
    attrs: {
      mode: 'multiple',
      getOptions: async() => {
        return packagePlan
      }
    },
    edit: true
  },
  timeEfficiencyType: {
    title: '时效类型(不填默认为全部类型)',
    // required: true,
    width: 200,
    component: ASelect,
    attrs: {
      mode: 'multiple',
      getOptions: async() => {
        return timeEfficiencyTypeOptions
      }
    },
    edit: true
  },
  solutionCodes: {
    title: '解决方案（不填默认为全部方案）',
    // required: true,
    width: 200,
    component: ASelect,
    attrs: {
      mode: 'multiple',
      showSearch: true,
      getOptions: async() => {
        return AutoWavePackageAttrOptions
      }
    },
    edit: true
  },
  waveOrderCount: {
    title: '波次订单数量',
    required: true,
    width: 200,
    component: NumberPicker,
    attrs: { precision: 0 },
    edit: true
  },
}


// 汇波时间配置
export const columns = {
  waveTimeConfigApplyScopeType: {
    title: '配置生效范围类型',
    width: 200,
    required: true,
    component: ASelect,
    attrs: {
      watchKey: 'dataLength,pickingMode,warehouseId',
      disabled: (data) => opt.isFOrB(data.pickingMode),
      formatOptions: (val, options, field, {fields, ...props}) => {
        return options.map(o => ({
          ...o,
          disabled: o.value == '0' && fields.length > 1
        }))
      },
      getOptions: async({field, action, actionKey}) => {
        return opt.waveCreationTimeConfigScopeTypeList
      },
      onChange: (val, index, field, fields) => {
        fields.forEach((f,i) => {
          f.setValues({
            waveTimeConfigApplyScopeType: val,
            waveTimeApplyScope: []
          })
        })
      }
    },
    edit: true
  },
  waveTimeApplyScope: {
    title: '配置生效范围',
    width: 280,
    component: ASelect,
    attrs: {
      // placeholder: '不填默认为全部',
      maxTagCount: 6,
      tagInline: false,
      showSearch: true,
      mode: 'multiple',
      disabled: (data) => opt.isFOrB(data.pickingMode),
      watchKey: 'waveTimeConfigApplyScopeType,pickingMode,warehouseId',
      formatOptions: (val, options, field, {fields}) => {
        const waveTimeApplyScopeSelected = fields && fields.map(f=> f.getValue('waveTimeApplyScope') || []) || []
        const hasSelected = [...new Set((waveTimeApplyScopeSelected || []).flat())].filter(f => !(val || []).includes(f))
        return options.map(o => ({
          ...o,
          disabled: hasSelected.some(h => h == o.value)
        }))
      },
      getOptions: async({field, action, actionKey}) => {
        const { waveTimeConfigApplyScopeType } = field.getValues()
        const warehouseId = getStepBaseData().warehouseId
        const res = await getWarehouseDistrictList({warehouseId, waveCreationScopeType: waveTimeConfigApplyScopeType})
        return Array.isArray(res) && res.map(r => ({
          ...r,
          label: r.name,
          value: r.code
        }))
      }
    },
    edit: true
  },
  waveCreationTimeScopeItems: {
    title: '波次汇单时间范围',
    tips: `
1、添加一个或者多个时间区间的时长总和必须等于24小时;
2、上一时间段结束时间不能大于下一时间段开始时间
    `,
    required: true,
    edit: true,
    component: AFormTable,
    validate: [{
      key: 'waveCreationTimeScopeItems',
      cb: (val, data) => {
        // 汇波时间总长必须等于24小时
        const timeRang = val || []
        const timeSum = timeRang.reduce((a,b) => {
          const wt = b.waveCreationTime || []
          const ts = wt[1] - wt[0]
          return a + ts
        }, 0)
        if (timeSum !== (moment('2022-04-21 23:59') - moment('2022-04-21 00:00'))) {
          return '波次汇单总时长需等于24小时'
        }
        if (timeRang.some((t,i) => i> 0 && timeRang[i -1].waveCreationTime[1] > t.waveCreationTime[0])) {
          return '波次汇单上一时间段结束时间不能大于下一时间段开始时间'
        }
      }
    }],
    attrs: {
      hasHeader: false,
      hasBorder: false,
      watchKey: 'warehouseId',
      columns: {
        waveCreationTime: {
          title: '波次汇单时间范围起止时间',
          required: true,
          component: TimePicker2.RangePicker,
          transTimeCode: ['waveCreationStartTime', 'waveCreationEndTime'],
          format: ['HH:mm', 'HH:mm'],
          validate: [
            { key: 'waveCreationStartTime', msg: '波次汇单开始时间必填' },
            { key: 'waveCreationEndTime', msg: '波次汇单结束时间必填' }
          ],
          attrs: {
            format: 'HH:mm',
            placeholder: ['开始时间', '结束时间'],
          },
          edit: true
        },
      },
      hasAdd: isEditTable,
      maxLength: 5,
    }
  },
  lastwaveOpenTimeScopeItems: {
    title: '尾波汇单时间范围',
    required: true,
    edit: true,
    component: AFormTable,
    validate: [{
      key: 'lastwaveOpenTimeScopeItems',
      cb: (val, data) => {
        // 上一时间段结束时间不能大于下一时间段开始时间
        const lastRange = val || []
        if (lastRange.some((t,i) => i> 0 && lastRange[i -1].lastwaveOpenTime[1] > t.lastwaveOpenTime[0])) {
          return '尾波汇单上一时间段结束时间不能大于下一时间段开始时间'
        }
      }
    }],
    attrs: {
      hasHeader: false,
      hasBorder: false,
      watchKey: 'warehouseId',
      columns: {
        lastwaveOpenTime: {
          title: '尾波汇单时间范围起止时间',
          required: true,
          component: TimePicker2.RangePicker,
          transTimeCode: ['lastwaveOpenStartTime', 'lastwaveOpenEndTime'],
          format: ['HH:mm', 'HH:mm'],
          validate: [
            { key: 'lastwaveOpenStartTime', msg: '尾波汇单开始时间必填' },
            { key: 'lastwaveOpenEndTime', msg: '尾波汇单结束时间必填' }
          ],
          edit: true,
          attrs: {
            format: 'HH:mm',
            placeholder: ['开始时间', '结束时间'],
          }
        },
      },
      hasAdd: isEditTable,
      maxLength: 5,
    }
  },
}

// 尾包集分详情配置
export const tailDelConfig = {
  startEndTime: {
    title: '推荐起始时间',
    required: true,
    useDetailValue: true,
    transTimeCode: ['startTime', 'endTime'],
    format: ['HH:mm', 'HH:mm'],
    component: TimePicker2.RangePicker,
    validate: [{ key: 'startTime', msg: '推荐开始时间必填' }, { key: 'endTime', msg: '推荐结束时间必填' }],
    attrs: {
      format: 'HH:mm',
    },
    edit: true
  }
}
// 尾包集分详情配置
export const tailGroupConfig = {
  groupName: {
    title: '汇波组名称',
    required: true,
    edit: true
  },
  areaIds: {
    title: '库区',
    required: true,
    component: ASelect,
    attrs: {
      showSearch: true,
      formatOptions: (val, options, field, {fields}) => {
        const areaIdsSelected = fields && fields.map(f=> f.getValue('areaIds') || []) || []
        const hasSelected = [...new Set((areaIdsSelected || []).flat())].filter(f => !(val || []).includes(f))
        return options.map(o => ({
          ...o,
          disabled: hasSelected.some(h => h == o.value)
        }))
      },
      getOptions: async ({ field, fields }) => {
        const list = await getDictionaryData(field.getValues())
        return list
      },
      mode: "multiple",
    },
    edit: true
  }
}


// 拆分库区拣选池波次数量上限
let areaIdListOptions = []
export const areaWaveNumUpperLimitsColumns = {
  areaIdList: {
    title: '配置生效范围',
    component: ASelect,
    required: true,
    validate: [{
      key: 'areaIdList',
      cb: (val, data, dataList) => {
        const currentSelectList = dataList.reduce((a, b) => {
          return a.concat(b.areaIdList);
        }, [])
        if (!isEmpty(val) && Array.isArray(val)) {
          const { configEffectiveScope } = data;
          const noP = configEffectiveScope.filter(cs => !currentSelectList.some(s => String(s) == String(cs)));

          if (!isEmpty(noP)) {
            return `拣选池波次数量上限 库区 配置生效范围 有误，
            ${noP.map(n => _getName(areaIdListOptions, n))}库区 未配置 拣选池波次数量上限
            `;
          }
        }

      }
    }],
    attrs: {
      // placeholder: '不填默认为全部',
      maxTagCount: 6,
      tagInline: false,
      showSearch: true,
      mode: 'multiple',
      watchKey: 'warehouseId,configEffectiveScope',
      formatOptions: (val, options, field, {fields}) => {
        const waveTimeApplyScopeSelected = fields && fields.map(f=> f.getValue('areaIdList') || []) || []
        const hasSelected = [...new Set((waveTimeApplyScopeSelected || []).flat())].filter(f => !(val || []).includes(f))
        return options.map(o => ({
          ...o,
          disabled: hasSelected.some(h => h == o.value)
        }))
      },
      getOptions: async({field, action, actionKey}) => {
        const warehouseId = getStepBaseData().warehouseId
        const res = await getWarehouseDistrictList({warehouseId, waveCreationScopeType: '2'})
        areaIdListOptions = Array.isArray(res) && res.map(r => ({
          ...r,
          label: r.name,
          value: r.code
        }))
        return areaIdListOptions;
      }
    },
    edit: true
  },
  waveNumUpperLimit: {
    title: '拣选池波次数量上限',
    component: NumberPicker,
    required: true,
    edit: true,
    attrs: {
      min: 0,
    }
  }
}