
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
    waveNo: {
        label: '波次号',
        attrs: {
            placeholder: '波次号',
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
    operateUser: {
        label: '拣货员ID',
    },
    serviceType: {
        label: '业务类型',
        component: ASelect,
        attrs: {
            showSearch: true,
            getOptions: getASelectOptions('carrierType')
        }
    },

    jobTime: {
        label: '波次起止时间',
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

    waveNo: {
        title: '波次号',
    },
    operateUser: {
        title: '拣货员',
    },
    totalOffShelvesNum: {
        title: '分配下架单数',
    },
    pickedNum: {
        title: '已拣数',
    },
    unPickNum: {
        title: '未拣数',
    },
    waveNoGenerateTime: {
        title: '波次生成时间',
    },
    make: {
        title: '操作',
    },
}

// 分配 表头
export const offshelvesColumns = [
    {
      title: '下架单号',
      dataIndex: 'delegationOrderNo'
    },
    {
      title: '渠道',
      dataIndex: 'endCarrierCode',
      cell: function(val){
        return <ASelect
            isDetail
            value={val}
            defaultValue={val}
            getOptions={getASelectOptions('LOGISTICS_CHANNEL')}
        ></ASelect>
      }
    },
    {
      title: '库区/巷道',
      dataIndex: 'roadwayId'
    }
  ]