import { Input, Radio  } from '@/component'
import ASelect from '@/component/ASelect/index'
import { getBaseConfigGroup } from '../api'
// 查询条件
export const searchModel = {
  type: {
    span: 24,
    component: ASelect,
    attrs: {
      isRadio: true,
      getOptions: async({field}) => {
        const data = await getBaseConfigGroup
        field.setValue('type', data.searchGroups[0].value)
        return data.searchGroups
      }
    }
  },
  searchCode: {
    fixedSpan: 24,
    attrs: {
      placeholder: '请输入单号'
    }
  },
  btn: {
    onlyShow: true,
    fixedSpan: 12,
  }
}