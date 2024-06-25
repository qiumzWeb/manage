import React from 'react';
import { Loading } from '@alifd/next'
import { AssignProps } from 'assets/js/proxy-utils'
const Component =  React.forwardRef(function (props, ref) {
  const {fullScreen, tagInline, ...attrs} = props
  return <Loading
    ref={ref}
    {...attrs}
    fullScreen={!!fullScreen}
  ></Loading>
})
AssignProps(Component, Loading)
export default Component