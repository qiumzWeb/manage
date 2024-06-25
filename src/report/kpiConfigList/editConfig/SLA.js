import React from 'react'
import { TimePicker2, Input  } from '@/component'
import ASelect from '@/component/ASelect/index'
import AFormTable from '@/component/AFormTable'
import $http from 'assets/js/ajax'
import {slaEnableOptions} from '@/report/options'
import { _uid, isEmpty } from 'assets/js'
export const getSLAOptions = $http({
    url: '/sys/kpiConfig/getSlaConfigEnum',
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
// 时效考核节点 出入库

// allot_effect: "播种时效"
// merge_effect: "合箱时效"
// offshelves_effect: "下架时效"
// pack_effect: "组包时效"

// sign_effect: "签收时效"
// instock_effect: "入库时效"
// onshelves_effect: "上架时效"
export const kpiTypeSlaNode = {
  1: ['sign_effect', 'instock_effect', 'onshelves_effect'], // KPI类型选择【入库】，考核环节枚举值：签收时效、入库时效、上架时效；
  2: ['allot_effect', 'merge_effect', 'offshelves_effect', 'pack_effect'] // KPI类型选择【出库】，考核环节枚举值：下架时效、播种时效、合箱时效、组包时效；
}
let kpiType = ''
let SLaListFields = []
export default {
    slaEnable: {
        label: 'SLA是否启用',
        component: ASelect,
        defaultValue: '0',
        attrs: {
            getOptions: async() => {
                return slaEnableOptions
            }
        }
    },
    slaConfig: {
        label: '',
        show: data => {
          if (kpiType != data.kpiType) {
            kpiType = data.kpiType
            SLaListFields.forEach(f => {
              f.setValue('watchKey', _uid())
              f.setValue('slaNode', '')
            })
          }
          return data.slaEnable == 1
        },
        span: 24,
        component: AFormTable,
        attrs: {
            maxLength: 7,
            hasAdd: true,
            excludeKeys: ['fields', 'watchKey'],
            columns: {
                slaNode: {
                  title: '考核环节',
                  required: true,
                  width: 200,
                  component: React.forwardRef(function SLANODE(props, ref){
                    const { fields } = props
                    SLaListFields = fields
                    return <ASelect ref={ref} {...props}></ASelect>
                  }),
                  attrs: {
                    getOptions: async({field, action, fields}) => {
                        field.setValue('fields', fields)
                        if (action === 0) { //初始化
                          fields && fields.forEach((f,i) => {
                            f.setValue('watchKey', _uid())
                          })
                        }
                        const data =  await getSLAOptions
                        return data.slaNodeMap.filter(f => (kpiTypeSlaNode[kpiType]).includes(f.value))
                    },
                    formatOptions: (value, options, field) => {
                      const fields = field.getValue('fields')
                      const hasSelectedKeys = fields && fields.map(f => f.getValues().slaNode).filter(f => f) || []
                      return options.map(o => ({
                        ...o,
                        disabled: hasSelectedKeys.some(h => h == o.value)
                      }))
                    },
                    watchKey: 'watchKey',
                    onChange: (val, index, field) => {
                      const {fields} = field.getValues()
                      Array.isArray(fields) && fields.forEach((f,i) => {
                        if (i !== index) {
                          f.setValue('watchKey', _uid())
                        }
                      })
                    },
                  },
                  edit: true
                },
                startNode: {
                  title: '开始节点',
                  required: true,
                  width: 200,
                  component: ASelect,
                  attrs: {
                    getOptions: async() => {
                        const data =  await getSLAOptions
                        return data.slaNodeFinishMap
                    }
                  },
                  edit: true
                },
                endNode: {
                  title: '结束节点',
                  required: true,
                  width: 200,
                  component: ASelect,
                  attrs: {
                    getOptions: async() => {
                        const data =  await getSLAOptions
                        return data.slaNodeFinishMap
                    }
                  },
                  edit: true
                },
                timeType: {
                    title: '考核时效类型',
                    required: true,
                    width: 200,
                    component: ASelect,
                    attrs: {
                        getOptions: async() => {
                            const data =  await getSLAOptions
                            return data.timeTypeMap
                        },
                        onChange: (val, index, field) => {
                            field.setValue('timeTypeSub', '')
                            field.setValue('time', '')
                        }
                      },
                    edit: true
                },
                timeTypeSub: {
                    title: '时间类型',
                    width: 200,
                    component: React.forwardRef(function timeTypeSub(props, ref){
                        const { field } = props
                        const type = field.getValue('timeType')
                        if (type == '1') return <ASelect {...props} getOptions={async() => {
                            const data =  await getSLAOptions
                            return data.timeTypeSubMap
                        }}></ASelect>
                        return null
                    }),
                    validate: [{key: 'timeTypeSub', cb: (val, record, list) => {
                        if (record.timeType == 1 && !val) return '请选择时间类型'
                    }}],
                    edit: true,
                },
                time: {
                    title: '考核时间',
                    required: true,
                    width: 200,
                    component: React.forwardRef(function timeTypeSub(props, ref){
                        const { field } = props
                        const type = field.getValue('timeType')
                        if (type == '1') return <TimePicker2 {...props}></TimePicker2>
                        return <Input
                          htmlType="number"
                          addonTextAfter={'分钟'}
                          placeholder="请输入整数"
                          onKeyDown={(e) => {
                            if (/\-|\./.test(e.key)) {
                              e.preventDefault()
                            }
                          }}
                          {...props}
                        ></Input>
                    }),
                    edit: true
                },
                
              }
        }
    }
}

