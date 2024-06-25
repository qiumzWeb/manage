import React from 'react';
import { ASelect, Input, DatePicker2 } from "@/component"
import { getWid, isEmpty } from 'assets/js'
import dayjs from 'dayjs'
import { getToolList } from './api'

// 操作框组件配置
export const ToolComponentConfig = {
  textarea: Input.TextArea,
  select: ASelect
}

// 工具下拉配置
export const getToolOptions = async() => {
  const list = await getToolList
  return Array.isArray(list.tools) && list.tools.map(t => ({
    ...t,
    label: t.label,
    value: t.name
  })) || []
}
// 员工查询条件
export const searchModel = {
  name: {
    label: '员工姓名/工号',
    attrs: {
      placeholder: '请输入员工姓名、工号'
    }
  },
}
// 员工列表
export const empColumns = {
  userName: {
    title: '员工姓名'
  },
  loginName: {
    title: '员工登录名'
  },
  employeeNo: {
    title: '员工工号'
  },

}

// 工具树配置
export const authConfig = {
  "groups":[
    {
      "name":"send_back_tool",
      "desc":"消息回传"
    },
    {
      "name":"package_tool",
      "desc":"包裹处理"
    },
    {
      "name":"order_tool",
      "desc":"订单处理"
    },
    {
      "name":"query_tool",
      "desc":"消息回传"
    },
    {
      "name":"utility",
      "desc":"小工具"
    }
  ],
  "tools":[
    {
      "name":"sendSignMessage",
      "label":"重发签收消息",
      "group":"send_back_tool",
      "submitUrl":"/cloudTool/cloud/pushMessage/sendSignMessage",
      "parameters":[
        {
          "name":"warehouseId",
          "lable":"仓ID",
          "uiType":"input",
          "isRequire":false
        },
        {
          "name":"deliveryCode",
          "lable":"包裹运单号",
          "uiType":"textarea",
          "isRequire":true,
          "valueSeparator":"\r\n"
        }
      ],
      "result":"resultMessage"
    }
  ]
}

// 操作记录查询条件
export const recordSearchModel = {
  makeTime: {
    label: '操作时间',
    component: DatePicker2.RangePicker,
    fixedSpan: 22,
    defaultValue: [dayjs().subtract(7, 'day'), dayjs()],
    attrs: {
      showTime: true,
    }
  },
  action: {
    label: '工具名称',
    component: ASelect,
    attrs: {
      getOptions: getToolOptions
    }
  }
}

// 操作记录 columns 配置
export const recordColumnsModel = {
  warehouseName: {
    title: '仓库名称'
  },
  action: {
    title: '工具名称',
    cell: (val) => <ASelect isDetail getOptions={getToolOptions} value={val} defaultValue={val}></ASelect>
  },
  content: {
    title: '操作内容'
  },
  createTime: {
    title: '操作时间'
  },

  createUser: {
    title: '用户ID'
  }
}