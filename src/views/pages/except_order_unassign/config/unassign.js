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
    exceptionType: {
        label: '异常类型',
        component: ASelect,
        attrs: {
            getOptions: getASelectOptions('orderExceptionType'),
        }
    },
    processResultType: {
        label: '处理结果类型',
        component: ASelect,
        attrs: {
            getOptions: getASelectOptions('orderExceptionProcessResultType'),
        }
    },
    delegationOrderNo: {
        label: '出库委托号',
        attrs: {
            placeholder: '出库委托号',
        }
    },
    countryCode: {
      label: '目的国家',
      component: ASelect,
      attrs: {
          showSearch: true,
          getOptions: getASelectOptions('COUNTRY')
      }
    },
    orderTime: {
        label: '订单生成时段起止时间',
        fixedSpan: 24,
        component: DatePicker2.RangePicker,
        attrs: {
            format: "YYYY/MM/DD HH:mm:ss",
            showTime: true
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
    channelCode: {
        label: '渠道',
        component: ASelect,
        attrs: {
            showSearch: true,
            watchKey: 'countryCode',
            getOptions: async(props) => {
                const {field} = props
                const country = field.getValue('countryCode')
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
    singleParcel: {
      label: '订单票类型',
      component: ASelect,
      defaultValue: '0',
      attrs: {
          getOptions: async() => {
              return [
                  {value: '0', label: '多票'},
                  {value: '1', label: '单票'}
              ]
          }
      }
    },
    roadwayBegin: {
        label: '起始巷道',
        attrs: {
            placeholder: '起始巷道',
        }
    },
    roadwayEnd: {
        label: '结束巷道',
        attrs: {
            placeholder: '结束巷道',
        }
    },
    carrierType: {
        label: '业务类型',
        component: ASelect,
        attrs: {
            showSearch: true,
            getOptions: getASelectOptions('carrierType')
        }
    },
}

// 表头配置
export const columns = {
    delegationOrderNo: {
        title: '出库委托号',
    },
    orderTime: {
        title: '订单生成时间'
    },
    channelCode: {
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
    roadwayId: {
        title: '库区/巷道',
        cell: function(val) {
            return <ASelect
            isDetail
            value={val}
            defaultValue={val}
            getOptions={getASelectOptions('roadway')}
        ></ASelect>
        }
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
    exceptionTime: {
        title: '异常发生时间'
    },
    processResultType: {
        title: '处理结果类型',
        cell: function(val) {
            return <ASelect
            isDetail
            value={val}
            defaultValue={val}
            getOptions={getASelectOptions('orderExceptionProcessResultType')}
        ></ASelect>
        }
    },

}