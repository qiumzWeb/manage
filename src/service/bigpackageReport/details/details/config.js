import FormTable from '@/component/FormTable'

// 大包信息
export const baseModel = {
  batchNo: {
    label: '交接批次号',
  },
  bigBagId: {
    label: '大包号',
  },
  statusDesc: {
    label: '大包状态',
  },
  grossWeight: {
    label: '预报重量',
  },
  standardWeight: {
    label: '大包实际重量',
  },
  preCpresDesc: {
    label: '大包来源',
  },
  passNo: {
    label: '格口号',
  },
  rfidNo: {
    label: '容器号',
  }
}
// 仅查看
Object.values(baseModel).forEach(f => {
  f.attrs = {detail: true}
})

// 大包里小包明细
export const smallPackageModel = {
  itemList: {
    label: '',
    span: 24,
    component: FormTable,
    attrs: {
      tableOptions: {
        fixedHeader: false,
      },
      defaultValue: '-',
      columnWidth: 150,
      columns: {
        trackingNumber: {
          title: '包裹运单号',
        },
        logisticsOrderCode: {
          title: '平台跟踪号',
        },
        status: {
          title: '包裹状态',
        },
        preCpcode: {
          title: '一段仓Code'
        },
        recommendStoreCode: {
          title: '推荐库区',
        },
        storeCode: {
          title: '上架库位',
        },
      }
    }
  }
}
// 日志表头
export const logColumns = {
  action: {
    title: '动作',
  },
  content: {
    title: '备注内容',
  },
  createUser: {
    title: '操作人',
  },
  createTime: {
    title: '备注时间',
  }
}
// 大包状态日志
export const packageStatusLogModel = {
  actionLogs: {
    label: '',
    span: 24,
    component: FormTable,
    attrs: {
      tableOptions: {
        fixedHeader: false,
      },
      defaultValue: '-',
      columnWidth: 150,
      columns: logColumns
    }
  }
}

// 系统日志信息
export const systemLogModel = {
  csmRemarkList: {
    label: '',
    span: 24,
    component: FormTable,
    attrs: {
      tableOptions: {
        fixedHeader: false,
      },
      defaultValue: '-',
      columnWidth: 150,
      columns: logColumns
    }
  }
}
