import React from 'react'
import { Input, Select, Button, Radio, DatePicker2 } from '@/component'
import ASelect from '@/component/ASelect'
import { getJobNode, getJobTeamGroup, getBigJobTeamGroup } from '../api'
import {getWid} from 'assets/js'
import { defaultSearchDate } from '@/report/utils'
const formItem = {
  labelCol: null,
  wrapperCol: null
}
export const qSearch = [
  {
    timeType: {
      label: '展示维度-时间',
      // span: 5,
      defaultValue: 1,
      component: Radio.Group,
      formItem,
      attrs: {
        dataSource: [
          {label: '天', value: 1},
          {label: '时间', value: 2}
        ],
        onChange: (val, ql) => {
          if (ql.searchParams) {
            ql.refresh()
          } else {
            ql.setState({
              tableData: []
            })
          }
        }
      }
    },
    jobType: {
      label: '展示维度',
      span: 12,
      defaultValue: 1,
      component: Radio.Group,
      formItem,
      attrs: {
        dataSource: [
          {label: '作业环节', value: 1},
          {label: '作业分组', value: 2}
        ],
        onChange: (val, vm) => {
          if (vm.searchParams) {
            vm.refresh()
          } else {
            vm.setState({
              tableData: []
            })
          }
        }
      }
    }
  },
  {
    warehouseId: {
      label: '仓库名称',
      // span: 5,
      component: ASelect,
      defaultValue: getWid(),
      formItem
    },
    planDate: {
      label: '日期区间',
      // span: 5,
      fixedSpan: 24,
      component: DatePicker2.RangePicker,
      defaultValue: defaultSearchDate,
      formItem,
    },
    timeScope: {
      label: '时间',
      // span: 5,
      formItem,
      show: (data) => {
        return data.timeType === 2
      },
      component: Input,
      attrs: {
        placeholder: "如： 1-5 或  2-3,5-7,9-12"
      }
    },
    jobNodeCodeList: {
      label: '作业环节',
      // span: 5,
      component: ASelect,
      formItem,
      attrs: {
        mode: 'multiple',
        getOptions: async () => {
          try {
            const options = await getJobNode()
            return (options || []).map(o => ({
              ...o,
              label: o.jobNode,
              value: o.jobNodeCode
            }))
          } catch (e) {
            return []
          }
        }
      }
    },
    jobLargeTeamGroupIdList: {
      label: '作业大组',
      // span: 5,
      formItem,
      component: ASelect,
      show: (data) => {
        return data.jobType === 2
      },
      attrs: {
        showSearch: true,
        mode: 'multiple',
        watchKey: 'warehouseId',
        getOptions: async (props) => {
          const warehouseId = props.field.getValue('warehouseId')
          if (!warehouseId) return []
          try {
            const options = await getBigJobTeamGroup({
              warehouseId
            })
            return options || []
          } catch (e) {
            return []
          }
        }
      }
    },
    jobTeamGroupIdList: {
      label: '作业小组',
      // span: 5,
      component: ASelect,
      formItem,
      show: (data) => {
        return data.jobType === 2
      },
      attrs: {
        showSearch: true,
        mode: 'multiple',
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
]

export const tColumns = {
  warehouseName: {
    title: '集运仓',
    width: 200,
    lock: 'left',
  },
  jobDate: {
    title: '日期',
    width: 150,
  },
  jobTime: {
    title: '时间'
  },
  jobNode: {
    title: '作业环节',
    width: 150,
  },
  // 作业 小组
  jobLargeTeamGroup: {
    title: '作业大组',
    width: 150,
    show: isZuoYeFZ
  },
  jobTeamGroup: {
    title: <span>作业小组</span>,
    width: 120,
    show: isZuoYeFZ,
  },
  manageEmployeeName: {
    title: '主管',
    width: 120,
    show: isZuoYeFZ,
  },
  // 作业环节
  planCount: {
    title: <span>计划作业单量</span>,
    width: 120
  },
  packageNum: {
    title: <span>实际作业单量</span>,
    width: 120,
  },
  supportCount: {
    title: '支援作业单量',
    width: 120,
    show: isDateTime
  },
  jobReachRate: {
    title: '作业达成率',
    width: 120,
  },
  planEmployeeCount: {
    title: <span>计划用工人数</span>,
    width: 120,
  },
  formalEmployeeCount: {
    title: <span>实际正式工人数</span>,
    width: 120,
  },
  briefEmployeeCount: {
    title: '实际临时工人数',
    width: 120,
  },
  employeeCount: {
    title: '实际用工人数',
    width: 150,
  },
  planWorkingHours: {
    title: '计划总工时',
    width: 150,
  },
  formalWorkingHours: {
    title: '实际正式工总工时',
    width: 150,
  },
  briefWorkingHours: {
    title: '实际临时工总工时',
    width: 150,
  },
  workingHours: {
    title: '实际总工时',
    width: 150,
  },
  supportHour: {
    title: '支援工时',
    width: 120,
    show: isDateTime
  },
  effectValue: {
    title: '目标人效',
    width: 150,
  },
  actualEffectValue: {
    title: '实际人效',
    width: 150,
  },
  effectReachRate: {
    title: '人效达成率',
    width: 150,
  },
}

function isZuoYeHj (that) {
  return that.field && that.field.getValue('jobType') === 1
}

function isZuoYeFZ (that) {
  return !isZuoYeHj(that)
}

function isDateTime (that) {
  return that.field && that.field.getValue('timeType') === 1
}

function isHourTime (that) {
  return !isDateTime(that)
}