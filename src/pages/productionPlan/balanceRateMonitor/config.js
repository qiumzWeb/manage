
import React from 'react';
import { DatePicker2, ASelect, Message  } from '@/component';
import { isEmpty, getWid } from 'assets/js';
import $http from 'assets/js/ajax';
import dayjs from 'dayjs';


export const searchModel = {
  warehouseId: {
    label: '仓库名称',
    component: ASelect,
    defaultValue: getWid(),
    attrs: {
      hasClear: false
    }
  },
  // 小时
  dateStart: {
    label: '日期',
    defaultValue: dayjs(),
    component: DatePicker2,
    useDetailValue: true,
    format: (val) => {
      if (dayjs(val).isValid()) {
        return {
          dateStart: dayjs(val).format("YYYY-MM-DD 00:00:00"),
          dateEnd: dayjs(val).format("YYYY-MM-DD 23:59:59")
        }
      } else {
        return {
          dateStart: "",
          dateEnd: ''
        }
      }
    },
    attrs: {
      hasClear: false,
      format: 'YYYY-MM-DD',
    }
  },
  searchBtn: {
    label: '  ',
    fixedSpan: 4,
    // 不参与查询
    onlyShow: true,
    // 自定义查询不显示
    outsider: true
  }
}

// 筛选条件
export const typeOptions = [
  {label: '入库-上架', value: 'instockAndOnShelveValue', active: true},
  {label: '下架-播种', value: 'offShelveAndSortingValue', active: true},
  {label: '合箱-组包', value: 'mergeAndAssemblingValue', active: true},
]

// 获取数据
export async function getSearchData(data) {
  return $http({
    url: '/pcs/production/plan/dashboard/balanceMonitor',
    method: 'post',
    data
  }).catch(e => {
    Message.error(e.message)
    return []
  })
}