import React from 'react'
import { Input, Select, Button, Radio, DatePicker2 } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid, AsyncDebounce, isEmpty} from 'assets/js'
import Api from 'assets/api'
import $http from 'assets/js/ajax'
import { getASelectOptions } from '@/views/servicepages/config'
import { defaultSearchTime } from '@/report/utils'
import { getCarrierType, getCountry, getDistrictGroup, packageTypeOptions } from '@/report/apiOptions'
import { orderPlatformOptions } from '@/report/options'
export {
  defaultSearchTime
}

export const getTime = (s) => {
   return s && s.format && s.format('YYYY-MM-DD HH:mm:ss') || s || '';
}

export const qSearch = [
  {
    warehouseId: {
      label: '仓库名称',
      defaultValue: getWid(),
      component: ASelect,
      formItem: {
        labelCol: {span: 5},
        wrapperCol: {span: 18}
      }
    },
    lp: {
      label: '一段LP',
      attrs: {
        placeholder: '批量查询以空格分隔,最多10个'
      }
    },
    mailNo: {
      label: '一段运单号',
      attrs: {
        placeholder: '批量查询以空格分隔,最多10个'
      }
    },
    warehouseDistrictGroup: {
      label: '库区组',
      component: ASelect,
      attrs: {
        placeholder: "请选择",
        watchKey: 'warehouseId',
        getOptions: async({field}) => {
          const values = field.getValues()
          const {data} = await getDistrictGroup(values, '1')
          return Array.isArray(data) && data.map(d => ({
            label: d.name,
            value: d.name
          })) || []
        }
      }
    },
    warehouseDistrictType: {
      label: '库区类型',
      component: ASelect,
      attrs: {
        // mode: 'multiple',
        watchKey: 'warehouseId',
        getOptions: async({field}) => {
          const values = field.getValues()
          const {data} = await getDistrictGroup(values, '4')
          return Array.isArray(data) && data.map(d => ({
            label: d.name,
            value: d.code
          })) || []
        }
      }
    },
    warehouseDistrictIdList: {
      label: '存储库区',
      component: ASelect,
      attrs: {
        mode: 'multiple',
        placeholder: "请选择",
        watchKey: 'warehouseId',
        getOptions: async({field}) => {
          const values = field.getValues()
          if (isEmpty(values.warehouseId)) return []
          const {result} = await $http({
            url: Api.getWareHouseDistrictList,
            method: 'post',
            data: {
              warehouseId: values.warehouseId,
              pageSize: 400
            }
          })
          return Array.isArray(result) && result.map(d => ({
            label: d.name,
            value: d.id
          })) || []
        }
      }
    },
    storeLaneWayList: {
      label: '存储巷道',
      component: ASelect,
      disabled: data => isEmpty(data.warehouseDistrictIdList),
      attrs: {
        mode: 'multiple',
        watchKey: 'warehouseId,laneWaySearch,warehouseDistrictIdList',
        showSearch: true,
        getOptions: AsyncDebounce(async({field}) => {
          let values = field.getValues()
          console.log(values, 999)
          if (isEmpty(values.warehouseDistrictIdList)) return []
          const data = await $http({
            url: Api.getFuzzyLaneWayList.replace("{warehouseId}", values.warehouseId),
            method: 'get',
            data: {
              warehouseDistrictIdList: values.warehouseDistrictIdList,
              laneCode: values.laneWaySearch
            }
          })
          return Array.isArray(data) && data || []
        }),
        onSearch: (val, field) => {
          field.setValue('laneWaySearch', val)
        }
      }
    },
    serviceTypeEnumList: {
      label: '业务类型',
      component: ASelect,
      attrs: {
        mode: 'multiple',
        getOptions: async() => {
          const data = await getCarrierType
          return Array.isArray(data) && data || []
        }
      }
    },
    packageStatus: {
      label: '包裹状态',
      component: ASelect,
      attrs: {
        getOptions: getASelectOptions('packageStatus')
      }
    },
    countryCodeList: {
      label: '目的国',
      component: ASelect,
      attrs: {
        mode: 'multiple',
        getOptions: async() => {
          const data = await getCountry
          return Array.isArray(data) && data || []
        }
      }
    },
    storedDay: {
      label: '在库天数',
      component: React.forwardRef(function StoreDay(props){
        const { field } = props
        const storedDayCompare = field.getValue('storedDayCompare')
        return <Input
          {...props}
          addonTextBefore={
            <ASelect
              value={storedDayCompare}
              hasArrow={false}
              isDropDown
              dropStyle={{
                width: 30,
                height: 30,
                justifyContent: 'center'
              }}
              getOptions={async() => {
                return [
                  {label: '=', value: 'eq'},
                  {label: '>', value: 'gt'},
                  {label: '≥', value: 'ge'},
                  {label: '≤', value: 'le'},
                  {label: '<', value: 'lt'}
                ]
              }}
              onChange={(value) => {
                field.setValue('storedDayCompare', value)
              }}
            ></ASelect>
          }
        ></Input>
      }),
      attrs: {
        placeholder: '最多输入一位小数',
      }
    },
    warEntryTime: {
      label: '入库日期',
      fixedSpan: 22,
      component: DatePicker2.RangePicker,
      transTimeCode: ['warEntryTimeStart', 'warEntryTimeEnd'],
      format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true
      }
    },
    onShelvesTime: {
      label: '上架日期',
      fixedSpan: 22,
      component: DatePicker2.RangePicker,
      transTimeCode: ['onShelvesTimeStart', 'onShelvesTimeEnd'],
      format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true
      }
    },
    source: {
      label: '订单平台',
      component: ASelect,
      attrs: {
        getOptions: async() => orderPlatformOptions
      }
    }
  }
]
// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
    lock: 'left'
  },
  referLogisticsOrderCode: {
    title: '一段LP',
  },
  mailNo: {
    title: '一段运单号',
  },
  packageStatus: {
    title: '包裹状态',
    cell: (val) => {
      return <ASelect isDetail value={val} getOptions={getASelectOptions('packageStatus')}></ASelect>
    }
  },
  warehouseDistrictName: {
    title: '存储库区',
  },
  districtStorageTypeName: {
    title: '库区类型',
  },
  storeLaneway: {
    title: '存储巷道',
  },
  storeCode: {
    title: '存储库位',
  },
  buyerVipCode: {
    title: '买家旺旺',
  },
  serviceTypeName: {
    title: '业务类型',
  },
  countryName: {
    title: '目的国',
  },
  turnoverType: {
    title: '包裹类型',
    cell: (val) => <ASelect isDetail value={val} getOptions={async() => await packageTypeOptions}></ASelect>
  },
  onShelvesTimeCnt: {
    title: '在库天数',
  },
  warEntryWeight: {
    title: '入库重量',
  },
  warEntryVolume: {
    title: '入库体积',
  },
  warEntryTime: {
    title: '入库时间',
  },
  onShelvesTime: {
    title: '上架时间',
  },
  onShelvesUser: {
    title: '上架操作员',
  },
  transferNumbers: {
    title: '移库次数',
  },
  transferTime: {
    title: '最后移库时间',
  },
  transferUser: {
    title: '最后移库操作员',
  },
  delegateNo: {
    title: '二段出库委托号',
  },
  orderStatus: {
    title: '二段订单状态',
  },
  source: {
    title: '订单平台',
    cell: (val) => <ASelect isDetail value={val} getOptions={async() => await orderPlatformOptions}></ASelect>
  },
  productNames: {
    title: '商品名称',
    cell: getValue
  },
  productQuantity: {
    title: '商品数量',
    cell: getValue
  },
  productCategoryIds: {
    title: '商品类目ID',
    cell: getValue
  },
  productUnitPrice: {
    title: '商品单价',
    cell: getValue
  },
  productActualPrice: {
    title: '实付金额',
    cell: getValue
  },
}

// 获取商品value
function getValue(val) {
  let value = val
  try {
    value = JSON.parse(val)
    return value.map(v => v.value).join(' | ') || '-'
  } catch(e) {}
  return value || '-'
}
