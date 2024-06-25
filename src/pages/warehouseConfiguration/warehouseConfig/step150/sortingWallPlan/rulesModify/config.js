import React from 'react'
import ASelect from '@/component/ASelect/index'
import { formModel } from '../config/planConfig'
import RulesDetail from '../rulesDetails'

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

