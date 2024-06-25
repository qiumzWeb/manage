import React from 'react';
import {  ASelect, Button, Message, NumberPicker, Dialog, AFormTable  } from '@/component'
import $http from 'assets/js/ajax'
import { transMultipleToStr, AsyncDebounce, isEmpty } from 'assets/js'
import API from 'assets/api'
import { getStepBaseData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';

const isEditable = () => !getStepBaseData().readOnly
const isTMall = () => getStepBaseData().isTMall

// 获取仓库异常密码
export function getConfirmPassWord(data) {
  return $http({
    url: '/sys/exceptionType/confirmPass/get',
    method: 'get',
    data
  })
}

// 获取opCode列表
export function getExceptionTypeList(data) {
  return $http({
    url:  API.getExceptionTypeList,
    method: 'post',
    data: {
      pageNum: 1,
      pageSize: 1000,
      ...data
    }
  }).then(res => {
    if (Array.isArray(res.result)) {
      return res.result
    } else {
      return []
    }
  }).catch(e => {
    Message.error(e.message)
    return []
  })
}

// 保存数据
export function getSaveData(data, passWord = true) {
  const promiseArr = []
  if (passWord) {
    promiseArr.push(
      $http({
        url: '/sys/exceptionType/confirmPass/save',
        method: 'post',
        data: {
          warehouseId: getStepBaseData().warehouseId,
          offShelves: data.offShelves || '',
          allot: data.allot || '',
          abnormalOffShelves: data.abnormalOffShelves || '',
          shelves: data.shelves || '',
          abnormalConfirm: data.abnormalConfirm || '',
          checkSkuMissingConfirm: data.checkSkuMissingConfirm || '',
          completeBatchMarkAbnormal: data.completeBatchMarkAbnormal || ''
        }
      }).then(_ => true).catch(e => {
        return e.message || '保存异常密码失败'
      })
    )
  }
  if (data.hasOpCode == 1 && !isEmpty(data.opCodeList)) {
    promiseArr.push($http({
      url: '/sys/exceptionType/addOrUpdates',
      method: 'post',
      data: data.opCodeList.map(o => ({
        ...o,
        warehouseId: getStepBaseData().warehouseId,
      }))
    }).then(_ => true).catch(e => {
      return e.message || '保存异常类型失败'
    }))
  }
  return isEmpty(promiseArr) ? Promise.resolve(false) : Promise.all(promiseArr)
}

// 参数类型配置

export const typeOptions = [
  {"label": "拒收类型", "value": 1}
];

// 基础密码配置
export function validatePossword(val, data, setError) {
  const reg = /^(\w|\@|\?|\+|\-|\*|\/|\.){4,10}$/
  if (!reg.test(val)) {
    setError('请填写4~10位数字、字母和特殊字符的组合')
    return false
  }
  return true
}
export const baseInfo = {
  offShelves: {
    label: '下架少货密码',
    required: true,
    disabled: () =>  !isEditable(),
    validate: validatePossword
  },
  allot: {
    label: '播种少货密码',
    required: true,
    disabled: () =>  !isEditable(),
    validate: validatePossword
  },
  abnormalOffShelves: {
    label: '异常下架密码',
    required: true,
    disabled: () =>  !isEditable(),
    validate: validatePossword
  },
  shelves: {
    label: '上架少货密码',
    required: true,
    disabled: () =>  !isEditable(),
    validate: validatePossword
  },
  abnormalConfirm: {
    label: '异常确认密码',
    required: true,
    disabled: () =>  !isEditable(),
    validate: validatePossword
  },
  checkSkuMissingConfirm: {
    label: '复核合箱少票确认密码',
    required: true,
    disabled: () =>  !isEditable(),
    validate: validatePossword
  },
  completeBatchMarkAbnormal: {
    label: '完结集货批次确认密码',
    required: true,
    disabled: () =>  !isEditable(),
    validate: validatePossword
  }
}

// 异常类型OPCode 配置
export const opCodeModel = {
  hasOpCode: {
    label: '是否配置异常类型',
    component: ASelect,
    disabled: () =>  !isEditable(),
    attrs: {
      isRadio: true,
      getOptions: async() => {
        return [
          {label: '是', value: '1'},
          {label: '否', value: '0'}
        ]
      }
    }
  },
  opCodeList: {
    label: '',
    component: AFormTable,
    span: 24,
    show: data => data.hasOpCode == 1,
    attrs: {
      hasAdd: isEditable,
      defaultData: {type: 1},
      maxLength: 100,
      beforeRemove: async(record, index) => {
        let result = true
        if (record.id) {
          result = await new Promise((resolve, reject) => {
            Dialog.confirm({
              title: '删除',
              content: '确认删除该条数据？',
              onOk: async() => {
                try {
                  await $http({
                    url: API.deleteExceptionTypeById.replace("{id}", record.id),
                    method: 'DELETE',
                  })
                  Message.success('删除成功')
                  resolve(true)
                } catch(e) {
                  Message.error(e.message)
                  resolve(false)
                }
              },
              onClose: () => resolve(false),
              onCancel: () => resolve(false)
            })
          })
        }
        return result
      },
      columns: {
        type: {
          title: '参数类型',
          required: true,
          component: ASelect,
          cell: (val) => <ASelect isDetail defaultValue="-" value={val} getOptions={async() => typeOptions}></ASelect>,
          edit: isEditable,
          attrs: {
            getOptions: async() => typeOptions
          }
        },
        code: {
          title: '参数详情',
          required: true,
          component: ASelect,
          cell: (val, index, record) => record.name,
          edit: isEditable,
          attrs:{
            watchKey: 'type',
            showSearch: true,
            getOptions: async({field}) => {
              const type = field.getValue('type')
              const config = {
                1: 'rejectType'
              }
              const resultType = config[type] || ''
              const codeList = await $http({
                url: API.getDataDictionaryByType,
                method: 'get',
                data: {
                  dataType: resultType
                }
              })
              return Array.isArray(codeList) && codeList || []
            }
          }
        },
        opCode: {
          title: 'opCode',
          edit: isEditable,
          required: true
        },
      }
    }
  }
}