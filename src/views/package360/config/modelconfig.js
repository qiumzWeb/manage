import React from 'react';
import { Input } from '@/component';
import ASelect from "@/component/ASelect";
import $http from "assets/js/ajax";
import { getBaseConfigGroup } from '../api'

export const searchModel = {
  tableSchema: {
    label: '数据库',
    attrs: {
      hasClear: true
    }
  },
  tableName: {
    label: '表名',
    attrs: {
      hasClear: true,
    }
  },
  displayName: {
    label: '展示名称',
    attrs: {
      hasClear: true,
    }
  },
  group: {
    label: '所属分组',
    component: ASelect,
    attrs: {
      showSearch: true,
      getOptions: async() => {
        const data = await getBaseConfigGroup
        return data.groups
      }
    }
  },
}

/**
 * 列信息
 * @type {{}}
 */
export const columns = {
  tableSchema: {
    title: '数据库',
    width: 150,
  },
  tableName: {
    title: '表名',
  },
  displayName: {
    title: '展示名称',
  },
  group: {
    title: '分组',
    cell: (val, index, record) => {
      console.log(val, record)
      return <ASelect value={val} defaultValue="-" isDetail getOptions={async() => {
        const data = await getBaseConfigGroup
        return data.groups
      }}></ASelect>
    }
  },
  operation_: {
    title: '操作',
    lock: 'right',
    width: 120,
  }
}

// 新增，修改
export const modifyModel = {
  tableSchema: {
    label: '数据库',
    required: true,
  },
  tableName: {
    label: '表名',
    required: true,
  },
  displayName: {
    label: '展示名称',
    required: true,
  },
  group: {
    label: '分组',
    component: ASelect,
    required: true,
    attrs: {
      showSearch: true,
      getOptions: async() => {
        const data = await getBaseConfigGroup
        return data.groups
      }
    }
  },
  metaData: {
    label: 'metaData',
    component: Input.TextArea,
    span: 24,
    required: true,
    attrs: {
      size: 'large',
      placeholder: '请输入JSON格式数据',
      rows: 35,
    }
  }
}
