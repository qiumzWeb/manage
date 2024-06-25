// import React, {useEffect, useRef, useState} from 'react'
// import Bus from 'assets/js/bus'
// import { Loading, Button, Dialog, Message, Tab } from '@/component'
// import Pagination from './component/Pagination'
// import QueryList from './component/queryList'
// import $http from 'assets/js/ajax'
// import Tobeassigned from './component/tobeassignedDialog'
// import ExceptOrderUnassign from './component/exceptOrderUnassign'
// import Offshelves from './component/offshelvesDialog'
// import { Table } from '@/component'
// import {isEmpty} from 'assets/js'
// window.loadOldPage('manage_page')
// export default function App(props) {
//   const isDev = process.env.NODE_ENV === 'development'
//   const [isLoading, setIsLoading] = useState(true)
//   const [iframeHeight, setIframeHeight] = useState('0%')
//   const iwindow = useRef()
//   const [List, setList] = useState(null)
//   const [TabTool, setTabTool] = useState([])
//   const [activeTab, setActiveTab] = useState('')

//   // 待分配任务
//   const [toBeassignVisible, setToBeassignVisible] = useState(false)
//   const [toBeassignData, setTobeassignData] = useState([])
//   const toBeassignClose = () => {
//     setToBeassignVisible(false)
//   }
//   // 订单异常分配任务
//   const [orderUnassignVisible, setOrderUnassignVisible] = useState(false)
//   const [orderUnassignData, setOrderUnassignData] = useState([])
//   const orderUnassignClose = () => {
//     setOrderUnassignVisible(false)
//   }

//   // 下架作业单分配任务
//   const [offshelvesDetailVisible, setOffshelvesDetailVisible] = useState(false)
//   const [offshelvesTableData, setOffshelvesTableData] = useState([])
//   const [offshelvesSelectRows, setOffshelvesSelectRows] = useState([])
//   const offshelvesColumns = [
//     {
//       title: '下架单号',
//       dataIndex: 'delegationOrderNo'
//     },
//     {
//       title: '渠道',
//       dataIndex: 'endCarrierCode',
//       cell: function(data){
//         return window.codeTrans['LOGISTICS_CHANNEL'][data] || data;
//       }
//     },
//     {
//       title: '库区/巷道',
//       dataIndex: 'roadwayId'
//     }
//   ]
//   const [offshelvesVisible, setOffshelvesVisible] = useState(false)
//   const [offshelvesData, setOffshelvesData] = useState([])
//   const offshelvesClose = () => {
//     setOffshelvesVisible(false)
//   }




//   // 事件配置
//   const events = {
//     fenpei(data) {
//       setToBeassignVisible(true)
//       setTobeassignData(data)
//     },
//     orderFenpei(data) {
//       setOrderUnassignVisible(true)
//       setOrderUnassignData(data)
//     },
//     offshelvesFenpei(data) {
//       setOffshelvesVisible(true)
//       setOffshelvesData(data)
//     }
//   }

//   // 加载页面
//   const loadPage = (time = 0, page) => {
//     const timer = setTimeout(() => {
//       setList(null)
//       setIframeHeight('0%')
//       setTabTool([])
//       const pages = page || location.pathname.split('/pages/')[1]
//       iwindow.current = document.getElementById('manage_page')
//       const win = iwindow.current && iwindow.current.contentWindow
//       if (win && win.loadPageContent) {
//         setIsLoading(false)
//         win.loadPageContent(pages)
//         Pagination.registerPagination(iwindow)
//         QueryList.register(iwindow, (iprops) => {
//           if (!iprops) {
//             return setIframeHeight('100%')
//           }
//           if (iprops.codeTrans) {
//             window.codeTrans = iprops.codeTrans
//           }
//           if (Array.isArray(iprops.tabOptions)) {
//             const activeKey = (iprops.tabOptions.find(t => t.active) || {page: ''}).page
//             setActiveTab(activeKey)
//             setTabTool(iprops.tabOptions)
//           }
//           console.log(iprops.btnList, '999999999999999')
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
//             {props.location.pathname === '/pages/offshelves' && <div slot="tableCell" prop="offshelves_make">
//               {(val, index, record) => {
//                 return <Button text type="link" onClick={async() => {
//                   setOffshelvesDetailVisible(true)
//                   const res = await $http({
//                     url: '/task/waitOffShelvesMission/list',
//                     method: 'get',
//                     data: {
//                       page: 1,
//                       waveNo: record.waveNo,
//                       operateUser: record.operateUser
//                     },
//                     oldApi: true
//                   })
//                   if (res.code == '0') {
//                     setOffshelvesTableData(res.result || [])
//                   } else {
//                     setOffshelvesTableData([])
//                   }
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
//         setTimeout(() => {
//           win.getDictionary(loadPage)
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
//     {/* <iframe ref={iwindow} width="100%" height={iframeHeight} src={'/manage.html'} style={{display: 'none'}}></iframe> */}
//     <div>
//       {
//         TabTool.length && <Tab activeKey={activeTab} animation={false}>
//           {TabTool.map((item, index) => {
//             return <Tab.Item title={item.title} key={item.page} onClick={() => loadPage(0, item.page)}></Tab.Item>
//           })}
//         </Tab> || null
//       }
//       {List}
//     </div>
//     {/* 分配任务 */}
//     <Tobeassigned
//       visible={toBeassignVisible}
//       onClose={toBeassignClose}
//       data={toBeassignData}
//     ></Tobeassigned>
//     {/* 订单异常分配任务 */}
//     <ExceptOrderUnassign
//       visible={orderUnassignVisible}
//       onClose={orderUnassignClose}
//       data={orderUnassignData}
//     ></ExceptOrderUnassign>
//       {/* 下架作业单分配任务 */}
//       <Dialog
//         visible={offshelvesDetailVisible}
//         style={{width: 800}}
//         title="信息"
//         footer={<Button type="primary" onClick={async() => {
//           if (!offshelvesSelectRows.length) {
//             return Message.warning('请选择分配数据')
//           }
//           const row = offshelvesSelectRows.reduce((a, b) => {
//             if (!a) return a
//             if (a.id === b.id) {
//               return a
//             } else {
//               return false
//             }
//           })
//           if (row) {
//             const res = await $http({
//               url: '/baseData/employeeList?roadWayIds=' + row.id,
//               method: 'get',
//               oldApi: true
//             })
//             if (res.code == '0') {
//               setOffshelvesData({data: res.dataList || [], selectedRows: [row]})
//               setOffshelvesVisible(true)
//               setOffshelvesDetailVisible(false)
//             } else {
//               setOffshelvesData({data: [], selectedRows: []})
//             }
//           } else {
//             Message.error('您选择的有不同的巷道id，请重新选择！')
//           }
//         }}>分配</Button>}
//         onClose={() => {setOffshelvesDetailVisible(false)}}
//       >
//         <Table dataSource={offshelvesTableData}
//           rowSelection={{
//             onChange: (keys, rows) => {
//               setOffshelvesSelectRows(rows)
//             },
//             selectedRowKeys: offshelvesSelectRows.map(s => s.id)
//           }}
//         >
//           {offshelvesColumns.map((c, index) => {
//             return <Table.Column {...c} key={index}></Table.Column>
//           })}
//         </Table>
//       </Dialog>
//     <Offshelves
//       visible={offshelvesVisible}
//       onClose={offshelvesClose}
//       data={offshelvesData}
//     ></Offshelves>
//   </div>
// }
