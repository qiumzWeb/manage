import $http from 'assets/js/ajax'

// 配置分组
export const getBaseConfigGroup = $http({
  url: '/pcsweb/tool/jyb360/config',
  method: 'get'
}).then(data => {
  if (data && Array.isArray(data.groups)) {
    data.groups = data.groups.map(d => ({
      ...d,
      label: d.desc,
      value: d.name
    }))
  }
  if (data && Array.isArray(data.searchGroups)) {
    data.searchGroups = data.searchGroups.map(s => {
      try {
        return {
          label: s.displayName,
          value: JSON.stringify(s.tables)
        }
      } catch(e) {
        return {
          label: s.displayName,
          value: ''
        }
      }

    })
  }
  return data
}).catch(e => [])

// 获取配置列表

export const getConfigList = '/tool/jyb360/pageTableMetaData'


// 配置保存
export const getConfigSave = (data) => {
  return $http({
    url: '/tool/jyb360/saveTableMetaData',
    method: 'post',
    data
  })
}

// 配置详情
export const getPackageData = (id) => {
  return $http({
    url: `/tool/jyb360/detailMetaData/${id}`,
    method: 'get',
  })
}

// 配置删除
export const getConfigDelete = (id) => {
  return $http({
    url: `/tool/jyb360/delById/${id}`,
    method: 'delete',
  })
}

// 
// 包裹查询
export const getQueryData = (data) => {
  return $http({
    url: '/tool/jyb360/queryData',
    method: 'post',
    data
  })
}
