import $http from 'assets/js/ajax'
import {isEmpty} from 'assets/js'

export const getDictionaryData = new Promise(resolve => {
  $http({
    url: '/pcsweb/sys/data/dictionary',
    oldApi: true,
    method: 'get'
  }).then(data => {
    console.log(data, '老数据')
    resolve(data || {})
  })
})

export const getASelectOptions = function(key){
  return async() => {
    const getOptions = await getDictionaryData
    return Object.entries(getOptions[key]).map(([key, val]) => ({
        label: val,
        value: key
    }))
  }
}

export const getDateTimeStr = (t) => {
  return t && t.format && t.format('YYYY-MM-DD HH:mm:ss') || t || undefined
}

export const getRangTime = (data, {time, start, end}) => {
  const source = data && data[time] || []
  const [s, e] = source
  return {
    [time]: undefined,
    [start]: getDateTimeStr(s),
    [end]: getDateTimeStr(e)
  }
}




export const filterData = (data) => {
  const d = {}
  Object.entries(data).forEach(([key,val]) => {
    if (!isEmpty(val)) {
      d[key] = val
    }
  })
  return d
}