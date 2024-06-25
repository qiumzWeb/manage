import React from 'react'
import { TimePicker2, Input, NumberPicker  } from '@/component'
import ASelect from '@/component/ASelect/index'
import AFormTable from '@/component/AFormTable'
import $http from 'assets/js/ajax'
import { _uid, isEmpty } from 'assets/js'
export const getSLAOptions = $http({
    url: '/sys/kpi/segmentConfig/configEnum',
    method: 'get'
}).then(data => {
    const newData = {}
    Object.entries(data).forEach(([key, value]) => {
        const list = []
        typeof value == 'object' && Object.entries(value).forEach(([k, v]) => {
            list.push({
                label: v,
                value: k
            })
        })
        newData[key] = list
    })
    return newData
}).catch(e => {})
export default {
  configNodeList: {
        label: '',
        span: 24,
        component: AFormTable,
        attrs: {
          maxLength: 10,
          hasAdd: true,
          watchKey: 'kpiType',
          columns: {
            startNode: {
              title: '考核起算节点',
              required: true,
              width: 200,
              component: ASelect,
              attrs: {
                watchKey: 'kpiType',
                getOptions: async({field}) => {
                    const data =  await getSLAOptions
                    const kpiType = field.getValue('kpiType')
                    return kpiType == '1' ? data.inStockNodeStart : data.outStockNodeStart
                }
              },
              edit: true
            },
            endNode: {
              title: '考核止算节点',
              required: true,
              width: 200,
              component: ASelect,
              attrs: {
                watchKey: 'kpiType',
                getOptions: async({field}) => {
                    const data =  await getSLAOptions
                    const kpiType = field.getValue('kpiType')
                    return kpiType == '1' ? data.inStockNodeStop : data.outStockNodeStop
                }
              },
              edit: true
            },
            ruleCondition: {
                title: '规则条件',
                required: true,
                width: 200,
                component: ASelect,
                attrs: {
                  getOptions: async() => {
                      const data =  await getSLAOptions
                      return data.ruleComparator
                  }
                },
                edit: true
            },
            ruleTimeLen: {
                title: '时长',
                required: true,
                width: 200,
                edit: true,
                component: NumberPicker,
                attrs: {
                  min: 0,
                }
            },
            ruleUnit: {
                title: '时长单位',
                required: true,
                width: 200,
                component: ASelect,
                edit: true,
                attrs: {
                  getOptions: async() => {
                      const data =  await getSLAOptions
                      return data.timeUnit
                  }
                },
            },
            
          }
        }
    }
}

