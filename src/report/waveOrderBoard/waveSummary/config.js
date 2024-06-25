import React from 'react';
import { ASelect, NumberPicker, DatePicker2, Button } from '@/component';
import {getWid, isEmpty, getWName} from 'assets/js';
import $http from 'assets/js/ajax';
import dayjs from 'dayjs'
import Bus from 'assets/js/bus'


// 查询
export function getSearchData(data) {
  return $http({
    url: '/bigWaveNo/digitalSigns/getBigWaveNoList',
    method: 'post',
    data: {
      warehouseId: getWid(),
      ...data
    }
  })
}


// 获取集货波次详情信息
export const searchApiUrl = '/bigWaveNo/digitalSigns/getBigWaveNo/detail'

// 获取完结批次信息
export function getWaveBatchCompleteInfo(data) {
  return $http({
    url: '/bigWaveNo/digitalSigns/consoBatch/complete',
    method: 'post',
    data: {
      warehouseId: data.warehouseId || getWid(),
      batchNo: data.batchNo
    }
  })
}

// 完结批次 异常上架 - SHYC  / 重堆垛 - CDD   / 已集齐 - none
export function getWaveBatchCompleteSubmit(data, exceptionCode = "SHYC") {
  return $http({
    url: '/bigWaveNo/digitalSigns/consoBatch/complete/submit',
    method: 'post',
    data: {
      warehouseId: data.warehouseId || getWid(),
      batchNo: data.batchNo,
      exceptionCode
    }
  })
}


// 校验异常集货密码
export function getCheckCompletePassword(data) {
  return $http({
    url: '/bigWaveNo/digitalSigns/consoBatch/complete/passwordCheck',
    method: 'post',
    data: {
      warehouseId: data.warehouseId || getWid(),
      ...data
    }
  })
}

// 批次状态
export const statusOptions = [
  {label: '分批中', value: '0'},
  {label: '已分批', value: '10'},
  {label: '待汇波', value: '20'},
  {label: '已汇波', value: '30'},
  {label: '分拣中', value: '40'},
  {label: '已完结', value: '50'},
]


// 查询条件
export const qSearch = {
    searchDate: {
      label: '波次时间',
      defaultValue: dayjs(),
      component: DatePicker2,
      useDetailValue: true,
      format: (val) => {
        return {
          gmtCreateStartTime: dayjs(val).format('YYYY-MM-DD 00:00:00'),
          gmtCreateEndTime: dayjs(val).format('YYYY-MM-DD 23:59:59')
        }
      },
      attrs: {
        hasClear: false,
      }
    },
    bigWaveNo: {
      label: '波次号',
    },
  }

// 波次信息
export const waveInfo = {
  orderSumNum: {
    title: '订单数'
  },
  packageSumNum: {
    title: '包裹数'
  },
  cutOffTime: {
    title: '预计出库时间'
  },
  batchNoSumNum: {
    title: '已生成集货批次'
  },
  bigBagSumNum: {
    title: '大包总数'
  },
  signBigBagNum: {
    title: '已签收大包数'
  },
  notArriveBigBagNum: {
    title: '未到达大包数'
  },
  arriveBigBagNum: {
    title: "批次到达大包数"
  }
}




// 列表
export const tColumns = {
  warehouseId: {
    title: '仓库名称',
    cell: val => getWName(val) || '-'
  },
  batchNo: {
    title: '集货批次',
    width: 200,
    cell: (val, index, record) => {
      return <a onClick={() => {
        Bus.$emit('getJumpDetail', {
          warehouseId: record.warehouseId,
          batchNo: val
        })
      }}>{val}</a>
    }
  },
  notArrivePackageNum: {
    title: ' 未到达包裹数',
  },
  arrivePackageNum: {
    title: '批次到达包裹数',
  },
  signPackageNum: {
    title: '签收包裹数',
  },
  instockPackageNum: {
    title: '已集货批次分拣包裹数',
  },
  batchNoPackageSumNum: {
    title: '集货批次包裹总数',
  },
  batchStatus: {
    title: '状态',
    cell: val => <ASelect value={val} getOptions={async() => statusOptions} isDetail defaultValue="-"></ASelect>
  }
}


// 异常密码配置
export const confirmModel = {
  batchCompletePassword: {
    label: '请输入完结集货批次密码',
    required: true,
    span: 24
  }
}