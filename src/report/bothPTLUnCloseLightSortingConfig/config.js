import React from 'react';
import { ASelect, Input, Message, Dialog, DatePicker2 } from '@/component';
import { getWid, AsyncDebounce, getStringCodeToArray } from 'assets/js';
import $http from 'assets/js/ajax';
import API from 'assets/api'

// 查询接口
export const searchApiUrl = '/sortWall/whiteList/search'

// 批量新增
export function getAddConfig(data) {
  return $http({
    url: '/sortWall/whiteList/batchAdd',
    method: 'post',
    data
  })
}

// 删除
export function getDeleteConfig(data) {
  return $http({
    url: '/sortWall/whiteList/delete',
    method: 'post',
    data: {
      warehouseId: data.warehouseId,
      employeeNo: data.employeeNo,
    }
  })
}


export const qSearch = [
  {
    warehouseId: {
      label: '仓库名称',
      defaultValue: getWid(),
      component: ASelect,
      attrs: {
        hasClear: false
      }
    },
    employeeNo: {
      label: '员工姓名',
      component: ASelect,
      attrs: {
        showSearch: true,
        watchKey: 'empSearch',
        filterLocal: false,
        fillProps: 'userName',
        placeholder: '请输入员工姓名或工号搜索',
        getOptions: AsyncDebounce(async ({field}) => {
          const list = []
          const sv = field.getValue('empSearch') || 's'
          if (!sv || !sv.length || !sv.trim()) return list
          const res = await $http({
              url: API.getJobName(sv),
              method: 'get'
          })
          return list.concat(Array.isArray(res) && res.map(r => ({
              ...r,
              label: `${r.userName || ''}${r.employeeNo && `(${r.employeeNo})` || ''}${r.loginName && `-${r.loginName}` || ''}`,
              value: r.loginName
          })) || [])
        }),
        onSearch: (val, field) => {
          field.setValue('empSearch', val)
        }
      }
    }
  }
]

// 列表
export const tColumns = {
  warehouseId: {
    title: '仓库名称',
    cell: val => <ASelect value={val} isDetail></ASelect>
  },
  employeeNo: {
    title: '登录账号',
  },
  employeeName: {
    title: '员工姓名',
  },
  operatorName: {
    title: '操作人',
  },
  operatorTime: {
    title: '操作时间',
  },
}

// 详情
// 明细column
export const addFormModel = {
  warehouseId: {
    label: '仓库名称',
    defaultValue: getWid(),
    component: ASelect,
    required: true,
    attrs: {
      hasClear: false
    }
  },
  employeeNoList: {
    label: '员工登录名',
    component: Input.TextArea,
    required: true,
    format: (val) => getStringCodeToArray(val),
    span: 24,
    attrs: {
      placeholder: '请输入集运宝系统账号的登录名，多个请用 空格 或 回车换行 分隔',
      rows: 10,
    }
  }
}