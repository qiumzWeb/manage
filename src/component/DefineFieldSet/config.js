import { NumberPicker, ASelect } from '@/component'

export const lockOptions = [
  {label: '左侧', value: 'left'},
  {label: '右侧', value: 'right'},
]

// 表头配置
export const columns = {
  width: {
    title: '字段宽度',
    component: NumberPicker,
    width: 110,
    attrs: {
      size: 'small',
      min: 0
    }
  },
  lock: {
    title: '锁定状态',
    component: ASelect,
    width: 125,
    attrs: {
      size: 'small',
      hasArrow: false,
      getOptions: async() => lockOptions
    }
  },
}

