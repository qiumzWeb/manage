import React from 'react'
import { Input, ASelect, Button, Radio, DatePicker2 } from '@/component'
import {getWid, transMultipleToStr} from 'assets/js'
import API from 'assets/api'
import $http from 'assets/js/ajax'
import { getStepBaseData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
const isEditable = () => getStepBaseData().readOnly
const isTMall = () => getStepBaseData().isTMall

// 查询接口
export async function getWarehousePutawayRecommendationList(data) {
  return $http({
    url: API.getWarehousePutawayRecommendationList,
    method: 'get',
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
// 是否配置
export const isTrueOrNotOption = [
  { label: '是', value: 1 },
  { label: '否', value: 0 }
]

export const recommendationDimensionOptions = [
  {label: '仓库', value: '400'},
  {label: '库区组', value: '350'},
  {label: '库区', value: '300'},
  {label: '巷道', value: '200'},
  {label: '库位', value: '100'},
];

export const storageRecommendUpLimitOptions  = [
  {label: '包裹数量', value: '1'},
  {label: '首单数量', value: '2'},
  {label: '库容体积', value: '3'},
]

// 首单推荐配置
export const findFirstPackageRuleOptions = [
  {label: '会员号/意向码', value: '0', disabled: true},
  {label: '大小件（大包、小包）', value: '1'},
  {label: '业务类型', value: '2'},
  {label: '特殊包裹（淘宝、淘宝外单、纯外单）', value: '3'},
]


// 默认推荐
export const defaultRecommendInfo = {
  recommendationDimensionId: {
    label: '入库推荐维度',
    component: ASelect,
    disabled: isEditable,
    required: true,
    attrs: {
      // isRadio: true,
      getOptions: async() => {
          return recommendationDimensionOptions
      },
    }
  },
  storageRecommendUpLimit: {
    label: '入库推荐上限校验',
    component: ASelect,
    required: true,
    disabled: isEditable,
    attrs: {
      getOptions: async() => {
          return storageRecommendUpLimitOptions
      },
    }
  },
  storageRecommendUpWarning: {
    label: '入库推荐上限预警',
    component: ASelect,
    required: true,
    disabled: isEditable,
    format: transMultipleToStr,
    attrs: {
      mode: 'multiple',
      getOptions: async() => {
          return storageRecommendUpLimitOptions
      },
    }
  },
  storageCheckingEndOfForm: {
    label: '入库校验尾单',
    component: ASelect,
    required: true,
    disabled: isEditable,
    attrs: {
      isRadio: true,
      getOptions: async() => {
          return isTrueOrNotOption
      },
    }
  },
  isStorageRecommendTransit: {
    label: '入库推荐考虑在途',
    component: ASelect,
    required: true,
    disabled: isEditable,
    attrs: {
      isRadio: true,
      getOptions: async() => {
          return isTrueOrNotOption
      },
    }
  },


}
// 上架推荐配置
export const onShelvesRecommendInfo = {
  verificationDimensionId: {
    label: '上架校验维度',
    component: ASelect,
    required: true,
    disabled: isEditable,
    attrs: {
      // isRadio: true,
      getOptions: async() => {
          return recommendationDimensionOptions
      },
    }
  },
  findFirstPackageRule: {
    label: '首单推荐逻辑',
    component: ASelect,
    required: true,
    disabled: isEditable,
    format: transMultipleToStr,
    fixedSpan: 24,
    attrs: {
      mode: 'multiple',
      getOptions: async() => {
          return findFirstPackageRuleOptions
      },
    }
  },
  putAwayContainer: {
    label: '是否启用上架容器',
    component: ASelect,
    required: true,
    disabled: isEditable,
    attrs: {
      isRadio: true,
      getOptions: async() => {
          return isTrueOrNotOption
      },
    }
  },
  distinguishPutawayTransfer: {
    label: '区分上架和移库',
    component: ASelect,
    required: true,
    disabled: isEditable,
    attrs: {
      isRadio: true,
      getOptions: async() => {
          return isTrueOrNotOption
      },
    }
  },
  putawayCheckingEndOfForm: {
    label: '上架校验尾单',
    component: ASelect,
    required: true,
    disabled: isEditable,
    attrs: {
      isRadio: true,
      getOptions: async() => {
          return isTrueOrNotOption
      },
    }
  },
  isOnShelvesIntercept: {
    label: '允许已下架包裹再上架',
    component: ASelect,
    required: true,
    disabled: isEditable,
    attrs: {
      isRadio: true,
      getOptions: async() => {
          return isTrueOrNotOption
      },
    }
  },
  storageLocationFullLoad: {
    label: '上架库位满载校验',
    component: ASelect,
    required: true,
    disabled: isEditable,
    attrs: {
      isRadio: true,
      getOptions: async() => {
          return isTrueOrNotOption
      },
    }
  },

}

