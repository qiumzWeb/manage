import React, { useEffect, useState, useRef, useImperativeHandle } from 'react'
import FormGroup from '@/component/FormGroup/index'
import { Button, Dialog } from '@/component'
import { Message } from '@/component/index'
import { baseModel, rulesModel } from './config'
import $http from 'assets/js/ajax';
import { getStepBaseData, setStepBaseData, saveStepNode, stepJump } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
export default React.forwardRef(function RulesModify(props, ref) {
  const { refresh } = props
  const [visible, setVisible]= useState(false)
  const [data, setData] = useState({isAdd: true})
  const [btnLoading, setBtnLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const form = useRef()
  useImperativeHandle(ref, () => ({
    open: (detailData) => {
      setData({
        ...detailData,
        rulesList: detailData,
      })
      setVisible(true)
    }
  }))
  function listRefresh() {
    typeof refresh === 'function' && refresh()
  }
  async function onOk() {
    try {
      const formData = await form.current.getDataList()
      if (!formData) return
      const { base } = formData
      let requestParams = {}
      if (data.isAdd) {
        requestParams = {
          url: `/warehouses/${getStepBaseData().warehouseId}/sorting-solution-create`,
          data: {
            ...data,
            ...base,
            isAdd: undefined,
            rulesList: undefined,
          }
        }
      } else {
        requestParams = {
          url:  `/warehouses/${getStepBaseData().warehouseId}/sorting-solution/${data.id}/update`,
          data: {
            ...data,
            ...base,
            rulesList: undefined,
          }
        }
      }
      setBtnLoading(true)
      const newPlanData = await $http({ type: 'post', ...requestParams })
      saveStepNode(160)
      if (data.isAdd) {
        // 新增计划，弹窗确认是否继续新增规则
        Dialog.confirm({
          title: '创建成功',
          content: '是否立即前往新增规则？',
          onOk: () => {
            setData({
              ...newPlanData,
              rulesList: {
                ...newPlanData,
                isOpenNewRules: true,
                warehouseId: getStepBaseData().warehouseId,
                warehouseName: getStepBaseData().warehouseName
              },
            })
          },
          okProps: {children: '新增规则'}
        })
      } else {
        Message.success('保存成功')
      }
      listRefresh()
    } catch(e) {
      Message.error(e.message)
    } finally {
      setBtnLoading(false)
    }
  }
  function onClose() {
    setVisible(false)
  }
  return <Dialog
    title={data.isAdd ? '新增' : '修改'}
    width={data.isAdd ? 900 : '100%'}
    visible={visible}
    onOk={onOk}
    okProps={{loading: btnLoading, children: data.isAdd ? '创建计划' : '保存'}}
    onClose={onClose}
    onCancel={onClose}
    cancelProps={{children: '关闭'}}
  >
    <FormGroup ref={form} loading={loading} data={data} group={{
      base: {title: '基本信息', model: baseModel},
      rules: {title: '规则信息', model: rulesModel, show: d => !d.isAdd}
    }}>
    </FormGroup>
  </Dialog>
})