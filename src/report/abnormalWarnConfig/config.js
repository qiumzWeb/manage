import React from 'react'
import { Input, AFormTable, ASelect, NumberPicker } from '@/component'
import {getWid, isEmpty } from 'assets/js'
import {
  timeOptions,
  abnormalWarnType,
  broadcastTypeOption,
  occurRuleValueTypeOptions,
  abnormalWarnContentConfig,
  abnormalBroadCastType,
  InitTimeOptions,
  abnormalWarnScopeType,
  prodPlanAbnormalWarnType,
  prodPlanNotNeedPrcentAbnormalWarnType
} from '@/report/options';
import { getBigJobTeamGroup } from '@/pages/productionPlan/api'
import $http from 'assets/js/ajax';

// 查询接口
export const searchUrl = '/sys/storageWarning/config/list'


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
  }
]

// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
    lock: 'left'
  },
  contentType: {
    title: '预警指标',
    cell: (val) => <ASelect isDetail value={val} getOptions={async() => abnormalWarnType}></ASelect>
  },
  // occurRuleOperator: {
  //   title: '计算方式',
  //   cell: (val) => <ASelect isDetail value={val} getOptions={async() => timeOptions}></ASelect>
  // },
  occurRuleValueType: {
    title: '预警值类型',
    cell: (val) => <ASelect isDetail value={val} getOptions={async() => occurRuleValueTypeOptions}></ASelect>
  },
  occurRuleValue: {
    title:'预警值',
    width: 150,
    cell: (val, index, record) => {
      if (isProdPlanConfig(record)) {
        const lowerValue = record.occurRuleValueType == 'percent' ? +(record.lowerValue * 100).toFixed(2) : record.lowerValue
        const upperValue = record.occurRuleValueType == 'percent' ? +(record.upperValue * 100).toFixed(2) : record.upperValue
        return <div>
          下限：{lowerValue || '无'}<br />
          上限：{upperValue || '无'}
        </div>
      } else {
        return val
      }
    }
  },
  frequency: {
    title: '预警频率',
    width: 150,
    cell: (val, index, record) => {
      if (isProdPlanConfig(record)) {
        return <ASelect isDetail value={record.triggerTimeList} mode="multiple" getOptions={async() => InitTimeOptions}></ASelect>
      } else {
        return <ASelect isDetail value={val} getOptions={async() => timeOptions}></ASelect>
      }
    }
  },
  contentTemplate: {
    title: '预警文案',
    width: 350
  },
  receiveType: {
    title: '预警方式',
    width: 200,
    cell: (val, index, record) => <ASelect isDetail mode="multiple" value={typeof val == 'string' && val.split('|')} getOptions={async() => abnormalBroadCastType[record.contentType] || broadcastTypeOption}></ASelect>,
  },
  receiver: {
    title: '预警接收人',
  },
  operator: {
    title: '操作人',
  },
  updateTime: {
    width: 200,
    title: '更新时间',
  },
  make: {
    title: '操作',
    lock: 'right'
  }
}
// 判断生产计划配置
export function isProdPlanConfig(data) {
  return prodPlanAbnormalWarnType.some(p => p.value == data.contentType)
}

// 判断只需要数值预警的配置
export function isProdPlanNotNeedPrcentConfig(data) {
  return prodPlanNotNeedPrcentAbnormalWarnType.some(p => p.value == data.contentType)
}

// 非生产计划配置
export function isNormalConfig(data) {
  return !isProdPlanConfig(data)
}

// 是否有大组维度
export function isNotGroupTeamConfig(data) {
  return !['QUANTITY_SPEED', 'CAPACITY'].includes(data.contentType)
}

// 是否显示调度建议
export function isShowSuggestions(data) {
  return ['CAPACITY'].includes(data.contentType)
}

// 获取调度建议名称列表
export function getProposalNameList(warehouseId) {
  return $http({
    url: '/sys/proposal/searchAllProposal',
    method: 'get',
    data: {warehouseId}
  }).then(res => {
    return Array.isArray(res) && res.map(r => ({
      ...r,
      label: r.proposalName,
      value: r.id
    })) || []
  }).catch(e => []) 
}

// 建议调度阈值比较类型
export const compareTypeOptions = [
  {label: '等于', value: 'eq'},
  {label: '大于', value: 'gt'},
  {label: '小于', value: 'lt'},
]


// 新增修改
export const formModel = {
  warehouseId: {
    label: '仓库名称',
    component: ASelect,
    disabled: data => !data.isAdd,
    required: true,
  },
  contentType: {
    label: '预警指标',
    component: ASelect,
    required: true,
    disabled: data => !data.isAdd,
    attrs: {
      getOptions: async() => {
        return abnormalWarnType
      },
      onChange: (val, vm, action) => {
        action && vm.field.setValue('contentTemplate', abnormalWarnContentConfig[val]);
        action && vm.field.setValue('receiveType', [])
        if (isProdPlanNotNeedPrcentConfig({contentType: val})) {
          vm.field.setValue('occurRuleValueType', 'number')
        }
        if (isNotGroupTeamConfig({contentType: val})) {
          vm.field.setValue('orgScope', '2')
        }
        if (val == 'DELAY_PACKAGE') {
          vm.field.setValue('occurRuleValueType', 'percent')
        }
      }
    }
  },
  /**
   * {label: '单量流速', value: 'QUANTITY_SPEED'},
   * {label: '产能', value: 'CAPACITY'},
   * 预警类型不是 单量流速 和产能 时，预警维度禁用，默认为全仓
   */
  
  orgScope: {
    label: '预警诊断维度',
    component: ASelect,
    required: true,
    defaultValue: '2',
    disabled: isNotGroupTeamConfig,
    show: isProdPlanConfig,
    attrs: {
      getOptions: async() => abnormalWarnScopeType,
    }
  },
  orgIdList: {
    label: '作业大组',
    // required: true,
    show: data => data.orgScope != '2',
    component: ASelect,
    attrs: {
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
  triggerTimeList: {
    label: '预警频率',
    component: ASelect,
    required: true,
    show: isProdPlanConfig,
    attrs: {
      mode: 'multiple',
      getOptions: async() => InitTimeOptions
    }
  },
  occurRuleValueType: {
    label: '预警值类型',
    component: ASelect,
    disabled: (data) => isProdPlanNotNeedPrcentConfig(data) || data.contentType == 'DELAY_PACKAGE',
    required: true,
    defaultValue: 'number',
    attrs: {
      hasClear: false,
      getOptions: async() => {
        return occurRuleValueTypeOptions
      }
    }
  },
  frequency: {
    label: '预警频率',
    component: ASelect,
    required: true,
    show: isNormalConfig,
    attrs: {
      getOptions: async() => {
        return timeOptions
      }
    }
  },
  lowerValue: {
    label: '预警值下限',
    required: data => isEmpty(data.upperValue),
    show: isProdPlanConfig,
    format: (val, {data, action}) =>  {
      const isPrcent = data.occurRuleValueType == 'percent'
      const type = {
        output: isPrcent ? +(Number(val) / 100).toFixed(2) : val,
        inset:  isPrcent ? val * 100 : val
      }
      return type[action]
    },
  },
  upperValue: {
    label: '预警值上限',
    required: data => isEmpty(data.lowerValue),
    show: isProdPlanConfig,
    format: (val, {data, action}) =>  {
      const isPrcent = data.occurRuleValueType == 'percent'
      const type = {
        output: isPrcent ? +(Number(val) / 100).toFixed(2) : val,
        inset:  isPrcent ? val * 100 : val
      }
      return type[action]
    },
  },
  occurRuleValue: {
    label:'预警值',
    required: true,
    show: isNormalConfig,
  },
  receiveType: {
    label: '预警方式',
    component: ASelect,
    defaultValue: ['dingtalk'],
    required: true,
    format: (val, {action}) =>  {
      const type = {
        output: Array.isArray(val) && val.join('|'),
        inset:  typeof val === 'string' && val.split('|') || []
      }
      return type[action]
    },
    attrs: {
      hasClear: false,
      mode: 'multiple',
      watchKey: 'contentType',
      getOptions: async({field}) => {
        const contentType = field.getValue('contentType')
        return abnormalBroadCastType[contentType] || broadcastTypeOption
      }
    }
  },
  contentTemplate: {
    label: '预警文案',
    required: data => !(Array.isArray(data.receiveType) && String(data.receiveType) == 'frontLineManagement'),
    component: Input.TextArea,
    disabled: data => Array.isArray(data.receiveType) && String(data.receiveType) == 'frontLineManagement',
    span: 24,
    tips: `1.库容满载率（包裹数量）：库区（例E-PA10) 包裹数量已达库容满载预警值，建议尽快关闭此库区的首单推荐 yyyy-mm-dd hh:mm:ss；
2.库容满载率（首单数量）：库区（例E-PA10)首单数量已达库区首单上限预警值，建议尽快关闭此库区的首单推荐,yyyy-mm-dd hh:mm:ss；
3.已到未入包裹数量：已到未入包裹数量：XXX,已达预警值，请尽快安排入库yyyy-mm-dd hh:mm:ss；
4.待上架包裹数量：待上架包裹数量：\${XXX},已达预警值，请尽快安排上架yyyy-mm-dd hh:mm:ss；
5.待下架包裹数量：待下架包裹数量：XXX，已达预警值，请尽快安排下架yyyy-mm-dd hh:mm:ss；
6. 小时落单差异：前一小时实际单量-前一小时预测单量。涉及到的环节：批次到达，出库通知;
7. 单量流速：前一天早7点到第二天7点的实际单量/产能【配置值】。涉及到的环节：入库，合箱。by天;
8. 单量预测差异：前一天早7点到第二天7点的实际单量/预测单量。（by天，预警时间第二天7点，即预警频率配置一天一次）;
9. 产能：前一小时实际落单-前一小时计划单量。涉及到的环节：所有环节;
10. 到岗人数：7点到当前时间实际到岗人数-计划到岗人数？（by天预警，预警指标计算3次，10点，15点，21点）;
11. 人效差异：前一小时实际人效-前一小时环节人效。涉及到的环节：所有环节;
12. WIP：（已入库待上架，已下架待播种，已合箱待组包的）待作业量/（上架，播种，组包环节）的每小时的计划单量;
    `,
    attrs: {
      placeholder: `请输入`
    }
  },
  receiver: {
    label: '预警接收人',
    tips: `选择钉钉群时，使用@分隔群号机器人access_token和接收人，多个接收人使用','号分隔;
access_token: 钉钉群机器人配置WebHook地址中access_token参数的值;
接收人： 目前仅支持填写接收人的手机号，例如： access_token@13888888888,13999999999,13666666666
`,
    span: 24,
    disabled: data => Array.isArray(data.receiveType) && String(data.receiveType) == 'frontLineManagement',
    component: Input.TextArea,
    required: data => !(Array.isArray(data.receiveType) && String(data.receiveType) == 'frontLineManagement'),
    attrs: {
      placeholder: `例：access_token@张三,李四,小明`
    }
  },
  proposalConfigDTOList: {
    label: '调度建议',
    span: 24,
    component: AFormTable,
    show: isShowSuggestions,
    attrs: {
      hasAdd: true,
      defaultData: {triggerOperator: 'eq'},
      watchKey: 'warehouseId',
      columns: {
        proposalId: {
          title: '调度建议名称',
          required: true,
          component: ASelect,
          edit: true,
          attrs: {
            getOptions: async({field}) => {
              const {warehouseId} = field.getValues();
              const options = await getProposalNameList(warehouseId)
              return options
            }
          }
        },
        triggerValue: {
          title: '调度建议触发阈值',
          required: true,
          edit: true,
          component: React.forwardRef(function(props, ref) {
            const { field, value, onChange } = props;
            return <Input
              ref={ref}
              addonBefore={<ASelect value={field.getValue('triggerOperator')} getOptions={async() => {
                return compareTypeOptions
              }} onChange={(val) => {
                field.setValue('triggerOperator', val)
                // 扩展字段 更新时 需要手动 触发 当前主字段的 change 事件，进行更新 
                typeof onChange === 'function' && onChange(value)
              }}></ASelect>}
              {...props}
          />
          })
        }
      },
      maxLength: 50,
    }
  }
}
