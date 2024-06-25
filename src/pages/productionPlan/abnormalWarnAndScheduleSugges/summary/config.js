import React from 'react';
import { ASelect, Input, DatePicker2, Message } from '@/component';
import {getWid, isEmpty} from 'assets/js';
import $http from 'assets/js/ajax';
import { defaultSearchTime } from '@/report/utils';
import { prodPlanAbnormalWarnType } from '@/report/options';
// 查询接口
export const searchApiUrl = '/broadcastAndProposal/form'

// 无效预警配置
export const validConfig = [
  {label: '有效预警', key: 'effectiveWarningNum'},
  {label: '无效预警',  key: 'ineffectiveWarningNum'},
  {label: '其它', key: 'otherWarningNum'}
]
/**
 * 获取图表数据
 */
export async function getChartData(data) {
  const request = (url) => $http({ url, method: 'post',data: {
    jobDateStart: data.jobDateStart,
    jobDateEnd: data.jobDateEnd,
    warehouseId: data.warehouseId
  }}).then(res => res || {}).catch(e => ({}))
  const [r1, r2] = await Promise.all([
    request('/broadcastAndProposal/pieChart/contentType'),
    request('/broadcastAndProposal/pieChart/warningEffective')
  ])
  return {
    ...r1,
    ...r2,
    other: Array.isArray(r1.contextTypeDetailList) && r1.contextTypeDetailList.map(r => ({label: r.contentType, value: r.noticeNum})) || [],
    valid: validConfig.map(v => ({
      ...v,
      value: r2[v.key] || 0
    }))
  }
}

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
    jobDateStart: {
      label: '预警日期',
      fixedSpan: 20,
      defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      useDetailValue: true,
      transTimeCode: ['jobDateStart', 'jobDateEnd'],
      format: ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
      attrs: {
        hasClear: false,
        format: 'YYYY-MM-DD',
      }
    },
    contentTypeList: {
      label: '预警指标',
      component: ASelect,
      attrs: {
        mode: 'multiple',
        hasClear: false,
        getOptions: async() => prodPlanAbnormalWarnType
      }
    },
  }
]

// 列表
export const tColumns = {
  jobDate: {
    title: '预警日期',
  },
  contentType: {
    title: '预警指标',
    cell: val => <ASelect value={val} isDetail getOptions={async() => prodPlanAbnormalWarnType} defaultValue="-"></ASelect>
  },

  totalWarningNum: {
    title: '全部预警数量'
  },
  effectiveWarningNum: {
    title: '有效预警数量',
  },
  ineffectiveWarningNum: {
    title: '无效预警数量',
  },
  otherWarningNum: {
    title: '其它'
  }
}
