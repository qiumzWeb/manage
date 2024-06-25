import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import { DatePicker2 } from '@/component'
import { checkResultOptions } from '../config'
import moment from 'moment'

export const onShelvesSearch = {
    warehouseId: {
        label: '仓库名称',
        component: ASelect,
        defaultValue: getWid(),
        attrs: {
            hasClear: false
        }
    },
    createTime: {
        label: '生成时间',
        fixedSpan: 22,
        component: DatePicker2.RangePicker,
        defaultValue: [
            moment().subtract(1, 'days'),
            moment()
          ],
        attrs: {
            format: 'YYYY-MM-DD HH:mm:ss',
            showTime: true
        }
    },
    logisticsOrderCode: {
        label: '一段LP单号',
    },
    mailNo: {
        label: '一段运单号',
    },
    waveNo: {
      label: '波次号'
    },
    checkResult: {
        label: '查验结果',
        component: ASelect,
        defaultValue: '0',
        attrs: {
            getOptions: async() => {
                return checkResultOptions
            }
        }
    },
    instructionCode: {
        label: '指令代码',
    },
    status: {
        label: '状态',
        component: ASelect,
        attrs: {
            getOptions: async() => {
                return [
                    {label: '已生成', value: '0'},
                    {label: '待下架', value: '1'},
                    {label: '待安检', value: '2'},
                    {label: '已安检', value: '3'},
                ]
            }
        }
    }
}

export const onShelvesColumns = {
    mailNo: {
        title: '一段运单号',
        lock: 'left',
    },
    logisticsOrderCode: {
        title: '一段LP单号',
    },
    packageStatusLabel: {
        title: '包裹状态',
    },
    waveNo: {
      title: '波次号'
    },
    instructionSource: {
        title: '指令来源',
        width: 100,
    },
    instructionCode: {
        title: '指令代码',
        width: 120,
    },
    instructionDesc: {
        title: '指令说明',
        width: 120,
    },
    checkResultLabel: {
        title: '查验结果',
        width: 100,
    },
    statusLabel: {
        title: '状态'
    },
    goodsFeature: {
        title: '禁限运属性',
    },
    packageImgUrlList: {
        title: '包裹图片',
        width: 300,
    },
    itemImgUrlList: {
        title: '商品图片',
        width: 300
    },
    itemQuantity: {
        title: '商品数量',
    },
    itemInspection: {
        title: '商品与查验结果是否一致',
    },
    resultDesc: {
        title: '结果描述',
    },
    gmtCreate: {
        title: '生成时间',
    },
    allocationTime: {
        title: '分配时间'
    },
    operator: {
        title: '操作人'
    }
}