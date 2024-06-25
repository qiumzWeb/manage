import React from 'react'
import { Input, Select, Button, Radio, DatePicker2 } from '@/component'
import moment from 'moment'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import $http from 'assets/js/ajax'
import API from 'assets/api'
// 查询接口
export const searchUrl = API.getWarehouseDistrictAssignedList

// 列表
export const tColumns = {
  name: {
    title: '库区简称',
  },
  areaName: {
    title: '国家',
    width: 350
  },
  serviceTypeName: {
    title: '业务类型',
  },
  packageTypeName: {
    title: '大小件',
  }
}

