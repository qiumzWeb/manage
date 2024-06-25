
import ASelect from '@/component/ASelect'
import { Input } from '@/component'

export const formModel = {
  apiPre: {
      label: '所属系统',
      span: 12,
      component: ASelect,
      required: true,
      attrs: {
          getOptions: async() => {
              return [
                  {label: 'manage管理系统', value: '/pcsweb'},
                  {label: 'service客服系统', value: '/pcsservice'},
                  {label: 'web实操系统', value: '/pcsapiweb'},
                  {label: 'lemo、PDA接口应用', value: '/pcsapiwt'},
                  {label: '4px稽核系统', value: '/pcsapiaudit'},
                  {label: 'process接单系统', value: '/pcsprocesswt'}
              ]
          }
      }
  },
  apiType: {
      label: '请求方式',
      span: 12,
      component: ASelect,
      required: true,
      attrs: {
          getOptions: async() => {
              return [
                  {label: 'GET', value: 'get'},
                  {label: 'POST', value: 'post'},
                  {label: 'DELETE', value: 'delete'},
                  {label: 'PUT', value: 'put'}
              ]
          }
      }
  },
  apiUrl: {
      label: '请求地址',
      span: 24,
      required: true,
      attrs: {
          placeholder: '例： /sys/kpiConfig/list'
      }
  },
  apiParams: {
    label: '请求参数',
    span: 12,
    component: Input.TextArea,
    attrs: {
        trim: true,
        rows: 10,
        placeholder: `请输入JSON格式字符串 \n\n 例:
        {
          "warehouseId": 10001001,
          "id": "888888"
        }`
    }
  },
  apiHeaders: {
    label: '请求头Headers',
    span: 12,
    component: Input.TextArea,
    attrs: {
        trim: true,
        rows: 10,
        placeholder: `请输入JSON格式字符串\n\n 例：
        {
          "token": "dfdjier2324903xsd9323231",
          "session": "wewewellll2323ll01020",
          "Content-Type": "application/json; charset=utf-8"
        }`
    }
  },

}


// 导出参数
export const exportFormModel = {
  commandKey: {
    label: '导出commandKey',
    span: 24,
    required: true,
    attrs: {
        placeholder: '输入导出需要的commandKey'
    }
  },
  apiParams: {
    label: '请求参数',
    span: 24,
    component: Input.TextArea,
    attrs: {
        trim: true,
        rows: 10,
        placeholder: `请输入JSON格式字符串，只需要输入接口查询参数即可 \n\n 例:
        {
          "warehouseId": 10001001,
          "id": "888888"
        }`
    }
  },
}