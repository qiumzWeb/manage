import React from 'react'
import {getWid} from 'assets/js'
import ASelect from '@/component/ASelect'
import { defaultSearchTime } from '@/report/utils'
import { DatePicker2 } from '@/component'
import { searchRangeOption, driftType } from '@/report/options'
import { getDistrictGroup } from '@/report/apiOptions'

// 查询接口
export const searchApiUrl = 'package/drift/list'

// 查询条件
export const qSearch = [
    {
        warehouseId: {
            label: '仓库名称',
            defaultValue: getWid(),
            component: ASelect,
            attrs: {
                hasClear: false
            }
        },
        searchRangeType: {
            label: '统计维度',
            defaultValue: '0',
            component: ASelect,
            needExpandToData: true,
            attrs: {
                hasClear: false,
                getOptions: async() => {
                    return searchRangeOption
                }
            }
        },
        shelvesDistrictGroupIdList: {
            label: '漂移库区组维度',
            component: ASelect,
            show: data => data.searchRangeType === '1',
            attrs: {
                mode: 'multiple',
                placeholder: '请选择',
                watchKey: 'warehouseId',
                getOptions: async({field}) => {
                    const values = field.getValues()
                    const {data} = await getDistrictGroup(values)
                    return Array.isArray(data) && data.map(d => ({
                        label: d.name,
                        value: d.code
                    })) || []
                }
            }
        },
        shelvesDistrictIdList: {
            label: '漂移库区维度',
            component: ASelect,
            show: data => data.searchRangeType === '2',
            attrs: {
              mode: 'multiple',
              watchKey: 'warehouseId',
              getOptions: async({field}) => {
                const values = field.getValues()
                const {data} = await getDistrictGroup(values)
                return Array.isArray(data) && data.map(d => ({
                  label: d.name,
                  value: d.code
                })) || []
              }
            }
          },
        makeTime: {
            label: '统计时间',
            fixedSpan: 22,
            needExpandToData: true,
            defaultValue: defaultSearchTime,
            component: DatePicker2.RangePicker,
            transTimeCode: ['startTime', 'endTime'],
            format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
            attrs: {
            format: 'YYYY-MM-DD HH:mm:ss',
            hasClear:false,
            showTime: true,
            }
        },
        driftType: {
            label: '漂移类型',
            component: ASelect,
            needExpandToData: true,
            attrs: {
                hasClear: true,
                getOptions: async() => {
                    return driftType
                }
            }
        }
    }
]

// 列表
export const tColumns = {
    warehouseName: {
        title: '仓库名称'
    },
    deliveryCode: {
        title: '包裹运单号'
    },
    driftTypeName: {
        title: '漂移类型'
    },
    searchRangeTypeName: {
        title: '统计维度',
    },
    shelvesDistrictGroupName: {
        title: '漂移库区组'
    },
    shelvesDistrictName: {
        title: '漂移库区'
    },
    recommendDistrictName: {
        title: '应上库区'
    },
    operationName: {
        title: '上架操作人'
    },
    instockOperateName: {
        title: '入库操作人'
    },
    operatingTime: {
        title: '操作时间'
    }
}