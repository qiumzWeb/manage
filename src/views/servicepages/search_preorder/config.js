import React from 'react'
import {getDictionaryData, getASelectOptions} from '../config'
import ASelect from '@/component/ASelect'
import { DatePicker2 } from '@/component'
import {getWid} from 'assets/js'
import moment from 'moment'
import $http from 'assets/js/ajax'
import { orderPlatformOptions } from '@/report/options'
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
    createTime: {
        label: '生成起止时间',
        fixedSpan: 22,
        component: DatePicker2.RangePicker,
        defaultValue: [moment().subtract(1, 'day'), moment()],
        attrs: {
            format: "YYYY/MM/DD HH:mm:ss",
            showTime: true
        }
    },
    mailNo: {
        label: '包裹运单号',
        attrs: {
            placeholder: '包裹运单号',
        }
    },
    referOrderId: {
        label: '订单交易号',
        attrs: {
            placeholder: '订单交易号'
        }
    },
    referUserId: {
        label: '买家会员号',
        attrs: {
            placeholder: '买家会员号'
        }
    },
    mobile: {
        label: '买家手机号',
        attrs: {
            placeholder: '买家手机号'
        }
    },
    referCode: {
        label: '买家识别码',
        attrs: {
            placeholder: '买家识别码'
        }
    },
    status: {
        label: '包裹状态',
        component: ASelect,
        attrs: {
            showSearch: true,
            getOptions: getASelectOptions('packageStatus')
        }
    },
    source: {
        label: '平台类型',
        component: ASelect,
        attrs: {
            showSearch: true,
            getOptions: getASelectOptions('platformCode')
        }
    },
    referLogisticsOrderCode: {
      label: '平台跟踪号',
      attrs: {
          placeholder: '平台跟踪号'
      }
    },
    packageType: {
        label: '包裹类型',
        component: ASelect,
        attrs: {
            showSearch: true,
            getOptions: getASelectOptions('packageType')
        }
    },
    carrierType: {
        label: '运输类型',
        component: ASelect,
        attrs: {
            showSearch: true,
            getOptions: getASelectOptions('carrierType')
        }
    },
}

// 表头配置
export const columns = {
    mailNo: {
        title: '包裹运单号',
    },

    referOrderId: {
        title: '订单交易号',
    },
    source: {
        title: '平台类型',
        cell: function(val) {
            return <ASelect
            isDetail
            defaultValue={val}
            value={val}
            getOptions={getASelectOptions('platformCode')}
        ></ASelect>
        }
    },
    referUserId: {
        title: '买家会员号',
    },

    status: {
        title: '包裹状态',
        cell: function(val) {
            return <ASelect
            isDetail
            defaultValue={val}
            value={val}
            getOptions={getASelectOptions('packageStatus')}
        ></ASelect>
        }
    },
    packageType: {
        title: '包裹类型',
        cell: function(val) {
            return <ASelect
            isDetail
            defaultValue={val}
            value={val}
            getOptions={getASelectOptions('packageType')}
        ></ASelect>
        }
    },
    referCode: {
        title: '买家识别码'
    },
    weight: {
        title: '包裹实重',
        cell: (val,index, record) => {
            return val ? val + record.weightUnit : ''
        }
    },
    storeCode: {
        title: '库位号',
    },
    receiverRegionCode: {
        title: '国家',
        cell: function(val) {
            return <ASelect
            isDetail
            defaultValue={val}
            value={val}
            getOptions={getASelectOptions('COUNTRY')}
        ></ASelect>
        }
    },
    exceptionType: {
        title: '异常状态',
        cell: function(val, index, record) {
            const value = record.parcelFounded && record.parcelFounded === 'N' ? '少货' : val
            return <ASelect
            isDetail
            defaultValue={value}
            value={value}
            getOptions={getASelectOptions('packageExceptionType')}
        ></ASelect>
        }
    },
    createTime: {
        title: '生成时间',
    },
    packageDetail_make: {
        title: '操作',
        lock:"right"
    },
}