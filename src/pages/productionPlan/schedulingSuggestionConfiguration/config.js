import React from 'react';
import { ASelect, Input, NumberPicker, ATipsCard, Checkbox } from '@/component';
import {getWid, isEmpty} from 'assets/js';
import $http from 'assets/js/ajax';
// 查询接口
export const searchApiUrl = '/sys/proposal/list'

// 新增
export function addConfig(data) {
  return $http({
    url: '/sys/proposal/add',
    method: 'post',
    data
  })
}

// 更新
export function updateConfig(data) {
  return $http({
    url:`/sys/proposal/modify`,
    method: 'post',
    data
  })
}

// 删除
export function deleteConfig(data) {
  return $http({
    url:'/sys/proposal/delete',
    method: 'post',
    data
  })
}

// 导入
export function importConfig(data) {
  return $http({
    url: '/sys/proposal/batch/add',
    method: 'post',
    data: data,
    dataType: 'form',
  })
}



// // 获取建议处理类
// export const getHandlerType = $http({
//   url: '/sys/proposal/get/handlerClass',
// }).then(res => {
//   return Array.isArray(res) && res.map(r => ({
//     label: r.desc,
//     value: r.handlerClass
//   })) || []
// }).catch(e => [])




// 获取调度建议模板
export const getProposalContentOptions = $http({
  url: '/sys/proposal/template'
}).then(res => {
  return Array.isArray(res) && res.map(r => ({...r, label: r.value})) || []
}).catch(e => [])

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
    proposalName: {
      label: '调度建议名称',
    },
  }
]

// 列表
export const tColumns = {
  warehouseId: {
    title: '仓库',
    cell: (val) => <ASelect value={val} isDetail></ASelect>,
    lock: 'left'
  },
  proposalName: {
    title: '调度建议名称',
  },
  proposalContent: {
    title: '调度建议文案',
    width: 500
  },
}

// 新增 / 修改
export const formModelConfig = {
  warehouseId: {
    label: '仓库名称',
    required: true,
    component: ASelect,
    disabled: true,
  },
  proposalName: {
    label: '调度建议名称',
    required: true,
  },
  handlerClass: {
    label: '处理类',
    required: true,
    // component: ASelect,
    // attrs: {
    //   getOptions: async() => {
    //     return await getHandlerType
    //   }
    // }
  },
  proposalContent: {
    label: '调度建议文案',
    span: 24,
    required: true,
    component: React.forwardRef(function(props, ref) {
      const { field } = props
      return <ATipsCard
        trigger={<Input.TextArea ref={ref} {...props}></Input.TextArea>}
      >
      <div style={{background: '#fff', padding: 10, color: '#333'}}>
        <ASelect value={props.value} direction="ver" isRadio onChange={(val) => {
          field.setValue('proposalContent', val)
        }} getOptions={async() => await getProposalContentOptions}></ASelect>
      </div>
      </ATipsCard>
    }),
    attrs: {
      rows: 4
    }
  },
}

// 批量导入
export const batchExportModel = {
  file: {
    fileName: 'proposalExcelTemplate.xlsx',
    componentType: 'import',
  }
}