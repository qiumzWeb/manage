import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import { DatePicker2 } from '@/component'
import { checkResultOptions } from '../config'
import moment from 'moment'
export const inStoreSearch = {
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
    }
}

export const inStoreColumns = {
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
    instructionSource: {
        title: '指令来源',
    },
    instructionCode: {
        title: '指令代码'
    },
    instructionDesc: {
        title: '指令说明'
    },
    checkResultLabel: {
        title: '查验结果',
    },
    goodsFeature: {
        title: '禁限运属性',
    },
    packageImgUrlList: {
        title: '包裹图片',
    },
    itemImgUrlList: {
        title: '商品图片',
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
    operator: {
        title: '操作人'
    },
}