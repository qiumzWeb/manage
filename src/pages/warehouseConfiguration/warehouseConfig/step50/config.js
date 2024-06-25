import React from 'react';
import { getCompanyList } from '../step10/config'
import { AFormTable, ASelect, Input, Upload, Button, Icon, Message } from '@/component'
import { getWareHouseDistrictOptions } from '@/pages/warehouseConfiguration/warehouseConfig/step40/config'
import { getStepBaseData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import $http from 'assets/js/ajax';
import { isEmpty } from 'assets/js';
import StorageLocationPreview from './StorageLocationPreview';

const isTMall = () => getStepBaseData().isTMall
// 查询接口
export const searchUrl = '/sys/storagePosition/queryList'


// 生成库位
export async function getCreateSysStoragePositions(shelveList) {
  // 检查是否可生成库位
  await $http({
    url: '/sys/storagelocation/checkIsCreatedStoragePositions',
    method: 'post',
    data: shelveList.map(s => s.shelvesId)
  })
  // 生成库位
  await $http({
    url: '/sys/storagelocation/openCreateSysStoragePositions',
    method: 'post',
    data: shelveList
  })
}



// 查询配置
export const searchModel = {
  warehouseDistrictIdList: {
    label: '库区',
    component: ASelect,
    attrs: {
      showSearch: true,
      watchKey: 'warehouseId',
      mode: 'multiple',
      getOptions: async() => await getWareHouseDistrictOptions()
    }
  },
  roadwayIdList: {
    label: '巷道',
    component: ASelect,
    attrs: {
      watchKey: 'warehouseDistrictIdList,warehouseId',
      showSearch: true,
      mode: 'multiple',
      getOptions: async({field}) => {
        const list = field.getValue('warehouseDistrictIdList')
        const warehouseId = getStepBaseData().warehouseId
        if (isEmpty(list)) return []
        const option = await $http({
          url: `/sys/laneway/getAssignedLaneways/${warehouseId}`,
          method: 'post',
          data: list
        })
        return Array.isArray(option) && option.map(o => ({
          ...o,
          label: o.lanewayCode,
          value: o.id
        }))
      }
    }
  },
  shelveIdList: {
    label: '货架',
    component: ASelect,
    attrs: {
      showSearch: true,
      mode: 'multiple',
      watchKey: 'warehouseDistrictIdList,roadwayIdList,warehouseId',
      getOptions: async({field}) => {
        const data = field.getValues()
        const warehouseDistrictIdList = data.warehouseDistrictIdList
        const roadwayIdList = data.roadwayIdList
        const warehouseId = getStepBaseData().warehouseId
        if (isEmpty(warehouseDistrictIdList) || isEmpty(roadwayIdList)) return []
        const option = await $http({
          url: searchUrl,
          method: 'post',
          data: {
            warehouseDistrictIdList,
            roadwayIdList,
            warehouseId,
            pageNum: 1,
            pageSize: 1000
          }
        })
        return option && Array.isArray(option.data) && option.data.map(o => ({
          ...o,
          label: o.shelvesCode,
          value: o.shelvesId
        }))
      }
    }
  }
}

// 列表配置
export const columnsModel = {
  name: {
    title: '库区'
  },
  lanewayCode: {
    title: '巷道'
  },
  shelvesCode: {
    title: '货架'
  },
  isCreated: {
    title: '状态',
    cell: (val) =>  val == 1 ? '已生成' : '未生成'
  }
}

// 批量导入配置
export const batchExportModel = {
  file: {
    fileName: 'storagePositionUploadExcel.xlsx',
    componentType: 'import',
  }
}

// 库位预览
export const storagelocationPreviewModel = {
  list: {
    label: '',
    span: 24,
    component: StorageLocationPreview,
  }
}

// 批量删除库位
export function getBatchDeleteStorage(fileData, warehouseId) {
  const fileList = fileData.file
  const formData = new FormData()
  Array.isArray(fileList) && fileList.forEach(file => {
    formData.append('file', file.originFileObj)
  })
  formData.append('warehouseId', warehouseId)
  return $http({
    url: '/sys/storagePosition/excel/delete',
    method: 'post',
    data: formData,
    timeout: 60000,
    dataType: 'form',
  })
}
