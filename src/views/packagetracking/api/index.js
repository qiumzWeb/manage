import $http from 'assets/js/ajax'


// 单号查询
export const getQueryList = (data) => {
  return $http({
    url: '/track/queryList',
    method: 'post',
    data
  })
}

// 一段包裹轨迹查询
export const getPackageTrack = (data) => {
  return $http({
    url: '/track/sync/package',
    method: 'post',
    data
  })
}