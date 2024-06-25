import React from 'react';
import { Grid } from '@alifd/next'
import { AssignProps } from 'assets/js/proxy-utils'
function Col (props) {
  const {defaultShow, required, show, ...attrs} = props
  return <Grid.Col
    {...attrs}
  ></Grid.Col>
}
AssignProps(Col, Grid.Col)
export default Col