import React from 'react';
import Page from '@/atemplate/queryTable';
import { ASelect, Input, Message, Dialog, DatePicker2 } from '@/component';
import { getWid, getStringCodeToArray } from 'assets/js';
import $http from 'assets/js/ajax';
import { getDistrictOptions } from '@/report/apiOptions'
import { defaultSearchTime } from '@/report/utils'
import { slaEnableOptions, timeEfficiencyTypeOptions } from '@/report/options'

// 查询接口
export const searchApiUrl = '/splitOrder/list'

// 确认拆单
export const confirmSplitApiUrl = '/splitOrder/doAction'
export function getConfirmSplitOrder(data) {
  return $http({
    url: confirmSplitApiUrl,
    method: 'post',
    data
  })
}

// 包裹明细
export const packageDetailApiUrl = "/splitOrder/get"


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
    searchTime: {
      label: '预计出库时间',
      fixedSpan: 24,
      needExpandToData: true,
      defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      transTimeCode: ['cutOffTimeStart', 'cutOffTimeEnd'],
      format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
        hasClear: false,
      }
    },
    timeEfficiencyTypes: {
      label: '时效类型',
      component: ASelect,
      attrs: {
        mode: 'multiple',
        getOptions: async() => timeEfficiencyTypeOptions
      }
    },
    areaIds: {
      label: '库区',
      component: ASelect,
      attrs: {
        showSearch: true,
        mode: 'multiple',
        watchKey: 'warehouseId',
        getOptions: getDistrictOptions,
      }
    },
    splitOrder: {
      label: '是否拆单',
      component: ASelect,
      attrs: {
        getOptions: async() => slaEnableOptions
      }
    },
    orderCodes: {
      label: '物流单号',
      fixedSpan: 24,
      component: Input,
      format: (val) => {
        return getStringCodeToArray(val)
      },
      attrs: {
        placeholder: '批量查询以空格分隔'
      }
    }
  }
]

// 列表
export const tColumns = {
  warehouseId: {
    title: '仓库名称',
    cell: val => <ASelect value={val} isDetail></ASelect>
  },
  orderLpCode: {
    title: '物流单号',
  },
  trackingNumber: {
    title: '国际运单号',
  },
  destCountry: {
    title: '目的国',
  },
  packageNum: {
    title: '包裹总数',
  },
  instockNum: {
    title: '入库数',
  },
  onShelveNum: {
    title: '上架数'
  },
  firstPackageInstockDuration: {
    title: '首单在库时长（h）',
    cell: val => isNaN(val) ? '-' : (val / 60 / 60)
  },
  cutOffTime: {
    title: '预计出库时间'
  },
  firstPackageAreaCode: {
    title: '首单所在库区'
  },
  splitOrder: {
    title: '是否已拆单',
    cell: (val) => <ASelect isDetail value={val} getOptions={async() => slaEnableOptions}></ASelect>
  },
  operator: {
    title: '拆单人'
  }, 
  splitTime: {
    title: '拆单时间'
  }
}

// 详情
// 明细column
export const detailColumn = {
  orderLpCode: {
    title: '物流单号',
  },
  trackingNumber: {
    title: '国际运单号',
  },
  destCountry: {
    title: '目的国',
  },
  packageCode: {
    title: '一段单号',
  },
  packageStatus: {
    title: '一段包裹状态',
  },
  instockTime: {
    title: '入库时间'
  },
  onShelveTime: {
    title: '上架时间'
  },
}
export const detailModel = {
  orderLpCode: {
    label: '',
    span: 24,
    component: React.forwardRef(function(props, ref) {
      const { value, field } = props
      const warehouseId = field.getValue('warehouseId')
      console.log(warehouseId, props, '99999999')
      return <Page
      // 自定义查询 自定表头 code
      ref={ref}
      code="hand_split_order_detail_search"
    // 查询配置
      searchOptions={{
        url: packageDetailApiUrl + `?orderLpCode=${value}&warehouseId=${warehouseId}`,
        method: 'post',
        beforeSearch: () => {}
      }}
      // 表格配置
      tableOptions={{
        model: detailColumn,
        formatData: (res, params, formatData, action) => {
          return formatData(res)
        },
        tableProps: {}
      }}
      // 其它配置
      queryListOptions={{
        initSearch: true,
        toolSearch: false,
        pagination: false
        // defaultParams: {
        //   orderLpCode: value,
        //   warehouseId
        // }
      }}
    ></Page>
    })
  }
}
