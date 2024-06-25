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
    delegateNo: {
        label: '出库委托号',
        attrs: {
            placeholder: '出库委托号',
        }
    },
    referOrderId: {
        label: '交易订单号',
        attrs: {
            placeholder: '交易订单号'
        }
    },

    endMailNo: {
        label: '末端面单号',
        attrs: {
            placeholder: '末端面单号'
        }
    },
    name: {
        label: '收货人姓名',
        attrs: {
            placeholder: '收货人姓名'
        }
    },
    mobile: {
        label: '手机号',
        attrs: {
            placeholder: '手机号'
        }
    },
    status: {
        label: '订单状态',
        component: ASelect,
        attrs: {
            showSearch: true,
            getOptions: getASelectOptions('orderCarriageStatus')
        }
    },
    exceptionType: {
        label: '异常类型',
        component: ASelect,
        attrs: {
            showSearch: true,
            getOptions: getASelectOptions('orderExceptionType')
        }
    },
    regionCode: {
        label: '国家',
        component: ASelect,
        attrs: {
            showSearch: true,
            getOptions: getASelectOptions('COUNTRY')
        }
    },
    lastMileChannel: {
        label: '渠道',
        component: ASelect,
        attrs: {
            showSearch: true,
            getOptions: getASelectOptions('LOGISTICS_CHANNEL')
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
    referUserId: {
        label: '买家会员号',
        attrs: {
            placeholder: '买家会员号'
        }
    },
    referLogisticsOrderCode: {
        label: '平台跟踪号',
        attrs: {
            placeholder: '平台跟踪号'
        }
    },
}

// 表头配置
export const columns = {
    delegateNo: {
        title: '出库委托号',
    },

    referOrderId: {
        title: '订单交易号',
    },
    endMailNo: {
        title: '末端面单号',
    },
    referUserId: {
        title: '买家会员号',
    },

    status: {
        title: '订单状态',
        cell: function(val) {
            return <ASelect
            isDetail
            defaultValue={val}
            value={val}
            getOptions={getASelectOptions('orderCarriageStatus')}
        ></ASelect>
        }
    },
    name: {
        title: '收件人姓名',
    },
    endCarrierCode: {
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
    countryCode: {
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
        cell: function(val) {
            return <ASelect
            isDetail
            defaultValue={val}
            value={val}
            getOptions={getASelectOptions('orderExceptionType')}
        ></ASelect>
        }
    },
    repack: {
      title: '是否拆包',
    },
    repackOperator: {
      title: '拆包操作人'
    },
    createTime: {
        title: '生成时间',
    },
    totalWeight: {
      title: '重量(g)',
    },
    boxLength: {
      title: '长（cm）',
    },
    boxWidth: {
      title: '宽(cm)',
    },
    boxHeight: {
      title: '高(cm)',
    },
    timeEfficiencyType: {
      title: '时效类型',
    },
    bbOperMark: {
      title: '是否包包直邮',
    },
    groupServiceOrderCode: {
      title: '拼团团号',
    },
    totalOrderActualPrice: {
      title: '订单货值',
    },
    orderDetail_make: {
        title: '操作',
        lock:"right"
    },
}