import React from 'react'
import {getDictionaryData, getASelectOptions} from '../config'
import ASelect from '@/component/ASelect'
import { DatePicker2 } from '@/component'
import {getWid} from 'assets/js'
import moment from 'moment'
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
    regionCode: {
        label: '目的国家',
        component: ASelect,
        attrs: {
            showSearch: true,
            getOptions: getASelectOptions('COUNTRY')
        }
    },
    delegationNo: {
        label: '入库委托号',
        attrs: {
            placeholder: '入库委托号',
        }
    },	
    mailNo: {
        label: '包裹运单号', 
        attrs: {
            placeholder: '包裹运单号',
        }
    },	
    orderCreateTime: {
        label: '包裹起止时间',
        fixedSpan: 22,
        component: DatePicker2.RangePicker,
        defaultValue: [moment().subtract(1, 'day'), moment()],
        attrs: {
            format: "YYYY/MM/DD HH:mm:ss",
            showTime: true
        }
    },
    serviceType: {
        label: '业务类型',
        component: ASelect,
        attrs: {
            showSearch: true,
            getOptions: getASelectOptions('carrierType')
        }
    }
}

// 表头配置
export const columns = {
    delegationNo: {
        title: '入库委托号',
    },
    mailNo: {
        title: '包裹运单号',
    },
    recommendStoreCode: {
        title: '推荐库位',
    },
    orderCreateTime: {
        title: '包裹生成时间',
    },
    inboundTime: {
        title: '入库时间',
    },
    packageStatus: {
        title: '包裹状态',
        cell: function(val) {
            return <ASelect isDetail value={val} getOptions={getASelectOptions('packageStatus')}></ASelect>
        }
    },
    regionCode: {
        title: '目的国家',
        cell: function(val) {
            return <ASelect isDetail value={val} getOptions={getASelectOptions('COUNTRY')}></ASelect>
        }
    }
}