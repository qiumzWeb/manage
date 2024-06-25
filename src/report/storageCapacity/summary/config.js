import { Input, Select, Button, Radio, DatePicker } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid, isEmpty} from 'assets/js'
import { getDistrictGroup } from '@/report/apiOptions'


export const qSearch = [
  {
    warehouseId: {
      label: '仓库名称',
      defaultValue: getWid(),
      component: ASelect,
      formItem: {
        labelCol: {span: 5},
        wrapperCol: {span: 18}
      },
      attrs: {
        hasClear: false
      }
    },
    searchRangeType: {
      label: '统计维度',
      defaultValue: '0',
      component: ASelect,
      attrs: {
        hasClear: false,
        getOptions: async() => {
          return [
            {label: '全仓维度', value: '0'},
            {label: '库区组维度', value: '1'},
            {label: '库区维度', value: '2'},
            {label: '巷道维度', value: '3'},
            {label: '库区类型', value: '4'},
          ]
        }
      }
    },
    districtGroupList: {
      label: '库区组维度',
      component: ASelect,
      show: data => data.searchRangeType === '1',
      attrs: {
        mode: 'multiple',
        placeholder: "请选择",
        watchKey: 'warehouseId',
        getOptions: async({field}) => {
          const values = field.getValues()
          const {data} = await getDistrictGroup(values)
          return Array.isArray(data) && data.map(d => ({
            label: d.name,
            value: d.code
          })) || []
        }
      }
    },
    districtList: {
      label: '库区维度',
      component: ASelect,
      show: data => data.searchRangeType === '2',
      attrs: {
        mode: 'multiple',
        watchKey: 'warehouseId',
        getOptions: async({field}) => {
          const values = field.getValues()
          const {data} = await getDistrictGroup(values)
          return Array.isArray(data) && data.map(d => ({
            label: d.name,
            value: d.code
          })) || []
        }
      }
    },
    waringType: {
      label: '库容预警',
      component: ASelect,
      show: data => data.searchRangeType === '2',
      attrs: {
        placeholder: "请选择",
        watchKey: 'warehouseId',
        getOptions: async({field}) => {
          const values = field.getValues()
          const {data} = await getDistrictGroup({
            ...values,
            searchRangeType: '5'
          })
          return Array.isArray(data) && data.map(d => ({
            label: d.name,
            value: d.code
          })) || []
        }
      }
    },
    laneWayList: {
      label: '巷道维度',
      component: ASelect,
      show: data => data.searchRangeType === '3',
      attrs: {
        mode: 'multiple',
        watchKey: 'warehouseId',
        getOptions: async({field}) => {
          const values = field.getValues()
          const {data} = await getDistrictGroup(values)
          return Array.isArray(data) && data.map(d => ({
            label: d.name,
            value: d.code
          })) || []
        }
      }
    },
    storageTypeCodeList: {
      label: '库区类型',
      component: ASelect,
      show: data => data.searchRangeType === '4',
      attrs: {
        mode: 'multiple',
        watchKey: 'warehouseId',
        getOptions: async({field}) => {
          const values = field.getValues()
          const {data} = await getDistrictGroup(values)
          return Array.isArray(data) && data.map(d => ({
            label: d.name,
            value: d.code
          })) || []
        }
      }
    },
  }
]

// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
    lock: 'left'
  },
  entityType: {
    title: '统计维度',
  },
  entityName: {
    title: '维度名称',
    lock: 'left'
  },
  entityDistrictType: {
    title: '维度类型',
  },
  onShelvesTurnoverTypeName: {
    title: '包裹类型'
  },
  storageCapacityWarning: {
    title: '预警状态',
    tips: `在途库容利用率+已入未上库容利用率+在架库容利用率 与「库区管理」中【库容预警百分比】比较，
小于预警值为正常，大于预警值且小于100%为预警，大于100%为超容；`
  },
  owner: {
    title: '责任人',
  },
  ownerTelephone: {
    title: '责任人电话',
  },
  totalPositionsCount: {
    width: 200,
    title:  '理论|实际库位总量',
    tips:  `全仓维度 理论值：仓库内包含的库位总和，「库位管理」中（【货架列】*【货架层】)；
实际值：仓库内包含的巷道，在「巷道管理」中【库位总量】的总和；
库区组维度 理论值：库区组内包含的库位总和，「库位管理」中（【货架列】*【货架层】)； 
实际值：库区组内包含的巷道，在「巷道管理」中【库位总量】的总和； 
库区维度 理论值：库区内包含的库位总和，「库位管理」中（【货架列】*【货架层】)； 
实际值：库区内包含的巷道，在「巷道管理」中【库位总量】的总和； 
巷道维度 理论值：巷道内包含的库位总和，「库位管理」中（【货架列】*【货架层】)； 
实际值：对应巷道，在「巷道管理」中【库位总量】的总和；`,
  },
  totalPackageLimitCount: {
    width: 200,
    title: '理论|实际仓库总容量',
    tips: `全仓维度 理论值：仓库内包含的库位能存放包裹的总和，「库位配置」中【库位包裹数量上限】总和；
实际值：仓库内包含的巷道，在「巷道管理」中【巷道总容量】的总和； 
库区组维度 理论值：库区组内包含的库位能存放包裹的总和，「库位配置」中【库位包裹数量上限】总和；
实际值：库区组内包含的巷道，在「巷道管理」中【巷道总容量】的总和； 
库区维度 理论值：库区内包含的库位能存放包裹的总和，「库位配置」中【库位包裹数量上限】总和；
实际值：库区内包含的巷道，在「巷道管理」中【巷道总容量】的总和；
巷道维度 理论值：巷道内包含的库位能存放包裹的总和，「库位配置」中【库位包裹数量上限】总和； 
实际值：对应巷道，在「巷道管理」中【巷道总容量】的总和；`,
  },
  firstPackageStorageCapacity: {
    title:  '首单容量',
    tips:  `全仓维度：仓库内包含的库区，在「库区管理」中【库区首单数量上限】的总和；
库区组维度：库区组内包含的库区，在「库区管理」中【库区首单数量上限】的总和； 
库区维度：对应库区在「库区管理」中【库区首单数量上限】的总和；`,
  },
  totalBuyerCount: {
    title:  '在库客户数',
    tips:  `全仓维度：仓库所有在库的合单意向码数量(已入库+已上架)； 
库区组维度：库区组内所有在库的合单意向码数量(已入库+已上架)； 
库区维度：库区内在库的合单意向码数量(已入库+已上架)；（AE、TMALL: 客户ID）`,
  },
  transitTotalPackageCount: {
    title: '在途包裹数',
  },
  transitTotalPackageVolume: {
    title: '在途包裹体积',
  },
  transitTotalBuyerCount: {
    title: '在途客户数',
  },
  allStorageCapacityUseRatio: {
    width: 200,
    title:  '在途库容利用率',
    tips:  `库区组维度：在途库容利用率+已入未上库容利用率+在架库容利用率 与「库区组管理」中【库容预警百分比】比较，小于预警值为正常，大于预警值为超容；
库区维度：在途库容利用率+已入未上库容利用率+在架库容利用率 与「库区管理」中【库容预警百分比】比较，小于预警值为正常，大于预警值为超容；`,
    cell: rateRender
  },
  instockTotalPackageCount: {
    width: 200,
    title:  '已入未上包裹数',
    tips:  `已入库未上架的包裹总数`,
  },
  instockOccupiedVolume: {
    width: 200,
    title:  '已入未上包裹体积',
    tips:  `已入库未上架的包裹总体积`,
  },
  instockTotalBuyerCount: {
    width: 200,
    title: '已入未上客户数',
    tips:  `已入库未上架客户数（AE、TMALL: 客户ID）`,
  },
  instockTotalPackageRatio: {
    width: 200,
    title:  '已入未上库容占用率',
    tips:  `已入库未上架的包裹数/实际仓库总容量`,
    cell: rateRender
  },
  totalPackageCount: {
    title:  '在架包裹数',
    tips:  `全仓/库区组/库区/巷道已上架的包裹总数`,
  },
  actualOccupiedVolume: {
    title:  '在架包裹体积',
    tips:  `全仓/库区组/库区/巷道已上架的包裹总体积`,
  },
  onShelversBuyerCount: {
    title:  '在架客户数',
    tips:  `全仓/库区组/库区/巷道已上架客户数（AE、TMALL: 客户ID）`,
  },
  storageCapacityUseRatio: {
    width: 200,
    title:  '在架库容利用率',
    tips:  `全仓/库区组/库区/巷道在架包裹数/实际仓库总容量`,
    cell: rateRender
  },
  firstPackageStorageCount: {
    title:  '在架首单数',
    tips:  `全仓/库区组/库区/巷道已上架的首单包裹总数（AE、TMALL: 客户ID）`,
  },
  firstPackageStorageRatio: {
    width: 200,
    title:  '在架首单利用率',
    tips:  `在架首单数/仓库首单容量`,
    cell: rateRender
  },
}

// 利率渲染，添加%
function rateRender(val, index, record) {
  return val
  // return !isEmpty(val) && !/\%$/.test(val) && val + '%' || val
}