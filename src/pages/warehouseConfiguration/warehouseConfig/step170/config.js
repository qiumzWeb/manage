import React from 'react';
import { ASelect, Button, Message, AFormTable, NumberPicker, Input  } from '@/component';
import $http from 'assets/js/ajax'
import { transMultipleToStr, isJSON, _getName } from 'assets/js'
import API from 'assets/api'
import { getStepBaseData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import { getRangTime, getTimeToRange, getReceiver, getReceiverToStr } from '@/report/utils'
const isEditable = () => getStepBaseData().readOnly
const isTMall = () => getStepBaseData().isTMall
import {
  timeOptions,
  abnormalWarnType,
  broadcastTypeOption,
  occurRuleValueTypeOptions,
  abnormalWarnContentConfig,
  abnormalBroadCastType
} from '@/report/options'

// 获取预警名称
export function getAbnormalWarnName(data) {
  return _getName(abnormalWarnType, data.contentType)
}

// 获取异常列表数据
export function getListData(data) {
  return $http({
    url: '/sys/storageWarning/config/list',
    method: 'post',
    data: {
      pageNum: 1,
      pageSize: 1000,
      configType: 'storageWarning',
      ...data,
    }
  }).then(res => {
    const list = res && res.data || []
    return list.map(l => {
      return {
        ...l,
        receiver: getReceiverToStr(l.receiver)
      }
    })
  }).catch(e => {
    Message.error(e.message);
    return []
  })
}

// 新增修改
export const formModel = {
  contentType: {
    label: '预警指标',
    component: ASelect,
    required: true,
    disabled: data => {
      return !data.isAdd
    },
    attrs: {
      formatOptions: (value, options, field) => {
        const { contentTypeDisabled } = field.getValues()
        return options.map(o => ({
          ...o,
          disabled: Array.isArray(contentTypeDisabled) && contentTypeDisabled.includes(o.value)
        }))
      },
      getOptions: async({field}) => {
        return abnormalWarnType
      },
      onChange: (val, vm, action) => {
        action && vm.field.setValue('contentTemplate', abnormalWarnContentConfig[val]);
        action && vm.field.setValue('receiveType', [])
      }
    }
  },
  occurRuleValueType: {
    label: '预警值类型',
    component: ASelect,
    required: true,
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
    attrs: {
      getOptions: async() => {
        return timeOptions
      }
    }
  },
  occurRuleValue: {
    label:'预警值',
    required: true,
  },
  receiveType: {
    label: '预警方式',
    component: ASelect,
    defaultValue: 'dingtalk',
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
    5.待下架包裹数量：待下架包裹数量：XXX，已达预警值，请尽快安排下架yyyy-mm-dd hh:mm:ss；`,
    attrs: {
      placeholder: `请输入`
    }
  },
  receiver: {
    label: '预警接收人',
    tips: `选择钉钉群时，使用@分隔群号机器人access_token和接收人，多个接收人使用','号分隔;
access_token: 钉钉群机器人配置WebHook地址中access_token参数的值`,
    span: 24,
    disabled: data => Array.isArray(data.receiveType) && String(data.receiveType) == 'frontLineManagement',
    component: Input.TextArea,
    required: data => !(Array.isArray(data.receiveType) && String(data.receiveType) == 'frontLineManagement'),
    attrs: {
      placeholder: `例：access_token@张三,李四,小明`
    }
  },
}
