import React from 'react';
import { ASelect, Button, Message, DatePicker2, NumberPicker, Input  } from '@/component';
import $http from 'assets/js/ajax'
import { transMultipleToStr, isJSON, _getName } from 'assets/js'
import API from 'assets/api'
import { getStepBaseData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import { getRangTime, getTimeToRange, getReceiver, getReceiverToStr } from '@/report/utils'
import {
  timeOptions,
  broadcastTypeOption,
  boardContentTypeOptions,
  contentTypeOptions
} from '@/report/options'

const isEditable = () => getStepBaseData().readOnly
const isTMall = () => getStepBaseData().isTMall

// 获取预警名称
export function getAbnormalWarnName(data) {
  return _getName(boardContentTypeOptions, data.contentType)
}



// 获取异常列表数据
export function getListData(data) {
  return $http({
    url: '/sys/broadcast/config/list',
    method: 'post',
    data: {
      pageNum: 1,
      pageSize: 1000,
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
  timeScopeStart: {
    label: '播报时间范围',
    fixedSpan: 24,
    component: DatePicker2.RangePicker,
    required: true,
    useDetailValue: true,
    transTimeCode: ['timeScopeStart', 'timeScopeEnd'],
    format: ['YYYY-MM-DD HH:00:00', 'YYYY-MM-DD HH:00:00'],
    attrs: {
      format: 'YYYY-MM-DD HH:00',
      showTime: true,
      timePanelProps:{
        format: "HH:00",
      },
      hasClear: false,
    }
  },
  frequency: {
    label: '播报频率',
    component: ASelect,
    required: true,
    attrs: {
      hasClear: false,
      getOptions: async() => {
        return timeOptions
      }
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
      }
    }
  },
  receiveType: {
    label:'播报方式',
    component: ASelect,
    defaultValue: 'dingtalk',
    required: true,
    attrs: {
      hasClear: false,
      getOptions: async() => {
        return broadcastTypeOption
      }
    }
  },
  receiver: {
    label: '播报接收方',
    tips: `选择钉钉群时，使用@分隔群号机器人access_token和接收人，多个接收人使用','号分隔;
access_token: 钉钉群机器人配置WebHook地址中access_token参数的值`,
    fixedSpan: 24,
    component: Input.TextArea,
    validate: (val, data, setError) => {
      const pv = val && typeof val === 'string' && val || ''
      if (!pv.split('@')[1]) {
        setError('@提醒人不能为空')
        return false
      }
      return true
    },
    required: true,
    attrs: {
      placeholder: `例：access_token@张三,李四,小明`
    }
  },
}
