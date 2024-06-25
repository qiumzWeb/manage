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
    delegationOrderNo: {
        label: '出库委托号',
        attrs: {
            placeholder: '出库委托号',
        }
    },
    regionCode: {
        label: '目的国家',
        component: ASelect,
        attrs: {
            showSearch: true,
            getOptions: getASelectOptions('COUNTRY')
        }
    },
    endCarrierCode: {
        label: '渠道',
        component: ASelect,
        attrs: {
            showSearch: true,
            watchKey: 'regionCode',
            getOptions: async(props) => {
                const {field} = props
                const country = field.getValue('regionCode')
                if (!country) return []
                const res = await $http({
                    url: '/pcsweb/baseData/channelList',
                    method: 'get',
                    oldApi: true,
                    data: {
                        regionCode: country
                    }
                })
                const opts = []
                const list = res.dataList || []
                for(let a of list) {
                    const getOpt = await getDictionaryData
                    const label = getOpt['LOGISTICS_CHANNEL'][a.code] || a.code
                    opts.push({
                        label,
                        value: a.code
                    })
                }
                return opts
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
    operateUser: {
        label: '打单人',
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
    trackingNumber: {
        label: '面单号', 
        attrs: {
            placeholder: '面单号',
        }
    },
    serviceType: {
        label: '业务类型',
        component: ASelect,
        attrs: {
            showSearch: true,
            getOptions: getASelectOptions('carrierType')
        }
    },
    printOrderTime: {
        label: '打单起止时间',
        fixedSpan: 22,
        component: DatePicker2.RangePicker,
        attrs: {
            format: "YYYY/MM/DD HH:mm:ss",
            showTime: true
        }
    },
    orderCreateTime: {
        label: '订单起止时间',
        fixedSpan: 22,
        component: DatePicker2.RangePicker,
        attrs: {
            format: "YYYY/MM/DD HH:mm:ss",
            showTime: true
        }
    },
}

// 表头配置
export const columns = {
    delegationOrderNo: {
        title: '出库委托号',
    },
    logisticsChannelCode: {
        title: '渠道',
        cell: function(val) {
            return <ASelect isDetail defaultValue={val} value={val} getOptions={getASelectOptions('LOGISTICS_CHANNEL')}></ASelect>
        }
    },
    deliveryType: {
        title: '派送类型',
        cell: function(val) {
            return <ASelect isDetail value={val} getOptions={getASelectOptions('deliveryType')}></ASelect>
        }
    },
    regionCode: {
        title: '目的国家',
        cell: function(val) {
            return <ASelect isDetail value={val} getOptions={getASelectOptions('COUNTRY')}></ASelect>
        }
    },
    trackingNumber: {
        title: '面单号',
    },
    printPersonId: {
        title: '打单人',
    },
    orderCreateTime: {
        title: '订单生成时间',
    }

}