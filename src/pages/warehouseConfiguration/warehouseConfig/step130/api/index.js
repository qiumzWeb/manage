import { Message } from '@/component'
import { getWid } from 'assets/js'
import moment from 'moment'
import $http from 'assets/js/ajax'
import { downloadExcel } from '@/assets/js/utils';
import { getStepBaseData, setStepBaseData, saveStepNode, InitDefaultData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
// 查询
export const searchApi = '/sys/container/list'

// 清单 查询
export const listSearch = '/sys/container/view'

// 新增容器
export async function addContainer(data) {
  try {
    const res = await $http({
      url: '/sys/container/add',
      method: 'post',
      data: {
        ...data,
        warehouseId: getStepBaseData().warehouseId
      },
    })
    Message.success('新增成功')
    saveStepNode(140)
  } catch(e) {
    Message.error(e.message)
  }
}

// 获取流向下拉配置
export const getSortCodeOptions = $http({
  url: '/sys/container/getSortingCode',
  method: 'get',
  oldApi: true,
}).then(res => Array.isArray(res) && res.map(r => ({
  label: r,
  value: r
}))).catch(e => [])

