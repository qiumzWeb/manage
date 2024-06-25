# 生成ssl 密钥  openssl req -nodes -new -x509 -keyout server.key -out server.cert
# install
npm install tnpm -g --registry=https://registry.anpm.alibaba-inc.com
# or
npm i -g npminstall --registry=https://registry.anpm.alibaba-inc.com
npminstall -g tnpm --registry=https://registry.anpm.alibaba-inc.com

tnpm install

# start

npm run dev

# build

npm run build

# 开发规范
为了统一组件规范，以上代码规范必须强制执行，否则将会出现不必要的bug
### 组件使用文档
    https://fe.4px.com/pcs/querylist
## UI组件 引用：
  禁止： 
  ```
  import { Input, Button, Dialog, NumberPicker, select, Table } from '@alifd/next'
  ```
  强制：
  ```
  import { Input, Button, Dialog, NumberPicker, select, Table } from '@/component'
  ```
## Table columns 配置
  禁止： 
  ```
  <Table columns={columns}></Table>
  ```
  强制：
  ```
  <Table>
    {columns.map((c, index) => {
      return <Table.Column key={index} {...c} ></Table.Column>
    })}
  </Table>
  ```
## Form 表单组件
  禁止： 
  
  ```
  import { Form } from '@/component'
  <Form></Form>
  ```
  强制：
  ```
    import AForm from '@/component/AForm'
    <AForm></AForm>
  ```

# 目录结构
├─c-build
│  └─config  // =================  webpack 配置
├─src
│  ├─assets  
│  │  ├─api  // ==============  接口api 
│  │  ├─js    // ============  常用 utils 
│  │  └─scss  //  ===========   基础样式
│  │      └─style
│  ├─component  // =============  公共组件
│  │  ├─AForm
│  │  ├─ASelect
│  │  ├─header
│  │  ├─menus
│  │  └─queryList
│  ├─layout  
│  ├─pages   //  ===========  需手动配置路由 页面目录 
│  │  ├─404
│  │  ├─abort
│  │  └─user
│  ├─RouterView
│  ├─routes  // =========== 路由守卫 : app.js ,  路由配置 ： index.js
│  └─views  // ==========  自动生成路由 页面目录
│      ├─index
│      │  ├─api
│      │  └─scss
│      └─pages
│          ├─api
│          └─scss
└─static   // ============  不加入编译的静态资源目录
