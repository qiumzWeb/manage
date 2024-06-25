import React, {useState, useEffect, useRef} from 'react'
import { Card, Grid, Message } from '@/component'
import { CardConfig } from './config'
import $http from 'assets/js/ajax'
import Cookie from 'assets/js/cookie'
import { useSetTimer } from 'assets/js/ahooks'
require('./px2rem.scss')
const commonData = {}
export default function App(props) {
  const isActive = useRef(props.isActive)
  const [data, setData] = useState({})
  useEffect(() => {
    isActive.current = props.isActive
  }, [props.isActive])
  useEffect(() => {
    console.log('初始化页面')
    getOutStoreData()
    getOrderData()
    getPackageData()
    getPreSortingData()
  }, [])
  // 1分钟刷新一次数据，三个接口间隔 20秒 逐个执行
  useSetTimer(getOutStoreData, 1000 * 60, 1000 * 10)
  useSetTimer(getPreSortingData, 1000 * 60, 1000 * 20)
  useSetTimer(getOrderData, 1000 * 60, 1000 * 30)
  useSetTimer(getPackageData, 1000 * 60, 1000 * 50)
  // 获取出库数据
  async function getOutStoreData() {
    console.log('获取出库数据')
    // tab 页切走时，不处理数据
    if (!isActive.current) return;
    try{
      const warehouseId = Cookie.get('warehouseId')
      const res = await $http({
        url: '/noneShelvesBoard/querySortingProgress',
        method: 'get',
        data: {warehouseId}
      })
      const {finalScannedQuantity, initialScannedQuantity, secondScannedQuantity, totalQuantity} = (res || {})
      Object.assign(commonData, {finalScannedQuantity, initialScannedQuantity, secondScannedQuantity, totalQuantity})
      setData({
        ...commonData
      })
    } catch(e) {
      console.log(e)
    }
  }
  // 获取接单数据
  async function getOrderData() {
    console.log('获取接单数据')
    // tab 页切走时，不处理数据
    if (!isActive.current) return;
    try{
      const warehouseId = Cookie.get('warehouseId')
      const res = await $http({
        url: '/noneShelvesBoard/queryOrderReceivingCount',
        method: 'get',
        data: {warehouseId}
      })
      const {orderReceiveCount, orderReceiveChain, pkgReceiveCount, pkgRecevieChain} = (res || {})
      Object.assign(commonData, {orderReceiveCount, orderReceiveChain, pkgReceiveCount, pkgRecevieChain})
      setData({
        ...commonData
      })
    } catch(e) {
      console.log(e)
    }
  }
  // 获取预分拣数据
  async function getPreSortingData() {
    console.log('获取分拣数据')
    // tab 页切走时，不处理数据
    if (!isActive.current) return;
    try{
      const warehouseId = Cookie.get('warehouseId')
      const res = await $http({
        url: '/noneShelvesBoard/queryPreSortingQuantity',
        method: 'get',
        data: {warehouseId}
      })
      Object.assign(commonData, (res || {}))
      setData({
        ...commonData
      })
    } catch(e) {
      console.log(e)
    }
  }
  // 获取包裹数据
  async function getPackageData() {
    console.log('获取包裹数据')
    // tab 页切走时，不处理数据
    if (!isActive.current) return;
    try{
      const warehouseId = Cookie.get('warehouseId')
      const res = await $http({
        url: '/noneShelvesBoard/queryBackLogCount',
        method: 'get',
        data: {warehouseId}
      })
      Object.assign(commonData, (res || {}))
      setData({
        ...commonData
      })
    } catch(e) {
      console.log(e)
    }
  }
  return <div className="noshelf-board">
    {CardConfig.map((config, index) => {
      return <div className='noshelf-board-col' key={index}>
        {Object.entries(config).map(([key, item]) => {
          return <div className='noshelf-board-cell' key={key}>
              <div className="noshelf-board-cell-title">{item.title}</div>
              <div className="noshelf-board-cell-content">
                {typeof item.value == 'function' ? item.value(data) : item.value}
              </div>
              {
                item.subTitle && <>
                  <div className="noshelf-board-cell-subtitle">{typeof item.subTitle == 'function' ? item.subTitle(data) : item.subTitle}</div>
                </>
              }
          </div>
        })}
        </div>
    })}
  </div>
}