import React, { useState, useEffect, useRef, useMemo } from 'react';
import { isEmpty, getUuid, getResult } from 'assets/js';
import { getChildren } from 'assets/js/proxy-utils'
import { Step, Message } from '@/component';
import { useHistory, useLocation } from 'react-router-dom'
require('./index.scss');
export default function ProcessSteps(props) {
  const { children, ...attrs } = props;
  const [stepChild, setStepChild] = useState(null);
  const uuid = useMemo(() => getUuid('step_'), []);
  const [currentStep, setCurrentStep] = useState(0)
  const location = useLocation();
  const stepPaths = useRef([])
  const StepItem = useMemo(() => getStepMenu(), [children, location.pathname])
  // 监听步骤变动自动定位
  useEffect(() => {
    const currentStepIndex = stepPaths.current.findIndex(s => s.includes(location.pathname));
    setCurrentStep(currentStepIndex > -1 ? currentStepIndex : 0)
    setStepChild(StepItem.child[currentStep])
  }, [location.pathname])
  
  // 点击步骤回调
  async function onClickStep(...args) {
    const [{paths, children, onClick, beforeEnter}, index] = args;
    const result = await getResult(beforeEnter, ...args);
    if (result === false) return;
    if (typeof result === 'string') {
      return Message.warning(result)
    }
    setCurrentStep(index);
    children && setStepChild(children);
    if (Array.isArray(paths) && paths[0]) {
      window.Router.push(paths[0])
    } else if (typeof onClick === 'function') {
      onClick(...args)
    }
  }

  // 获取 步骤菜单 
  function getStepMenu() {
    const child = []
    stepPaths.current = []
    const Item =  getChildren(children).map((c, index) => {
      if (!c || (c && !c.props)) return null;
        const { name, paths, beforeEnter, disabled, ...itemAttrs } = c.props;
        const key = uuid + index;
        child.push(c.props.children)
        if(Array.isArray(paths)) {
          stepPaths.current.push(paths);
          if (paths.includes(location.pathname)) {
            setCurrentStep(index);
          }
        }
        return <Step.Item
          {...itemAttrs}
          disabled={typeof disabled === 'function' ? disabled({key, index, ...c.props}) : disabled}
          title={name}
          key={key}
          onClick={(...args) => {
            onClickStep({
              ...itemAttrs,
              name,
              paths,
              beforeEnter,
              key
            }, ...args)
          }}
        >
        </Step.Item>
    })
    Item.child = child
    return Item;
  }
  return <div className="pcs-process-steps">
    <Step {...attrs} current={currentStep}>{StepItem}</Step>
    <div className='pcs-process-step-child'>
      {stepChild || StepItem.child[currentStep]}
    </div>
  </div>
}

