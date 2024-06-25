import React from 'react'
import { Input, Select, Button, Radio, DatePicker2, NumberPicker } from '@/component'
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
    dataType: {
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
      label: '展示维度-工序',
      // span: 5,
      defaultValue: 1,
      formItem,
      component: Radio.Group,
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
    },
  },
  {
    warehouseId: {
      label: '仓库名称',
      // span: 5,
      component: ASelect,
      defaultValue: getWid(),
      formItem,
      attrs: {
        // mode: 'multiple'
      }
    },
    planDate: {
      label: '日期区间',
      formItem,
      fixedSpan: 24,
      component: DatePicker2.RangePicker,
      defaultValue: defaultSearchDate
    },
    planTimeList: {
      label: '时间',
      // span: 5,
      formItem,
      show: (data) => {
        return data.dataType === 2
      },
      component: Input,
      attrs: {
        placeholder: "如： 1-5 或  2-3,5-7,9-12"
      }
    },
    jobNodeCodeList: {
      label: '作业环节',
      // span: 5,
      formItem,
      component: ASelect,
      attrs: {
        hasClear: true,
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
      formItem,
      component: ASelect,
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
  planDate: {
    title: '日期',
    width: 150,
  },
  planTime: {
    title: '时间',
    width: 150,
  },
  arriveWarehouseCount: {
    title: <span>到仓打卡<br/>计划单量</span>,
    width: 150,
    show: isZuoYeHj,
  },
  // 入库报表字段
  bigPkgSignCount: {
    title: <span>签收<br/>计划单量</span>,
    show: isZuoYeHj,
    width: 120
  },
  // pkgSignCount: {
  //   title: <span>包裹签收<br/>计划单量</span>,
  //   show: isZuoYeHj,
  //   width: 120,
  // },
  // pkgInstockCount: {
  //   title: <span>包裹入库<br/>计划单量</span>,
  //   width: 120,
  //   show: isZuoYeHj
  // },
  pkgAutoInstockCount: {
    title: <span>自动入库<br/>计划单量</span>,
    width: 120,
    show: isZuoYeHj
  },
  pkgManualInstockCount: {
    title: <span>人工入库<br/>计划单量</span>,
    width: 120,
    show: isZuoYeHj
  },
  pkgOnShelveCount: {
    title: <span>包裹上架<br/>计划单量</span>,
    width: 120,
    show: isZuoYeHj
  },
  // 出库报表字段
  outStockNoticeCount: {
    title: <span>出库通知<br/>计划单量</span>,
    show: isZuoYeHj,
    width: 120
  },
  pkgOffShelveCount: {
    title: <span>包裹下架<br/>计划单量</span>,
    show: isZuoYeHj,
    width: 120,
  },
  orderSortingCount: {
    title: <span>订单播种<br/>计划单量</span>,
    width: 120,
    show: isZuoYeHj
  },
  orderMergePrintCount: {
    title: <span>订单合箱<br/>计划单量</span>,
    width: 120,
    show: isZuoYeHj
  },
  orderAssemblingCount: {
    title: <span>订单组包<br/>计划单量</span>,
    width: 120,
    show: isZuoYeHj
  },
  orderDispatchCount: {
    title: <span>订单发运<br/>计划单量</span>,
    width: 120,
    show: isZuoYeHj
  },
  // end
  jobNode: {
    title: '作业环节',
    width: 150,
    show: isZuoYeFZ
  },
  jobLargeTeamGroup: {
    title: '作业大组',
    width: 150,
    show: isZuoYeFZ
  },
  jobTeamGroup: {
    title: '作业小组',
    width: 150,
    show: isZuoYeFZ
  },
  planCount: {
    title: '计划单量',
    width: 150,
    show: isZuoYeFZ
  },
  averagePlanWorkingHours: {
    title: '人均计划工时',
    width: 150,
    show: isZuoYeFZ
  },
  planEmployeeNumOnDuty: {
    title: '计划到岗人数',
    width: 120,
    show: isZuoYeFZ
  },
  make: {
    title: '操作',
    lock: 'right',
    width: 150,
    show: (that) => {
      return isZuoYeFZ(that) && isDateTime(that)
    }
  }
}

function isZuoYeHj (that) {
  return that.field && that.field.getValue('jobType') === 1
}
function isZuoYeFZ (that) {
  return !isZuoYeHj(that)
}
function isDateTime (that) {
  return that.field && that.field.getValue('dataType') === 2
}


// 修改

export const modifyFormModel = {
  warehouseName: {
    label: '仓库名称',
    disabled: true
  },
  jobNode: {
    label: '作业环节',
    disabled: true
  },
  jobTeamGroup: {
    label: '作业小组',
    disabled: true,
  },
  planCount: {
    label: '计划单量',
    component: NumberPicker,
    attrs: {
      min: 0
    }
  },
  averagePlanWorkingHours: {
    label: '人均计划工时',
    component: NumberPicker,
    attrs: {
      min: 0,
      precision: 2,
    }
  },
  planEmployeeNumOnDuty: {
    label: '计划到岗人数',
    component: NumberPicker,
    attrs: {
      min: 0
    }
  }
}