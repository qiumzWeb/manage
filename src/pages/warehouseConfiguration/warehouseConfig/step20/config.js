import { getCompanyList } from '../step10/config'
import { AFormTable, ASelect, Input } from '@/component'
import $http from 'assets/js/ajax'
import API from 'assets/api'
import { getStepBaseData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
const isEditable = () => !getStepBaseData().readOnly
// 查询虚仓数据
export function getVirtualWarehouseList(data) {
  return $http({
    url: API.getVirtualWarehouseList,
    method: 'get',
    data: {
      pageNum: 1,
      pageSize: 20,
      ...data,
    }
  }).then(res => {
    return res && res.data || []
  })
}

// 保存虚仓
export async function getSaveVirtualWarehouse(data) {
  await $http({
    url: '/sys/virtual-warehouses/batchCreate',
    method: 'post',
    data
  })
}

// 虚仓信息
export const virtualWarehouseInfo = {
  virtualWarehouseList: {
    label: '',
    component: AFormTable,
    span: 24,
    attrs: {
      hasAdd: isEditable,
      maxLength: 100,
      columns: {
        virtualWarehouseName: {
          title: '虚仓名称',
          required: true,
          width: 300,
          edit: isEditable,
          attrs: {
            maxLength: 256
          }
        },
        virtualWarehouseCode: {
          title: '虚仓代号',
          required: true,
          width: 300,
          edit: isEditable,
        },
        virtualWarehouseDescription: {
          title: '虚仓描述',
          // component: Input.TextArea,
          edit: isEditable,
          attrs: {
            // rows: 4,
            maxLength: 512,
            placeholder: '请描述虚仓用途或业务等',
            // showLimitHint: true
          }
        },
      }
    }
  }
}
