import { DatePicker2 } from '@/component'
import ASelect from '@/component/ASelect/index'
import {getWid} from 'assets/js'
import moment from 'moment'
export const searchUrl = '/adm/operationTask/reportList'
export const nameOptions = [
    {label: '签收', value: 'SIGN'},
    {label: '人工入库', value: 'IN_BOUND'},
    {label: '容器上架', value: 'SHELVES'},
    {label: '下架', value: 'OFF_SHELVES'},
    {label: '尾包下架', value: 'TAIL_OFF_SHELVES'},
    {label: '播种', value: 'ALLOT'},
    {label: '合箱', value: 'MERGE'},
    {label: '人工分拣-粗分', value: 'BROAD_SORTING'},
    {label: '人工分拣-细分', value: 'SUBDIVISION'},
    {label: 'RFID绑定', value: 'RFID_BINDING'},
    {label: '出库集包', value: 'OUTBOUND_COLLECT_PACKAGE'},
    {label: '出库异形人工组包', value: 'OUTBOUND_SS_MANUAL_PACKAGE'},
    {label: '出库称重', value: 'OUTBOUND_WEIGH'},
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
    taskTime: {
        label: '操作日期',
        component: DatePicker2.RangePicker,
        fixedSpan: 20,
        attrs: {
            defaultValue: [moment().subtract(1, 'day'), moment()],
            hasClear: false,
            showTime: true
        }
    },
    queryOperateNodeList: {
        label: '工序名称',
        component: ASelect,
        attrs: {
            mode: 'multiple',
            getOptions: async() => {
                return nameOptions
            }
        }
    },
    taskId: {
        label: '业务单号',
    },
    containerCode: {
        label: '容器编号'
    },
    operatorEmployeeNo: {
        label: "工号"
    }
}

export const qColumns = {
    warehouseName: {
        title: '仓库名称',
        width: 160,
        lock:'left'
    },
    taskStartStr: {
        title: '操作日期',
        width: 120,
        cell: (val, index, record) => {
            return record.taskStartTime && moment(record.taskStartTime).format("YYYY-MM-DD") || '--'
        }
    },
    operateNodeName: {
        width: 150,
        title: '工序名称'
    },
    taskId: {
        width: 220,
        title: '业务单号（任务号）'
    },
    taskOperateCount: {
        width: 100,
        title: '作业单量'
    },
    containerCode: {
        width: 150,
        title: '容器编号'
    },
    taskStartTime: {
        width: 200,
        title: '操作开始时间'
    },
    taskEndTime: {
        width: 200,
        title: '操作结束时间'
    },
    operateCost: {
        width: 120,
        title: '操作时长（秒）'
    },
    operatorEmployeeNo: {
        width: 200,
        title: '工号'
    },
    operatorName: {
        width: 150,
        title: '姓名'
    }
}