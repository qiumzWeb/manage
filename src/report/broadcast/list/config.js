import React from 'react';
import { Input, AFormTable, Button, Radio, DatePicker2, ASelect } from '@/component';
import dayjs from 'dayjs';
import $http from 'assets/js/ajax';
import {getWid, isEmpty, getObjType} from 'assets/js';
import {
  contentTypeOptions,
} from '../config';
import { UPPHPLANOPTIONS, UPPHSUMPLANOPTIONS } from '@/report/options';
import UppHDataSum from './component/upphDataSum';

export const qSearch = [
  {
    warehouseId: {
      label: '仓库名称',
      defaultValue: getWid(),
      component: ASelect,
      attrs: {
        hasClear: false
      }
    },
    timeScoped: {
      label: '播报时间范围',
      fixedSpan: 24,
      defaultValue: [dayjs().subtract(3, 'days'), dayjs()],
      component: DatePicker2.RangePicker,
      attrs: {
        format: 'YYYY-MM-DD',
      }
    },
    contentType: {
      label: '播报内容',
      component: ASelect,
      attrs: {
        getOptions: async() => contentTypeOptions
      }
    },
  }
]
// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
  },
  occurTime: {
    title: '播报时间',
  },
  contentType: {
    title: '播报内容',
    cell: (val) => <ASelect isDetail value={val} getOptions={async() => contentTypeOptions}></ASelect>
  },
  make: {
    title: '播报详情',
    // definedCell: (getTips, cell) => {
    //   return getTips(cell, {
    //     align: 'tr',
    //     popupStyle: {
    //       maxWidth: 1000
    //     }
    //   })
    // }
  }
}

// 获取UPPH详情数据
export function getUPPHDetailData(data) {
  return $http({
    url: '/upph/summary/detail',
    method: 'get',
    data
  })
}

// UPPH 播报详情配置
export const UppHSumDataModel = {
  upphMasterPlan: {
    label: '',
    span: 24,
    component: UppHDataSum,
  }
}

export const UPPHConfigTable = {
  upphSubPlans: {
    label: '',
    span: 24,
    component: AFormTable,
    attrs: {
      edit: false,
      cellProps: (rowIndex, colIndex) => {
        // 实时综合人数
        if (rowIndex === 10) {
          switch(colIndex) {
            case 1: return { colSpan: 4 };
            case 5: return { colSpan: 2 };
            case 7: return { colSpan: 2 };
          }
        }
        // 动态计划出勤人数
        if (rowIndex === 11) {
          switch(colIndex) {
            case 5: return { colSpan: 2 };
            case 7: return { colSpan: 2 };
          }
        }
        // 当天出勤人数
        if (rowIndex === 12) {
          switch(colIndex) {
            case 5: return { colSpan: 2 };
            case 7: return { colSpan: 2 };
          }
        }
        // 截至目前下班人数
        if (rowIndex === 13) {
          switch(colIndex) {
            case 5: return { colSpan: 2 };
            case 7: return { colSpan: 2 };
          }
        }
        // 截至目前出勤人数
        if (rowIndex === 14) {
          switch(colIndex) {
            case 5: return { colSpan: 2 };
            case 7: return { colSpan: 2 };
          }
        }
      },
      columns: {
        // {label: '实时综合人效', value: 'SUB_REAL_TIME_COMPREHENSIVE_EFFECT'},
        // {label: '动态计划出勤人数', value: 'SUB_DYNAMIC_PLAN_WORK_EMPLOYEE_COUNT'},
        // {label: '当天出勤人数', value: 'SUB_TODAY_WORK_EMPLOYEE_COUNT'},
        // {label: '截至目前下班人数', value: 'SUB_NOW_OFF_WORK_EMPLOYEE_COUNT'},
        // {label: '截至目前出勤人数', value: 'SUB_NOW_WORK_EMPLOYEE_COUNT'},
        indicatorCode: {
          title: '模板',
          children: {
            label: {
              width: 150,
              title: 'Key Nodes',
              cell: cellRender.bind(null, 'label')
            }
          }
        },
        inStock: {
          title: '入库',
          children: {
            sign: {
              title: '签收',
              cell: (val, index, record) => {
                if (record.indicatorCode === 'SUB_REAL_TIME_COMPREHENSIVE_EFFECT') {
                  return cellRender('inStock',record.inStock,  {
                    style: {textAlign: 'center'},
                  }, record)
                }
                return cellRender('sign', val, index, record)
              }
            },
            manualInstock: {
              title: '人工分拣',
              cell: cellRender.bind(null, 'manualInstock')
            },
            autoInstock: {
              title: '自动分拣',
              cell: cellRender.bind(null, 'autoInstock')
            },
            packBag: {
              title: '收包',
              cell: cellRender.bind(null, 'packBag')
            },
          }
        },
        insideStock: {
          title: '库内',
          children: {
            onShelve: {
              title: '上架',
              cell: (val, index, record) => {
                if (UPPHSUMPLANOPTIONS.some(u => u.value == record.indicatorCode)) {
                  return cellRender('insideStock', record.insideStock,  {
                    style: {textAlign: 'center'},
                    key: 'outStock'
                  }, record)
                }
                return cellRender('onShelve', val, index, record)
              }
            },
            offShelve: {
              title: '下架',
              cell: cellRender.bind(null, 'offShelve')
            },
          }
        },
        outStock: {
          title: '出库',
          children: {
            sorting: {
              title: '播种',
              cell: (val, index, record) => {
                if (UPPHSUMPLANOPTIONS.some(u => u.value == record.indicatorCode)) {
                  return cellRender('outStock', record.outStock, {
                    style: {textAlign: 'center'},
                  }, record)
                }
                return cellRender('sorting', val, index, record)
              }
            },
            merge: {
              title: '合箱',
              cell: cellRender.bind(null, 'merge')
            },
          }
        },
        totalCount: {
          title: '合计',
          cell: cellRender.bind(null, 'totalCount')
        }
      }
    }
  }
}


// 渲染自定义元素
function cellRender(key, val, props, record) {
  const attrs = getObjType(props) === 'Object' && props || {};
  const planEffect = record.planEffect;
  if (record.indicatorCode === 'SUB_PERCENT_COMPLETE' && !isEmpty(val)) {
    attrs.className = getColorClass(val);
    val += "%";
  }
  // ↑ ↓
  return <div {...attrs}>
    {isEmpty(val) ? "-" : val}
    {record.indicatorCode === 'SUB_REAL_TIME_EFFECT' && val > planEffect[key] && <span className="success-color"> ↑ </span> || ''}
    {record.indicatorCode === 'SUB_REAL_TIME_EFFECT' && val < planEffect[key] && <span className="fall-color"> ↓ </span> || ''}
  </div>
}

// 获取标颜色
function getColorClass(value) {
  if (isNaN(value)) return '';
  const colorBox = {
    [value > 30] : 'success-color',
    [value > 10 && value <= 30] : 'warn-color',
    [value <= 10] : 'fall-color',
  }
  return colorBox[true]
}
