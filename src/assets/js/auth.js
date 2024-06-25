import { _indexMenuCode, BusMenuMap, getWName } from 'assets/js'
import Bus from 'assets/js/bus'

/**
 * 判断首页权限
 * 通过菜单权限决定数据权限
 */
export const checkIndexAuth = () => new Promise(async (resolve) => {
  await (Bus.getState(BusMenuMap) || new Promise(resolve => Bus.watch(BusMenuMap, resolve)))
  const menu = Bus.getState(BusMenuMap)
  const indexKey = '/' + _indexMenuCode
  menu && menu[indexKey] && resolve(true) || resolve(false)
})
/**
 * 判断是否有某个仓库的权限
 * @param {*} warehouseId 
 * @returns {Boolean}
 */
export const hasWarehouseAuth = (warehouseId) => {
  // getWName 返回值为 等于 仓Id  而不是 name 时 则 用户无该仓库的权限
  return getWName(warehouseId) !== warehouseId;
}