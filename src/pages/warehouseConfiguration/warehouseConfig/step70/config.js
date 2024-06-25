import React from 'react'
import { Input, ASelect, Button, Radio, Message, NumberPicker } from '@/component'
import {getWid, transMultipleToStr} from 'assets/js'
import {
  slaEnableOptions,
  packageSource
} from '@/report/options'
import { getCountry, getCarrierType } from '@/report/apiOptions'
import { getStepBaseData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import API from 'assets/api'
import $http from 'assets/js/ajax'

const isEditable = () => getStepBaseData().readOnly
const isTMall = () => getStepBaseData().isTMall

// 查询接口
export async function getWarehouseSignConfigList(data) {
  return $http({
    url: API.getWarehouseSignConfigManageListNew,
    method: 'post',
    data: {
      pageNum: 1,
      pageSize: 20,
      ...data,
    }
  }).then(res => {
    return (res && res.data || [{}])[0]
  }).catch(e => {
    Message.error(e.message);
    return {}
  })
}

const signType = [
  {"label": "小包签收", "value": "0"},
  {"label": "大包签收", "value": "1"}];

const sendBackLevelOptions  = [
  {label: '签收', value: '1'},
  {label: '签收-入库', value: '2'},
  {label: '签收-入库-上架', value: '3'},
]
// 新增修改
// 签收通用配置
export const signModel = {
  signType: {
    label: '签收作业类型',
    component: ASelect,
    required: true,
    disabled: isEditable,
    attrs: {
      isRadio: true,
      getOptions: async() => {
          return signType
      },
      onChange: (val, vm) => {
        vm.setOpenData({
          signType: val,
        })
      }
    }
  }
}
// 大包签收配置  AE
export const packageSignModel = {
  isBigbagSignWeighing: {
    label: '是否称重校验',
    required: true,
    component: ASelect,
    show: data => data.signType == 1,
    disabled: isEditable,
    attrs: {
      isRadio: true,
      getOptions: async() => {
          return slaEnableOptions
      }
    }
  },
  bigbagSignWeightLimit: {
    label: '重量校验误差限制(g)',
    required: true,
    disabled: isEditable,
    component: NumberPicker,
    attrs: {
      precision: 2
    },
    show: data => data.signType == 1 && data.isBigbagSignWeighing == 1
  },
  sendBackLevel: {
    label: '回传小包入库&上架',
    required: true,
    component: ASelect,
    disabled: isEditable,
    show: data => data.signType == 1,
    attrs: {
      getOptions: async() => {
          return sendBackLevelOptions
      }
    }
  },

// 小包签收配置 TM
  isSmallbagSignAudit: {
    label: '包裹预报审核',
    component: ASelect,
    required: true,
    disabled: isEditable,
    show: data =>data.signType == 0,
    attrs: {
      isRadio: true,
      getOptions: async() => {
          return slaEnableOptions
      }
    }
  },
  carTitleStatus: {
    label: '是否必须录入快递车封号',
    component: ASelect,
    required: true,
    disabled: isEditable,
    show: data => data.signType == 0,
    attrs: {
      isRadio: true,
      getOptions: async() => {
          return slaEnableOptions
      }
    }
  },
  auditCountryCode: {
    label: '审核国家',
    component: ASelect,
    required: true,
    format: transMultipleToStr,
    show: data => data.signType == 0 && data.isSmallbagSignAudit == 1,
    disabled: isEditable,
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
    format: transMultipleToStr,
    disabled: isEditable,
    show: data => data.signType == 0 && data.isSmallbagSignAudit == 1,
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
    format: transMultipleToStr,
    disabled: isEditable,
    show: data => data.signType == 0 && data.isSmallbagSignAudit == 1,
    attrs: {
      mode: 'multiple',
      getOptions: async() => {
          return await getCarrierType
      }
    }
  },
}

export const rejectModel = {
    // 拒收配置 AE TM 都要
    isSmallRejectPhoto: {
      label: '是否强制拍照',
      component: ASelect,
      required: true,
      disabled: isEditable,
      attrs: {
        isRadio: true,
        getOptions: async() => {
            return slaEnableOptions
        }
      }
    },
}

