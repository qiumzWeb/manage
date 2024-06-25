import Api from 'assets/api'
import $http from 'assets/js/ajax'
import Bus from 'assets/js/bus'
import { flatMap, _menus_, BusMenuMap, _indexMenuCode, _ICESTARKPRE_, isEmpty, isSameURLStr } from 'assets/js'
import {pathReg, getUrl, getId, getTitle, getParentId, getChildren, toUrl, setUrl, setTitle, deleteChildren, getSelectedScrollIntoView} from './utils'
import { Message} from '@/component'
import { DefineMenu } from './config'
const isProd = false
// 获取低码平台菜单
window.fetchGetMenuByRequest = $http({
  url: _ICESTARKPRE_ + '/getMenuByRequest',
  method: 'post',
  returnRes: true,
  data: {
    "tenantCode": "cone",
    "appCode": "pcs-manage",
    "loginType": "BUC",
    "userId": "WB01080910",
    "userTenant": ""
  }
})
const getIceStarkMenu = window.fetchGetMenuByRequest.then(res => {
  const {menus} = res && res.data || {}
  if (menus && Array.isArray(menus.subMenus)) {
    const iceMenuTree = menus.subMenus.filter(s => s.path.includes(_ICESTARKPRE_))
    flatMap(iceMenuTree, {
      childrenCode: 'subMenus',
      clone: false,
      callBack: (item) => {
        item.childrens = item.subMenus
        item.id = 80000 + Math.floor(Math.random() * 5000) + item.id
        item.menuUrl = undefined
        if (item.path.includes(_ICESTARKPRE_)) {
          item.parentMenuId = 9661
          Array.isArray(item.childrens) && item.childrens.forEach(c => {
            c.href = '/icestark' + c.path
            c.parentMenuId = item.id
          })
        } else {
          Array.isArray(item.childrens) && item.childrens.forEach(c => {
            c.href = item.href + c.path
            c.parentMenuId = item.id
          })
        }
      }
    })
    return iceMenuTree
  }
}).catch(err => {
  return []
})


  // 禁用的菜单
  const disabledMenu = [
    _indexMenuCode, //首页
    // 9675, 9680, 9681, 9685, 9686, 9687, 9688, 9690, 9691, 9692,
    // 9694,12910, 20432, 12909, 9858,9852, 10433,20431,23376,
    // 23377,10711, 23378, 32098,23375, 23379, 23373, 28704,28706,
    // 23374, 11962, 11088,11089,11090, 11602, 9701,9697, 9698,
    // 9863,9864, 11271, 9695
  ]
  // 自定义首页菜单
  const IndexMenuItem = {
    id: 999999999,
    href: '/',
    text: '首页',
  }
  const fbiReportIds = []
  // manage 系统菜单
  export default async (localMenu, {setMenuTree, setOpenKey, routerProps}) => {
    let pcsMenu = []
    let pcsServiceMenu = {}
    let childrenCode = 'childrens'
    try {
      const baseMenu = await $http({
        url: Api.getMenu,
        method: 'get',
        data: {
          app_code: 'pcs',
          useGosMenu: false
        }
      }).catch(e => [])
      // 缓存菜单信息
      const menuMap = {}
      if (Array.isArray(baseMenu)) {
        pcsMenu = (baseMenu.find(b => b.id == 9661) || {childrens: []})[childrenCode];
        pcsServiceMenu = baseMenu.find(b => b.id == 9662);
        // if (baseMenu.length === 1) {
        //   childrenCode = 'childrens'
        //   pcsMenu = baseMenu[0][childrenCode]
        // }
        // 将首页插入到最顶部
        pcsMenu.unshift(IndexMenuItem)

        // 生产环境 菜单 需要从菜鸟会员配置，测试菜单 直接代码 注入
        if (!isProd) {
          // 将测试菜单加入进来
          pcsMenu.push(...DefineMenu)
        }

        const iceStarkMenu = await getIceStarkMenu.then(icm => icm.filter(m => getTitle(m) !== "客服管理中心"))
        getMergeIceStarkMenu(pcsMenu, iceStarkMenu)
        // 将菜单 拉平并处理数据
        flatMap(pcsMenu, {childrenCode, clone: false, callBack: (m, parent) => {
          filterSingleMenu(m) // 单个菜单踢除子菜单
          if (getId(m) < 9700 && m.href && !m.href.includes('/pages/')) { // 4px老系统
            m.href = '/pages/' + m.href
          }
          // 首页权限控制
          if(disabledMenu.includes(m.menuCode)) {
            m.href = m.menuCode
            m.show = false
          }
          // 禁用菜单
          if (disabledMenu.includes(getId(m))) {
            m.show = false
          }
          m.routePath = getUrl(m) && getUrl(m).replace(pathReg, '')
          const id = toUrl(m.routePath || getId(m))
          // 生成菜单keys 层级
          if (!parent) {
            m.openKeys = [toUrl(getId(m))]
          } else {
            m.openKeys = [...parent.openKeys, toUrl(getId(m))]
          }
          if (isSameURLStr(id, routerProps.pathname)) {
            window._setTitle(getTitle(m))
            setOpenKey(m.openKeys)
          }
          m.key= id
          
          menuMap[id] = m
          const reportId = id.match(/^\/fbi\/report\/(\d*)/)
          if (reportId && !fbiReportIds.includes(reportId[1])) {
            fbiReportIds.push(reportId[1])
          }
        }})
      } else {
        localMenu = null
      }
      console.log(menuMap, 'manage 路由')
      Bus.setState({[BusMenuMap] : menuMap});
      // 渲染 菜单
      if (!localMenu || !baseMenu) {
        typeof setMenuTree === 'function' && setMenuTree(pcsMenu || [])
      } 
    } catch (err) {
      Message.error(err.message)
    }
    // 加载客服系统菜单
    getServiceMenuTree(pcsMenu, {setMenuTree, setOpenKey, routerProps, pcsServiceMenu})
  }
  // 获取客服系统 菜单
  async function getServiceMenuTree (menu, {setMenuTree, setOpenKey, routerProps, pcsServiceMenu}) {
    let pcsMenu = []
    let childrenCode = 'childrens'
    try {
      let baseMenu = []
      if (pcsServiceMenu) {
        baseMenu = [pcsServiceMenu]
      } else {
        baseMenu = await $http({
          url: Api.getServiceMenu,
          method: 'get',
        })
      }
      // 缓存菜单信息
      const menuMap = {}
      if (Array.isArray(baseMenu)) {
        baseMenu[0]?.childrens?.sort((a, b) => a.text.localeCompare(b.text))
        pcsMenu.push(...baseMenu)
        const iceStarkMenu = await getIceStarkMenu.then(icm => {
          const kf = icm?.find(m => getTitle(m) === "客服管理中心") || {}
          return getChildren(kf) || []
        }).catch(e => [])
        getMergeIceStarkMenu(baseMenu[0]?.childrens || [], iceStarkMenu)
        flatMap(pcsMenu, {childrenCode, clone: false, callBack: (m, parent) => {
          filterSingleMenu(m) // 单个菜单踢除子菜单
          if (getId(m) < 9800 && m.href && !m.href.includes('/servicepages/')) { // 4px客服系统
            m.href = '/servicepages/' + m.href
          }
          if (disabledMenu.includes(getId(m))) {
            m.show = false
          }
          if (getId(m) >= 9800 && m.href && !m.href.includes('/service/')) { // 菜鸟客服系统
            if (!(/^https?:\/\//.test(m.href))) {
              const href = /^\//.test(m.href) ? m.href : ('/' + m.href)
              m.href = '/service' + href
            }
          }
          if (m.text && m.text.includes('(新)')) {
            m.text = m.text.replace('(新)', '')
          }
          m.routePath = getUrl(m) && getUrl(m).replace(pathReg, '')
          const id = toUrl(m.routePath || getId(m))
          // 生成菜单keys 层级
          if (!parent) {
            m.openKeys = [toUrl(getId(m))]
          } else {
            m.openKeys = [...parent.openKeys, toUrl(getId(m))]
          }
          if (isSameURLStr(id, routerProps.pathname)) {
            window._setTitle(getTitle(m))
            setOpenKey(m.openKeys)
          }
          m.key= id
          menuMap[id] = m
        }})
      }
      console.log(menuMap, 'service 路由')
      Bus.setState({[BusMenuMap]: {
        ...Bus.getState(BusMenuMap),
        ...menuMap,
      }})
      
    } catch (err) {
      Message.error(err.message)
    }
    // 渲染 菜单
    const newMenu = [
      ...menu,
      ...pcsMenu
    ];
    typeof setMenuTree == 'function' && setMenuTree(newMenu || [])
    // 缓存菜单
    window.dbStore.set(_menus_, newMenu)
    getSelectedScrollIntoView()
    // 考虑到此代码会阻塞系统的秒开率， 固注释掉
    // 页面渲染完成后执行
    // let si = setTimeout(() => {
    //   // fbi 报表预加载
    //   fbiReportIds.forEach((id) => {
    //     let ti = setTimeout(() => {
    //       window.getFbiReportUrl(id)
    //       clearTimeout(ti)
    //     }, 100)
    //   })
    //   clearTimeout(si)
    // }, 5000)
  }
  // 多级菜单下只有一个菜单且与父菜单同名时，则将子菜单提升为一级菜单
  function filterSingleMenu(menuItem) {
    if (
      menuItem &&
      Array.isArray(getChildren(menuItem)) &&
      getChildren(menuItem).length === 1
    ) {
      if (menuItem.path && menuItem.path.includes(_ICESTARKPRE_)) return
      const child = getChildren(menuItem)[0]
      // if (child.text == menuItem.text) {
        setUrl(menuItem, getUrl(child))
        setTitle(menuItem, getTitle(child))
        deleteChildren(menuItem)
      // }
    }
  }

  // 合并低码微前端菜单
  function getMergeIceStarkMenu(manageMenu, icestarkMenu) {
    icestarkMenu.forEach(iceMenu => {
      const currentMenu = manageMenu.find(m => {
        return  getTitle(m) == getTitle(iceMenu)
      })
      if (currentMenu) {
        if (isEmpty(getChildren(currentMenu))) {
          currentMenu.childrens = []
        }
        iceMenu.childrens.forEach(ice => {
          ice.parentMenuId = currentMenu.id
        })
        currentMenu.childrens.push(...iceMenu.childrens)
      } else {
        manageMenu.push(iceMenu)
      }
    })
  }
