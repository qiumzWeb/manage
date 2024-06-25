import { isEmpty, getWid } from 'assets/js';
import $http from 'assets/js/ajax';

// 获取监控数据
export function getMonitorData(getResponseDate) {
  return $http({
    url: `/flowPick/position/monitorQuery/reBatchPosition/fullScreen/list?warehouseId=${getWid()}`,
    method: 'post',
    getResponseDate
  }).then(res => {
    const abnormalDeviceDataList = getHasStatusList(res.abnormalDeviceDataList);
    const normalDeviceDataList = getHasStatusList(res.normalDeviceDataList);
    return {
      ...(res || {}),
      abnormalDeviceDataList,
      normalDeviceDataList,
      normalData: getTatolData(normalDeviceDataList),
      abnormalData: getTatolData(abnormalDeviceDataList)
    }
  })
}

// 集齐状态颜色配置
export const StatusConfig = {
  1: 'success-bg success-c', // 已集齐
  2: 'warn-bg warn-c', // 未集齐- 超时
  3: 'fail-bg fail-c', // 未集齐 - 未超时
  4: '', // 空闲
}

// 转换集齐状态 
export function getHasStatusList(list) {
  return Array.isArray(list) && list.map(item => {
    const cl = item.devicePositions;
    const newArr =  Array.isArray(cl) && cl.map(l => {
      const Config = {
        [l.empty]: '4',
        [!l.empty && !l.ready && !l.timeout]: '3',
        [!l.empty && !l.ready && l.timeout]: '2',
        [!l.empty && l.ready]: '1'
      }
      return {
        ...l,
        status: Config[true] || null
      }

    }) || []
    newArr.sort((a, b) => +a.status - +b.status);
    return newArr;

  }) || []
}

export function getTatolData(list) {
  return Array.isArray(list) && list.reduce(({ ready, notReadyAndTimeout, empty}, b) => {
    return {
      ready: ready + (Array.isArray(b) && b.filter(bt => bt.status == '1') || []).length,
      notReadyAndTimeout: notReadyAndTimeout + (Array.isArray(b) && b.filter(bt => bt.status == '2') || []).length,
      empty: empty + (Array.isArray(b) && b.filter(bt => bt.status == '4') || []).length
    }
  }, {
    ready: 0,
    notReadyAndTimeout: 0,
    empty: 0
  })
}
