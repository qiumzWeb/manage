import React, {useState, useEffect} from 'react';
import { Grid } from '@alifd/next'
import { AssignProps, getChildren } from 'assets/js/proxy-utils'
import { Form, Button } from '@/component'
import Col from './col'
function Row (props) {
  const {type, moreSearch, ...attrs} = props
  // const childrenAll = getChildren(children)
  // const defaultChildren = childrenAll.filter(c => c.props.defaultShow)
  // const [visible, setVisible] = useState(false)
  // const [clientChildren, setClientChildren] = useState([])
  // const moreSearchBtn = <Col>
  //   <Form.Item>
  //     <Button
  //       style={{ marginTop: '5px' }}
  //       text
  //       type="primary"
  //       onClick={() => {
  //         setVisible(!visible);
  //       }}
  //     >
  //       高级搜索
  //       <Icon type={visible ? 'arrow-down' : 'arrow-right'} />
  //     </Button>
  //   </Form.Item>
  // </Col>
  return <Grid.Row
    {...attrs}
    wrap
  ></Grid.Row>
}
AssignProps(Row, Grid.Row)
export default Row
