import React from 'react';
import { ASelect, Input, NumberPicker, DatePicker2, Message } from '@/component';
import {getWid, isEmpty, getWName} from 'assets/js';
import $http from 'assets/js/ajax';
import dayjs from 'dayjs';
import { qSearch as SummarySearchModel, statusTypeOptions } from '../summary/config'
import { AutoWavePackageAttrOptions } from "@/report/options"
// 查询接口
export const searchApiUrl = '/delay/package/report/detail'

export const qSearch = {
    ...SummarySearchModel,
    packageCode: {
      label: '包裹号',
    },
    referOrderId: {
      label: '订单号',
    },
    delayTimeLower: {
      label: '滞溜时长范围（分钟）',
      component: React.forwardRef((props, ref) => {
        const { value, field } = props
        return <div>
          <NumberPicker min={0} ref={ref} {...props} placeholder="时长下限" style={{width: '45%'}}></NumberPicker>
          <span style={{display: 'inline-block', width: '10%', textAlign: 'center'}}>-</span>
          <NumberPicker min={value || 0} value={field.getValue('delayTimeUpper')} style={{width: '45%'}} onChange={(val) => {
            field.setValue('delayTimeUpper', val)
          }} placeholder="时长上限"></NumberPicker>
        </div>
      }),
    },
    solutionCode: {
      label: '解决方案',
      component: ASelect,
      show: data => data.statusType == 'P',
      attrs: {
        getOptions: async() => AutoWavePackageAttrOptions
      }
    }
}

// 列表
export const tColumns = {
  warehouseId: {
    title: '仓库名称',
    cell: val => getWName(val) || '-'
  },
  gmtModifyTime: {
    title: '时间',
  },
  packageCode: {
    title: '包裹号'
  },
  referLogisticsOrderCode: {
    title: '二段LP',
    show: vm => {
      const { statusType } = vm.field.getValues();
      return statusType == 'P'
    }
  },
  referOrderId: {
    title: '订单号',
  },
  // type: {
  //   title: '统计维度',
  //   cell: val => <ASelect value={val} isDetail getOptions={async() => statusTypeOptions} defaultValue="-"></ASelect>
  // },
  status: {
    title: '状态'
  },
  delayTime: {
    title: '滞留时长(分钟)',
  },
  solutionCode: {
    title: '解决方案',
    cell: val => <ASelect defaultValue="-" value={val} isDetail getOptions={async() => AutoWavePackageAttrOptions}></ASelect>
  }
}
