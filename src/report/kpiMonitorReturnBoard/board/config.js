import React from 'react'
import {thousands, getWid, isEmpty} from 'assets/js'
import { ASelect, DatePicker2, Message } from '@/component'
import { defaultSearchTime } from '@/report/utils'


export const searchModel = {
  warehouseId: {
    label: '仓库名称',
    component: ASelect,
    defaultValue: getWid(),
    attrs: {
      hasClear: false,
      showSearch: true
    }
  },
  startTime: {
    label: '统计时间',
    fixedSpan: 22,
    defaultValue: defaultSearchTime,
    component: DatePicker2.RangePicker,
    useDetailValue: true,
    transTimeCode: ['startTime', 'endTime'],
    format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
    attrs: {
      hasClear: false,
      format: 'YYYY-MM-DD HH:mm:ss',
      showTime: true,
    }
  }
}
export const CardConfig = [
  [
    {
      title: '逆向拒收订单占比',
      tip: '逆向签收失败的包裹占比',
      value: (data, goDetail) => <div className='warn-color'>{`${thousands(data.signBigBagBeforeCutTimeCount)}`}</div>,
    },
    {
      title: '签收失败包裹量',
      value: (data, goDetail) => <div className='main-color' onClick={() => {
        if (isEmpty(data)) {
          Message.warning('请先查询数据！')
        } else if (typeof goDetail === 'function') {
          goDetail({
            ...data,
            detailType: 3,
            content: '',
            contentShort: ''
          })
        }
      }} style={{cursor: 'pointer'}}>{`${thousands(data.rejectPackages)}`}</div>,
    },
    {
      title: '逆向签收包裹量',
      value: (data, goDetail) => <div className='main-color' onClick={() => {
        if (isEmpty(data)) {
          Message.warning('请先查询数据！')
        } else if (typeof goDetail === 'function') {
          goDetail({
            ...data,
            detailType: 2,
            content: '',
            contentShort: ''
          })
        }
      }} style={{cursor: 'pointer'}}>{`${thousands(data.signPackages)}`}</div>,
    },
  ],
  {
    span: 'single',
    data: {
      title: '逆向入库无法获取快递面单处理完成率',
      titleAlign: 'left',
      value: <div id="return-chart-pie-box"></div>,
    }
  },
  {
    span: 'big',
    data: {
      title: '逆向入库原因',
      titleAlign: 'left',
      value: <div id="return-chart-box"></div>,
    }
  },

  // [
  //   {
  //     title: '未出库的包裹操作逆向占比',
  //     value: data => `${thousands(data.initialScannedQuantity)}/${thousands(data.totalQuantity)}`
  //   },
  //   {
  //     title: '逆向入库成功包裹量',
  //     value: data => `${thousands(data.secondScannedQuantity)}/${thousands(data.totalQuantity)}`
  //   },
  //   {
  //     title: '未出库逆向包裹单量',
  //     value: data => `${thousands(data.finalScannedQuantity)}/${thousands(data.totalQuantity)}`,
  //     tip: '二次路由失败/在架包裹回退/误操作的包裹'
  //   },
  // ]
]