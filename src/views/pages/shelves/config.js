
import React from 'react'
import {getDictionaryData, getASelectOptions} from '../config'
import ASelect from '@/component/ASelect'
import { DatePicker2 } from '@/component'
import {getWid} from 'assets/js'
import moment from 'moment'
import $http from 'assets/js/ajax'
// 查询配置
export const searchModel = {
    warehouseId: {
        label: '仓库名称',
        component: ASelect,
        defaultValue: getWid(),
        attrs: {
            hasClear: false
        }
    },
    deliveryCode: {
        label: '包裹运单号',
        attrs: {
            placeholder: '包裹运单号',
        }
    },
    packageType: {
        label: '包裹类型',
        component: ASelect,
        attrs: {
            getOptions: async() => {
                return [
                    {value: 'Normal', label: '正常包裹'},
                    {value: 'NoPrealert', label: '无预报包裹'}
                ]
            }
        }
    },
    roadwayId: {
        label: '库区/巷道',
        component: ASelect,
        attrs: {
            showSearch: true,
            getOptions: getASelectOptions('roadway')
        }
    },
    operatUser: {
        label: '上架操作员',
        component: ASelect,
        attrs: {
            showSearch: true,
            watchKey: 'roadwayId',
            getOptions: async(props) => {
                const {field} = props
                const roadway = field.getValue('roadwayId')
                if (!roadway) return []
                const res = await $http({
                    url: '/pcsweb/baseData/employeeList',
                    method: 'get',
                    oldApi: true,
                    data: {
                        roadWayIds: roadway
                    }
                })
                const list = res.dataList || []
                return list.map(l => ({
                    value: l.employeeId,
                    label: l.employeeName
                }))
            }
        }
    },
    shelvesTime: {
        label: '上架起止时间',
        fixedSpan: 22,
        component: DatePicker2.RangePicker,
        defaultValue: [moment().subtract(1, 'day'), moment()],
        attrs: {
            format: "YYYY/MM/DD HH:mm:ss",
            showTime: true
        }
    },
}

// 表头配置
export const columns = {

    deliveryCode: {
        title: '包裹运单号',
    },
    numberBook: {
        title: '号码簿',
    },
    recommendStoreCode: {
        title: '推荐库位',
    },
    storeCode: {
        title: '上架库位',
    },
    roadwayName: {
        title: '库区/巷道',
    },
    operatUser: {
        title: '上架操作员',
    },
    operatTime: {
        title: '上架时间',
    },
}