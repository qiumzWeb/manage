import React, {useEffect, useState, useImperativeHandle, useRef} from 'react'
import { Dialog } from '@/component'
import QueryList from '@/component/queryList'
import Cookie from 'assets/js/cookie'

export default React.forwardRef(function OutStoreDetail(props, ref) {
  const [visible, setVisible] = useState(false)
  const query = useRef()
  useImperativeHandle(ref, () => ({
    open(data) {
      setVisible(true)
    }
  }))
  // 查询拦截
  function beforeSearch(req) {

  }
  // 数据格式
  function formatData(res) {
  }
  // 关闭
  function onClose() {
    setVisible(false)
  }
  const tColumns = {
    bigbagId: {
      title: '大包号'
    },
    storagePosition: {
      title: '库位号'
    },
    rfId: {
      title: '堆垛架号'
    },
    outstockPkgNum: {
      title: '出库包裹数'
    },
  }
  return <Dialog
    visible={visible}
    title="查看出库堆垛架"
    width={1200}
    footer={false}
    onClose={onClose}
  >
    <QueryList
      ref={query}
      toolSearch={false}
      initSearch
      // pagination={false}
      columns={tColumns}
      defaultValue='-'
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: `/noneShelvesSortingWall/queryContainer/${Cookie.get('warehouseId')}`,
        method: 'get',
        fixedHeader: false
      }}
    >
    </QueryList>
  </Dialog>
})