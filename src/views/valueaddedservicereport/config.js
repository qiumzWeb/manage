import { DatePicker, Input } from '@/component'
import ASelect from '@/component/ASelect/index'
import {getWid} from 'assets/js'
import moment from 'moment'
import $http from 'assets/js/ajax'
const getServiceTypeOptions = $http({
    url: `/pcsapiweb/value/addedServices/get`,
    method: 'get',
  })

export const searchUrl = '/value/added/services/list'
export const packageTypeOptions = [
    {label: '一段包裹', value: 'P'},
    {label: '二段订单', value: 'O'}
]
export const qSearch = {
    warehouseId: {
        label: '仓库名称',
        component: ASelect,
        attrs: {
            defaultValue: getWid(),
            hasClear: false
        }
    },
    type: {
        label: '包裹类型',
        component: ASelect,
        attrs: {
            getOptions: async() => {
                return packageTypeOptions
            },
            defaultValue: 'P',
            hasClear: false
        }
    },
    orderCode: {
        label: '包裹号',
    },
    settlementCode: {
        label: '服务类型',
        component: ASelect,
        attrs: {
            getOptions: async() => {
                const list = await getServiceTypeOptions
                return Array.isArray(list) && list.map(s => ({
                    ...s,
                    label: `${s.serviceType}-${s.serviceItem}`,
                    value: s.settlementCode
                })) || []
            }
        }
    },
    time: {
        label: '创建时间',
        fixedSpan: 21,
        component: DatePicker.RangePicker,
        attrs: {
            showTime: true,
            defaultValue: [moment().subtract(7, 'days'), moment()],
        }
    }
}

export const qColumns = {
    warehouseName: {
        title: '仓库名称',
        width: 160,
        lock:'left'
    },
    orderCode: {
        title: '包裹号',
        width: 200,
    },
    serviceItem: {
        width: 200,
        title: '服务项',
    },
    usageAmount: {
        width: 100,
        title: '使用量'
    },
    settlementCode: {
        width: 200,
        title: '结算元数据'
    },
    weight: {
        width: 100,
        title: '重量(g)'
    },
    length: {
        width: 100,
        title: '长（cm）'
    },
    width: {
        width: 100,
        title: '宽（cm）'
    },
    height: {
        width: 100,
        title: '高（cm）'
    },
    operator: {
        width: 150,
        title: '操作人'
    },
    gmtCreate: {
        width: 120,
        title: '操作时间'
    },
}
