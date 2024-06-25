import React from 'react';
import { ASelect } from '@/component';
import { getWid, getUuid, isTrue, isEmpty } from 'assets/js';
import $http from 'assets/js/ajax';
import { getDevice, getLocalPositionCode, typeOptions } from '@/flashSow/flashSowPackageConfig/config';

// 波次类型
export const getWaveTypeOptions = {
  NONE: '无',
  NORMAL: '慢',
  PRIOR: '快',
  BELOW: '中',
  TOPPRIOR: '特快'
}

// 库位状态配置， 0:空闲,1:占用,2:未集齐-超时,3:未集齐-已超时,4:已集齐
export const occupyStatusOptions = [
  {label: '空闲', value: '0'},
  {label: '占用', value: '1'},
  {label: '未集齐-已超时', value: '2'},
  {label: '未集齐-未超时', value: '3'},
  {label: '已集齐', value: '4'},
]

// 是否空闲
export function isEmptyIdle(data) {
  return isEmpty(data.waveCode)
}

// 是否集齐
export function isCollectedOrder(data) {
  return data.isOffShelvesComplete && data.isComplete;
  // return !isEmpty(data.waveOrderNums) && !isEmpty(data.collectedOrderCount) && data.collectedOrderCount == data.waveOrderNums
}

// 是否超时
export function isTimeout(data) {
  return (data.instockDurationTimes || 0) > (data.instockDurationTimesOut || 0);
}

// 获取导航拦数据 →
export function getNavBarData(res) {
  const newArr =  res.filter(r => isTrue(r.positionCode))
            .map(r => {
              const statusConfigStr = {
                [!isEmptyIdle(r) && isCollectedOrder(r)]: '  →  已集齐',
                [isEmptyIdle(r)]: '  →  空闲',
                [!isEmptyIdle(r) && !isCollectedOrder(r) && isTimeout(r)]: '  →  未集齐-已超时',
                [!isEmptyIdle(r) && !isCollectedOrder(r) && !isTimeout(r)]: '  →  未集齐-未超时',
              }
              const statusConfig = {
                [!isEmptyIdle(r) && isCollectedOrder(r)]: 3,
                [isEmptyIdle(r)]: 5,
                [!isEmptyIdle(r) && !isCollectedOrder(r) && isTimeout(r)]: 1,
                [!isEmptyIdle(r) && !isCollectedOrder(r) && !isTimeout(r)]: 2,
              }
              const colorConfig = {
                [!isEmptyIdle(r) && isCollectedOrder(r)]: "success-color",
                [isEmptyIdle(r)]: "",
                [!isEmptyIdle(r) && !isCollectedOrder(r) && isTimeout(r)]: "fall-color",
                [!isEmptyIdle(r) && !isCollectedOrder(r) && !isTimeout(r)]: "",
              }
              return {
                ...r,
                sortNo: statusConfig[true],
                title: <span>
                  库位号：{r.positionCode || '-'}
                  <span className={colorConfig[true]}>{statusConfigStr[true]}</span>
                </span>,
                searchTitle: `库位号：${r.positionCode || '-'} ${statusConfigStr[true]}`
              }
            })
  return newArr;
}

// 获取数据
let requestUid = null
export function getData(data, render) {
  const pageConfig = {
    pageSize: 4,
    pageNum: 1
  }
  requestUid = getUuid();
  const getRes = (pageNum = pageConfig.pageNum, uid) => $http({
    url: '/flowPick/position/monitorQuery/reBatchPosition/get',
    method: 'post',
    data: {
      ...data,
      ...pageConfig,
      pageNum
    }
  }).then(res => {
    // 存在新请求时，停止渲染
    if (uid !== requestUid) return
    // 轮询请求接口，直接到没有数据返回
    if (Array.isArray(res)) {
      // if (res.length === pageConfig.pageSize) {
      if (res.length && res[0].isPageTurning) {
        getRes(pageNum + 1, uid)
      }
      const newRes = getNavBarData(res)
      typeof render === 'function' && render(newRes)
      return newRes
    } else {
      typeof render === 'function' && render([])
      return []
    }
  })
  return getRes(pageConfig.pageNum, requestUid)
}

// 获取库位
const DeviceAndStorageCache = {}
export function getDeviceAndStorage(warehouseId, type) {
  const data = DeviceAndStorageCache[warehouseId+type]
  if (data) return data
  return DeviceAndStorageCache[warehouseId + type] = $http({
    url: `/flowPick/position/monitorQuery/reBatchPosition/getDeviceAndCode?warehouseId=${warehouseId}`
  }).then(res => {
    if (res) {
      return res[type] || {}
    }
    return {}
  }).catch(e => ({}))
}

// 获取弹窗挂载节点
function getPopupContainer() {
  return document.querySelector('.flashSowCard')
}



// 查询配置
export const searchModel = {
  warehouseId: {
    label: '仓库名称',
    component: ASelect,
    defaultValue: getWid(),
    attrs: {
      getPopupContainer,
      hasClear: false,
      onChange(val, vm) {
        vm.field.setValues({
          deviceCode: '',
          codeList: []
        })
      }
    }
  },
  type: {
    label: '库位类型',
    component: ASelect,
    defaultValue: '0',
    attrs: {
      getPopupContainer,
      hasClear: false,
      getOptions: async() => typeOptions,
      onChange(val, vm) {
        vm.field.setValues({
          deviceCode: '',
          codeList: []
        })
      }
    }
  },
  deviceCode: {
    label: '关联设备',
    component: ASelect,
    attrs: {
      getPopupContainer,
      // mode: 'multiple',
      showSearch: true,
      watchKey: 'warehouseId,type',
      getOptions: async({field}) => {
        const warehouseId = field.getValue('warehouseId')
        const type = field.getValue('type')
        const opt = await getDeviceAndStorage(warehouseId, type)
        return Object.keys(opt).map(k => ({label: k, value: k}))
      },
      onChange(val, vm) {
        vm.field.setValues({
          codeList: []
        })
      }
    }
  },
  codeList: {
    label: '库位代码',
    component: ASelect,
    attrs: {
      getPopupContainer,
      showSearch: true,
      mode: 'multiple',
      watchKey: 'warehouseId,type,deviceCode',
      getOptions: async({field}) => {
        const {warehouseId, type, deviceCode } = field.getValues()
        const opt = await getDeviceAndStorage(warehouseId, type)
        const codelist = opt && opt[deviceCode] || []
        return codelist.map(k => ({label: k, value: k}))
      }
    }
  },
  occupyStatus: {
    label: '库位状态',
    component: ASelect,
    attrs: {
      getPopupContainer,
      getOptions: async({field}) => {
        return occupyStatusOptions
      }
    }
  },
  searchBtn: {
    label: '',
    fixedSpan: 4,
    outsider: true
  }
}
