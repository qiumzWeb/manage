import React from 'react';
import { getCompanyList } from '../step10/config'
import { AFormTable, ASelect, Input, Upload, Button, Icon, NumberPicker  } from '@/component'
import { isTrue, isEmpty } from 'assets/js'
import { getCountry, packageTypeOptions, getStorageTypeOptions } from '@/report/apiOptions'
import { getStepBaseData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import { recommendOption } from '@/report/storageAreaGroupConfig/config'
import $http from 'assets/js/ajax'
import API from 'assets/api'
const cell = (val) => {
  return isTrue(val) ? val : '--'
}
const isEditable = () => !getStepBaseData().readOnly
const isTMall = () => getStepBaseData().isTMall

// 查询配置
export const searchModel = {
  districtStorageType: {
    label: '库区存储类型',
    component: ASelect,
    defaultValue: '5',
    attrs: {
      hasClear: false,
      getOptions: async({field}) => {
        return await getStorageTypeOptions
      },
      onChange: (val, vm) => {
        vm.field.setValues({
          warehouseDistrictIdList: [],
        })
      }
    }
  },
  warehouseDistrictIdList: {
    label: '库区',
    component: ASelect,
    attrs: {
      mode: 'multiple',
      showSearch: true,
      watchKey: 'warehouseId,districtStorageType',
      onChange: (val, vm) => {
        vm.field.setValues({
          roadwayIdList: []
        })
      },
      getOptions: async({field}) => {
        const warehouseId = getStepBaseData().warehouseId
        const storageTypeCode = field.getValue('districtStorageType')
        const list = await $http({
          url: API.getDistrictNames.replace("{warehouseId}", warehouseId),
          method: 'post',
          data:{
            storageTypeList: storageTypeCode && [storageTypeCode]
          }
        }).then(d=> {
          return Array.isArray(d) && d.map(e => ({
            ...e,
            label: e.name,
            value: e.id
          }))
        }).catch(e => [])
        return list
      }
    }
  },
  minPkgNum: {
    label: '库位包裹上限',
    expandKeys: ['maxPkgNum'],
    component: React.forwardRef(function(props, ref){
      const { field } = props
      return <>
        <NumberPicker label="最小" {...props} style={{width: '50%'}} ></NumberPicker>
        <NumberPicker label="最大" style={{width: '50%'}} onChange={(val) => {
          field.setValue('maxPkgNum', val)
        }}></NumberPicker>
      </>
    })
  },
  roadwayIdList: {
    label: '巷道代码',
    component: ASelect,
    attrs: {
      mode: 'multiple',
      showSearch: true,
      watchKey: 'warehouseId,warehouseDistrictIdList',
      getOptions: async({field}) => {
        const warehouseId = getStepBaseData().warehouseId
        const warehouseDistrictIdList = field.getValue('warehouseDistrictIdList')
        if (isEmpty(warehouseDistrictIdList)) return []
        const list = await $http({
          url: API.getAssignedLaneways.replace("{warehouseId}", warehouseId),
          method: 'post',
          data: warehouseDistrictIdList
        }).then(d=> {
          return Array.isArray(d) && d.map(e => ({
            ...e,
            label: e.lanewayCode,
            value: e.id
          }))
        }).catch(e => [])
        return list
      }
    }
  },
  recommendTypeList: {
    label: '库位推荐类型',
    component: ASelect,
    attrs: {
      mode: 'multiple',
      getOptions: async({field}) => {
        return recommendOption
      }
    }
  },
  storagePositionCodeList: {
    label: '库位编号',
    format: (val) => {
      if (typeof val === 'string') {
        return val.split(/\;|\；/).filter(f => f)
      }
      return val
    },
    attrs: {
      placeholder: `多个库位编号可用';'分号分割`
    }
  }
}


// 表头配置
export const tColumns = {
  warehouseShort: {
    title: '仓库名称',
    width: 100,
    cell
  },
  warehouseDistrictName: {
    title: '库区',
    width: 100,
    cell
  },
  districtStorageTypeLabel: {
    title: '库区存储类型',
    width: 100,
    cell
  },
  roadwayTypeLabel: {
    title: '巷道类型',
    width: 100,
    cell
  },
  roadwayCode: {
    title: '巷道码',
    width: 100,
    cell
  },
  rowNo: {
    title: '库位行',
    width: 100,
    cell
  },
  columnNo: {
    title: '库位列',
    width: 100,
    cell
  },
  storagePositionsCode: {
    title: '库位编号',
    width: 100,
    cell
  },
  volume: {
    title: <div style={{lineHeight:'30px'}}>
                体积<span>(cm<sup>3</sup>)</span>
            </div>,
    width: 120,
    cell
  },
  recommendTypeLable: {
    title: '库位推荐类型',
    width: 150,
    cell
  },
  pkgNumLimit: {
    title: '库位包裹数量上限',
    width: 100,
    lock: 'right',
    required: true,
    edit: true
  },
  length: {
    title: '长(cm)',
    width: 100,
    lock: 'right',
    required: true,
    edit: true
  },
  width: {
    title: '宽(cm)',
    width: 100,
    lock: 'right',
    required: true,
    edit: true
  },
  height: {
    title: '高(cm)',
    width: 100,
    lock: 'right',
    required: true,
    edit: true
  }
}

// 大批量修改
export const batchModifyBaseInfo = {
  districtStorageType: {
    label: '库区存储类型',
    component: ASelect,
    defaultValue: '5',
    attrs: {
      hasClear: false,
      getOptions: async({field}) => {
        return await getStorageTypeOptions
      },
    }
  },
  districtIds: {
    label: '库区',
    component: ASelect,
    attrs: {
      mode: 'multiple',
      showSearch: true,
      watchKey: 'warehouseId,districtStorageType',
      getOptions: async({field}) => {
        const warehouseId = getStepBaseData().warehouseId
        const storageTypeCode = field.getValue('districtStorageType')
        const list = await $http({
          url: API.getDistrictNames.replace("{warehouseId}", warehouseId),
          method: 'post',
          data:{
            storageTypeList: storageTypeCode && [storageTypeCode]
          }
        }).then(d=> {
          return Array.isArray(d) && d.map(e => ({
            ...e,
            label: e.name,
            value: e.id
          }))
        }).catch(e => [])
        return list
      },
      onChange: (val, vm) => {
        vm.setOpenData({
          districtIds: val
        })
      }
    }
  },
  isAddMoreCondition: {
    label: '添加其它条件',
    component: ASelect,
    defaultValue: 0,
    attrs: {
      isRadio: true,
      getOptions: async() => [
        {label: '是', value: 1},
        {label: '否', value: 0}
      ]
    }
  },
  conditionList: {
    label: '',
    component: AFormTable,
    show: data => data.isAddMoreCondition,
    span: 24,
    attrs: {
      hasAdd: true,
      maxLength: 100,
      watchKey: 'districtIds',
      columns: {
        roadwayIdList: {
          title: '巷道编码',
          component: ASelect,
          edit:true,
          attrs: {
            mode: 'multiple',
            showSearch: true,
            watchKey: 'districtIds',
            getOptions: async({field, fields}) => {
              const warehouseId = getStepBaseData().warehouseId
              const warehouseDistrictIdList = field.getValue('districtIds')
              if (isEmpty(warehouseDistrictIdList)) return []
              const list = await $http({
                url: API.getAssignedLaneways.replace("{warehouseId}", warehouseId),
                method: 'post',
                data: warehouseDistrictIdList
              }).then(d=> {
                return Array.isArray(d) && d.map(e => ({
                  ...e,
                  label: e.lanewayCode,
                  value: e.id
                }))
              }).catch(e => [])
              return list
            }
          }
        },
        shelveCodeList: {
          title: '货架号',
          component: ASelect,
          edit:true,
          attrs: {
            mode: 'multiple',
            showSearch: true,
            watchKey: 'districtIds,roadwayIdList',
            getOptions: async({field, fields}) => {
              const warehouseId = getStepBaseData().warehouseId
              const warehouseDistrictIdList = field.getValue('districtIds')
              const roadwayIdList = field.getValue('roadwayIdList')
              if (isEmpty(warehouseDistrictIdList) || isEmpty(roadwayIdList)) return []
              const list = await $http({
                url: API.getSameShelveCodeListUnderRoadway.replace("{warehouseId}", warehouseId),
                method: 'get',
                data: {
                  districtIdList:warehouseDistrictIdList,
                  roadwayIdList:roadwayIdList
                }
              }).then(d=> {
                return Array.isArray(d) && d.map(e => ({
                  label: e,
                  value: e
                }))
              }).catch(e => [])
              return list
            }
          }
        },
        rowNoList: {
          title: '行号',
          component: ASelect,
          edit:true,
          attrs: {
            mode: 'multiple',
            showSearch: true,
            watchKey: 'districtIds,roadwayIdList,shelveCodeList',
            getOptions: async({field, fields}) => {
              const warehouseId = getStepBaseData().warehouseId
              const warehouseDistrictIdList = field.getValue('districtIds')
              const roadwayIdList = field.getValue('roadwayIdList')
              const shelveCodeList = field.getValue('shelveCodeList')
              if (isEmpty(warehouseDistrictIdList) || isEmpty(roadwayIdList) || isEmpty(shelveCodeList)) return []
              const list = await $http({
                url: API.getSameRowNoListUnderShelve.replace("{warehouseId}", warehouseId),
                method: 'get',
                data: {
                  districtIdList:warehouseDistrictIdList,
                  roadwayIdList:roadwayIdList,
                  shelveCodeList:shelveCodeList
                }
              }).then(d=> {
                return Array.isArray(d) && d.map(e => ({
                  label: e,
                  value: e
                }))
              }).catch(e => [])
              return list
            }
          }
        },
      }
    }
  }
}
export const batchModifyOtherInfo = {
  length: {
    label: '库位尺寸-长',
    component: NumberPicker,
    attrs: {
      min: 0
    }
  },
  width: {
    label: '库位尺寸-宽',
    component: NumberPicker,
    attrs: {
      min: 0
    }
  },
  height: {
    label: '库位尺寸-高',
    component: NumberPicker,
    attrs: {
      min: 0
    }
  },
  pkgNumLimit: {
    label: '库位包裹数量上限',
    component: NumberPicker,
    attrs: {
      min: 0
    }
  },
  recommendType: {
    label: '库位推荐类型',
    component: ASelect,
    defaultValue: '',
    attrs: {
      placeholder: '不填则默认为不做变更',
      getOptions: async({field}) => {
        return recommendOption
      }
    }
  }
}

// 批量上传库位优秀级
export const batchExportModel = {
  file: {
    fileName: 'uploadDemo.xlsx',
    componentType: 'import',
  }
}