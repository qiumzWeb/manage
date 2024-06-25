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
    deliveryType: {
        label: '派送类型',
        component: ASelect,
        attrs: {
            getOptions: getASelectOptions('deliveryType')
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
    roadwayIdStart: {
        label: '起始巷道',
        attrs: {
            placeholder: '起始巷道',
        }
    },
    roadwayIdEnd: {
        label: '结束巷道',
        attrs: {
            placeholder: '结束巷道',
        }
    },
    singleParcel: {
      label: '单票/多票',
      component: ASelect,
      defaultValue: '0',
      attrs: {
          getOptions: async() => {
              return [
                  {label: "多票", value: "0"},
                  {label: "单票", value: "1"}
              ]
          }
      }
    },
    interceptStatus: {
      label: '订单拦截状态',
      component: ASelect,
      defaultValue: '0',
      attrs: {
          getOptions: async() => {
              return [
                  {label: "未拦截", value: "0"},
                  {label: "已拦截", value: "1"}
              ]
          }
      }
    },
    dutyGroupId: {
        label: '责任组',
        component: ASelect,
        attrs: {
            showSearch: true,
            watchKey: 'warehouseId',
            getOptions: async(props) => {
                const {field} = props
                const a = field.getValue('warehouseId')
                if (!a) return []
                const res = await $http({
                    url: '/pcsweb/baseData/dutyGroupList',
                    method: 'get',
                    oldApi: true,
                    data: {
                        warehouseId: a
                    }
                })
                const list = res.dataList || []
                return list.map(l => ({
                    value: l.dutyGroupId,
                    label: l.dutyGroupName
                }))
            }
        }
    },
    endCarrierCode: {
        label: '渠道',
        component: ASelect,
        attrs: {
            showSearch: true,
            getOptions: getASelectOptions('LOGISTICS_CHANNEL')
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
    sortCodes: {
        label: '分拣码',
        component: ASelect,
        attrs: {
            showSearch: true,
            mode: 'multiple',
            getOptions: async(props) => {
                const res = await $http({
                    url: '/pcsweb/baseData/sortCodeList',
                    method: 'get',
                    oldApi: true,
                })
                const list = res.dataList || []
                return list.map(l => ({
                    value: l.code,
                    label: l.code
                }))
            }
        }
    },
    taskTime: {
        label: '任务起止时间',
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
    endCarrier: {
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
    deliveryType: {
        title: '派送类型',
        cell: function(val) {
            return <ASelect
            isDetail
            value={val}
            defaultValue={val}
            getOptions={getASelectOptions('deliveryType')}
        ></ASelect>
        }
    },
    regionCode: {
        title: '目的国家',
        cell: function(val) {
            return <ASelect
            isDetail
            value={val}
            defaultValue={val}
            getOptions={getASelectOptions('COUNTRY')}
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
    interceptStatus: {
        title: '拦截状态',
        cell: function(val) {
            return <ASelect
            isDetail
            value={val}
            defaultValue={val}
            getOptions={getASelectOptions('AllocationInterceptStatus')}
        ></ASelect>
        }
    },
    sortCode: {
        title: '分拣码',
    },
    taskCreateTime: {
        title: '任务创建时间',
    },
    orderCreateTime: {
        title: '订单生成时间',
    },

}