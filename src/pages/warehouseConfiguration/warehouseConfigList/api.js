import {getWid, getObjType, isEmpty} from 'assets/js'
import $http from 'assets/js/ajax'
import API from 'assets/api'

// 查询条件
export const searchUrl = '/sys/openWarehouse/pageQuery'

// 获取复用仓库
export async function getCopyWarehouse(warehouseType) {
  return $http({
    url: '/sys/openWarehouse/queryCopyWarehouseList',
    method: 'get',
    data: {warehouseType}
  })
  .then(res => {
    return Array.isArray(res) && res.map(r => ({
      ...r,
      label: r.warehouseName,
      value: r.warehouseId
    })) || []
  })
  .catch(e => [])
}

// 新增物理仓
export function getCreateWarehouse(data) {
  return $http({
    url: '/sys/openWarehouse/open',
    method: 'get',
    data
  })
}

// 启用作废
export function updateWarehouseStatus(data) {
  return $http({
    url: '/sys/openWarehouse/updateWarehouseStatus',
    method: 'get',
    data
  })
}





