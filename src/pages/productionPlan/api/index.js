import $http from 'assets/js/ajax';
import { Message } from '@/component'
import moment from 'moment'
import { getWid, filterNotEmptyData } from 'assets/js'
// 查询
export const searchApi = '/pcs/production/plan/search'
// 下载模板
export async function getDownloadTemplate(warehouseId) {
  try {
    const res = await $http({
      url: `/pcs/production/plan/warehouseId/${warehouseId}/download`,
      method: 'get',
      responseType: 'blob'
    })
    downloadExcel(res, '生产计划模板' + moment().format("YYYYMMDD"))
  } catch (e) {
    Message.error(e.message)
  }
}

// 导入数据
export async function getUpload(fileList) {
  // console.log(fileList, 8989)
  // try {
    const formData = new FormData()
    Array.isArray(fileList) && fileList.forEach(file => {
      formData.append('productionPlanFile', file.originFileObj)
    })
    await $http({
      url: '/pcs/production/plan/upload',
      method: 'post',
      data: formData,
      timeout: 60000,
      dataType: 'form',
    })
    Message.success('上传成功')
  // } catch (e) {
    // Message.error(e.message)
  // }
}

// 导出
export async function getExport(data) {
  try {
    const res = await $http({
      url: '/pcs/production/plan/export',
      method: 'post',
      data,
      responseType: 'blob'
    })
    downloadExcel(res, '生产计划' + moment().format("YYYYMMDD"))
  } catch(e) {
    Message.error(e.message)
  }
}

// 下载数据
export function downloadExcel(res, name) {
  const fileName = name + '.xls'
  const blob = new Blob([res], {type: 'application/vnd.ms-excel'})
  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(blob, fileName)
  } else {
    const url = window.URL.createObjectURL(blob)
    let a = document.createElement('a')
    a.download = name + '.xls'
    a.href= url
    a.click()
    window.URL.revokeObjectURL(url)
    a = null
  }
}

// 编辑
export function toEdit(data) {
  return $http({
    url: '/pcs/production/plan/update',
    method: 'post',
    data
  })
}

// 删除
export function toDelete(data) {
  return $http({
    url: '/pcs/production/plan/delete',
    method: 'post',
    data
  })
}

// 获取作业环节下拉数据
const jobNodeOption = $http({
  url: '/pcs/production/plan/getJobNode',
  method: 'get',
})
export function getJobNode() {
  return jobNodeOption
}

// 获取业务类型下拉数据
const bizTypeOption = $http({
  url: '/pcs/production/plan/pressureMonitor/getBizTypeList',
  method: 'get',
})
export function getBizType() {
  return bizTypeOption
}

// 获取作业大组下拉数据 
export function getBigJobTeamGroup(data) {
  return $http({
    url: '/sys/labor/group/largeGroupList',
    method: 'get',
    data
  })
}

// 获取作业小组下拉数据 
export function getJobTeamGroup(data) {
  return $http({
    url: '/pcs/production/plan/getJobTeamGroup',
    method: 'get',
    data
  })
}

// 规则配置查询
export const ruleApi = '/pcs/production/plan/rule/search'


// 新增规则
export function toAddRule(data) {
  return $http({
    url: '/pcs/production/plan/rule/insert',
    method: 'post',
    data
  })
}

// 修改规则
export function toEditRule(data) {
  return $http({
    url: '/pcs/production/plan/rule/update',
    method: 'post',
    data
  })
}

// 删除规则
export function toDeleteRule(data) {
  return $http({
    url: '/pcs/production/plan/rule/delete',
    method: 'post',
    data
  })
}

// 规则类型
const ruleTypeRequest = $http({
  url: "/pcs/production/plan/rule/getRuleTypeList",
  method: 'get',
})
export function getRuleTye() {
  return ruleTypeRequest
}

// 环节人效查询 
export const efficiencyQuery = 'pcs/production/plan/nodeEmployeeEffect/search'

// 人效下载模板
export async function efficiencyDownTem(warehouseId) {
  try {
    const res = await $http({
      url: `/pcs/production/plan/nodeEmployeeEffect/${warehouseId}/download`,
      method: 'get',
      responseType: 'blob'
    })
    downloadExcel(res, '环节人效模板' + moment().format("YYYYMMDD"))
  } catch (e) {
    Message.error(e.message)
  }
}

// 人效导入
export async function getEfficiencyUpload(fileList) {
  // console.log(fileList, 8989)
  // try {
    const formData = new FormData()
    Array.isArray(fileList) && fileList.forEach(file => {
      formData.append('productionPlanFile', file.originFileObj)
    })
    await $http({
      url: '/pcs/production/plan/nodeEmployeeEffect/upload',
      method: 'post',
      data: formData,
      timeout: 60000,
      dataType: 'form',
    })
    Message.success('上传成功')
  // } catch (e) {
    // Message.error(e.message)
  // }
}

// 环节人效导出
export async function getEfficiencyExport(data) {
  try {
    const res = await $http({
      url: '/pcs/production/plan/nodeEmployeeEffect/export',
      method: 'post',
      data,
      responseType: 'blob'
    })
    downloadExcel(res, '环节人效' + moment().format("YYYYMMDD"))
  } catch(e) {
    Message.error(e.message)
  }
}


// 用工计划
export const useWorkSearchApi = '/pcs/production/plan/employmentPlan/search'

// 用工计划汇总
export const userWorkSearchSumApi = "/pcs/production/plan/employmentPlan/search/summary"

// 用工计划导出
export async function getUseWorkExport(data) {
  try {
    const res = await $http({
      url: '/pcs/production/plan/employmentPlan/export',
      method: 'post',
      data,
      responseType: 'blob'
    })
    downloadExcel(res, '用工计划' + moment().format("YYYYMMDD"))
  } catch(e) {
    Message.error(e.message)
  }
}

// 生产达成
export const produceSearchApi = '/pcs/production/plan/productionReach/search'

// 生产达成汇总
export const produceSearchSumApi = '/pcs/production/plan/productionReach/summary'

// 生产达成导出
export async function getProduceExport(data) {
  try {
    const res = await $http({
      url: '/pcs/production/plan/productionReach/export',
      method: 'post',
      data,
      responseType: 'blob'
    })
    downloadExcel(res, '生产达成' + moment().format("YYYYMMDD"))
  } catch(e) {
    Message.error(e.message)
  }
}

// 出库合单预测
export const outStockSearchApi = '/pcs/production/plan/outStockNoticePre/search'

// 出库合单导出
export async function getOutStockExport(data) {
  try {
    const res = await $http({
      url: '/pcs/production/plan/outStockNoticePre/export',
      method: 'post',
      data,
      responseType: 'blob'
    })
    downloadExcel(res, '出库合单预测' + moment().format("YYYYMMDD"))
  } catch(e) {
    Message.error(e.message)
  }
}


// 生产进度压力监控查询 
export const pressureMonitorSearch = '/pcs/production/plan/pressureMonitor/search'

// 生产进度压力监控下载模板
export async function pressureMonitorDownTem(warehouseId) {
  try {
    const res = await $http({
      url: `/pcs/production/plan/pressureMonitor/${warehouseId}/download`,
      method: 'get',
      responseType: 'blob'
    })
    downloadExcel(res, '生产进度压力监控模板' + moment().format("YYYYMMDD"))
  } catch (e) {
    Message.error(e.message)
  }
}

// 生产进度压力监控导入
export async function getPressureMonitorUpload(fileList) {
  // try {
    const formData = new FormData()
    Array.isArray(fileList) && fileList.forEach(file => {
      formData.append('productionPlanFile', file.originFileObj)
    })
    await $http({
      url: '/pcs/production/plan/pressureMonitor/upload',
      method: 'post',
      data: formData,
      timeout: 60000,
      dataType: 'form',
    })
    Message.success('上传成功')
  // } catch (e) {
    // Message.error(e.message)
    
  // }
}

// 生产进度压力监控导出
export async function getPressureMonitorExport(data) {
  try {
    const res = await $http({
      url: '/pcs/production/plan/pressureMonitor/export',
      method: 'post',
      data,
      responseType: 'blob'
    })
    downloadExcel(res, '生产进度压力监控' + moment().format("YYYYMMDD"))
  } catch(e) {
    Message.error(e.message)
  }
}

/**
 * 生产计划配置 - 新
 */

// 获取 总计划-动态计划调整
export async function getUPPHConfig() {
  try {
    const res = await $http({
      url: '/sys/production/config/upph/search',
      method: 'post',
      data: {
        warehouseId: getWid(),
        configValidDate: moment().format('YYYY-MM-DD 00:00:00')
      }
    })
    return res
  } catch(e) {
    Message.error(e.message)
    return {}
  }
}

// 保存 总计划-动态计划调整 信息
export function saveUPPHConfig(data) {
  return $http({
    url: '/sys/production/config/upph/addOrModify',
    method: 'post',
    data: filterNotEmptyData(data)
  })
}



// 获取其它配置信息
export async function getOtherPlanConfig() {
  try {
    const res = await $http({
      url: '/sys/production/config/plan/list',
      method: 'get',
      data: {
        warehouseId: getWid()
      }
    })
    return res
  } catch(e) {
    Message.error(e.message)
    return {}
  }
}


// 保存 总计划-动态计划调整 信息
export function savePlanOtherConfig(data) {
  return $http({
    url: '/sys/production/config/plan/addOrModify',
    method: 'post',
    data: filterNotEmptyData(data)
  })
}
