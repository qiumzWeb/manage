import React from 'react'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import {
  kpiTypeOption,
  kpiTimeTypeOption,
  kpiEndOperationOptions,
  kpiAchieveDateOptions,
  slaEnableOptions
} from '@/report/options'
import {
  packageTypeOptions
} from '@/report/apiOptions'

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
    kpiType: {
      label: 'KPI类型',
      component: ASelect,
      attrs: {
        getOptions: async() => {
          return kpiTypeOption
        }
      }
    },
    speedType: {
      label: '包裹类型',
      component: ASelect,
      attrs: {
        getOptions: async() => {
          return  await packageTypeOptions
        }
      }
    },
  }
]
// 列表
export const tColumns = {
  warehouseShortname: {
    title: '仓库名称',
    lock: 'left'
  },
  kpiName: {
    title: 'KPI方案名称',
  },
  kpiType: {
    title: 'KPI类型',
    cell: (val) => {
      return <ASelect isDetail getOptions={async() => kpiTypeOption} value={val}></ASelect>
    }
  },
  kpiStartOperation: {
    title: 'KPI起算时间类型',
    cell: (val) => {
      return <ASelect
        isDetail
        getOptions={async() => kpiTimeTypeOption}
        defaultValue='包裹批次达到时间'
        value={val}
      ></ASelect>
    }
  },
  kpiStartCalculationTime: {
    title: 'KPI起算开始时间T-1',
    width: 180
  },
  kpiEndCalculationTime: {
    title: 'KPI起算结束时间T日',
    width: 180
  },
  kpiEndOperation: {
    title: 'KPI止算时间类型',
    cell: (val) => {
      return <ASelect
        isDetail
        getOptions={async() => kpiEndOperationOptions}
        defaultValue='订单出库时间'
        value={val}
      ></ASelect>
    }
  },
  kpiAchieveDate: {
    title: 'KPI达成时间',
    cell: (val, index, record) => {
      const getLabel = (label) => {
        if (record.kpiRuleCondition != "=") {
          label += record.kpiRuleCondition.replace("&lt;","<").replace("&gt;",">")
        }
        return label + record.kpiRuleValue
      }
      const options = kpiAchieveDateOptions.map(o => ({
        ...o,
        label: getLabel(o.label)
      }))
      return <ASelect
        isDetail
        getOptions={async() => options}
        value={record.kpiRuleField}
      ></ASelect>
    }
  },
  kpiStartEffectiveDate: {
    title: 'KPI生效开始时间'
  },
  kpiEndEffectiveDate: {
    title: 'KPI生效结束时间'
  },
  isDefault: {
    title: '默认KPI方案'
  },
  speedType: {
    title: '包裹/订单类型',
    cell: (val) => <ASelect isDetail getOptions={async() => await packageTypeOptions} value={val} defaultValue="无"></ASelect> 
  },
  slaEnable: {
    title: '是否SLA考核',
    cell: (val) => <ASelect isDetail getOptions={async() => slaEnableOptions} value={val} defaultValue="_"></ASelect> 
  },
  isEnable: {
    title: '状态',
    cell: (val) => val == 1 ? '启用' : '禁用' 
  },
  make: {
    title: '操作',
    lock: 'right'
  },
}

