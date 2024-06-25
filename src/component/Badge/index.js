import React from 'react';
import { Badge } from '@alifd/next'
import { AssignProps, getMarginStyle } from 'assets/js/proxy-utils'
const Component =  React.forwardRef(function (props, ref) {
  const {mt, mr, mb, ml, ...attrs} = props
  return <span style={getMarginStyle({mt, mr, mb, ml, style:{ cursor: 'pointer'}})}>
    <Badge
      ref={ref}
      {...attrs}
    ></Badge>
  </span>
})
AssignProps(Component, Badge)
export default Component