
import React, {useEffect} from 'react'
import Bus from 'assets/js/bus'
import { getWid, RouterPositionSet } from 'assets/js'
import KeepAlive from '@/component/keepAlive'
import { checkIndexAuth } from 'assets/js/auth'
import { isWarehouseConfigRoute } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config'

export default {
/**
 * @desc 路由首次进入时调用, 路由守卫
 * @param {function} next // 必须执行next() 才能进入页面
 * @param {Object} route // 当前路由信息
 */
  async beforeEach(next, route) {
    if (!getWid() && route.path !== '/selectwarehouse') {
      await new Promise(resolve => {
        const unBus = Bus.$on('routeRefresh', () => {
          unBus()
          resolve()
        })
      })
    }
    // 判断首页路由权限
    const paths = ['/', '/index']
    if (paths.includes(route.path) && !(await checkIndexAuth())) {
      next('/update')
    } else {
      next();
    }
    
    // next()
  },


/**
 * @desc 所有路由总开关  // beforeRouteEntry
 * @param {*} Route //当前加载的路由组件
 * @returns
 */
  beforeRouteEnter(Route) {
    return function ProxyApp (props) {
      const path = props.location.pathname
      Bus.setState({
        apiBase: /\/service/.test(path) ? '/pcsservice' : null
      })
      const TagUrl = props.match.url + props.location.search
      let RouteTitle = Route.title
      Bus.$emit(RouterPositionSet, Route.home || path)
      useEffect(() => {
        // 开仓配置页面离开时需要弹出离开确认框
        // window.hasSavePreventLeave = isWarehouseConfigRoute(props.location.pathname);
        const unBlock = props.history.block((tx) => {
          const hasConform = !(tx.state && tx.state.noConfirm === true)
          if(window.hasSavePreventLeave && !isWarehouseConfigRoute(tx.pathname) && hasConform) {
            return "确定要离开？\n系统可能不会保存您所做的更改。"
          }
          unBlock();
        })
      }, [])
      useEffect(() => {
        // 获取路由title
        if (Route.title) {
          document.title = Route.title
          RouteTitle = Route.title
        } else if (document.title) {
          RouteTitle = document.title
        }
        // 全局挂载路由
        !window.Router && (window.Router = props.history)

        // 设置特定页面背景色 为 透明色， 默认为白色
        const routes = [
          '/', '/index', '/fbi/report/:id',
          '/icestark/:id', '/icestark/service/:id'
        ]
        const color = (routes.includes(props.match.path) || Route.model == "fullScreen") && 'transparent' || undefined
        
        // 设置页签显示
        const hideNavTagRoutes = []
        const hideNavTag = hideNavTagRoutes.includes(props.match.path)

        Bus.$emit('setConfig', {color, hideNavTag})
        if (Route.title !== '404') {
          Bus.$emit('setNavTag', {
            pathname: props.location.pathname.toLowerCase(),
            url: TagUrl,
            name: RouteTitle,
            home: Route.home
          })
        }
      },[props.match.url])
      return <KeepAlive {...props} keepKey={TagUrl}><Route {...props}></Route></KeepAlive>
    };
  }
}
