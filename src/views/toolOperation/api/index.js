import $http from 'assets/js/ajax'

// 查询
export const getToolList = $http({
    url: '/pcsweb/tools/config',
    method: 'get',
  })

  // 操作记录查询
export const recordQueryList = '/tools/queryHistory'