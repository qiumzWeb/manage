import $http from 'assets/js/ajax'


// 单号查询
export const getTreeList = (data) => {
  return $http({
    url: '/tools/getAuthInfo',
    method: 'get',
    data
  })
}

// 一段包裹轨迹查询
export const saveToolAuth = (data) => {
  return $http({
    url: '/tools/auth',
    method: 'post',
    data
  })
}