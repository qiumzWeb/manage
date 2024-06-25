import React, {useState, useEffect, useRef, useImperativeHandle} from 'react'
import { Button, Dialog, Message, Cascader } from '@/component'
import APaingList from '@/component/APaginglist'
import { tColumns, searchUrl } from './config'
import AForm from '@/component/AForm'
import $http from 'assets/js/ajax'
import { isEmpty, deepForEach } from 'assets/js'
import API from 'assets/api'
export default React.forwardRef(function App(props, ref) {
  const [data, setData] = useState({})
  const [treeData, setTreeData] = useState([])
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedValue, setSelectedValue] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedExpand, setSelectedExpand] = useState({})
  // 历史选择
  const [historySelectedValue, setHistorySelectedValue] = useState({})
  // 当前选择的数据
  const [currentSelectedRows, setCurrentSelectedRows] = useState({})
  const query = useRef()
  useImperativeHandle(ref, () => ({
    open: (row) => {
      setData(row)
      getData(row.id)
      setVisible(true)
    }
  }))
  // 查询前参数拦截
  const beforeSearch = (req) => {
    setCurrentPage(req.data.pageNum)
    return {
      ...req,
      data: {
        ...req.data,
        ...getParams()
      }
    }
  }
  // 处理树结构数据
  const formatData = (treeRes, req, {action}) => {
    const treeData = deepForEach(treeRes.result, {callBack: (d) => {
      d.value = d.key
      if (isEmpty(d.children) && d.isLeaf !== true) {
        d.checkboxDisabled = true
      }
    }}) || []
    Object.assign(treeRes, {
      currentPageNum: treeRes.pageNum,
      totalRowCount: treeRes.total,
      data: treeData
    })
    getSelectedData(treeData, treeRes.pageNum, action)
    setTreeData(treeData)
  }
  function refresh(data){
    query.current.refresh(data)
  }
  // 获取物理库区数据
  async function getData(id) {
    if (!id) return Message.error('库区数据ID丢失，请联系管理员')
    try{
      const res = await $http({
        url: API.getWareHouseDistrict,
        method: 'post',
        data: {id: id + ''}
      })
      if (res) {
        setData(res)
      } else {
        Message.error('查询数据失败')
      }
    }catch(e) {
      Message.error(e.message)
    }
  }
  // 获取被选中的数据
  async function getSelectedData(tree, pageNum, action) {
    // 已修改过, 且为非切换pageSize操作时，则不加载历史选项， 若切换pageSize, 则不保存历史修改
    // if (selectedValue[pageNum] && action != 4) return
    try{
      const res = await $http({
        url: API.getPhysicalAssignByWarehouseDistrictId,
        method: 'get',
        data: {
          warehouseDistrictId: data.id,
          roadwayIds: tree.map(t => t.value) + ''
        }
      })
      if (res) {
        // 保存历史选择数据
        setHistorySelectedValue({
          ...historySelectedValue,
          [currentPage]: Array.isArray(res) && res || []
        })
        // 获取历史，并去重处理
        const currents = selectedValue[currentPage] || []
        const currentData = [...new Set(currents.concat(res || []))]
        // 设置默认选中
        setSelectedValue({
          ...selectedValue,
          [currentPage]: currentData
        })
        // 设置默认展开
        // 若没有 展开项， 则默认展开已选择的第一项
        if (isEmpty(selectedExpand[currentData])) {
          const sp = '_'
          // 取第一个key值
          const firstEx = currentData[0]
          // 取前缀
          const firstPrx = firstEx && firstEx.split(sp)[0]
          // 获取同一根系的一组key
          const onlyEx = firstPrx && currentData.filter(f => f && f.split(sp).includes(firstPrx)) || []
          let currentEx = []
          // 重组展开的key
          onlyEx.forEach(o => {
            const e = o && o.split(sp)
            if (e) {
              currentEx = currentEx.concat(e.reduce((a,b) => {
                if (isEmpty(a)) {
                  a.push(b)
                } else {
                  a.push(a.slice(-1) + sp + b)
                }
                return a
              }, []))
            }
          })
          setSelectedExpand({
            ...selectedExpand,
            [currentPage]: [...new Set(currentEx)]
          })
        }
      }
    }catch(e) {
      Message.error(e.message)
    }
  }
  // 获取查询参数
  function getParams(params) {
    params = params || data
    return {
      warehouseId: params.warehouseId,
      warehouseDistrictId: params.id
    }
  }
  // 保存
  async function onOk() {
    setLoading(true)
    let currentSelectedKeys = {}
    let historySelectedKeys = {}
    let addWarehouseDistrictAssignList = []
    let deleteWarehouseDistrictAssignList = []
    // 获取已选择的数据，只选择子节点数据
    Object.entries(currentSelectedRows).forEach(([key, c]) => {
      if (isEmpty(currentSelectedKeys[key])) {
        currentSelectedKeys[key] = []
      }
      deepForEach(c, {callBack: (d) => {
        if (d.isLeaf == true) {
          currentSelectedKeys[key].push(d.value)
        }
      }})
      currentSelectedKeys[key].forEach(k => {
        if (!historySelectedValue[key].includes(k)) {
          addWarehouseDistrictAssignList.push(k)
        }
      })
      historySelectedValue[key].forEach(hk => {
        if (!currentSelectedKeys[key].includes(hk)) {
          deleteWarehouseDistrictAssignList.push(hk)
        }
      })
    })
    const requestParams = {
      "warehouseDistrictId": data.id,
      "addWarehouseDistrictAssignList": addWarehouseDistrictAssignList,
      "deleteWarehouseDistrictAssignList": deleteWarehouseDistrictAssignList
    }
    try{
      await $http({
        url: API.physicalAssign,
        method: 'post',
        data: requestParams
      })
      Message.success('分配成功')
      onClose()
      typeof props.callBack == 'function' && props.callBack()
    } catch(e) {
      Message.error(e.message)
    }
    setLoading(false)
  }

  // 关闭
  function onClose() {
    setVisible(false)
    setSelectedValue({})
    setCurrentSelectedRows({})
    setHistorySelectedValue({})
  }
  // 选择变动
  function onSelect(val, data, opt) {
    console.log(val, data, opt, '被选中的=====')
    setSelectedValue({
      ...selectedValue,
      [currentPage]: val
    })
    setCurrentSelectedRows({
      ...currentSelectedRows,
      [currentPage]: data
    })
  }
  // 选择展开
  function onExpandChange(val) {
    console.log(val, '被展开的=======')
    setSelectedExpand({
      ...selectedExpand,
      [currentPage]: val
    })
  }
  // 懒加载数据
  function loadLazyData(currentData) {
    return new Promise(resolve => {
      if (isEmpty(currentData.children)) {
        const { pos, value } = currentData
        const item = pos.split('-').slice(1).reduce((ret, num) => ret.children[num], {children: treeData})
        $http({
          url: API.getShelvesListByRoadWayIdForTree,
          method: 'post',
          data: value
        }).then(d => {
          if (!isEmpty(d)) {
            if (pos.split('-').length === 2) {
              item.children = d;
            }
            query.current.setState({
              dataSource: [...treeData]
            });
          } else {
            Message.warning('未查询到数据！')
          }
          resolve();
        }).catch(e => {
          Message.warning('未查询到数据！')
        })
      } else {
        resolve()
      }
    })
  }
  return <div>
    <Dialog
      title='物理分配'
      width={1000}
      visible={visible}
      onOk={onOk}
      onClose={onClose}
      onCancel={onClose}
      okProps={{loading, children: '保存'}}
    >
      <APaingList
        ref={query}
        initSearch
        component={Cascader}
        formatSearchParams={beforeSearch}
        formatData={formatData}
        options={{
          url: API.getTreeByWarehouseIdAndDistrictId
        }}
        attrs={{
          multiple: true,
          onChange: onSelect,
          onExpand: onExpandChange,
          value: selectedValue[currentPage] || [],
          expandedValue: selectedExpand[currentPage] || [],
          loadData: loadLazyData,
          listStyle: {
            width: '200px',
            height: 'calc(100vh - 280px )'
          }
        }}
      ></APaingList>
    </Dialog>
  </div>
})