import React from 'react'
import {getDictionaryData, getASelectOptions} from '../../config'
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
    completeTime: {
        label: '处理完结起止时间',
        fixedSpan: 22,
        component: DatePicker2.RangePicker,
        attrs: {
            format: "YYYY/MM/DD HH:mm:ss",
            showTime: true
        }
    },
    lastmileChannel: {
        label: '渠道',
        component: ASelect,
        attrs: {
            getOptions: getASelectOptions('LOGISTICS_CHANNEL'),
        }
    },
    exceptionType: {
        label: '异常类型',
        component: ASelect,
        attrs: {
            getOptions: getASelectOptions('orderExceptionType'),
        }
    },
    delegationNo: {
        label: '出库委托号',
        attrs: {
            placeholder: '出库委托号',
        }
    },
    referOrderId: {
        label: '交易订单号',
        attrs: {
            placeholder: '交易订单号',
        }
    },

}

// 表头配置
export const columns = {
    taskNo: {
        title: '任务号'
    },
    referOrderId: {
        title: '交易订单号',
    },
    delegationNo: {
        title: '出库委托号'
    },
    lastmileChannel: {
        title: '渠道',
        cell: function(val) {
            return <ASelect
            isDetail
            defaultValue={val}
            value={val}
            getOptions={getASelectOptions('LOGISTICS_CHANNEL')}
        ></ASelect>
        }
    },
    orderCreateTime: {
        title: '订单生成时间'
    },
    orderCreateTime: {
        title: '入库时间'
    },
    exceptionType: {
        title: '异常类型',
        cell: function(val) {
            return <ASelect
            isDetail
            value={val}
            defaultValue={val}
            getOptions={getASelectOptions('orderExceptionType')}
        ></ASelect>
        }
    },
    taskAssignTime: {
        title: '分配时间'
    },
    processerName: {
        title: '处理人账号'
    },
    completeTime: {
        title: '完结时间'
    },
    processDuration: {
        title: '处理时长'
    },

}