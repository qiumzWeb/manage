import React from 'react';
import Page from '@/atemplate/queryTable';
import { ASelect, Input, Message, Dialog, DatePicker2, Button } from '@/component';
import { getWid, getStringCodeToArray, AsyncDebounce } from 'assets/js';
import $http from 'assets/js/ajax';
import { getDistrictOptions } from '@/report/apiOptions'
import { defaultSearchTime } from '@/report/utils'
import { slaEnableOptions, timeEfficiencyTypeOptions } from '@/report/options'
import API from 'assets/api'

// 查询接口
export const searchApiUrl = '/packageSku/search/searchSku'


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
    searchTime: {
      label: '复核扫描时间',
      fixedSpan: 24,
      defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      transTimeCode: ['checkStartTime', 'checkEndTime'],
      format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
        hasClear: false
      }
    },
    skuCode: {
      label: 'SKU条码',
      onEnter: true
    },
    checkOperator: {
      label: '复核扫描人',
      component: ASelect,
      attrs: {
        showSearch: true,
        watchKey: 'empSearch',
        filterLocal: false,
        fillProps: 'userName',
        placeholder: '请输入员工姓名或工号搜索',
        getOptions: AsyncDebounce(async ({field}) => {
          const list = []
          const sv = field.getValue('empSearch')
          if (!sv || !sv.length || !sv.trim()) return list
          const res = await $http({
              url: API.getJobName(sv),
              method: 'get'
          })
          return list.concat(Array.isArray(res) && res.map(r => ({
              ...r,
              label: `${r.userName || ''}${r.employeeNo && `(${r.employeeNo})` || ''}${r.loginName && `-${r.loginName}` || ''}`,
              value: r.userId
          })) || [])
        }),
        onSearch: (val, field) => {
          field.setValue('empSearch', val)
        }
      }
    },
    createTime: {
      label: '接单时间',
      fixedSpan: 24,
      needExpandToData: true,
      component: DatePicker2.RangePicker,
      transTimeCode: ['createStartTime', 'createEndTime'],
      format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      }
    },
  }
]

// 列表
export const tColumns = {
  warehouseId: {
    title: '仓库名称',
    cell: val => <ASelect value={val} isDetail></ASelect>
  },
  skuCode: {
    title: 'SKU条码',
  },
  productId: {
    title: '商品ID',
  },
  skuName: {
    title: '商品名称',
  },
  deliveryCode: {
    title: '一段LP号',
    // width: 150,
    cell: val => {
      return <a className='main-color' onClick={() => {
        window.Router.push(`/service/packageList?mailNoList=${val}`)
      }}>{val}</a>
    }
  },
  orderReferLogisticsCode: {
    title: '二段LP号',
  },
  inStockTime: {
    title: '一段入库时间'
  },
  shelveTime: {
    title: '一段上架时间',
  },
  offShelveTime: {
    title: '下架时间'
  },
  checkSkuTime: {
    title: '复核扫描时间'
  },
  checkSkuOperatorName: {
    title: '复核扫描人',
  },
  firstWarehouse: {
    title: '汇单仓'
  }
}
