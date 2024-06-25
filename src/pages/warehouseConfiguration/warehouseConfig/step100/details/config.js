import React from 'react'
import { NumberPicker, AFormTable, TimePicker2, Message } from '@/component'
import ASelect from '@/component/ASelect'
import * as opt from './options'
import Api from 'assets/api'
import $http from 'assets/js/ajax'
import { getWid, isEmpty, transMultipleToStr, _getName, getUuid } from 'assets/js'
import { getStepBaseData, setStepBaseData, saveStepNode, InitDefaultData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import { columns, volumeColumns, tailDelConfig, tailGroupConfig, packageAttrColumns, areaWaveNumUpperLimitsColumns } from './editTableConfig'
import { isEmptyTime } from '@/report/utils'
import { getCarrierType } from '@/report/apiOptions'

 const isEditTable = () => !getStepBaseData().readOnly;


 // 获取波次类型
export function getWveTypeName(data) {
  return _getName(opt.waveTypeList, data.waveType) + '-' + _getName(opt.strategyNameList, data.strategy)
}
/**
 * @end 禁用配置结束 
 */

// 自动汇波业务类型 下拉值 
export const getServiceTypeList = getCarrierType

// 分播墙规格
export const getWallSpecs = $http({
  url: Api.getWallSpecs,
  method: 'get'
})
// 获取配置生效范围
const WarehouseDistrictList = {}
export const getWarehouseDistrictList = ({ warehouseId, waveCreationScopeType }) => {
  if (!WarehouseDistrictList['' + warehouseId + waveCreationScopeType]) {
    WarehouseDistrictList['' + warehouseId + waveCreationScopeType] = $http({
      url: Api.getWarehouseDistrictList,
      method: 'get',
      data: { warehouseId, waveCreationScopeType }
    })
  }
  return WarehouseDistrictList['' + warehouseId + waveCreationScopeType]
}



// 波次信息
export const baseModel = {
  waveType: {
    label: '波次类型',
    component: ASelect,
    required: true,
    attrs: {
      onChange: (waveType, vm) => {
        const field = vm.field
        const getOpenData = {
          6: { strategy: '1' },
          9: { waveCreationScope: '3', pickingMode: '9' }
        }
        const openData = getOpenData[waveType] || {}
        if (!isEmpty(openData)) {
          field.setValues(openData)
        }
        vm.setOpenData({
          waveType,
          offshelvesContainerStrategy: '1',
          isAutoAllocationDistribution: '1',
          ...openData
        })
      },
      getOptions: async () => {
        return opt.waveTypeList
      }
    }
  },
  strategy: {
    label: '波次生成策略',
    component: ASelect,
    required: true,
    disabled: (data) => data.waveType == 6,
    tips: opt.strategyNameList.map(o => `${o.label}: ${o.desc}`).join('\n'),
    attrs: {
      getOptions: async () => {
        return opt.strategyNameList
      }
    }
  },
  serviceType: {
    // label: '自动汇波业务类型',
    label: '业务类型',
    tips: `场景1
  配置时选择type1业务类型，则此仓库汇波时会产生两种波次：type1单独汇波；type2、type3···typeN混合汇波；
  场景2
  配置时选择type1、type2业务类型，则此仓库汇波时会产生三种波次：type1单独汇波；type2单独汇波；type3···typeN混合汇波；
  场景3
  不选择业务类型时，将不区分类型全部汇波。`,
    component: ASelect,
    // required: true,
    format: transMultipleToStr,
    attrs: {
      mode: 'multiple',
      hasSelectAll: false,
      getOptions: async () => {
        const list = await getServiceTypeList
        return list
      }
    }
  },
  waveCreationDimension: {
    label: '波次汇单维度',
    component: ASelect,
    required: true,
    attrs: {
      getOptions: async () => {
        return opt.waveHuiDanList
      }
    }
  },
  waveCreationScope: {
    label: '波次汇单范围',
    component: ASelect,
    disabled: data => {
      return data.waveType == '9' && data.waveCreationScope == '3';
    },
    attrs: {
      getOptions: async () => {
        return opt.waveHuiDanScopeList
      },
      onChange(waveCreationScope, vm) {
        vm.setOpenData({ waveCreationScope })
      }
    },
  },
  orderType: {
    label: '汇波订单类型',
    component: ASelect,
    format: transMultipleToStr,
    attrs: {
      mode: 'multiple',
      getOptions: async () => {
        return opt.orderTypeList
      }
    }
  },
  waveTaskCount: {
    label: '波次内订单数量',
    component: NumberPicker,
    required: true,
    show: data => {
       return !data.isUsingVolumeWave
    },
    attrs: {
      placeholder: '请输入数字'
    }
  },
  pickingMode: {
    label: '拣货模式',
    component: ASelect,
    required: true,
    disabled: data => {
      return data.waveType == '9' && data.pickingMode == '9';
    },
    attrs: {
      getOptions: async () => {
        return opt.pickingModeList
      },
      onChange(pickingMode, vm) {
        if (pickingMode != '7') {
          vm.setOpenData({ 
            isSplitByArea: false,
          })
        }
        if (opt.isFOrB(pickingMode)) {
          vm.setOpenData({ 
            pickingMode,
            waveTimeConfigList: waveTimeConfigDefaultValue,
          })
        } else {
          vm.setOpenData({ pickingMode })
        }
      }
    }
  },
  waveCompletionThreshold: {
    label: '波次完结阈值',
    component: NumberPicker,
    required: true,
    show: data => data.pickingMode == 12,
    attrs: {
      min: 0
    }
  },
  configEffectiveScopeType: {
    label: '配置生效范围类型',
    component: ASelect,
    required: true,
    show: data => opt.isFOrB(data.pickingMode),
    attrs: {
      getOptions: async ({ field }) => {
        return opt.waveCreationTimeConfigScopeTypeList
      },
    }
  },
  configEffectiveScope: {
    label: '配置生效范围',
    component: ASelect,
    // required: true,
    show: data => opt.isFOrB(data.pickingMode),
    attrs: {
      mode: 'multiple',
      showSearch: true,
      watchKey: 'warehouseId,configEffectiveScopeType',
      onChange(val, vm) {
        vm.setOpenData({ 
          configEffectiveScope: val,
        })
      },
      getOptions: async ({ field, action }) => {
        // 依赖变动时，清空本身值
        if (action == 1) {
          field && field.setValue('configEffectiveScope', [])
        }
        const { warehouseId, configEffectiveScopeType } = field.getValues()
        const res = await getWarehouseDistrictList({ warehouseId, waveCreationScopeType: configEffectiveScopeType })
        return Array.isArray(res) && res.map(r => ({
          ...r,
          label: r.name,
          value: r.code
        }))
      }
    }
  },
  // 闪电播切片配置
  packageNumLowerLimit: {
    label: '波次切片包裹数量范围限制',
    expandKeys: ['packageNumUpperLimit'],
    component: React.forwardRef(function app(props, ref){
      const { value, field } = props
      const packageNumUpperLimit = field.getValue('packageNumUpperLimit')
      return <span>
        <NumberPicker {...props} placeholder="下限值" style={{width: '45%'}}></NumberPicker>
        <span style={{display: 'inline-block', width: '10%', textAlign: 'center'}}>-</span>
        <NumberPicker min={0} value={packageNumUpperLimit} onChange={(val) => {
          field.setValue('packageNumUpperLimit', val)
        }} placeholder="上限值" style={{width: '45%'}}></NumberPicker>
      </span>
    }),
    validate: (val, data, setError) => {
      if (data.packageNumUpperLimit < val) {
        setError('下限值不可以大于上限值')
        return false
      }
      return true
    },
    show: data => data.pickingMode == 7,
    attrs: {
      min: 0,
    }
  },
  seizureNumLowerLimit: {
    label: '波次抢夺包裹数量下限',
    component: NumberPicker,
    show: data => data.pickingMode == 7,
    attrs: {
      min: 0,
    }
  },
}

// 尾包汇波配置
export const tailModel = [{
  offShelvesWavePackageLimit: {
    label: '下架容器包裹数量上限',
    component: NumberPicker,
    required: true,
    attrs: {
      placeholder: '请输入',
      min: 0,
      max: 99999999
    }
  },
  suggestTailWave: {
    label: '推荐下架容器号',
    component: ASelect,
    required: true,
    attrs: {
      isRadio: true,
      getOptions: async () => {
        return opt.YN2
      }
    }
  },
  limitScanTailWaveEqualsSuggest: {
    label: '校验下架容器号',
    component: ASelect,
    required: true,
    show: (data) => {
      return data.suggestTailWave;
    },
    attrs: {
      isRadio: true,
      getOptions: async () => {
        return opt.YN2
      }
    }
  },

},
{
  limitScanTailWaveEqualsSuggestEffectiveTime: {
    label: '',
    span: 8,
    show: (data) => {
      return data.suggestTailWave;
    },
    component: AFormTable,
    validate: (val) => {
      console.log(val)
      if (Array.isArray(val) && val.length > 1) {
        if (val.some((v, index) => {
          if (index > 0 && v.startEndTime[0] < val[index - 1].startEndTime[1]) {
            Message.warning('尾包汇波配置上一时间段结束时间不能大于下一时间段开始时间')
            return true
          }
        })) {
          return false
        }
      }
      return true
    },
    attrs: {
      columns: tailDelConfig,
      hasAdd: isEditTable,
      maxLength: 5
    }
  },
  tailWaveGenerateGroupConfig: {
    label: '',
    span: 12,
    component: AFormTable,
    show: (data) => {
      return data.waveCreationScope == '3'
    },
    attrs: {
      watchKey: 'warehouseId',
      columns: tailGroupConfig,
      hasAdd: isEditTable,
      maxLength: 5,
    }
  }
}]
// 体积汇波信息- 天猫业务规则配置
export const VolumeModel = {
  isUsingVolumeWave: {
    label: '体积汇波模式开关',
    component: ASelect,
    required: true,
    attrs: {
      hasClear: false,
      isRadio: true,
      onChange(isUsingVolumeWave, vm) {
        vm.setOpenData({ isUsingVolumeWave })
      },
      getOptions: async () => {
        return opt.NF
      }
    }
  },
  volumeWaveConfigList: {
    label: '', // 体积编辑
    span: 24,
    show: (data) => data.isUsingVolumeWave,
    component: AFormTable,
    validate: (val) => {
      if(Array.isArray(val) && val.some((s, index) => {
        if (s.startVolume > s.endVolume) {
          Message.warning('体积下限必须小于体积上限')
          return true
        } else if (index > 0) {
          const preData = val[index - 1]
          if (preData.endVolume > s.startVolume) {
            Message.warning(`第${index + 1}条配置体积下限值不得小于第${index}条体积上限值`)
            return true
          }
        }
        return false
      })) {
        return false
      }
      return true
    },
    attrs: {
      watchKey: 'warehouseId',
      columns: volumeColumns,
      hasAdd: isEditTable,
      maxLength: 5,
    }
  },
  packageAttrEnable: {
    label: '汇波筛选条件开关',
    component: ASelect,
    required: true,
    format: (val) => !!val,
    attrs: {
      hasClear: false,
      isRadio: true,
      onChange(packageAttrEnable, vm) {
        vm.setOpenData({ packageAttrEnable })
      },
      getOptions: async () => {
        return opt.NF
      }
    }
  },
  // 汇波筛选条件
  packageAttrConfigs: {
    label: '',
    span: 24,
    show: (data) => data.packageAttrEnable,
    component: AFormTable,
    attrs: {
      columns: packageAttrColumns,
      hasAdd: isEditTable,
      maxLength: 50,
    }
  }
}

// 

// 汇波时间信息
// 时间配置默认值
function setDefaultForceUpdate (list) {
  list.isForceUpdate = true
  return list
}
export const waveTimeConfigDefaultValue = setDefaultForceUpdate([{
  waveTimeConfigApplyScopeType: '0',
  waveTimeApplyScope: [],
  waveCreationTimeScopeItems: setDefaultForceUpdate([{
    waveCreationStartTime: '',
    waveCreationEndTime: '',
    waveCreationTime: []
  }]),
  lastwaveOpenTimeScopeItems: setDefaultForceUpdate([{
    lastwaveOpenStartTime: '',
    lastwaveOpenEndTime: '',
    lastwaveOpenTime: []
  }])
}])
// 时间配置Model
export const XJModel = {
  waveCreationPriority: {
    label: '波次汇单优先级',
    component: ASelect,
    required: true,
    attrs: {
      hasClear: false,
      isRadio: true,
      getOptions: async () => {
        return opt.waveCreationPriorityList
      }
    }
  },
  isFirstInOut: {
    label: '先进先出',
    component: ASelect,
    required: true,
    attrs: {
      hasClear: false,
      isRadio: true,
      getOptions: async () => {
        return opt.YN1
      }
    }
  },
  lazyModeStatus: {
    label: '尾波懒人模式',
    component: ASelect,
    required: true,
    attrs: {
      hasClear: false,
      isRadio: true,
      getOptions: async () => {
        return opt.YN2
      }
    }
  },
  waveTimeConfigList: {
    label: '', //时间配置表
    span: 24,
    component: AFormTable,
    attrs: {
      watchKey: 'warehouseId,pickingMode',
      columns: columns,
      hasAdd: isEditTable,
      defaultData: (index, list) => {
        return {
          waveTimeConfigApplyScopeType: Array.isArray(list) && list[0] && list[0].waveTimeConfigApplyScopeType || '0'
        }
      },
      beforeAdd: (record, index, tableData, tableFields) => {
        if (tableData[0].waveTimeConfigApplyScopeType == '0') {
          Message.warning('配置生效范围类型选择全部后只能配置一条时间配置')
          return false
        }
        // 通过改变 第一条的dataLength 更新 配置生效范围类型 的下拉选择值状态
        const field = Array.isArray(tableFields) && tableFields[0]
        if (field) {
          field.setValue('dataLength', tableData.length + 1)
        }
      },
      beforeRemove: (record, index, tableData, tableFields) => {
        // 通过改变 第一条的dataLength 更新 配置生效范围类型 的下拉选择值状态
        const field = Array.isArray(tableFields) && tableFields[0]
        if (field) {
          field.setValue('dataLength', tableData.length - 1)
        }
      },
      maxLength: 5,
      cellProps: (rowIndex, colIndex) => {
        if (rowIndex == 0 && colIndex == 0) {
          return {
            rowSpan: 5
          }
        }
      }
    }
  },
  pureSingleMultipleWaveOpenTimeScope: {
    label: '', //纯单多票波次开启时间
    fixedSpan: 24,
    component: AFormTable,
    show: data => data.pickingMode == '7',
    validate: (val, data) => {
      if (Array.isArray(val) && val.some(item => {
        // 一个时间为空， 一个时间有值 ，则报错必填， 不能为空
        return (
          isEmptyTime(item.pureSingleMultipleWaveStartTime) && !isEmptyTime(item.pureSingleMultipleWaveEndTime)
        ) || (
          !isEmptyTime(item.pureSingleMultipleWaveStartTime) && isEmptyTime(item.pureSingleMultipleWaveEndTime)
        )
      })) {
        Message.warning('纯单多票波次开始或者结束时间不能为空')
        return false
      }

      // 时间不能重复
      const timeRang = val || []
      if (timeRang.some((t,i) => i> 0 && timeRang[i -1].pureSingleMultipleWaveTime[1] > t.pureSingleMultipleWaveTime[0])) {
        Message.warning('纯单多票波次上一时间段结束时间不能大于下一时间段开始时间')
        return false
      }
      
      return true
    },
    attrs: {
      watchKey: 'warehouseId,pickingMode',
      maxLength: 3,
      columns: {
        pureSingleMultipleWaveTime: {
          title: '纯单多票波次开启时间',
          component: TimePicker2.RangePicker,
          transTimeCode: ['pureSingleMultipleWaveStartTime', 'pureSingleMultipleWaveEndTime'],
          format: ['HH:mm', 'HH:mm'],
          attrs: {
            format: 'HH:mm',
            placeholder: ['开始时间', '结束时间'],
          },
          edit: true
        },
      },
      hasAdd: isEditTable,
    }
  },
  forceWaveOpenTimeScope: {
    label: '', //强制汇波开启时间
    fixedSpan: 24,
    component: AFormTable,
    show: data => data.pickingMode == '7',
    validate: (val, data) => {
      // 判断尾波汇波时间，强制汇波时间不能与尾波汇波时间冲突
      const { waveTimeConfigList } = data;
      const lastwaveOpenTimeScopeItems = waveTimeConfigList.reduce((a, b) => {
        return a.concat(b.lastwaveOpenTimeScopeItems)
      }, [])

      if (Array.isArray(val) && val.some(v => {
        return lastwaveOpenTimeScopeItems.some(l => {
          const lastwaveOpenTime = l.lastwaveOpenTime;
          const forceWaveTime = v.forceWaveTime;
          const newArr = [...lastwaveOpenTime, ...forceWaveTime]
          newArr.sort((a, b) => +a - +b);
          return !([
            String(+newArr[0]) + String(+newArr[1]),
            String(+newArr[2]) + String(+newArr[3])
          ]).includes(String(+forceWaveTime[0]) + String(+forceWaveTime[1]));

        })
      })) {
        Message.warning('强制汇波开启时间不可与尾波汇单时间冲突')
        return false;
      }
      if (Array.isArray(val) && val.some(item => {
        // 一个时间为空， 一个时间有值 ，则报错必填， 不能为空
        return (
          isEmptyTime(item.forceWaveStartTime) && !isEmptyTime(item.forceWaveEndTime)
        ) || (
          !isEmptyTime(item.forceWaveStartTime) && isEmptyTime(item.forceWaveEndTime)
        )
      })) {
        Message.warning('强制汇波开始或结束时间不能为空')
        return false
      }

      // 时间不能重复
      const timeRang = val || []
      if (timeRang.some((t,i) => i> 0 && timeRang[i -1].forceWaveTime[1] > t.forceWaveTime[0])) {
        Message.warning('强制汇波上一时间段结束时间不能大于下一时间段开始时间')
        return false
      }

      return true
    },
    attrs: {
      watchKey: 'warehouseId,pickingMode,waveTimeConfigList',
      maxLength: 3,
      columns: {
        forceWaveTime: {
          title: '强制汇波开启时间',
          component: TimePicker2.RangePicker,
          transTimeCode: ['forceWaveStartTime', 'forceWaveEndTime'],
          format: ['HH:mm', 'HH:mm'],
          attrs: {
            format: 'HH:mm',
            placeholder: ['开始时间', '结束时间'],
          },
          edit: true
        },
      },
      hasAdd: isEditTable,
    }
  },
  waveOrderCountMinValue: {
    label: '强制汇波时间段波次订单数量最小值',
    component: NumberPicker,
    show: data => data.pickingMode == '7' && Array.isArray(data.forceWaveOpenTimeScope) && data.forceWaveOpenTimeScope.some(f => !isEmptyTime(f.forceWaveTime)),
    required: true,
    attrs: {
      min: 0
    }
  }

}
// 下架参数信息
export const HBModel = [
  {
    isBindOffshelvesContainer: {
      label: '是否绑定下架框',
      required: true,
      component: ASelect,
      attrs: {
        isRadio: true,
        getOptions: async () => {
          return opt.YN
        }
      }
    },
    offshelvesContainerStrategy: {
      label: '下架框分配策略',
      component: ASelect,
      disabled: true,
      attrs: {
        getOptions: async () => {
          return opt.strategyNameList.filter(s => ['1', '2'].includes(s.value))
        }
      }
    },
    offshelvesWarningTime: {
      label: '下架预警时间（分钟）',
      component: NumberPicker,
      required: true,
    }
  },
  {
    isSplitByArea: {
      label: '是否拆分拣选池波次数量上限',
      component: ASelect,
      required: true,
      show: (data) => data.pickingMode == '7',
      attrs: {
        isRadio: true,
        getOptions: async() => opt.YN2
      }
    },
    wavenumUpperLimit: {
      label: '拣选池波次数量上限',
      component: NumberPicker,
      show: (data) =>  data.isSplitByArea != true,
      required: true,
    },
    areaWaveNumUpperLimits: {
      label: '拆分库区拣选池波次数量上限',
      component: AFormTable,
      span: 12,
      required: true,
      show: (data) => data.isSplitByArea,
      attrs: {
        columns: areaWaveNumUpperLimitsColumns,
        hasAdd: isEditTable,
        maxLength: 50,
        watchKey: 'warehouseId,configEffectiveScope',
      }
    }
  }
]
// 分拨参数信息
export const FBModel = {
  isUseDistribution: {
    label: '是否需要播种',
    component: ASelect,
    required: true,
    attrs: {
      isRadio: true,
      getOptions: async () => {
        return opt.YN
      }
    }
  },
  isAutoAllocationDistribution: {
    label: '自动分配分拨墙',
    component: ASelect,
    disabled: true,
    attrs: {
      getOptions: async () => {
        return opt.strategyNameList.filter(s => ['1', '2'].includes(s.value))
      }
    }
  },
  isValidDistribution: {
    label: '校验分拨墙格口',
    component: ASelect,
    required: true,
    attrs: {
      getOptions: async () => {
        return opt.YN
      }
    }
  },
  distributionWarningTime: {
    label: '分拨预警时间',
    component: NumberPicker,
    required: true,
  },
  sortingWallSpecs: {
    label: '播种墙规格',
    component: ASelect,
    required: true,
    show: data => {
      return ['3'].includes(data.pickingMode)
    },
    attrs: {
      getOptions: async () => {
        const res = await getWallSpecs
        return Array.isArray(res) && res.map(r => ({
          ...r,
          label: r.description,
          value: r.code
        }))
      }
    }
  }
}


// 表单group 配置
export const groupConfig = {
  base: {title: '波次信息', model: baseModel},
  config1: {title: '尾包汇波配置', model: tailModel, show: (data) => {
    return data.pickingMode == 9
  }},
  config2: {title: '天猫业务规则配置', model: VolumeModel},
  config3: {title: '汇波时间配置', model: XJModel},
  config4: {title: '下架参数配置', model: HBModel},
  config6: {title: '分拨参数配置', model: FBModel},
}


// 默认配置
  // 初始化默认值
export function getDefaultData(baseData) {
  let defaultData = {uuid: getUuid()}
  InitDefaultData([baseModel, tailModel, VolumeModel, XJModel, HBModel, FBModel], defaultData)
  Object.assign(defaultData, {
    warehouseId: baseData.warehouseId,
    warehouseShortname: baseData.warehouseName,
    isAutoAllocationDistribution: '1',
    offshelvesContainerStrategy: '1',
    isUsingVolumeWave: false,
    waveCreationPriority: '0',
    isFirstInOut: '0',
    lazyModeStatus: false,
    waveCreationDimension: '1',
    waveCreationScope: '2',
    missionSplitScope: '2',
    waveTimeConfigList: waveTimeConfigDefaultValue,
    isUseDistribution: '2',
    isBindOffshelvesContainer: '2',
    packageAttrEnable: false,
    isSplitByArea: false,

  })
  return defaultData
}

// 保存数据
export function getSaveConfig(data) {
  return $http({
    url: Api.saveSysWarehouseTaskAllocationConfig,
    method: 'post',
    data
  })
}