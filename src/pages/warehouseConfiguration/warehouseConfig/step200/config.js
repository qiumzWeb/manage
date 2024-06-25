import React from 'react';
import { Message  } from '@/component';
import $http from 'assets/js/ajax'
import { getStepBaseData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';

const isEditable = () => getStepBaseData().readOnly
const isTMall = () => getStepBaseData().isTMall

// 获取异常列表数据
export function getListData(data) {
  return $http({
    url: '/sys/kpi/segmentConfig/list',
    method: 'post',
    data: {
      pageNum: 1,
      pageSize: 1000,
      ...data,
    }
  }).then(res => {
    const list = res && res.data || []
    return list
  }).catch(e => {
    Message.error(e.message);
    return []
  })
}
