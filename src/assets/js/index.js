import Cookie from 'assets/js/cookie'
export * from './common';
import localStore from './localStore';
import Bus from 'assets/js/bus'

/**
 * 统一变量名
 */
// 首页快捷入口code
export const defineFastEntry = 'DEFINE_FAST_ENTRY_' + Cookie.get('accountId')
// 菜单 Map code
export const BusMenuMap = 'menuMap'
// 自定义菜单 code
export const _menus_ = 'MENU_TREE_' + Cookie.get('accountId')
// 用户token code
export const token = 'TwAhx8HL'
// 仓id code
export const wid = 'warehouseId'
// 用户仓id code
export const uWid  = Cookie.get('accountId') + '_warehouseId'
// 版本号 
export const version = '__VERSION__'
// 仓库名称
export const widName = 'warehouseName'
// 仓库列表
export const widList = 'warehouseList'
// 页签
export const NavTag = '__NabPageTag__'
// 首页菜单 menuCode
export const _indexMenuCode = 'pcs-wms-manage#menu#index'

// 低代码路由前缀
export const _ICESTARKPRE_ = '/cone/pcs-manage'

// 表格求和字段名
export const sumDataCode = '_isSumData_'

// 路由定位事件名称
export const RouterPositionSet = 'SetRouterPosition'

// 企业id code
export const CEId = 'companyEnterpriseId'
// 用户企业id code
export const uCEId  = Cookie.get('accountId') + '_companyEnterpriseId'
// 企业名称
export const CEIdName = 'companyEnterpriseName'
// 企业列表
export const CEIdList = 'companyEnterpriseList'

// 触发企业选择事件
export const changeCompanyEnterpriseEvent = "_NOT_LOGIN_CompanyEnterprise"

export {
    Cookie,
    localStore
}
// 是否登录
export function isLogin() {
    return !!Cookie.get(token)
}
// 获取仓Id ,判断是否选择仓库
export function getWid() {
    if (!localStore.get(uWid) || !Cookie.get(wid)) {
        setWid(localStore.get(uWid) || Cookie.get(wid))
    }
    return +Cookie.get(wid) || ''
}

// 获取仓库名称
export function getWName(wid) {
    const wl = Bus.getState(widList) && Bus.getState(widList).data
    wid = wid || getWid()
    if (wl) {
        return (wl.find(w => w.value == wid) || {label: wid}).label
    } else {
        return wid
    }
}

// 设置仓id
export function setWid(val) {
    Cookie.set(wid, val)
    localStore.set(uWid, val)
}

// 退出登录
export async function logout(isHandle) {
  const exit = () => {
    Cookie.del(token)
    Cookie.del(wid)
    const currentPath = encodeURIComponent(window.location.href)
    window.location.href = 'https://cnlogin.cainiao.com/login?isNewLogin=true&redirectURL=' + currentPath
  }
  console.log(isHandle, '888888888')
  if (isHandle) {
    exit()
  } else {
    window.getCompanyEnterpriseList && window.getCompanyEnterpriseList.then(CE => {
      console.log(CE, '=======菜鸟企业=======')
      if (CE) {
        Bus.$emit(changeCompanyEnterpriseEvent, CE)
      } else {
        exit()
      }
    })
  }

}

// 唤起一键开仓配置
export const WarehouseConfigModel = 'WarehouseConfigModel'
export function SetWarehouseModel(status) {
  Bus.$emit(WarehouseConfigModel, status)
}


// 获取企业Id ,判断是否选择企业
export function getCEId() {
  if (!localStore.get(uCEId) || !Cookie.get(CEId)) {
      setWid(localStore.get(uCEId) || Cookie.get(CEId))
  }
  return +Cookie.get(CEId) || ''
}

// 获取企业名称
export function getCEName(CEId) {
  const wl = Bus.getState(CEIdList)
  CEId = CEId || getCEId()
  if (wl) {
      return (wl.find(w => w.value == CEId) || {label: CEId}).label
  } else {
      return CEId
  }
}

// 设置企业id
export function setCEId(val) {
  Cookie.set(CEId, val)
  localStore.set(uCEId, val)
}