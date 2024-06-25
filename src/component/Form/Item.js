import React, {useState} from 'react';
import { Form } from '@alifd/next'
import { getChildDisplayName, AssignProps, getChildren } from 'assets/js/proxy-utils'
import {getUuid} from 'assets/js'
function FormItem (props) {
  const {labelCol, wrapperCol, labelAlign, children, labelLeft, ...attrs} = props
  const childName = getChildDisplayName(children)
  const [uuid, setUuid] = useState(getUuid())
  let align = {}
  if (Array.isArray(labelLeft)) {
    align = {
      labelAlign: 'left',
      wrapperCol: {
        span: labelLeft[1] || (23 - labelLeft[0])
      },
      labelCol: {
        span: labelLeft[0]
      }
    }
  }
  if (attrs.label) {attrs.label = <span onClick={(e) => {
    const parentNode = e.target.parentNode
    const forValue = parentNode.attributes.for && parentNode.attributes.for.value
    const inputNode = document.getElementsByClassName(uuid)[0].getElementsByTagName('input')[0]
    if (forValue && inputNode) {
      parentNode.setAttribute('for', uuid)
      inputNode.id = uuid
    }
  }}>{attrs.label}</span>}
  return <Form.Item
    className={uuid}
    style={{width: '100%'}}
    {...attrs}
    {...align}
  >
    {
      childName === 'Button'
      ? <span
        style={{marginTop: '32px', display: 'inline-block'}}
        >{children}</span>
      : children
    }
  </Form.Item>
}
AssignProps(FormItem, Form.Item)
export default FormItem