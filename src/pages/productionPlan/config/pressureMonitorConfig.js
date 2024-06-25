import React from 'react'
import { Input, Select, Button, Radio, DatePicker } from '@/component'
import ASelect from '@/component/ASelect'
import { getJobNode, getBizType } from '../api'
import {getWid} from 'assets/js'
import moment from 'moment'
const formItem = {
  labelCol: null,
  wrapperCol: null
}
export const qSearch = [
  {
    warehouseId: {
      label: '仓库名称',
      // span: 5,
      component: ASelect,
      defaultValue: getWid(),
      formItem
    },
    jobDate: {
      label: '日期',
      // span: 5,
      component: DatePicker,
      formItem,
      defaultValue: moment()
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
      },
    },
    bizTypeCodeList: {
      label: '业务类型',
      // span: 5,
      component: ASelect,
      formItem,
      attrs: {
        mode: 'multiple',
        getOptions: async () => {
          try {
            const options = await getBizType()
            return (options || []).map(o => ({
              ...o,
              label: o.bizType,
              value: o.bizTypeCode
            }))
          } catch (e) {
            return []
          }
        }
      },
    }
  }
]

export const tColumns = {
  warehouseName: {
    title: '集运仓',
    width: 200,
    lock: 'left',
  },
  jobDate: {
    title: '时间',
    width: 150,
  },
  bizType: {
    title: <span>类型</span>,
    width: 120
  },
  jobNode: {
    title: <span>作业环节</span>,
    width: 120,
  },
  shouldFinishDate: {
    title: '应完成时间',
    width: 120,
  },
  waitHandlePackageNum: {
    title: <span>全天待处理量</span>,
    width: 120,
  },
  packageNum: {
    title: <span>已处理包裹数量</span>,
    width: 120,
  },
  surplusPackageNum: {
    title: <span> 剩余待处理量</span>,
    width: 120
  },
  surplusCapacity: {
    title: <span>剩余产能</span>,
    width: 120,
  },
  preLatePackageNum: {
    title: '预计晚点量',
    width: 120,
  },
  pressureValue: {
    title: <span>压力值</span>,
    width: 120,
  }
}
