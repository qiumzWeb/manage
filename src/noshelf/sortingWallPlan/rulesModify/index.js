import React, { useEffect, useState, useRef, useImperativeHandle } from 'react'
import FormGroup from '@/component/FormGroup/index'
import { Button, Dialog, Message } from '@/component'
import { baseModel, rulesModel, getUpdateBaseData } from './config'
import { getUpdateRuleToUCS, flashSowOptions } from '../config/planConfig'
import $http from 'assets/js/ajax'
import Bus from 'assets/js/bus'
export default React.forwardRef(function RulesModify(props, ref) {
  const { refresh } = props
  const [visible, setVisible]= useState(false)
  const [data, setData] = useState({isAdd: true})
  const [btnLoading, setBtnLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const form = useRef()
  const realData = useRef({})
  useEffect(() => {
    // 解决配置更新
    const unBus = Bus.$on('ruleDetailRefresh', () => {
      getUpdateBaseData({...realData.current, solutionId: realData.current.id}).then(resData => {
        if (resData) {
          updateData({
            ...realData.current,
            ...resData
          })
        }
      })
    })
    return () => unBus()
  }, [])
  useImperativeHandle(ref, () => ({
    open: (detailData) => {
      updateData({
        ...detailData,
        rulesList: detailData,
      })
      setVisible(true)
    }
  }))
  function listRefresh() {
    typeof refresh === 'function' && refresh()
  }
  function updateData(data) {
    setData(realData.current = data)
  }
  async function onOk() {
    try {
      const formData = await form.current.getDataList()
      if (!formData) return
      const { base } = formData
      let requestParams = {}
      if (data.isAdd) {
        requestParams = {
          url: `/warehouses/${base.warehouseId}/sorting-solution-create`,
          data: {
            ...data,
            ...base,
            isAdd: undefined,
            rulesList: undefined
          }
        }
      } else {
        requestParams = {
          url:  `/warehouses/${base.warehouseId}/sorting-solution/${data.id}/update`,
          data: {
            ...data,
            ...base,
            rulesList: undefined
          }
        }
      }
      setBtnLoading(true)
      const newPlanData = await $http({ type: 'post', ...requestParams })
      if (data.isAdd) {
        // 新增计划，弹窗确认是否继续新增规则
        Dialog.confirm({
          title: '创建成功',
          content: '是否立即前往新增规则？',
          onOk: () => {
            updateData({
              ...newPlanData,
              rulesList: {
                ...newPlanData,
                isOpenNewRules: true
              },
            })
          },
          okProps: {children: '新增规则'}
        })
      } else {
        Message.success('保存成功')
      }
      listRefresh();
      !data.isAdd && onClose();
    } catch(e) {
      Message.error(e.message)
    } finally {
      setBtnLoading(false)
    }
  }
  function onClose() {
    setVisible(false)
  }

  // 推送到UCS
  async function pushToUcs() {
    try {
      await getUpdateRuleToUCS({...data, solutionId: data.id})
      listRefresh()
      onClose()
    } catch(e) {
      Message.error(e.message)
    }
  }
  return <Dialog
    title={data.isAdd ? '新增' : '修改'}
    width={data.isAdd ? 820 : '100%'}
    visible={visible}
    // onOk={onOk}
    // okProps={{loading: btnLoading, children: data.isAdd ? '创建计划' : '保存'}}
    onClose={onClose}
    // onCancel={onClose}
    // cancelProps={{children: '关闭'}}
    footer={<>
      {flashSowOptions.map(f => f.value).includes(data.sortingType) && <Button p mr="10" onClick={pushToUcs}>推送UCS</Button>}
      <Button p mr="10" onClick={onOk}>{data.isAdd ? '创建计划' : '保存'}</Button>
      <Button onClick={onClose}>关闭</Button>
    </>}
  >
    <FormGroup ref={form} loading={loading} data={data} group={{
      base: {title: '基本信息', model: baseModel},
      rules: {title: '规则信息', model: rulesModel, show: d => !d.isAdd}
    }}>
    </FormGroup>
  </Dialog>
})