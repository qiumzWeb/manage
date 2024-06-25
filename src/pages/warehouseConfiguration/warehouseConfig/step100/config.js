import React from 'react';
import { ASelect, Button, Message, AFormTable, NumberPicker  } from '@/component';
import $http from 'assets/js/ajax'
import { transMultipleToStr, isJSON } from 'assets/js'
import API from 'assets/api'
import { getStepBaseData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
const isEditable = () => !getStepBaseData().readOnly

// 获取列表
export function getSysWarehouseTaskAllocationConfigList(data) {
  return $http({
    url: API.getSysWarehouseTaskAllocationConfigList,
    method: 'post',
    data: {
      pageNum: 1,
      pageSize: 1000,
      ...data,
    }
  }).then(res => {
    return res && res.data || []
  }).catch(e => {
    Message.error(e.message);
    return []
  })
}
