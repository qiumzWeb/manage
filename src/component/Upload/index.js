import React from 'react';
import { Upload } from '@alifd/next'
import Dragger from './Dragger'
import { AssignProps } from 'assets/js/proxy-utils'
const Component =  React.forwardRef(function (props, ref) {
  const {children, ...attrs} = props
  return <Upload
    ref={ref}
    {...attrs}
  >{children}</Upload>
})
AssignProps(Component, Upload, (key, to) => {
  if (key === 'Dragger') {
    to[key] = Dragger
  }
})
export default Component