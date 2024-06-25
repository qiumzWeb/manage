import React, {useEffect, useState} from 'react';
import { Input } from '@alifd/next'
import TextArea from './TextArea'
import { AssignProps } from 'assets/js/proxy-utils'
import { onEnter as onInputEnter } from 'assets/js/utils'
const Component =  React.forwardRef(function (props, ref) {
  const {maxTagCount,showSearch, tagInline, hasLimitHint, detail, onEnter, trim, ...attrs} = props
  if (!attrs.placeholder && !attrs.disabled) {
    attrs.placeholder = '请输入'
  }
  return detail ? <span ref={ref} style={{fontWeight: 'bold', wordBreak: 'break-all'}}>{props.value}</span> : <Input
    ref={ref}
    showLimitHint={!!hasLimitHint}
    hasClear
    composition
    onKeyPress={onInputEnter(onEnter)}
    {...attrs}
    onBlur={(...args) => {
      typeof props.onBlur === 'function' && props.onBlur(...args);
      typeof props.onChange === 'function' && props.onChange(props.value && typeof props.value === 'string' && props.value.trim() || props.value)
    }}
  ></Input>
})
AssignProps(Component, Input, (key, to) => {
  if (key === 'TextArea') {
    to[key] = TextArea
  }
})
export default Component