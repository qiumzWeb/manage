import React, { useState, useEffect, useRef, useImperativeHandle } from 'react'
import { FormGroup } from '@/component'
import { groupConfig } from './config'
import { getStepBaseData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
export default React.forwardRef(function App(props, ref) {
  const { data, visible } = props
  return <div>
    <FormGroup
      hasBorder={false}
      loading={!visible}
      ref={ref}
      isDetail={() => getStepBaseData().readOnly }
      data={data}
      group={groupConfig}
    ></FormGroup>
  </div>
})