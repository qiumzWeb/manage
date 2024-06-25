import React, {useEffect, useState} from 'react'
import { Icon, Badge } from '@/component'
import ASelect from '@/component/ASelect'
import $http from 'assets/js/ajax'
import Cookie from 'assets/js/cookie'
import Api from 'assets/api'
import { logout, setWid, getWid } from 'assets/js'
import OverTips from '@/component/overTips/index'
import SelectWareHouse from '@/layout/selectwarehouse'
import UserIcon from 'assets/imgs/default-user.js'
import Bus from 'assets/js/bus'
import moment from 'moment'
const requestUserInfo = $http({
  url: Api.getUserInfo,
  method: 'get',
  oldApi: true
})
let timer = null
export default function Action(props) {
  const [userInfo, setUserInfo] = useState({})
  const [downloadCount, setDownloadCount] = useState(0)

  // 获取用户信息
  const getUser = async() => {
    try {
      const res = await requestUserInfo
      setUserInfo(res || {})
      Cookie.set('useName', res.name)
    } catch(e) {}
  }
  // 获取下载中心可下载数据
  async function getDownloadCount() {
    clearTimeout(timer)
    try {
      const res = await $http({
        url: Api.downloadCenterList,
        method: 'post',
        data: {
          // warehouseId: getWid(),
          startTime: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
          status: ['SUCC']
        }
      })
      if (res && res.totalRowCount) {
        setDownloadCount(res.totalRowCount)
      } else {
        setDownloadCount(0)
      }
    } catch (e) {
      console.log(e)
    } finally {
      // timer = setTimeout(() => {
      //   getDownloadCount()
      //   clearTimeout(timer)
      // }, 30000)
    }
  }
  useEffect(() => {
    // getWarehouseInfo()
    getDownloadCount()
    const unBus = Bus.$on('routeRefresh', ()=> {
      Bus.$emit('downLoadRefresh')
    })
    const unRefresh = Bus.$on('downLoadRefresh', () => getDownloadCount().then(() => {
      timer = setTimeout(() => {
        getDownloadCount()
        clearTimeout(timer)
      }, 30000)
    }))
    getUser()
    return () => {
      unBus();
      unRefresh()
    }
  }, [])

  return <div style={{display: 'flex', fontSize: 14}}>
    <SelectWareHouse></SelectWareHouse>
    <OverTips showTips
      trigger={
        <Badge count={downloadCount} mr="24" ml="24">
          <Icon style={{cursor: 'pointer'}} onClick={() => {
          window.Router && window.Router.push('/downloadcenter')
        } } title="下载中心" defineType="download"></Icon>
        </Badge>
      }
    >
      {
        downloadCount ? `您有${downloadCount}个文件导出成功`: '暂无下载任务'
      }
    </OverTips>
    {/* <OverTips showTips trigger={<Badge count="0" mr='25' ml="25" style={{marginLeft: '30%'}}style={{marginLeft: '30%'}}><Icon type="email" size='small'></Icon></Badge>}>
        您暂时没有新消息
    </OverTips> */}
    <ASelect isDropDown defaultValue={
        <>
          {/* <Icon defineType="default-user" mr="5"></Icon> */}
          <UserIcon></UserIcon>
          {userInfo.name || userInfo.userName}
        </>
      }
      onClick={() => logout('exit')}
      align={'tr cr'}
      offset={[0, 24]}
      getOptions={async () => {
        return [{
          label: '退出登录',
          value: ''
        }]
      }}
    ></ASelect>
  </div>
}