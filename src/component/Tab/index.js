import React, {useEffect, useRef, useState} from 'react';
import { Tab } from '@alifd/next'
import Item from './Item'
import { Icon, Button, ATipsCard } from '@/component';
import { AssignProps, getChildren } from 'assets/js/proxy-utils';
import { getUuid } from 'assets/js';
function ATab (props) {
  const {type, extra, activeKey, onChange, defaultActived, ...attrs} = props;
  const [moreListVisible, setMoreListVisible] = useState(false)
  const currentClassRef = useRef(getUuid());
  const currentClassName = '_tab_' + currentClassRef.current + '_';
  const extraRef = useRef();
  const [active, setActive] = useState(activeKey);
  const TabItemsRef = useRef();
  const timerRef = useRef();
  useEffect(() => {
    TabItemsRef.current = getChildren(props.children).map(c => ({...c.props, key: c.key}));
    // 激活的key 不存在时， 默认激活第一个tab
    if (TabItemsRef.current.every(t => t.key !== active)) {
      const firstItem = Array.isArray(TabItemsRef.current) && TabItemsRef.current[0] || {}
      const lastItem = Array.isArray(TabItemsRef.current) && TabItemsRef.current.slice(-1) && TabItemsRef.current.slice(-1)[0] || {}
      let initKey = defaultActived == 'last' ? lastItem.key : firstItem.key;
      initKey && TabOnChange(initKey)
    }
    setExtraBoxPositon();
  }, [props.children])
  useEffect(() => {
    setActive(activeKey)
  }, [activeKey])

  // 设置超出扩展内容
  function setExtraBoxPositon(count = 0) {
    // 对横向摆放的tab 生效
    clearTimeout(timerRef.current);
    if (!['left', 'right'].includes(props.tabPosition)) {
      timerRef.current = setTimeout(() => {
        const tabBox = document.body.querySelector('.' + currentClassName);
        const tabScrollBox = tabBox && tabBox.querySelector('.next-tabs-nav-scroll');
        const extraBox = extraRef.current;
        const extraBoxWidth = extraBox.getBoundingClientRect().width;
        if (tabScrollBox) {
          const exTraSiblingElement = extraBox.parentElement.nextElementSibling || extraBox.parentElement.previousElementSibling;
          exTraSiblingElement.style.width = `calc(100% - ${extraBoxWidth}px)`
          const scrollWidth = tabScrollBox.scrollWidth;
          const clientWidth = tabScrollBox.clientWidth;
          setMoreListVisible(scrollWidth > clientWidth)
        }
        // dom 渲染可能 会延迟，渲染期间， 自动 检查三次
        if (count < 3) {
          setExtraBoxPositon(count + 1)
        }
      }, 500)
    }
  }

  // 选项卡变动
  function TabOnChange(key, ...args) {
    typeof onChange === 'function' && onChange(key, ...args);
    setActive(key)
  }
  return <div>
    <Tab
      {...attrs}
      animation={false}
      activeKey={active}
      onChange={TabOnChange}
      shape={type || "pure"}
      size="small"
      navClassName={`g-pcs-tab ${currentClassName}`}
      extra={<div ref={extraRef}>
        {moreListVisible && <ATipsCard
          PopUpPisition={{top: 10}}
          trigger={<Icon type="list" mr="10" s="l" style={{cursor: 'pointer', color: '#999'}}></Icon>}>
          <div className="pcs-tab-more-box">
            {Array.isArray(TabItemsRef.current) && TabItemsRef.current.map((item, index) => {
              return <span
                className={
                  active === item.key ? 'main-color box-cell-item light-hover': 'light-hover box-cell-item'
                }
                onClick={() => {
                  TabOnChange(item.key);
                  document.body.click();
                }}>{item.title}</span>
            })}
          </div>
        </ATipsCard> || null}
        {extra}
      </div>}
    ></Tab>
  </div>
}
AssignProps(ATab, Tab, (key, to) => {
  if (key === 'Item') (to[key] = Item)
})
export default ATab