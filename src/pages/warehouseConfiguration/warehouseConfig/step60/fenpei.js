import React, {useState, useEffect, useRef, useImperativeHandle} from 'react'
import { Button, Dialog, Message } from '@/component'
import QueryList from '@/component/queryList/index'
import { fenpeiSearchUrl, fenpeiTColumns } from './config'
export default function App(props) {
  const { value, onChange } = props
  const [selectedRows, setSelectedRows] = useState([])
  const query = useRef()
  const beforeSearch = (req) => {
    req.data ={ groupId: value.groupId } 
  }
  const formatData = (data) => {
    data.data = data.districtList
    if (Array.isArray(data.data)) {
      const rows = data.data.filter(s => s.isAllocation == 'Y')
      setSelectedRows(rows)
      getSelectedRows(rows)
    }
  }
  // 更新数据
  function getSelectedRows(rows) {
    typeof onChange=== 'function' && onChange({
      selectedRows: rows,
      warehouseName: value.warehouseName,
      groupName: value.groupName,
      groupId: value.groupId
    })
  }
  return <div>
      <div style={{fontSize: 16, fontWeight: 'bold'}}>
        <span>仓库名称：{value.warehouseName}</span>
        <span style={{marginLeft: 100}}>库区组简称: {value.groupName}</span>
      </div>
      {/* 查询列表 */}
      <QueryList
        ref={query}
        toolSearch={false}
        initSearch={true}
        pagination={false}
        columns={fenpeiTColumns}
        defaultValue="-"
        formatSearchParams={beforeSearch}
        formatData={formatData}
        tableOptions={{
          url: fenpeiSearchUrl,
          method: 'post',
          attrs: {
            rowSelection: {
              onChange: (keys, rows) => {
                  setSelectedRows(rows)
                  getSelectedRows(rows)
              },
              selectedRowKeys: selectedRows.map(m => m.id)
          }
          }
        }}
      >
      </QueryList>
  </div>
}