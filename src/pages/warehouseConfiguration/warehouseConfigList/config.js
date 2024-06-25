import React from 'react';
import { Input, ASelect, Button } from '@/component'
import {getWid, getObjType, isEmpty} from 'assets/js'
import { getCopyWarehouse } from './api'
// 仓库类型
export const warehouseTypeOptions = [
  {label: '天猫', value: 1},
  {label: 'LZD', value: 2},
  {label: 'AE', value: 3},
]

// 开仓状态
export const warehouseStatusOptions = [
  {label: '进行中', value: 10},
  {label: '配置完成', value: 20},
  {label: '已生效', value: 30},
  {label: '已作废', value: 40}
]
// 开仓进度
export const warehouseProgressOptions = [
  {label: '新增仓库', value: 10},
  {label: '场地配置', value: 20},
  {label: '实操环节配置', value: 30},
  {label: '物料设备配置', value: 40},
  {label: '运营监控配置', value: 50},
  {label: '开仓完成', value: 60}
]

export const qSearch = {
    openWarehouseCode: {
      label: '开仓编码',
      attrs: {
        placeholder: '请输入关键字搜索'
      }
    },
    warehouseName: {
      label: '仓库名称',
      attrs: {
        placeholder: '请输入关键字搜索'
      }
    },
    warehouseType: {
      label: '仓库类型',
      component: ASelect,
      attrs: {
        getOptions: async() => warehouseTypeOptions
      }
    },
    warehouseStatus: {
      label: '状态',
      component: ASelect,
      attrs: {
        getOptions: async() => warehouseStatusOptions
      }
    },
    warehouseProgress: {
      label: '开仓进度',
      component: ASelect,
      attrs: {
        getOptions: async() => warehouseProgressOptions
      }
    }

}

export const qColumns = {
    openWarehouseCode: {
      title: '开仓编号',
    },
    warehouseName: {
      title: '仓库名称',
    },
    warehouseId: {
      title: '仓库ID',
    },
    warehouseTypeName: {
      title: '仓库类型',
    },
    warehouseStatusName: {
      title: '状态'
    },
    warehouseProgressName: {
      title: '开仓进度',
    },
    createdBy: {
      title: '创建人',
    },
    gmtCreate: {
      title: '创建时间'
    },
}

// 详情配置
export const detailModel = {
  warehouseType: {
    label: '仓库类型',
    component: ASelect,
    required: true,
    attrs: {
      getOptions: async() => warehouseTypeOptions
    }
  },
  isCopy: {
    label: '是否复用现有仓库',
    required: true,
    component: ASelect,
    defaultValue: '2',
    attrs: {
      isRadio: true,
      getOptions: async() => [
        {label: '是', value: '1'},
        {label: '否', value: '2'}
      ]
    }
  },
  baseWarehouseId: {
    label: '复用仓库',
    required: true,
    tips: <div>
    <p className='warn-color' style={{fontSize: 14, marginBottom: 10}}>注：选择复用仓库后，进入以下配置流程后将会自动复用该仓的数据</p>
    <p>
      场地配置： 新增库区、新增巷道货架、新增库位、库位配置、新增库区组
    </p>
    <p>
      实操规则配置： 签收配置、入库配置、上架配置、下架配置
    </p>
  </div>,
    show: (data) => data.isCopy == 1,
    component: ASelect,
    attrs: {
      watchKey: 'warehouseType',
      showSearch: true,
      getOptions: async({field}) => {
        const warehouseType = field.getValue('warehouseType');
        if (!warehouseType) return [];
        const res = await getCopyWarehouse(warehouseType);
        return res
      }
    }
  }
}

