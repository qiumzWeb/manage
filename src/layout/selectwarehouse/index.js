import React, {useState, useEffect, useRef} from 'react'
import { useHistory } from 'react-router'
import { Dialog, Grid, Button, Icon, Message, Input, ATipsCard  } from '@/component'
import $http from 'assets/js/ajax'
import Api from 'assets/api'
import { setWid, getWid, Cookie, widList, widName, isEmpty, setCEId, getCEId, getCEName, CEIdList, CEIdName, logout, changeCompanyEnterpriseEvent } from 'assets/js'
import Bus from 'assets/js/bus'
require('./index.scss')
const { Row, Col} = Grid
let wareList = []
export default function App(props){
  const [companyList, setCompanyList] = useState([])
  const [warehouseList, setWarehouseList] = useState({})
  const [visible, setVisible] = useState(false)
  const [isClick, setIsClick] = useState(false)
  const [wareHouse, setWareHouse] = useState({})
  const [currentHouse, setCurrentHouse] = useState({})
  const [searchCardVisible, setSearchCardVisible] = useState(false)
  const [searchCardOptions, setSearchCardOptions] = useState([])
// 企业列表
  const [companyEnterpriseList, setCompanyEnterpriseList] = useState([])
  const [currentCompanyEnterprise, setcurrentCompanyEnterprise] = useState({})

  /**
   * ===============仓库==================
   */

  // 仓库dom树
  const warehouseDomNodeBox = useRef({});
  const getTreeKey = (t) => `${t.companyName}_${t.companyId}`
  const history = useHistory()
  const getTreeWarehouse = (arr) => {
    if (!Array.isArray(arr)) return []
    const tree = {}
    arr.forEach(a => {
      const key = getTreeKey(a)
      if (tree[key]) {
        tree[key].children.push(a)
      } else {
        tree[key] = {
          ...a,
          label: a.companyName,
          value: a.companyId,
          children: [a]
        }
      }
    })
    return tree
  }
  const getWareHouseList = async () => {
    // 获取公司仓库列表
    let res = await $http({
      url: Api.getCompanyWareHouseList,
      method: 'get'
    })
    // console.log(res)
    if (res && Array.isArray(res)) {
      if (!getWid()) {
        setVisible(true)
      }
      res = res.map(r => ({
        ...r,
        label: r.warehouseName,
        value: r.warehouseId
      }))
      wareList = [...res]
      if (!Bus.getState(widList)) {
        Bus.setState({
          [widList]: {
            currentPageNum: 1,
            data: res,
            pageSize: 100,
            totalRowCount: res.length
          }
        })
      }
      const houseTree = getTreeWarehouse(res)
      const currentHouse = getCurrentWareHouse(res)
      Bus.setState({ houseTree }) // 缓存仓库树
      setCurrentHouse(currentHouse || {label: '选择仓库'})
      setCompanyList(Object.values(houseTree))
      getSelectedWareHouse(houseTree, currentHouse)
    }
  }
  // 设置仓库
  function getCurrentWareHouse (houseList) {
    return houseList.find(d => d.value == getWid())
  }
  // 选择仓库
  function SelectWarehouse (w) {
    setWareHouse(w)
    Cookie.set(widName, encodeURIComponent(w.label))
  };
  // 选择公司
  function SelectCompany (w) {
    setWarehouseList(w)
  };
  // 获取已选择的仓库
  function getSelectedWareHouse (houseTree, currentHouse) {
    let wareHouseList = {}
    if (!currentHouse || !currentHouse.companyId) {
      wareHouseList = Object.values(houseTree)[0] || {}
    } else {
      const key = getTreeKey(currentHouse)
      wareHouseList = houseTree[key]
    }
    SelectCompany(wareHouseList)
    SelectWarehouse(currentHouse || {})
    // 滚动到可视区
    getCurrentHouseScrollIntoView(currentHouse)
  }
  // 当前选择仓库滚动到可视区
  function getCurrentHouseScrollIntoView(currentHouse) {
    if (visible) {
      // 只对最后一次解发滚动
      clearTimeout(warehouseDomNodeBox.current.timer);
      warehouseDomNodeBox.current.timer = setTimeout(() => {
        const domNode = warehouseDomNodeBox.current[currentHouse.value];
        const isClick = warehouseDomNodeBox.current.activeHouse == currentHouse.value;
        !isClick && domNode && domNode.scrollIntoView({behavior: 'smooth',  block: "end"});
      }, 100)
    }
  }
  // 确认选择
  function onOk() {
    // console.log(wareHouse, 8989)
    if (!wareHouse.value) {
      return Message.warning('请选择仓库')
    }
    setCurrentHouse({
      ...wareHouse
    })
    if (!getWid()) {
      onClose()
      setWid(wareHouse.value)
      Bus.$emit('routeRefresh')
    } else if (wareHouse.value == getWid()) {
      onClose()
    } else {
      setWid(wareHouse.value)
      window.location.reload()
    }
    Cookie.set(widName, encodeURIComponent(wareHouse.label))
    // onClose()
    // Bus.$emit('routeRefresh')

  }
  /**
   * ============= 仓库选择 end ================
   */

  /**
   * ============= 选择企业 ===========  
   */

// 获取企业
  function getCompanyEnterpriseList() {
    Bus.$on(changeCompanyEnterpriseEvent, (res) => {
      setCompanyEnterpriseList(res)
      setcurrentCompanyEnterprise(res.find(r => r.current) || {})
      Bus.setState({
        [CEIdList]: res
      })
      setVisible(true)
    })
  }
  // 选择企业
  function SelectCompanyEnterprise (w) {
    setCEId(w.value)
    setcurrentCompanyEnterprise(w)
  };

  // 判断是否需要切换企业
  function isChangeCompanyEnterprise() {
    return isEmpty(companyList) && !isEmpty(companyEnterpriseList)
  }

  // 确认选择企业
  async function onChangeCompanyEnterprise() {
    try {
      if (!currentCompanyEnterprise.value) {
        return Message.warning('请选择企业')
      }
      setCEId(currentCompanyEnterprise.value)
      Cookie.set(CEIdName, encodeURIComponent(currentCompanyEnterprise.label))
      await $http({
        url: '/pcslogin/switchEnterprise',
        method: 'get',
        data: {
          enterpriseId: currentCompanyEnterprise.value
        }
      })
      logout(true)
    } catch(e) {
      Message.error(e.message)
    }
  }


  /**
   * =============== 企业选择 end ===================
   */

// 初始化
  useEffect(() => {
    getWareHouseList();
    getCompanyEnterpriseList()
  }, [])
  function onClose () {
    setIsClick(false)
    setVisible(false)
  }
  return <div style={{display: 'flex', alignItems: 'center', fontWeight: 'bold'}}>
    <div style={{cursor: 'pointer'}} onClick={() => {
      setVisible(true)
      setIsClick(true)
    }}>{currentHouse.label}<Icon s="m" type="arrow-d"></Icon></div>
    <Dialog
      className={!isClick && 'selectwarehouse' || ''}
      title={
        !isChangeCompanyEnterprise() && <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <span>选择仓库</span>
        <ATipsCard
          visible={searchCardVisible}
          onClose={() => setSearchCardVisible(false)}
          trigger={
            <Input
              style={{marginLeft: 30}}
              placeholder='搜索仓库'
              innerBefore={
                <Icon type="search" style={{ margin: 4 ,color: '#d3d3d3'}} />
              }
              onFocus={() => {
                if (isEmpty(searchCardOptions)) {
                  setSearchCardVisible(false)
                } else {
                  setSearchCardVisible(true)
                }
              }}
              onChange={(val) => {
                if (isEmpty(val) || !val.trim()) return;
                const searchWh = (wareList.find(w => w.label.includes(val)));
                if (isEmpty(searchWh)) return;
                setSearchCardVisible(true);
                setSearchCardOptions(wareList.filter(w => w.label.includes(val)));
                getSelectedWareHouse(getTreeWarehouse(wareList), searchWh);
              }}
            ></Input>
        }>
          <div style={{background: '#fff', color: '#333'}}>
            {searchCardOptions.map((m, index) => {
              if (!m) return null
              return <div className={`pcs-tips-selector ${index == 0 && 'active' || ''}`} key={m.value} onClick={
                () => {
                  setSearchCardVisible(false);
                  getSelectedWareHouse(getTreeWarehouse(wareList), m);
                }
              }>
                {m.label}
              </div>
            })}
          </div>
        </ATipsCard>
        </div> || <span>当前企业无法登录集运宝，请在下方选择其它企业登录</span>
      }
      visible={visible}
      style={{width: 800}}
      footer={<div>
        <div style={{padding: '0 0 20px 0', fontSize: 14}}>
          <b>当前选择：</b><span className='main-color' style={{
            display: 'inline-block',
          }}>{
            isChangeCompanyEnterprise() ? (
              currentCompanyEnterprise.label || '--'
            ): (wareHouse.label || '--')
          }</span>
        </div>
        {isChangeCompanyEnterprise() && <div>
          <Button mr="10" type="primary" onClick={onChangeCompanyEnterprise}>确定并重新登录</Button>
          <Button onClick={() => logout(true)}>切换账号</Button>
        </div> || <div>
          <Button mr="10" type="primary" onClick={onOk}>确定</Button>
          {currentHouse.value && <Button onClick={onClose}>取消</Button>}
        </div>}
      </div>}
      onClose={onClose}
    >
    {/* 仓库选择 */}
      {!isChangeCompanyEnterprise() && <div style={{height: '500px',overflow: 'hidden', display: 'flex'}}>
        <div style={{height: '100%', overflow: 'auto',borderRight: '1px solid #ccc', flex: 1}}>
            {companyList.map((w,index) => {
              return <div
                className={`p-company-select ${warehouseList.value === w.value && 'active' || ''}`}
                key={index}
                onClick={() => SelectCompany(w)}
              >
                <span>{w.label}</span>
                <Icon type="arrow-right"></Icon>
              </div>
            })}
        </div>
        <div style={{flex: 1,height: '100%', overflow: 'auto',}}>
          <div>
            {Array.isArray(warehouseList.children) && warehouseList.children.map((w,index) => {
              return <div
                className={`p-ware-select ${w.value == wareHouse.value && 'active' || ''}`}
                key={index}
                ref={(ref) => {
                  // 保存当前dom 节点
                  warehouseDomNodeBox.current[w.value] = ref;
                  if (wareHouse.value == w.value) {
                    getCurrentHouseScrollIntoView(w);
                  }
                }}
                onClick={function(node){
                  warehouseDomNodeBox.current.activeHouse = w.value;
                  SelectWarehouse(w)
                }}
              >
                <span>{w.label}</span>
              </div>
            })}
          </div>

        </div>
      </div>}
    {/* 企业选择 */}
      {isChangeCompanyEnterprise() &&<div>
        <div style={{height: '400px',overflow: 'hidden', display: 'flex'}}>
        <div style={{flex: 1,height: '100%', overflow: 'auto',}}>
          <div>
            {Array.isArray(companyEnterpriseList) && companyEnterpriseList.map((E, index) => {
              return <div
                className={`p-ware-select ${E.value == currentCompanyEnterprise.value && 'active' || ''}`}
                key={index}
                ref={(ref) => {
                  // 保存当前dom 节点
                  warehouseDomNodeBox.current[E.value] = ref;
                  if (E.current) {
                    getCurrentHouseScrollIntoView(E);
                  }
                }}
                onClick={function(node){
                  warehouseDomNodeBox.current.activeHouse = E.value;
                  SelectCompanyEnterprise(E)
                }}
              >
                <span>{E.label}</span>
              </div>
            })}
          </div>
        </div>
      </div>
      </div>}
    </Dialog>
  </div>
}