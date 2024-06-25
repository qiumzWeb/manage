## Form表单内嵌可编辑表格

#### 使用方法

```
const columns = {
  base: {
    title: '其它'
  },
  p: {
    title: '优先级',
    required: true,
    width: 130,
    edit: true,
    component: ASelect,
    attrs: {
      getOptions: async() => {
        return pOptions
      }
    }
  },
  store_no: {
    title: '集运仓库区',
    required: true,
    width: 400,
    edit: true,
    component: getDefineComponent('store_no_op', Input),
    attrs: {
      placeholder: '如：A-1,B-1',
    }
  },
  is_tail: {
    title: '是否尾包',
    required: true,
    width: 220,
    edit: true,
    component: getDefineComponent('is_tail_op'),
    attrs: {
      getOptions: async() => {
        return vOptions
      }
    }
  },
}

import AFormTable from '@/component/AFormTable'

function App() {
  return <Form>
    <Form.Item>
      <AFormTable
        name="infoList"
        defaultData={defaultData} // [Function | Array]
        maxLength={10} // hasAdd 为true 时， 最大可增加的 行数
        hasAdd={true} // 是否可新增数据， true :显示添加 按钮， false: 不可新增
        columns={columns}
      />
    </Form.Item>
  </Form>
}

function App() {
  const [data, setData] = useState([])
  return <AFormTable value={data} onChange={setData}    />
}

```