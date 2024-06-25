import React, {useState, useEffect, useRef} from 'react'
import { Card, Button, AForm, Message } from '@/component';
import { formModel, addUrl, modifyUrl} from './config';
import { useActivate } from 'react-activation';
import { getStepBaseData, setStepBaseData, saveStepNode } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config'
import $http from 'assets/js/ajax'
import BottomTool from '@/pages/warehouseConfiguration/warehouseConfigProgress/bottom-tools';
import { isEmpty, getObjType } from 'assets/js'
WarehouseConfigStep.title = '新增物理库'
WarehouseConfigStep.home = '/warehouseConfigList'
export default function WarehouseConfigStep(props) {
  let baseData = getStepBaseData() || {}
  const defaultData = {
    warehouseId: baseData.warehouseId,
    isReadOnly: baseData.readOnly,
    isAdd: true
  }
  Object.keys(formModel).forEach(key => defaultData[key]='')
  const [warehouseData, setWarehouseData] = useState(defaultData)
  const [nextDisabled, setNextDisabled] = useState(baseData.currentSaveNode < 20)
  const form = useRef();
  useEffect(initStep, [])
  useActivate(initStep)
  // 判断是否为修改配置
  function isModify() {
    baseData = getStepBaseData() || {}
    return baseData.currentSaveNode > 10
  }
  // 初始化
  function initStep() {
    // 若已新增仓库 ，则加载仓库信息
    if (isModify()) {
      form.current.setLoading(true)
      $http({
        url: `/sys/openWarehouse/getWarehouseByWarehouseId?warehouseId=${baseData.warehouseId}`,
        method: 'get',
      }).then(res => {
        if (getObjType(res) === 'Object') {
          setWarehouseData({
            isReadOnly: baseData.readOnly,
            isAdd: false,
            ...res
          })
        }
      }).finally(_ => {
        form.current.setLoading(false)
      })
    } else {
      console.log(defaultData, '默认数据====')
      setWarehouseData(defaultData)
    }
  }
  // 保存
  async function onOk() {
    const result = await form.current.validate()
    if (result) {
      const formData = form.current.getData()
      formData.warehouseShort = formData.warehouseName
      if (isModify()) {
        await modify({
          ...formData,
        })
      } else {
        await add({
          ...formData,
        })
      }
    }
  }
  // 新增
  async function add(data) {
    try {
      const res = await $http({
        url: `/sys/openWarehouse/createAndApplyPermission`,
        method: 'post',
        data: Object.assign({
          openWarehouseCode: baseData.openWarehouseCode,
          warehouseType: baseData.warehouseType
        }, warehouseData, data)
      })
      setWarehouseData(res);
      setStepBaseData({
        ...res,
        currentSaveNode: baseData.currentSaveNode < 20 ? 20 : baseData.currentSaveNode
      });
      saveStepNode(20)
      setNextDisabled(false)
      Message.success('新增成功')
    } catch(e) {
      Message.error(e.message)
      throw new Error(e.message)
    }
  }
  // 修改
  async function modify(modifyData) {
    try {
      const res = await $http({
        url: `${modifyUrl}/${warehouseData.warehouseId}`,
        method: 'post',
        data: Object.assign({
          warehouseId: warehouseData.warehouseId
        }, modifyData)
      })
      setStepBaseData(res)
      Message.success('保存成功')
    } catch(e) {
      Message.error(e.message)
    }
  }
  return <div>
    <Card title="基础信息" hasBorder={false}>
      <Card.Content>
        <AForm isDetail={() => !!getStepBaseData().readOnly} data={warehouseData} formModel={formModel} ref={form}></AForm>
      </Card.Content>
    </Card>
    <BottomTool
      rightTool={<>
        {isModify() ? <Button size="large" p onClick={onOk} mr='10'>保存</Button> : <Button size="large" p onClick={onOk} mr='10' call_jump="20">保存并申请权限</Button>}
        <Button size="large" s mr='10' call_jump="20" disabled={nextDisabled}>下一步</Button>
      </>}
    ></BottomTool>
  </div>
}