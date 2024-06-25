import {getWid, getObjType, isEmpty} from 'assets/js'
import $http from 'assets/js/ajax'

// 查询条件
export const searchUrl = '/added/services/task/list'

// 获取任务状态
export const getTaskStatusOptions = $http({
  url: '/added/services/task/getStatus',
  method: 'get'
}).then(res => {
  let list = []
  if (getObjType(res) === 'Object') {
    list = Object.entries(res).map(([value, label]) => {
      return { value, label }
    })
  }
  return list
}).catch(err => [])

// 分配任务
export async function getTaskAllocation(result) {
  const {data, selectRows = []} = result
  await $http({
    url: '/added/services/task/allocation',
    method: 'post',
    data: {
      warehouseId: selectRows[0].warehouseId,
      ids: selectRows.map(s => s.id),
      employeeId: data.id
    }
  })
}

// 任务完结
export async function getTaskFinish(data) {
  const {warehouseId, ids, content} = data
  await $http({
    url: '/added/services/task/finishTask',
    method: 'post',
    data: {
      warehouseId,
      ids,
      taskResult: -1,
      content
    }
  })
}

// 照片审核
export async function getAuditPicture(data) {
  await $http({
    url: '/added/services/task/auditPicture',
    method: 'post',
    data: {
      warehouseId: data.warehouseId,
      taskOrderId: data.id,
      fileUrl: data.fileUrl.map(f => f.url).join(';')
    }
  })
}


// 获取日志
export const getLogList = async(data) => {
  try {
    const res = await $http({
      url: '/added/services/task/logs',
      method: 'get',
      data: {
        id: data.id,
        warehouseId: data.warehouseId
      }
    })
    return {
      logs: Array.isArray(res) && res || []
    }
  } catch(e) {
    return {}
  }

}