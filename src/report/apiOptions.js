import Api from 'assets/api'
import $http from 'assets/js/ajax'
import CUSTOMER_API from 'assets/api/customer-api'

// 获取数据字典
export function getDataDictionaryByType(dataType) {
  if (!dataType) return Promise.resolve([])
  return $http({
    url: Api.getDataDictionaryByType,
    method: 'get',
    data: { dataType }
  })
}

// 国家地区
export const getCountry = getDataDictionaryByType('COUNTRY')
  .then(data => {
    return Array.isArray(data) && data || []
  }).catch(e => [])

// 业务类型
export const getCarrierType = getDataDictionaryByType('carrierType')
  .then(data => {
    return Array.isArray(data) && data || []
  }).catch(e => [])


// JOOM逆向入库原因
export const getJoomReversalInstock = getDataDictionaryByType('joomReversalInstock')
  .then(data => {
    return Array.isArray(data) && data || []
  }).catch(e => [])


// 维度类型
export const getDistrictGroup = (data, type) => {
  let {warehouseId, searchRangeType } = data
  if (type) searchRangeType = type
  if (warehouseId && searchRangeType) {
    return $http({
      url: Api.queryStorageCapacityType,
      method: 'get',
      data: {
        warehouseId: warehouseId,
        districtType: searchRangeType
      }
    })
  } else {
    return {
      data: []
    }
  }
}

// 包裹类型
export const packageTypeOptions = $http({
  url: Api.getDistrictBagTypeNames,
}).then(data => {
  window._PACKAGETYPEOPTIONS = Array.isArray(data) && data.map(d => ({
    ...d,
    value: d.code
  })) || []
  return window._PACKAGETYPEOPTIONS
}).catch(e => [])


// 存储类型
export const getStorageTypeOptions = $http({
  url: Api.getDistrictStorageTypeNames,
}).then(data => {
  return Array.isArray(data) && data.map(d => ({
    ...d,
    value: d.code
  }))
}).catch(e => [])

// 天猫汇波包裹类型
export const getWavePackageType = $http({
  url: 'sys/data/dictionary/getGoodsTypeList',
}).then(data => {
  return Array.isArray(data) && data || []
}).catch(e => [])



// 获取正常库区列表
export const getDistrictOptions = async({field, warehouseId}) => {
  warehouseId = warehouseId || field.getValue('warehouseId')
  if (!warehouseId) return []
  const list = await $http({
    url: Api.getDistrictNames.replace("{warehouseId}", warehouseId),
    method: 'post',
    data:{
      storageTypeList: [5]
    }
  }).then(d=> {
    return Array.isArray(d) && d.map(e => ({
      ...e,
      label: e.name,
      value: e.id
    }))
  }).catch(e => [])
  return list
}

// 获取库区组列表
export const getDistrictGroupOptions = async({field, warehouseId}) => {
  warehouseId = warehouseId || field.getValue('warehouseId')
  if (!warehouseId) return []
  const list = await $http({
    url: `sys/storageAreaGroup/getGroupList?warehouseId=${warehouseId}`,
    method: 'post',
  }).then(d=> {
    return Array.isArray(d) && d.map(e => ({
      ...e,
      label: e.groupName,
      value: e.groupId
    }))
  }).catch(e => [])
  return list
}


// 波次汇单维度
export const getWaveCreationDimensionList = async({field, warehouseId}) => {
  warehouseId = warehouseId || field.getValue('warehouseId')
  if (!warehouseId) return []
  const list = await $http({
    url: Api.getWaveCreationDimensionList,
    method: 'get',
    data:{
      warehouseId
    }
  }).then(d=> {
    return Array.isArray(d) && d.map(e => ({
      ...e,
      label: e.name,
      value: Number(e.code)
    }))
  }).catch(e => [])
  return list
}

// 渠道名称
export const getEndCarrierList = async({field, deliveryType}) => {
  deliveryType = deliveryType || field.getValue('deliveryType')
  if (!deliveryType) return []
  const list = await $http({
    url: Api.getEndCarrierList,
    method: 'get',
    data:{
      deliveryType
    }
  }).then(d=> {
    return Array.isArray(d) && d || []
  }).catch(e => [])
  return list
}

// 未端分拨仓
export const getWarehouseListW = async({field, endCarrier}) => {
  endCarrier = endCarrier || field.getValue('endCarrier')
  if (!endCarrier) return []
  const list = await $http({
    url: Api.getWarehouseListW,
    method: 'get',
    data:{
      endCarrier
    }
  }).then(d=> {
    return Array.isArray(d) && d.map(e => ({
      ...e,
      label: e.code,
      value: e.code
    }))
  }).catch(e => [])
  return list
}


// 订单状态
export async function getOrderStatusOptions() {
  try {
    const res = await $http({
      url: CUSTOMER_API.getOrderStatusNames,
      method: 'get',
    })
    return Array.isArray(res) && res.map(r => {
      return {
        ...r,
        value: r.code
      }
    }) || []
  } catch(e) {
    return []
  }
}


// 获取移动管理平台大小组环节
export const getDingApiMenuData = $http({
  url: '/dingApi/monitor/getDingApiMenu',
  method: 'get'
}).then(res => {
  return res || {};
}).catch(e => {})