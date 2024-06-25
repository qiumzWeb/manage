import ASelect from "@/component/ASelect/index"
import { getWid, isEmpty } from 'assets/js'
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
  make: {
    title: '操作',
  }
}

// 工具树配置
export const authConfig = {
  "loginName":"S123456",
  "userName":"张三",
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
      "isAuth":true
    },
    {
      "name":"sendInboundMsg",
      "label":"重发入库消息",
      "group":"send_back_tool",
      "isAuth":true
    }
  ]
}

