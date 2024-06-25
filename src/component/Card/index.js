import React from 'react';
import { Card } from '@alifd/next'
import { getChildDisplayName, getChildren, AssignProps } from 'assets/js/proxy-utils'
import { isTrue } from 'assets/js'
import { Grid, ToggleCard } from '@/component'
function Component (props) {
  const {
    direction, children, contentHeight, size, style,
    definedStyle, showTitleBullet, hasBorder,
    subTitle, title, extra, isToggle, isGroup, showCollapse, toggleExtra,
    ...attrs
  } = props
  // 获取children
  const getChild = (cds) => getChildren(cds).map((child, index) => {
    if (Array.isArray(child)) {
      return getChild(child)
    }
    const childName = getChildDisplayName(child)
    const prop = {...child.props}
    if (childName === 'Row') {
      const rowChild = getChildren(prop.children)
      // 若子组件 全是 Col 布局，则添加 默认 gutter属性
      if (
        !rowChild.some(rc => getChildDisplayName(rc) !== 'Col')
      ) {
        !isTrue(prop.gutter) && (prop.gutter = '12')
      }
      return <div style={{padding: "0 16px"}} key={index}>
        <Grid.Row {...prop}>
          {rowChild}
        </Grid.Row>
      </div>
    }
    return child
  })
  // 获取title配置项目
  const defaultTitleConfig = {
    showHeadDivider: isToggle ? hasBorder != true : hasBorder,
    hasBorder: isToggle ? hasBorder != true : hasBorder,
  }
  if (!isToggle) {
    Object.assign(defaultTitleConfig, {
      subTitle, title, extra,
    })
  }

  const CardBox = <Card
  style={{overflow: 'visible', ...(definedStyle || {})}}
  {...attrs}
  {...defaultTitleConfig}
  free
>
  {getChild(children)}
  {toggleExtra}
</Card>

  return isToggle ? <ToggleCard
    title={title}
    titleExtra={subTitle}
    btnExtra={extra}
    isGroup={isGroup}
    showCollapse={showCollapse}
  >
    {CardBox}
  </ToggleCard> : CardBox;

}
AssignProps(Component, Card)
export default Component