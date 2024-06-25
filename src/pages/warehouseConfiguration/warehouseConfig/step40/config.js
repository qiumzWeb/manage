import React from 'react';
import { getCompanyList } from '../step10/config'
import { AFormTable, ASelect, Input, Upload, Button, Icon, NumberPicker, Message } from '@/component'
import { getStepBaseData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import { getWareHouseDistrictList } from '@/pages/warehouseConfiguration/warehouseConfig/step30/config';

const isEditable = () => !getStepBaseData().readOnly
const isTMall = () => getStepBaseData().isTMall
// 获取关联库区
export const getWareHouseDistrictOptions = () => getWareHouseDistrictList({
  warehouseId: getStepBaseData().warehouseId
}).then(list => {
  return list.map(l => ({
    ...l,
    label: l.name,
    value: l.id
  }))
})

// 巷道信息
export const TunnelModel = {
  lanewayCode: {
    title: '巷道代码',
  },
  saturation: {
    title: '饱和度(%)'
  },
  locationQuantity: {
    title: '库位总量',
  },
  storageCapacity: {
    title: '巷道总容量',
  },
  refDistrictName: {
    title: '关联库区'
  },
  make: {
    title: '操作'
  }

}

// 编辑巷道
export const TunnelDetailModel = {
  warehouseShortname: {
    label: '仓库名称',
    disabled: true
  },
  lanewayCode: {
    label: '巷道代码',
    required: true,
  },
  saturation: {
    label: '饱和度(%)',
    required: true,
  },
  locationQuantity: {
    label: '库位总量',
    required: true,
  },
  storageCapacity: {
    label: '巷道总容量',
    required: true,
  },
}

// 编辑货架
export const ShelvesDetailModel = {
  refWarehouseDistrictId: {
    label: '关联库区',
    component: ASelect,
    disabled: () => !isEditable(),
    required: true,
    attrs: {
      showSearch: true,
      getOptions: async() => {
        return await getWareHouseDistrictOptions()
      }
    }
  },
  list: {
    label: '',
    component: AFormTable,
    span: 24,
    attrs: {
      hasAdd: isEditable,
      maxLength: 100,
      columns: {
        shelvesCode: {
          title: '货架代码',
          required: true,
          edit: isEditable,
        },
        columnNum: {
          title: '货架列数',
          required: true,
          component: NumberPicker,
          edit: isEditable,
          attrs: {
            min: 0,
            max: 99
          }
        },
        rowNum: {
          title: '货架层数',
          required: true,
          component: NumberPicker,
          attrs: {
            min: 0,
            max: 99
          },
          edit: isEditable,
        },
      }
    }
  }
}

// 批量导入
export const batchExportModel = {
  file: {
    fileName: 'lanewayUploadExcel.xlsx',
    componentType: 'import',
  }
}