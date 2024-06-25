
import React from 'react';
import { DatePicker2 } from '@/component';
import ASelect from '@/component/ASelect';
import {getWid} from 'assets/js';
import { getDateToRangTime } from '@/report/utils';
import dayjs from 'dayjs';
import $http from 'assets/js/ajax';
// 查询接口
export const searchApiUrl = '/pcsweb/return/package/list';

// 清单类型
export const getListType = [
  {label: '拒收', value: '1'},
  {label: '退件', value: '2'}
]

// 快递公司
export const getLogisticsCompany = $http({
  url: '/pcsweb/return/package/receive/logistic',
  oldApi: true
}).then(res => {
  return Array.isArray(res) && res.map(r => ({
    ...r,
    label: r.name,
    value: r.shortCode
  })) || []
}).catch(e => [])



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
    orderCode: {
      label: '包裹运单号',
    },
    statisticalTime: {
      label: '统计时间',
      fixedSpan: 22,
      needExpandToData: true,
      defaultValue: getDateToRangTime(dayjs()),
      component: DatePicker2.RangePicker,
      transTimeCode: ['startTime', 'endTime'],
      format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
        hasClear: false
      }
    },
    type: {
      label: '清单类型',
      component: ASelect,
      attrs: {
        getOptions: async() => getListType
      }
    },
    logisticCode: {
      label: '快递公司',
      component: ASelect,
      attrs: {
        showSearch: true,
        getOptions: async() => await getLogisticsCompany
      }
    }
  }
]

// 列表
export const tColumns = {
  deliveryCode: {
    title: '正向运单号',
  },
  dispatchCode: {
    title: '逆向运单号',
  },
  logisticCode: {
    title: '快递公司',
    cell: (val) => <ASelect isDetail value={val} defaultValue={val || '-'} getOptions={async() => await getLogisticsCompany}></ASelect> 
  },
  typeName: {
    title: '清单类型',
  },
  packageTypeLabel: {
    title: '包裹标识',
  },
  weight: {
    title: '重量',
  },
  volume: {
    title: '尺寸',
    width: 150
  },
  receiverName: {
    title: '收件人',
  },
  productName: {
    title: '品名',
  },
  operateUser: {
    title: '操作人',
  },
  operateTime: {
    title: '操作时间',
  },
  handover: {
    title: '快递交接人',
  },
}

