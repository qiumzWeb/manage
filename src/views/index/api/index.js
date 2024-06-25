import request from 'assets/js/ajax.js'
import moment from 'moment'
import { checkIndexAuth } from 'assets/js/auth'
import Cookie from 'assets/js/cookie'
import { deepAssign } from 'assets/js'
// 获取数据
export async function getMonitorData(callback) {
  const auth = await checkIndexAuth()
  if(auth) {
    const [
      storageCapacityData,
      NeedDoTaskAndExceptionMonitorList,
      TimeSharingOperationMonitorList,
      InStorageMonitorList,
      // InstockOutstock
    ] = await Promise.all([
      getStorageCapacityData(),
      getNeedDoTaskAndExceptionMonitorList(),
      getTimeSharingOperationMonitorList(),
      getInStorageMonitorList(),
      // getInstockOutstock()
    ])
    return deepAssign(
      {},
      storageCapacityData,
      NeedDoTaskAndExceptionMonitorList,
      TimeSharingOperationMonitorList,
      InStorageMonitorList,
      // InstockOutstock
    )
  }
  return Promise.resolve({})
}

// 老接口
export function getAllData() {
  return request({
    url: `/data/monitor/index`,
    method: 'get',
  })
}

// 库存监控接口
export function getStorageCapacityData() {
  return request({
    url: `/data/monitor/index/storageCapacity`,
    method: 'get',
    data: {warehouseId: Cookie.get('warehouseId')}
  }).catch(e => ({}))
}

// 作业量和异步监控
export function getNeedDoTaskAndExceptionMonitorList() {
  return request({
    url: `/data/monitor/index/needDoTaskAndExceptionMonitorList`,
    method: 'get',
  }).catch(e => ({}))
}

// 分时作业监控
export function getTimeSharingOperationMonitorList() {
  return request({
    url: `/data/monitor/index/timeSharingOperationMonitorList`,
    method: 'get',
  }).catch(e => ({}))
}


// 入库、出库
export function getInstockOutstock() {
  return request({
    url: `/data/monitor/index/currentDayData/instock/outstock`,
    method: 'get',
  }).catch(e => ({}))
}

// 蓄水池
export function getInStorageMonitorList() {
  return request({
    url: `/data/monitor/index/inStorageMonitorList`,
    method: 'get',
  }).catch(e => ({}))
}

