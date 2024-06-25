
import $http from 'assets/js/ajax'
import CUSTOMER_API from 'assets/api/customer-api'

// 获取大包状态
export const getBigPackageStatusOptions = $http({
  url: CUSTOMER_API.getBigPackageNames,
}).then(data => {
  return data && Object.entries(data).map(([value, label]) => ({
    label,
    value
  }))
}).catch(e => [])

// 签收点
export const signRegionOptions = [
  {label: '蓄水区', value: 'storage'},
  {label: '操作区', value: 'operation'},
]