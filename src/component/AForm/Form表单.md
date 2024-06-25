## Form 表单组件

#### 使用方法

```
import AForm from '@/component/AForm'
<!-- 表单配置 -->
export const formModel = {
  warehouseId: {
    label: '仓库名称',
    component: ASelect,
    defaultValue: getWid(),
    disabled: data => !data.isAdd,
    required: true,
    attrs: {
      hasClear: false
    }
  },
  timeScoped: {
    label: '播报时间范围',
    fixedSpan: 24,
    component: DatePicker2.RangePicker,
    required: true,
    attrs: {
      format: 'YYYY-MM-DD HH:00',
      showTime: true,
      timePanelProps:{
        format: "HH:00",
      },
      hasClear: false,
    }
  },
  frequency: {
    label: '播报频率',
    component: ASelect,
    required: true,
    attrs: {
      hasClear: false,
      getOptions: async() => {
        return timeOptions
      }
    }
  },
  receiver: {
    label: '播报接收方',
    tips: `选择钉钉群时，使用@分隔群号机器人access_token和接收人，多个接收人使用','号分隔;
access_token: 钉钉群机器人配置WebHook地址中access_token参数的值`,
    fixedSpan: 24,
    component: Input.TextArea,
    required: true,
    attrs: {
      placeholder: `例：access_token@张三,李四,小明`
    }
  },
}


function App() {
  const form = useRef()
  const save = async () => {
    <!-- 表单校验 -->
    const result = await form.current.validate()
    if (result) {
      <!-- 获取表单数据 -->
      const formData = form.current.getData()
    }
  }
  return <AForm ref={form}  formModel={formModel} data={props.data} />
}
```
