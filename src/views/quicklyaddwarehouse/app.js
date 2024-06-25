import React, { useState, useEffect } from 'react';
import { SetWarehouseModel } from 'assets/js'
import { Dialog, Message } from '@/component';
QuicklyAddWarehouse.title = '开仓配置'
export default function QuicklyAddWarehouse() {
  useEffect(() => {
    Dialog.confirm({
      title: '是否进入开仓配置模式',
      content: <div style={{lineHeight: '30px'}}>
        <div style={{margin: 20}}>
          <div>您即将进入开仓配置模式，进入开仓配置模式后，系统界面将只显示开仓相关配置项，</div>
          <div>其它功能菜单将无法操作，</div>
          <div>
            期间若要操作其它功能菜单，可点击顶部
            <b className='warn-color'>【退出开仓配置模式】</b>
            按钮返回系统页面。
          </div>
        </div>
      </div>,
      onOk: () => {
        Message.success('进入开仓配置模式')
        SetWarehouseModel(true)
      },
      onClose: onClose,
      onCancel: onClose
    })
  }, [])
  function onClose() {
    SetWarehouseModel(false)
  }
  return <div></div>
}