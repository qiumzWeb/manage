import React from 'react';
import { ASelect, Input, NumberPicker, DatePicker2, Message } from '@/component';
import {getWid, isEmpty, getWName} from 'assets/js';
import { defaultSearchTime } from '@/report/utils';
import { qSearch as SummarySearchModel, statusTypeOptions } from '../summary/config'
import { getJobTeamGroup } from '@/pages/productionPlan/api';
import { jobModuleOptions } from '@/pcs/distributionGroup/config';
// 查询接口
export const searchApiUrl = '/sys/shiftManage/detailList'

export const qSearch = {
    ...SummarySearchModel,
    searchTime: {
      label: '日志发起时间',
      fixedSpan: 20,
      defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      useDetailValue: true,
      transTimeCode: ['startTime', 'endTime'],
      format: ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
      attrs: {
        hasClear: false,
        format: 'YYYY-MM-DD',
      }
    },
    sendJobTeamGroupId: {
      label: '发起小组',
      component: ASelect,
      attrs: {
        showSearch: true,
        watchKey: 'warehouseId',
        getOptions: async (props) => {
          const warehouseId = props.field.getValue('warehouseId')
          if (!warehouseId) return []
          try {
            const options = await getJobTeamGroup({
              warehouseId
            })
            return (options || []).map(o => ({
              ...o,
              label: o.jobTeamGroup,
              value: o.jobTeamGroupId
            }))
          } catch (e) {
            return []
          }
        }
      }
    },
    receiveJobTeamGroupId: {
      label: '接收小组',
      component: ASelect,
      attrs: {
        showSearch: true,
        watchKey: 'warehouseId',
        getOptions: async (props) => {
          const warehouseId = props.field.getValue('warehouseId')
          if (!warehouseId) return []
          try {
            const options = await getJobTeamGroup({
              warehouseId
            })
            return (options || []).map(o => ({
              ...o,
              label: o.jobTeamGroup,
              value: o.jobTeamGroupId
            }))
          } catch (e) {
            return []
          }
        }
      }
    },
}

// 列表
export const tColumns = {
  warehouseId: {
    title: '仓库名称',
    cell: val => getWName(val) || '-'
  },
  shiftLogNumber: {
    title: '日志编号'
  },
  jobSendTime: {
    title: '日志发起时间',
  },
  jobModule: {
    title: '模块',
    cell: val => <ASelect value={val} isDetail getOptions={async() => jobModuleOptions} defaultValue="-"></ASelect>
  },
  jobTeamGroupFrom: {
    title: '发起小组',
  },
  manageEmployeeNameFrom: {
    title: '发起小组主管',
  },
  jobTeamGroupTo: {
    title: '接收小组'
  },
  manageEmployeeNameTo: {
    title: '接收小组主管',
  },
  jobContext: {
    title: '交接内容',
  },
}
