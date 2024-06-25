import React from 'react';
import { Upload } from '@alifd/next'
import { Icon } from '@/component'
import { AssignProps } from 'assets/js/proxy-utils'
const Component =  React.forwardRef(function (props, ref) {
  const {children, ...attrs} = props
  return <Upload.Dragger
    ref={ref}
    {...attrs}
  >
    <div className='next-upload-drag' style={{padding: 20}}>
      <p className='next-upload-drag-icon'><Icon type="upload" size="large"></Icon></p>
      <p className='next-upload-drag-text'>点击或拖动文件到虚框内上传</p>
      <p className='next-upload-drag-hint'>{children || '支持xls、xlsx格式'}</p>
    </div>
  </Upload.Dragger>
})
AssignProps(Component, Upload.Dragger)
export default Component