import React from 'react'
import { Input, Select, Button, Radio, DatePicker2 } from '@/component'
import moment from 'moment'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import {
  slaEnableOptions,
  packageSource
} from '@/report/options'
import { getCountry, getCarrierType } from '@/report/apiOptions'
import API from 'assets/api'


// 查询接口
export const searchUrl = API.getWarehouseSignConfigManageListNew

const signType = [
  {"label": "小包签收", "value": "0"},
  {"label": "大包签收", "value": "1"}];

const sendBackLevelOptions  = [
  {label: '签收', value: '1'},
  {label: '签收-入库', value: '2'},
  {label: '签收-入库-上架', value: '3'},
]

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
    signType: {
        label: '签收作业类型',
        component: ASelect,
        attrs: {
            getOptions: async() => {
                return signType
            }
        }
    }
  }
]

// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
    lock: 'left'
  },
  signType: {
    title: '签收作业类型',
    cell: (val) => <ASelect isDetail value={val} getOptions={async() => signType}></ASelect>
  },
  isBigbagSignWeighing: {
    title: '大包签收-是否称重校验',
    width: 200,
    cell: (val) => <ASelect isDetail value={val} getOptions={async() => slaEnableOptions}></ASelect>
  },
  bigbagSignWeightLimit: {
    title: '大包签收-重量校验误差限制',
    width: 220
  },
  isSmallbagSignAudit: {
    title:'小包签收-包裹预报审核',
    width: 200,
    cell: (val) => <ASelect isDetail value={val} getOptions={async() => slaEnableOptions}></ASelect>
  },
  carTitleStatus: {
    title: '小包签收-是否必须录入快递车封号',
    width: 250,
    cell: (val) => <ASelect isDetail value={val} getOptions={async() => slaEnableOptions}></ASelect>
  },
  isCheckUpdateWarehouse: {
    title: '小包签收-是否校验更新仓库',
    width: 250,
    cell: (val) => <ASelect isDetail defaultValue="-" value={val} getOptions={async() => slaEnableOptions}></ASelect>
  },
  isSmallRejectPhoto: {
    title: '小包拒收-是否强制拍照',
    width: 200,
    cell: (val) => <ASelect isDetail value={val} getOptions={async() => slaEnableOptions}></ASelect>
  },

  make: {
    title: '操作',
    width: 100,
    lock: 'right'
  }
}


// 新增修改
// 签收通用配置
export const signModel = {
  warehouseId: {
    label: '仓库名称',
    defaultValue: getWid(),
    required: true,
    component: ASelect,
    disabled: data => !data.isAdd,
    attrs: {
      hasClear: false
    }
  },
  signType: {
    label: '签收作业类型',
    component: ASelect,
    required: true,
    attrs: {
      getOptions: async() => {
          return signType
      }
    }
  }
}
// 大包签收配置
export const bigSignModel = {
  isBigbagSignWeighing: {
    label: '是否称重校验',
    required: true,
    component: ASelect,
    attrs: {
      getOptions: async() => {
          return slaEnableOptions
      }
    }
  },
  bigbagSignWeightLimit: {
    label: '重量校验误差限制',
    required: true,
    show: data => data.isBigbagSignWeighing == 1
  },
  sendBackLevel: {
    label: '回传小包入库&上架',
    required: true,
    component: ASelect,
    attrs: {
      getOptions: async() => {
          return sendBackLevelOptions
      }
    }
  }
}

// 小包签收配置
export const smallSignModel = {
  isSmallbagSignAudit: {
    label: '包裹预报审核',
    component: ASelect,
    required: true,
    attrs: {
      getOptions: async() => {
          return slaEnableOptions
      }
    }
  },
  carTitleStatus: {
    label: '是否必须录入快递车封号',
    component: ASelect,
    required: true,
    attrs: {
      getOptions: async() => {
          return slaEnableOptions
      }
    }
  },
  auditCountryCode: {
    label: '审核国家',
    component: ASelect,
    required: true,
    show: data => data.isSmallbagSignAudit == 1,
    attrs: {
      mode: 'multiple',
      getOptions: async() => {
          return await getCountry
      }
    }
  },
  auditPackageType: {
    label: '包裹类型',
    component: ASelect,
    required: true,
    show: data => data.isSmallbagSignAudit == 1,
    attrs: {
      mode: 'multiple',
      getOptions: async() => {
          return packageSource
      }
    }
  },
  auditCarrierType: {
    label: '业务类型',
    component: ASelect,
    required: true,
    show: data => data.isSmallbagSignAudit == 1,
    attrs: {
      mode: 'multiple',
      getOptions: async() => {
          return await getCarrierType
      }
    }
  },
  isCheckUpdateWarehouse: {
    label: '是否校验更新仓库',
    component: ASelect,
    required: true,
    defaultValue: '0',
    attrs: {
      getOptions: async() => slaEnableOptions
    }
  }
}
// 小包拒收配置
export const smallRejectModel = {
  isSmallRejectPhoto: {
    label: '是否强制拍照',
    component: ASelect,
    required: true,
    attrs: {
      getOptions: async() => {
          return slaEnableOptions
      }
    }
  },
}

