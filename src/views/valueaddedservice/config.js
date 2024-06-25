import { DatePicker, Input } from '@/component'
import ASelect from '@/component/ASelect/index'
import {getWid} from 'assets/js'
import moment from 'moment'
export const searchUrl = '/sys/value/added/services/config/list'
export const saveUrl = '/sys/value/added/services/config/save'
export const updateUrl = '/sys/value/added/services/config/update'
export const deleteUrl = '/sys/value/added/services/config/delete'
export const qSearch = {
    warehouseId: {
        label: '仓库名称',
        component: ASelect,
        attrs: {
            defaultValue: getWid(),
            hasClear: false
        }
    },
    serviceType: {
        label: '服务类型',
    }
}

export const qColumns = {
    warehouseName: {
        title: '仓库名称',
        width: 160,
        lock:'left'
    },
    serviceType: {
        title: '服务类型',
        width: 200,
    },
    serviceItem: {
        width: 200,
        title: '服务项',
    },
    unit: {
        width: 100,
        title: '单位'
    },
    settlementCode: {
        width: 200,
        title: '结算元数据'
    },
    serviceDescription: {
        width: 350,
        title: '服务描述'
    },
    // serviceReadme: {
    //     width: 200,
    //     title: '服务说明'
    // },
    operator: {
        width: 150,
        title: '操作人'
    },
    gmtCreate: {
        width: 120,
        title: '创建时间'
    },
    gmtModified: {
        width: 200,
        title: '修改时间'
    },
    make: {
        title: '操作',
        width: 120,
        lock: 'right'
    }
}

// 新增修改配置
export const formModel = {
    warehouseId: {
        label: '仓库名称',
        required: true,
        component: ASelect,
        disabled: (data) => !data.isAdd,
        attrs: {
            hasClear: false
        }
    },
    serviceType: {
        label: '服务类型',
        required: true,
        attrs: {
            maxLength: 30,
        }
    },
    serviceItem: {
        required: true,
        label: '服务项',
        attrs: {
            maxLength: 30,
        }
    },
    settlementCode: {
        required: true,
        label: '结算元数据',
        attrs: {
            maxLength: 30,
        }
    },
    unit: {
        label: '单位',
        required: true,
        attrs: {
            maxLength: 16,
        }
    },
    serviceDescription: {
        label: '服务描述',
        span: 24,
        required: true,
        component: Input.TextArea,
        attrs: {
            placeholder: "请输入内容",
            maxLength: 400,
            rows:4,
            showLimitHint: true
        }
    },

}