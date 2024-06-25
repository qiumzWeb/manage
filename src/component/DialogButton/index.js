import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import { Dialog, Button, AForm, FormGroup, Message } from '@/component';
import { getResult, getObjType } from 'assets/js';
import { getMergeImportConfig } from './config';

export default React.forwardRef(function DialogButton(props, ref) {
  const {
    title, config, groupConfig, content, DialogWidth, children, data,
    onSubmit, beforeClose, beforeShow, btnProps, refresh, footer,
    defaultValue, disabled, confirmMsg, loading, isDetail, groupType,
    headerSlot, footerSlot, dialogTitle, formProps
  } = props
  const [visible, setVisible] = useState(false)
  const form = useRef()
  // 自动检查是否有导入组件, 自动补全导入组件配置
  getMergeImportConfig(config);
  if (getObjType(groupConfig) === 'Object') {
    Object.values(groupConfig).forEach(item => {
      getMergeImportConfig(item.model);
    })
  }
  useImperativeHandle(ref, () => ({
    open,
    close: onClose,
    submit: onOk
  }));
  async function open() {
    if (disabled) return;
    const result = await getResult(beforeShow, props)
    if (typeof result === 'string') {
      return Message.warning(result)
    }
    if (confirmMsg) {
      Dialog.confirm({
        title,
        content: typeof confirmMsg === 'function' ? confirmMsg(data, props) : confirmMsg,
        onOk: async() => {
          const useResult = await getResult(onSubmit, data, props)
          if (typeof useResult === 'string') {
            return Message.warning(useResult)
          }
          if (useResult === false) return;
          if (typeof refresh === 'function') {
            refresh()
          }
        }
      })
    } else {
      setVisible(true)
    }
    
  }
  async function onOk (expandData) {
    let result = null
    let formData = {}
    if (config) {
      result = await form.current.validate()
      formData = form.current.getData()
    }
    if (groupConfig) {
      result = formData = await form.current.getData()
    }
    if (result) {
      const useResult = await getResult(onSubmit, formData, data, props)
      if (typeof useResult === 'string') {
        return Message.warning(useResult)
      }
    
      if (useResult === false) return;
      if (typeof refresh === 'function') {
        refresh()
      }
      onClose()
    } else if (result === null) {
      if (expandData) {
        const useResult = await getResult(onSubmit, expandData, data, props)
        if (typeof useResult === 'string') {
          return Message.warning(useResult)
        }
        if (useResult === false) return;
        if (typeof refresh === 'function') {
          refresh()
        }
      }
      onClose()
    }
    
  }
  async function onClose() {
    const result = await getResult(beforeClose)
    if (typeof result === 'string') {
      return Message.warning(result)
    }
    setVisible(false)
  }
  // 获取footer 按钮状态
  function getFooter() {
    return getObjType(footer) === 'Object' ? footer : {}
  }
  return <span>
    <span onClick={open}>
      {children ? children : <Button loading={loading} {...btnProps}>{title}</Button>}
    </span>
    <Dialog
      title={dialogTitle || title}
      width={DialogWidth || 'auto'}
      visible={visible}
      footer={footer !== false && <div>
        {
          getFooter().ok !== false && (
            typeof getFooter().ok === 'function' ? getFooter().ok({
              form, data, props, onClose
            }) : <Button p mr="10" onClick={async() => await onOk()}>{getFooter().ok || '确定'}</Button>
          ) || null
        }
        {
          getFooter().cancel !== false && (
            typeof getFooter().cancel === 'function' ?  getFooter().cancel({
              form, data, props, onClose
            }) : <Button onClick={async() => await onClose()}>{getFooter().cancel || '取消'}</Button>
          ) || null
        } 
      </div> || false}
      onClose={onClose}
    >
    {typeof headerSlot === 'function' ? headerSlot(props) : headerSlot}
    {config && <AForm {...formProps} isDetail={isDetail} loading={loading} formModel={config} defaultValue={defaultValue} ref={form} data={data}></AForm> || null}
    {groupConfig && <FormGroup
      {...formProps}
      isDetail={isDetail} loading={loading}
      defaultValue={defaultValue}
      ref={form} group={groupConfig}
      isToggle={groupType === 'toggle'}
      data={data}></FormGroup> || null}
    {content || null}
    {typeof footerSlot === 'function' ? footerSlot(props) : footerSlot}
    </Dialog>
  </span>
})