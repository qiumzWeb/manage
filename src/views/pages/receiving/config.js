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
    batchCode: {
        label: '收货批次号',
        attrs: {
            placeholder: '收货批次号',
        }
    },
    deliveryCode: {
        label: '包裹运单号',
        attrs: {
            placeholder: '包裹运单号',
        }
    },
    logisticsChannelCode: {
        label: '物流公司编码',
        component: ASelect,
        attrs: {
            showSearch: true,
            getOptions: async(props) => {
                const res = await $http({
                    url: '/pcsweb/task/logisticCode/list',
                    method: 'get',
                    oldApi: true,
                })
                const opts = []
                const list = res.dataList || []
                for(let a of list) {
                    const getOpt = await getDictionaryData
                    const label = getOpt['logisticsCompany'][a.code] || a.code
                    opts.push({
                        label,
                        value: a.code
                    })
                }
                return opts
            }
        }
    },
    carTitles: {
        label: '快递车封号', 
        attrs: {
            placeholder: '快递车封号',
        }
    },	
    receiverTime: {
        label: '签收起止时间',
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
    batchCode: {
        title: '收货批次号',
    },
    carTitles: {
        title: '快递车封号',
    },
    deliveryCode: {
        title: '包裹运单号',
    },
    packageStatus: {
        title: '包裹状态',
        cell: function(val) {
            return <ASelect
            isDetail
            value={val}
            getOptions={getASelectOptions('packageStatus')}
        ></ASelect>
        }
    },
    logisticsCode: {
        title: '物流公司编码',
        cell: function(val) {
            return <ASelect
            isDetail
            value={val}
            getOptions={getASelectOptions('logisticsCompany')}
        ></ASelect>
        }
    },
    operatUser: {
        title: '签收员',
    },
    operatTime: {
        title: '签收时间',
    },
    storeCode: {
        title: '上架库位',
    },
    onShelvesTime: {
        title: '上架时间',
    },
    bigBagCode: {
        title: '大包号',
    },
}