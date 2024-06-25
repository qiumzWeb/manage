import React from 'react';
import { ASelect, Button, Message, DatePicker2, NumberPicker, Input  } from '@/component';
import $http from 'assets/js/ajax'
import { transMultipleToStr, isJSON, _getName } from 'assets/js'
import API from 'assets/api'
import { getStepBaseData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';

const isEditable = () => getStepBaseData().readOnly
const isTMall = () => getStepBaseData().isTMall

// 获取异常列表数据
export function getListData(data) {
  return $http({
    url: API.getKpiListNew,
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


