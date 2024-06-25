import React, { useEffect, useState } from 'react';
import { toUpper } from 'assets/js';
import Bus from 'assets/js/bus';
export const paginationContainerConfig = {
  hasMounted: false,
  mountId: '_xxxx_pcs-pagination-specify-container_xxxx_'
}

// 生成Id
export function getId(id) {
  return paginationContainerConfig.mountId + toUpper(id)
}

// 获取分页组件
export function getPaginationComponent(id) {
  return paginationContainerConfig[getId(id)]
}


// 获取挂载容器
export function getPaginationContainer(id) {
  return document.getElementById(getId(id))
}

// 创建挂载容器
export function createPaginationMountContainer(id) {
  return function PaginationComponent(props) {
    const [pComponent, setPComponent] = useState(props.children);
    useEffect(() => {
      paginationContainerConfig.hasMounted = true
      const unBus = Bus.$on(paginationContainerConfig.mountId, (pc) => {
        setPComponent(pc)
      })
      return () => {
        Object.assign(paginationContainerConfig, {
          hasMounted: false,
          [getId(id)]: null
        })
        unBus();
      }
    }, [])
    useEffect(() => {
      setPComponent(props.children)
    }, [props.children])
    return <div style={{display: 'inline-block', margin: '0 10px'}} id={getId(id)}>
      {pComponent}
    </div>
  }
}

// 更新挂载组件
export function updatePaginationComponent(component, id) {
  const componentId = getId(id)
  paginationContainerConfig[componentId] = component
  Bus.$emit(paginationContainerConfig.mountId, component)
  return null
}