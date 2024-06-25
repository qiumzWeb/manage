import React from 'react';
import { ASelect, Input, DatePicker2, Message, AFormTable } from '@/component';
import {getWid, isEmpty, thousands, isTrue} from 'assets/js';
import $http from 'assets/js/ajax';
import { downloadExcel } from '@/assets/js/utils';
import DialogButton from '@/atemplate/queryTable/config/dialogButton';
import dayjs from 'dayjs';
import { getCalendarTableColumn, getCalendarStartAndEnd } from '@/report/utils';
import { dataSourceOptions } from '@/pages/productionPlan/productionPlanReportBoard/config'

// 查询接口
export const searchApiUrl = '/prediction/quantity/summary'


// 导入出库通知
export function getOutStockNoticeUpload(data) {
  return $http({
    url:'/prediction/quantity/outStockNoticeUpload',
    method: 'post',
    data,
    dataType: 'form',
  })
}

// 导入批次到达
export function getBatchArriveUpload(data) {
  return $http({
    url: '/prediction/quantity/batchArriveUpload',
    method: 'post',
    data,
    dataType: 'form',
  })
}


// 批量导入-出库通知
export const outStockNoticeModel = {
  file: {
    onDownload: async() => {
      try {
        const res = await $http({
          url: '/prediction/quantity/outStockNoticeDownload',
          responseType: 'blob'
        })
        downloadExcel(res, `出库通知预测-${dayjs().format('YYYYMMDDHHmmss')}`)
      } catch(e) {
        Message.error(e.message)
      }
    },
    componentType: 'import',
  }
}


// 批量导入-批次到达
export const batchArriveModel = {
  file: {
    onDownload: async() => {
      try {
        const res = await $http({
          url: '/prediction/quantity/batchArriveDownload',
          responseType: 'blob'
        })
        downloadExcel(res, `批次到达预测-${dayjs().format('YYYYMMDDHHmmss')}`)
      } catch(e) {
        Message.error(e.message)
      }
    },
    componentType: 'import',
  }
}

// 获取详情
export function getDetailData(data) {
  return $http({
    url: '/prediction/quantity/detailByDay',
    method: 'post',
    data,
  })
}



// 查询条件
export const qSearch = [
  {
    warehouseId: {
      label: '仓库名称',
      defaultValue: getWid(),
      component: ASelect,
      needExpandToData: true,
      attrs: {
        hasClear: false
      }
    },
    jobDateStart: {
      label: '选择周期',
      defaultValue: dayjs(),
      component: DatePicker2.MonthPicker,
      useDetailValue: true,
      format: (val) => {
        if (dayjs(val).isValid()) {
          const { start, end } = getCalendarStartAndEnd(val)
          return {
            jobDateStart: start.format("YYYY-MM-DD 00:00:00"),
            jobDateEnd: end.format("YYYY-MM-DD 23:59:59"),
            currentDate: val
          }
        } else {
          return {
            jobDateStart: "",
            jobDateEnd: ''
          }
        }
      },
      attrs: {
        hasClear: false,
        onChange: (val, vm) => {
          // vm.refresh()
        }
      }
    },
    dataSource: {
      label: '预测数据来源',
      component: ASelect,
      defaultValue: '2',
      needExpandToData: true,
      attrs: {
        hasClear: false,
        getOptions: async() => dataSourceOptions
      }
    },
  }
]

// 详情 - 日历
const cell = (val) => isTrue(val) ? val : '-';
export const detailModel = {
  base1: {title: '批次到达预测', model: {
    batchArriveDetails: {
      label: '',
      component: AFormTable,
      span: 24,
      attrs: {
        edit: false,
        showIndex: true,
        columns: {
          departureName: {
            title: '始发仓',
            cell
          },
          countryName: {
            title: '国家',
            cell
          },
          turnoverTypeName: {
            title: '波次类型',
            cell
          },
          predictionValue: {
            title: '预测单量',
            cell
          },
          actualValue: {
            title: '实际单量',
            cell
          },
          predictionDifference: {
            title: '预测实际差异幅度',
            cell
          },
        }
      }
    }
  }},
  base2: {title: '通知出库预测', model: {
    outStockNoticeDetails: {
      label: '',
      component: AFormTable,
      span: 24,
      attrs: {
        edit: false,
        showIndex: true,
        columns: {
          countryName: {
            title: '国家',
            cell
          },
          turnoverTypeName: {
            title: '波次类型',
            cell
          },
          districtName: {
            title: '库区',
            cell
          },
          predictionValue: {
            title: '预测单量',
            cell
          },
          actualValue: {
            title: '实际单量',
            cell
          },
          predictionDifference: {
            title: '预测实际差异幅度',
            cell
          },
        }
      }
    }
  }},
  base3: {title: '批次发运预测', model: {
    batchShippingDetails: {
      label: '',
      component: AFormTable,
      span: 24,
      attrs: {
        edit: false,
        showIndex: true,
        columns: {
          countryName: {
            title: '国家',
            cell
          },
          channel: {
            title: '渠道',
            cell
          },
          predictionValue: {
            title: '预测单量',
            cell
          },
          actualValue: {
            title: '实际单量',
            cell
          },
          predictionDifference: {
            title: '预测实际差异幅度',
            cell
          },
        }
      }
    }
  }},
  base4: {title: '发车车次计划', model: {
    departurePlanDetails: {
      label: '',
      component: AFormTable,
      span: 24,
      attrs: {
        edit: false,
        showIndex: true,
        columns: {
          trunkName: {
            title: '干线仓目的地',
            cell
          },
          trunkPartner: {
            title: '干线仓CP',
            cell
          },
          aging: {
            title: '时效',
            cell
          },
          packingType: {
            title: '装箱/装袋',
            cell
          },
          trainType: {
            title: '车辆类型',
            cell
          },
          truckLoad: {
            title: '装载量',
            cell
          },
          trainNum: {
            title: '车辆数',
            cell
          },
        }
      }
    }
  }},
}

// 列表 - 日历
export const tColumns = getCalendarTableColumn((item, index, record) => {
  const { warehouseId, dataSource } = record;
  const currentDate = dayjs().format("YYYY-MM-DD")
  const isToday = currentDate == item.jobDate
  const isLastDay = dayjs(item.jobDate) < dayjs().startOf('day');
  // 渲染数据
  const getLastValue = (arr) => {
    return <span
      style={{color: item.isCurrentMoth? "#333" : '#ccc', fontWeight: 'bold'}}
    >{isLastDay ? arr.map(a => thousands(isEmpty(a) ? '-' : a)).join(' | ') : thousands(isEmpty(arr[0]) ? '-' : arr[0])}</span>
  }
  const bottom5 = {marginBottom: 10}
  return <div style={{
      minHeight: 110,
      width: '100%',
      cursor: 'pointer',
      color: item.isCurrentMoth ? '#666' : '#ccc',
    }}>
    <DialogButton
      title='预测类型详情'
      DialogWidth={1200}
      groupConfig={detailModel}
      groupType={'toggle'}
      getData={async() => {
        const setData = (r = {}) => ({
          batchArriveDetails: r.batchArriveDetails || [],
          outStockNoticeDetails: r.outStockNoticeDetails || [],
          batchShippingDetails: r.batchShippingDetails || [],
          departurePlanDetails: r.departurePlanDetails || []
        })
        try {
          if (!warehouseId || !dataSource) return setData()
          const res = await getDetailData({
            warehouseId,
            dataSource,
            jobDate: item.jobDate
          })
          return setData(res || {})
        } catch(e) {
          Message.error(e.message)
          return setData()
        }
      }}
      footer={false}
      button={
        // 日历 render
        <div style={{width: '100%'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...bottom5}}>
            <div>
              {isToday && <span className='main-back' style={{display: 'inline-block', borderRadius: 20, padding: 3, color: '#fff', marginRight: 5}}>今</span> || ''}
              {item.jobDate}
            </div>
            <div className={`${!isLastDay && item.isCurrentMoth && 'downcenter_INIT main-border' || ''}`} style={{
              border: '1px solid #ccc',
              borderRadius: 20,
              padding: 3
            }}>{isLastDay ? '预测 | 实际' : '预测'}</div>
          </div>
          <div style={bottom5}>批次到达: {getLastValue([item.batchArrivePredictionNum, item.batchArriveActualNum])}</div>
          <div></div>
          <div style={bottom5}>通知出库: {getLastValue([item.outStockNoticePredictionNum, item.outStockNoticeActualNum])}</div>
          <div style={bottom5}>批次发运: {getLastValue([item.batchShippingPredictionNum, item.batchShippingActualNum])}</div>
          <div style={{}}>发车计划: {getLastValue([item.departurePlanPredictionNum])}</div>
        </div>
      }
    >
    </DialogButton>

    </div>
})


