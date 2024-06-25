import React from 'react';
import { Input } from '@alifd/next'
import { AssignProps } from 'assets/js/proxy-utils'
import { onEnter as onInputEnter } from 'assets/js/utils'
const Component =  React.forwardRef(function (props, ref) {
  const {hasClear, hasLimitHint, onEnter, ...attrs} = props
  return <Input.TextArea
    ref={ref}
    showLimitHint={!!hasLimitHint}
    onKeyPress={onInputEnter(onEnter)}
    composition
    {...attrs}
  ></Input.TextArea>
})
AssignProps(Component, Input.TextArea)
export default Component