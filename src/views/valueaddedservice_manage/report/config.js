
import { DatePicker2 } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import { getDateToRangTime } from '@/report/utils'
import dayjs from 'dayjs'
// 查询接口
export const searchApiUrl = '/added/services/task/statistics'


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
    statisticalTime: {
      label: '统计时间',
      fixedSpan: 22,
      needExpandToData: true,
      defaultValue: getDateToRangTime(dayjs()),
      component: DatePicker2.RangePicker,
      transTimeCode: ['startTime', 'endTime'],
      format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
        hasClear: false
      }
    },
  }
]

// 列表
export const tColumns = {
  statisticalTime: {
    title: '统计时间',
    width: 170,
    cell: (val, index, record) => {
      return record.startTime + ' ~ ' + record.endTime
    }
  },
  statusLabel: {
    title: '状态',
  },
  serviceType: {
    title: '服务类型',
    children: {
      removeFormaldehydeServiceCount: {
        title: '除甲醛',
      },
      dewormingServiceCount: {
        title: '除虫',
      },
      woodFrameServiceCount: {
        title: '加固',
      },
    }
  },
}

