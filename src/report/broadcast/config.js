import React from 'react'
import { Input, Select, Button, Radio, DatePicker2, ASelect } from '@/component'
import dayjs from 'dayjs'
import {getWid} from 'assets/js'
import {
  timeOptions,
  broadcastTypeOption,
  boardContentTypeOptions,
  contentTypeOptions,
  InitTimeOptions,
  broadcastTypeByContentType,
  broadcastOptions,
  UPPHBroadcastOptions
} from '@/report/options'
export {
  timeOptions,
  broadcastTypeOption,
  contentTypeOptions,
}

// 查询接口
export const searchUrl = '/sys/broadcast/config/list'


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
  timeScoped: {
    title: '播报时间范围',
    width: 350,
    cell: (val, index, record) => {
      return val.map(v => dayjs(v).format('YYYY-MM-DD HH:00')).join('~')
    }
  },
  frequency: {
    title: '播报频率',
    width: 150,
    cell: (val, index, record) => {
      if (isProdPlanConfig(record)) {
        return <ASelect isDetail value={record.triggerTimeList} mode="multiple" getOptions={async() => InitTimeOptions}></ASelect>
      } else {
        return <ASelect isDetail value={val} getOptions={async() => timeOptions}></ASelect>
      }
    }
  },
  contentType: {
    title: '播报内容',
    cell: (val) => <ASelect isDetail value={val} getOptions={async() => contentTypeOptions}></ASelect>
  },
  receiveType: {
    title:'播报方式',
    width: 120,
    cell: (val) => <ASelect isDetail mode="multiple" value={(val || '').split('|')} getOptions={async() => broadcastOptions}></ASelect>
  },
  receiver: {
    title: '播报接收方',
    width: 200,
    cell: (val) => <pre style={{  whiteSpace: 'break-spaces'}}>{val}</pre>
  },
  operator: {
    title: '更新人',
    width: 100
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
  return UPPHBroadcastOptions.some(u => u.value == data.contentType);
  // return data.contentType == "UPPH"
}

// 非生产计划配置
export function isNormalConfig(data) {
  return !isProdPlanConfig(data)
}

// 新增修改
export const formModel = {
  warehouseId: {
    label: '仓库名称',
    component: ASelect,
    disabled: data => !data.isAdd,
    required: true,
    attrs: {
      hasClear: false
    }
  },
  contentType: {
    label: '播报内容',
    component: ASelect,
    required: true,
    attrs: {
      hasClear: false,
      getOptions: async() => {
        return boardContentTypeOptions
      },
      onChange: (val, vm, action) => {
        action && vm.field.setValue('receiveType', ['dingtalk'])
      }
    }
  },
  receiveType: {
    label:'播报方式',
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
      // watchKey: 'contentType',
      getOptions: async({field}) => {
        // const contentType = field.getValue('contentType')
        // return broadcastTypeByContentType[contentType] || broadcastTypeOption;
        return broadcastTypeOption;
      }
    }
  },
  timeScoped: {
    label: '播报时间范围',
    fixedSpan: 24,
    component: DatePicker2.RangePicker,
    show:isNormalConfig,
    required: true,
    attrs: {
      format: 'YYYY-MM-DD HH:00',
      showTime: true,
      timePanelProps:{
        format: "HH:00",
      },
      hasClear: false,
    }
  },
  triggerTimeList: {
    label: '播报频率',
    component: ASelect,
    required: true,
    show: isProdPlanConfig,
    attrs: {
      mode: 'multiple',
      getOptions: async() => InitTimeOptions
    }
  },
  frequency: {
    label: '播报频率',
    component: ASelect,
    show: isNormalConfig,
    required: true,
    attrs: {
      hasClear: false,
      getOptions: async() => {
        return timeOptions
      }
    }
  },

  receiver: {
    label: '播报接收方',
    tips: `选择钉钉群时，使用@分隔群号机器人access_token和接收人，多个接收人使用','号分隔;
access_token: 钉钉群机器人配置WebHook地址中access_token参数的值;
接收人： 目前仅支持填写接收人的手机号，例如： access_token@13888888888,13999999999,13666666666`,
    span: 24,
    component: Input.TextArea,
    required: true,
    attrs: {
      placeholder: `例：access_token@张三,李四,小明`
    }
  },
}
