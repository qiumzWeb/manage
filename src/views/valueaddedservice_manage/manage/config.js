import React from 'react';
import { DatePicker2, Input, UploadImage, ASelect, AFormTable, ImagePreview } from '@/component'
import {getWid, getObjType, isEmpty} from 'assets/js'
import { defaultSearchDate } from '@/report/utils'
import Api from 'assets/api'
import $http from 'assets/js/ajax'
import { getTaskStatusOptions } from './api'
import { defaultPreSet } from '@/component/DatePicker2/RangePicker'

// 审核状态
export const auditStatusOptions = [
  {label: '待审核', value: '0'},
  {label: '已通过', value: '1'},
]

// 服务类型
export const serviceTypeOptions = [
  {label: '除甲醛', value: 'removeFormaldehydeService'},
  {label: '除虫', value: 'dewormingService'},
  {label: '加固', value: 'woodFrameService'},
]
// 异常类型
export const exceptionTypeOptions = [
  {label: '包裹损毁', value: '301'},
  {label: '包裹丢失', value: '302'},
  {label: '其它', value: '303'},
  {label: '已退款', value: '304'},
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
    referLogisticsOrderCode: {
        label: '平台物流号',
    },
    settlementCode: {
        label: '服务类型',
        component: ASelect,
        attrs: {
          getOptions: async() => serviceTypeOptions
        }
    },
    warehouseDistrictName: {
      label: '存储库区',
      component: ASelect,
      attrs: {
        showSearch: true,
        placeholder: "请选择",
        watchKey: 'warehouseId',
        getOptions: async({field}) => {
          const values = field.getValues()
          if (isEmpty(values.warehouseId)) return []
          const {result} = await $http({
            url: Api.getWareHouseDistrictList,
            method: 'post',
            data: {
              warehouseId: values.warehouseId,
              pageSize: 400
            }
          })
          return Array.isArray(result) && result.map(d => ({
            label: d.name,
            value: d.name
          })) || []
        }
      }
    },
    status: {
        label: '任务状态',
        component: ASelect,
        attrs: {
          getOptions: async() => await getTaskStatusOptions
        }
    },
    auditStatus: {
      label: '审核状态',
      component: ASelect,
      attrs: {
        getOptions: async() => auditStatusOptions
      }

    },
    searchTime: {
      label: '任务生成时间',
      fixedSpan: 24,
      defaultValue: defaultPreSet['近一周'],
      component: DatePicker2.RangePicker,
      transTimeCode: ['startTime', 'endTime'],
      format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      }
    },
    allocateTime: {
      label: '任务分配时间',
      fixedSpan: 24,
      component: DatePicker2.RangePicker,
      transTimeCode: ['allocateStartTime', 'allocateEndTime'],
      format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      }
    },
}

export const qColumns = {
    deliveryCode: {
      title: '包裹号',
      width: 160
    },
    referLogisticsOrderCode: {
      title: '平台物流号',
      width: 160
    },
    servicesType: {
      title: '服务类型',
      cell: (val, index, record) => <ASelect isDetail value={val} getOptions={async() => serviceTypeOptions}></ASelect>
    },
    warehouseDistrictName: {
      title: '库区'
    },
    statusLabel: {
      title: '任务状态',
    },
    auditStatus: {
      title: '审核状态',
      cell: (val, index, record) => <ASelect isDetail value={val} getOptions={async() => auditStatusOptions}></ASelect>
    },
    operatorName: {
      title: '任务执行人'
    },
    gmtCreate: {
      title: '任务生成时间',
      width: 160
    },
    allocateTime: {
      title: '任务分配时间',
      width: 160
    },
    finishTime: {
      title: '任务完成时间',
      width: 160
    },
}

// 详情配置
export const detailModel = {
  referLogisticsOrderCode: {
    label: '平台物流号',
    attrs: {
      detail: true
    }
  },
  servicesType: {
    label: '服务类型',
    component: ASelect,
    attrs: {
      isDetail: true,
      style: {fontWeight: 'bold'},
      getOptions: async() => serviceTypeOptions
    }
  },
  warehouseDistrictName: {
    label: '库区',
    attrs: {
      detail: true
    }
  },
  statusLabel: {
    label: '任务状态',
    attrs: {
      detail: true
    }
  },
  auditStatus: {
    label: '审核状态',
    component: ASelect,
    attrs: {
      isDetail: true,
      defaultValue: '-',
      style: {fontWeight: 'bold'},
      getOptions: async() => auditStatusOptions
    }
  },
  exceptionType: {
    label: '异常类型',
    component: ASelect,
    attrs: {
      isDetail: true,
      style: {fontWeight: 'bold'},
      defaultValue: '-',
      getOptions: async() => exceptionTypeOptions
    }
  },
  operatorName: {
    label: '任务执行人',
    attrs: {
      detail: true
    }
  },
  gmtCreate: {
    label: '任务生成时间',
    attrs: {
      detail: true
    }
  },
  allocateTime: {
    label: '任务分配时间',
    attrs: {
      detail: true
    }
  },
  finishTime: {
    label: '任务完成时间',
    attrs: {
      detail: true
    }
  },
  imgUrls: {
    label: '包裹图片',
    span: 24,
    component: React.forwardRef((props, ref) => {
      if (props.value == '-') return props.value
      const urlList = typeof props.value === 'string' && props.value.split(';') || [];
      return <ImagePreview urlList={urlList}></ImagePreview>
    })
  },
  logs: {
    label: '操作日志',
    span: 24,
    component: AFormTable,
    attrs: {
      columns: {
        action: {
          title: '动作'
        },
        content: {
          title: '备注内容'
        },
        createUser: {
          title: '操作人'
        },
        createTime: {
          title: '操作时间'
        }
      }
    }
  }
}

// 审核照片
export const auditImageConfig = {
  fileUrl: {
    label: '',
    component: UploadImage,
    expandKeys: ['warehouseId', 'id'],
    span: 24,
    attrs: {
      showDeleteConfirm: true,
      uploadParams: (data) => ({
        taskOrderId: data.id,
        warehouseId: data.warehouseId
      })
    }
  }
}

// 完结任务
export const taskFinishConfig = {
  warehouseId: {
    label: '仓库名称',
    component: ASelect,
    span: 12,
    attrs: {
      isDetail: true,
      style: {fontWeight: 'bold'},
    }
  },
  taskResult: {
    label: '状态',
    span: 12,
    defaultValue: '已退款',
    expandKeys: ['ids'],
    attrs: {
      detail: true
    }
  },
  content: {
    label: '备注信息',
    span: 24,
    component: Input.TextArea,
    attrs: {
      rows: 5,
      placeholder: '请输入备注信息'
    }
  }
}