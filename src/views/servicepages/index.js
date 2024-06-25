// import React, {useEffect, useRef, useState} from 'react'
// import Bus from 'assets/js/bus'
// import { Loading, Button, Dialog, Message, Tab } from '@/component'
// import Pagination from '../pages/component/Pagination'
// import QueryList from '../pages/component/queryList'
// import $http from 'assets/js/ajax'
// import ExceptOrderUnassign from './component/exceptOrderUnassign'
// import { DetailDialog } from '@/service/package/list.jsx'
// import { DetailDialog as OrderDetail } from '@/service/order/list'
// import {isEmpty} from 'assets/js'
// window.loadOldPage('service_page')
// export default function App(props) {
//   const isDev = process.env.NODE_ENV === 'development'
//   const [isLoading, setIsLoading] = useState(true)
//   const [iframeHeight, setIframeHeight] = useState('0%')
//   const iwindow = useRef()
//   const [List, setList] = useState(null)
//   const [TabTool, setTabTool] = useState([])
//   const [activeTab, setActiveTab] = useState('')
//   const packageDetail = useRef()
//   // 待分配任务
//   // 订单异常分配任务
//   const [orderUnassignVisible, setOrderUnassignVisible] = useState(false)
//   const [orderUnassignData, setOrderUnassignData] = useState([])
//   const orderUnassignClose = () => {
//     setOrderUnassignVisible(false)
//   }


//   // 事件配置
//   const events = {
//     orderFenpei(data) {
//       setOrderUnassignVisible(true)
//       setOrderUnassignData(data)
//     }
//   }


//   const loadPage = (time = 0, page) => {
//     const timer = setTimeout(() => {
//       setList(null)
//       setIframeHeight('0%')
//       setTabTool([])
//       const pages = page || location.pathname.split('/servicepages/')[1]
//       iwindow.current = document.getElementById('service_page')
//       const win = iwindow.current && iwindow.current.contentWindow

//       if (win && win.loadPageContent) {
//         setIsLoading(false)
//         win.loadPageContent(pages)
//         setIsLoading(false)
//         win.loadPageContent(pages)
//         Pagination.registerPagination(iwindow)
//         QueryList.register(iwindow, (iprops) => {
//           if (!iprops) {
//             return setIframeHeight('100%')
//           }
//           if (Array.isArray(iprops.tabOptions)) {
//             const activeKey = (iprops.tabOptions.find(t => t.active) || {page: ''}).page
//             setActiveTab(activeKey)
//             setTabTool(iprops.tabOptions)
//           }
//           setList(<QueryList
//             qSearch={iprops.qSearch}
//             tColumns={iprops.tColumns}
//             getRes ={iprops.getRes}
//             tableOptions = {iprops.tableOptions}
//           >
//             {!isEmpty(iprops.btnList) && <div slot="tools">
//               {Array.isArray(iprops.btnList) && iprops.btnList.map((btn, index) => {
//                 return <Button key={index} mr={index + 1 == iprops.btnList.length ? 0 : 10} onClick={() => {
//                   typeof btn.onClick === 'function' && btn.onClick({
//                     Dialog, $http, Message, setIsLoading
//                   }, (data) => {
//                     if (data) {
//                       console.log(data, 8989);
//                       (events[data.code])(data);
//                     } else {
//                       Bus.$emit('iframeTableRefresh')
//                     }
//                   })
//                 }}>{btn.title}</Button>
//               })}
//             </div>}
//             {props.location.pathname === '/servicepages/search_preorder' && <div slot="tableCell" prop="packageDetail_make">
//               {(val, index, record) => {
//                 return <Button text type="link" onClick={() => {
//                   packageDetail.current && packageDetail.current.onDialogShow(record.id)
//                 }}>详情</Button>
//               }}
//             </div> || null}
//             {props.location.pathname === '/servicepages/g_order_oList' && <div slot="tableCell" prop="orderDetail_make">
//               {(val, index, record) => {
//                 return <Button text type="link" onClick={() => {
//                   packageDetail.current && packageDetail.current.onDialogShow(record.id)
//                 }}>详情</Button>
//               }}
//             </div> || null}
//           </QueryList> )

//         })
//       } else {
//         loadPage(20)
//       }
//       clearTimeout(timer)
//     }, time)
//   }
//   useEffect(() => {
//     loadPage()
//   }, [props.match.params.path])
//   const watchMessage = (e) => {
//     if (e.origin === window.location.origin) {
//       const data = e.data && JSON.parse(e.data)
//       if (data.hasOwnProperty('loading')) {
//         setIsLoading(!!data.loading)
//       }
//     }
//   }
//   useEffect(() => {
//     const unBus = Bus.watch('menuMap', state => {
//       loadPage()
//     })
//     const refreshBus = Bus.$on('routeRefresh', () => {
//       const win = iwindow.current && iwindow.current.contentWindow
//       if (location.pathname === props.location.pathname) {
//         let t = setTimeout(() => {
//           win.getDictionary(loadPage)
//           clearTimeout(t)
//         }, 0)
//       }
//       // win.getDictionary(loadPage)
//       // loadPage()
//     })
//     window.addEventListener('message', watchMessage, false)
//     return () => {
//       unBus()
//       window.removeEventListener('message', watchMessage, false)
//       refreshBus()
//     }
//   }, [])

//   return <div>
//     {isLoading && <Loading style={{position: 'absolute', top: '48%', left: '48%', zIndex: 999}}></Loading>}
//     {/* <iframe ref={iwindow} width="100%" height={iframeHeight} src={'/service.html'} style={{display: 'none'}}></iframe> */}
//     <div>
//       {
//         TabTool.length && <Tab style={{marginBottom: 20}} activeKey={activeTab} animation={false}>
//           {TabTool.map((item, index) => {
//             return <Tab.Item title={item.content} key={item.page} onClick={() => loadPage(0, item.page)}></Tab.Item>
//           })}
//         </Tab> || null
//       }
//       {List}
//     </div>
//     {/* 订单异常分配任务 */}
//     <ExceptOrderUnassign
//       visible={orderUnassignVisible}
//       onClose={orderUnassignClose}
//       data={orderUnassignData}
//     ></ExceptOrderUnassign>
//     {/* 包裹详情 */}
//     {props.location.pathname === '/servicepages/search_preorder' && <DetailDialog ref={packageDetail}/>}
//     {/* 订单详情 */}
//     {props.location.pathname === '/servicepages/g_order_oList' && <OrderDetail ref={packageDetail}></OrderDetail>}
//   </div>
// }
