import React from 'react';
import { ASelect, Input, DatePicker2, Message } from '@/component';
import {getWid, isEmpty} from 'assets/js';
import $http from 'assets/js/ajax';
import dayjs from 'dayjs';
import { defaultSearchTime } from '@/report/utils';
import { prodPlanAbnormalWarnType } from '@/report/options';
import { getBigJobTeamGroup } from '../../api'
// 查询接口
export const searchApiUrl = '/broadcastAndProposal/detail/list'

// 编辑提交
export function getStatusModify(data) {
  return $http({
    url: '/broadcastAndProposal/detail/modify',
    method: 'post',
    data
  })
}

// 是否有效
export const isEffectOptions = [
  {label: '有效', value: '2'},
  {label: '无效', value: '1'},
  {label: '其他', value: '0'},
]
// 处理状态
export const progressStatusOptions = [
  {label: '已完成', value: '2'},
  {label: '计算中', value: '1'},
  {label: '新建', value: '0'},
]

// 预警状态
export const isNeedWarningOptions = [
  {label: '需要', value: '1'},
  {label: '不需要', value: '0'},
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
    largeTeamGroupIdList: {
      label: '预警诊断维度',
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
    warningEffectiveness: {
      label: '预警是否有效',
      component: ASelect,
      attrs: {
        getOptions: async() => isEffectOptions
      }
    },
    proposalEffectiveness: {
      label: '调度是否有效',
      component: ASelect,
      attrs: {
        getOptions: async() => isEffectOptions
      }
    },
    isNeedWarning: {
      label: '是否需要预警',
      component: ASelect,
      attrs: {
        getOptions: async() => isNeedWarningOptions
      }
    }
  }
]

// 列表
export const tColumns = {
  contentType: {
    title: '预警指标',
    cell: val => <ASelect value={val} isDetail getOptions={async() => prodPlanAbnormalWarnType} defaultValue="-"></ASelect>,
    lock: 'left',
  },
  jobNodeCode: {
    title: '环节'
  },
  jobDate: {
    title: '预警日期',
    lock: 'left',
  },
  largeTeamName: {
    title: '预警诊断维度'
  },
  currentValue: {
    title: '当前值'
  },
  lowerValue: {
    title: '预警值下限',
  },
  upperValue: {
    title: '预警值上限',
  },
  progressStatus: {
    title: '状态',
    cell: val => <ASelect value={val} isDetail getOptions={async() => progressStatusOptions} defaultValue="-"></ASelect>,
  },
  proposalContent: {
    title: '调度建议',
  },
  isNeedWarning: {
    title: '是否需要预警',
    cell: val => <ASelect value={val} isDetail getOptions={async() => isNeedWarningOptions} defaultValue="-"></ASelect>
  },
  warningEffectiveness: {
    title: '预警是否有效',
    cell: val => <ASelect value={val} isDetail getOptions={async() => isEffectOptions} defaultValue='-'></ASelect>
  },
  proposalEffectiveness: {
    title: '调度是否有效',
    cell: val => <ASelect value={val} isDetail getOptions={async() => isEffectOptions} defaultValue='-'></ASelect>
  },

  remark: {
    title: '备注'
  },
}

// 编辑配置
export const EditModel = {
  warningEffectiveness: {
    label: '预警是否有效',
    component: ASelect,
    required: true,
    span: 12,
    attrs: {
      getOptions: async() => isEffectOptions
    }
  },
  proposalEffectiveness: {
    label: '调度是否有效',
    component: ASelect,
    required: true,
    span: 12,
    attrs: {
      getOptions: async() => isEffectOptions
    }
  },
  remark: {
    label: '备注',
    component: Input.TextArea,
    span: 24,
    attrs: {
      rows: 4
    }
  },
}

// 详情
export const detailModel = {
  contentType: {
    label: '预警指标',
    component: ASelect,
    attrs: {
      isDetail: true,
      style: {fontWeight: 'bold'},
      getOptions: async() => prodPlanAbnormalWarnType,
      defaultValue: '-'
    }
  },
  jobNodeCode: {
    label: '环节',
    attrs: {
      detail: true
    }
  },
  jobDate: {
    label: '预警日期',
    attrs: {
      detail: true
    }
  },
  largeTeamName: {
    label: '预警诊断维度',
    attrs: {
      detail: true
    }
  },
  currentValue: {
    label: '当前值',
    attrs: {
      detail: true
    }
  },
  lowerValue: {
    label: '预警值下限',
    attrs: {
      detail: true
    }
  },
  upperValue: {
    label: '预警值上限',
    attrs: {
      detail: true
    }
  },
  progressStatus: {
    label: '状态',
    component: ASelect,
    attrs: {
      isDetail: true,
      style: {fontWeight: 'bold'},
      getOptions: async() => progressStatusOptions,
      defaultValue: '-'
    }
  },
  warningEffectiveness: {
    label: '预警是否有效',
    component: ASelect,
    attrs: {
      isDetail: true,
      style: {fontWeight: 'bold'},
      getOptions: async() => isEffectOptions,
      defaultValue: '-'
    }
  },
  proposalEffectiveness: {
    label: '调度是否有效',
    component: ASelect,
    attrs: {
      isDetail: true,
      style: {fontWeight: 'bold'},
      getOptions: async() => isEffectOptions,
      defaultValue: '-'
    }
  },
  isNeedWarning: {
    label: '是否需要预警',
    component: ASelect,
    attrs: {
      isDetail: true,
      style: {fontWeight: 'bold'},
      getOptions: async() => isNeedWarningOptions,
      defaultValue: '-'
    }
  },
  exceptionCode: {
    label: '异常码',
    attrs: {
      detail: true
    }
  },
  metadata: {
    label: '元数据',
    span: 24,
    attrs: {
      detail: true
    }
  },
  warningContent: {
    label: '预警内容',
    span: 24,
    attrs: {
      detail: true
    }
  },
  proposalContent: {
    label: '调度建议',
    span: 24,
    attrs: {
      detail: true
    }
  },
  remark: {
    label: '备注',
    span: 24,
    attrs: {
      detail: true
    }
  },
}
