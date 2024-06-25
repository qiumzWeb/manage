import React from 'react'
import ASelect from '@/component/ASelect/index'
import { formModel } from '../config/planConfig'
import RulesDetail from '../rulesDetails'
import $http from 'assets/js/ajax';

// 基本信息
export const baseModel = formModel
// 配置规则
export const rulesModel = {
  rulesList: {
    label: '',
    span: 24,
    component: RulesDetail,
  }
}

// 刷新基础数据
export function getUpdateBaseData({warehouseId, solutionId}) {
  return $http({
    url: `/warehouse/${warehouseId}/sorting-solutions/list`,
    method: 'post',
    data: {
      warehouseId,
      solutionId
    }
  }).then(res => {
    return res && res.data && Array.isArray(res.data) && res.data[0] || null
  }).catch(e => null)
}