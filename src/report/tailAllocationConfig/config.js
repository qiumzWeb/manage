import React from 'react'
import $http from 'assets/js/ajax'
import ASelect from '@/component/ASelect'
import { DatePicker2, NumberPicker, AFormTable, TimePicker2 } from '@/component';
import { getWid, isEmpty, getStringCodeToArray } from 'assets/js'
import { Input } from '@/component'
import API from 'assets/api'
import dayjs from 'dayjs'


// 查询接口
export const searchUrl = '/sys/sortingConfig/pageData'

// 新增接口
export const addUrl = '/sys/sortingConfig/newConfig'

// 修改接口 
export const modifyUrl = '/sys/sortingConfig/updConfig'

// 删除接口
export const deleteUrl = '/sys/sortingConfig/delConfig/'

export const getDictionaryData = (warehouseId) => new Promise(resolve => {
    $http({
        url: API.getDistrictScopeList,
        method: 'get',
        data: {
            districtType: '2',
            warehouseId
        }
    }).then(data => {
        let list = data && data.data || []
        resolve(list.map(l => ({
            ...l,
            value: l.code,
            label: l.name
        })))
    })
})

// 是否 选项
const yesNoType = [
    { "label": "否", "value": 0 },
    { "label": "是", "value": 1 }
];

// 查询的字段
export const qSearch = [
    {
        warehouseId: {
            label: '仓库名称',
            defaultValue: getWid(),
            component: ASelect,
            attrs: {
                // 是否可以清空
                hasClear: false
            }
        }
    }
]

// 列表
export const tColumns = {
    warehouseName: {
        // 列名
        title: '仓库名称',
        // 固定
        lock: 'left'
    },
    name: {
        title: '配置名称',
    },
    recommendTail: {
        title: '是否推荐尾包容器号',
        cell: val => <ASelect value={val} getOptions={async () => yesNoType} defaultValue="-" isDetail></ASelect>
    },
    validateTail: {
        title: '是否校验尾包容器号',
        cell: val => <ASelect value={val} getOptions={async () => yesNoType} defaultValue="-" isDetail></ASelect>
    },
    startTime: {
        title: '推荐开始时间',
        width: 100,
        listKey: 'recommendTime',
    },
    endTime: {
        title: '推荐结束时间',
        width: 100,
        listKey: 'recommendTime',
    },
    updaterName: {
        title: '操作人',
        width: 120,
    },
    gmtModified: {
        title: '操作时间',
        width: 130,
    },
    make: {
        title: '操作',
        lock: 'right'
    }
}

// 推荐起始时间配置
export const recommendConfig = {
    startEndTime: {
        title: '推荐起始时间',
        required: true,
        useDetailValue: true,
        transTimeCode: ['startTime', 'endTime'],
        format: ['HH:mm:ss', 'HH:mm:ss'],
        component: TimePicker2.RangePicker,
        validate: [{ key: 'startTime', msg: '推荐开始时间必填' }, { key: 'endTime', msg: '推荐结束时间必填' }],
        attrs: {
            format: 'HH:mm:ss',
        },
        edit: true
    }
}

// 新增/修改
export const formModel = [
    {
        warehouseId: {
            // 名称
            label: '仓库名称',
            // 默认值
            defaultValue: getWid(),
            // 是否必填
            required: true,
            // 组件
            component: ASelect,
            disabled: data => !data.isAdd,
            attrs: {
                hasClear: false,
                onChange: (val, vm, action) => {
                    vm.setOpenData({ invConfig: val })
                    if (action) {
                        vm.field.setValue('cycleCountRange', [])
                    }
                }
            }
        },
        name: {
            label: '配置名称',
        },
        recommendTail: {
            label: '是否推荐尾包容器号',
            component: ASelect,
            required: true,
            attrs: {
                getOptions: async () => {
                    return yesNoType;
                },
            }
        },
        validateTail: {
            label: '是否校验尾包容器号',
            component: ASelect,
            show: (data) => {
                return data.recommendTail == 1;
            },
            required: true,
            attrs: {
                getOptions: async () => {
                    return yesNoType;
                },
            }
        },
        recommendTime: {
            label: '',
            span: 24,
            component: AFormTable,
            show: (data) => {
                return data.recommendTail == 1;
            },
            attrs: {
                columns: recommendConfig,
                hasAdd: true,
                maxLength: 5,
            }
        }
    }
]
