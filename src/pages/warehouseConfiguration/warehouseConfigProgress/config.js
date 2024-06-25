import React from 'react';
import { Button } from '@/component';
import { createBus } from 'assets/js/bus';
import $http from 'assets/js/ajax';
import { getWid, getObjType, getWName } from 'assets/js';
import { Message, Dialog } from '@/component';
export const isWarehouseConfigRoute = path => /^\/warehouseConfig\/.*/.test(path);
export const stepBus = createBus();
export const currentWarehouseInfo = 'currentWarehouseInfo';
window.stepBus = stepBus;

// 通过配置文件初始化默认值
/**
 * 
 * @param {Array, Object} configList 配置信息
 * @param {Object} defaultData 默认值
 */
export function InitDefaultData(configList, defaultData) {
  if (getObjType(configList) === 'Object') {
    configList = [configList]
  }
  if (Array.isArray(configList)) {
    configList.forEach(config => {
      if (getObjType(config) === 'Object') {
        Object.keys(config).forEach(k => defaultData[k] = undefined)
      }
      if (Array.isArray(config)) {
        InitDefaultData(config, defaultData)
      }
    })
  }
}

// 通过仓Id获取开仓配置信息
export async function getOpenWarehouseInfo() {
  return $http({
    url: '/sys/openWarehouse/queryOpenWarehouseDetail',
    method: 'post',
    data: {warehouseId: getWid()}
  }).then(res => res).catch(e => ({}))
}
// 获取当前仓库创建信息
export function getStepBaseData() {
  return stepBus.getState(currentWarehouseInfo) || {
    warehouseId: getWid(),
    warehouseName: getWName(),
  }
};
// 设置当前仓库创建信息
export function setStepBaseData(data = {}, isAssign = true) {
  const oldData = isAssign ? getStepBaseData() : {}
  stepBus.setState({
    [currentWarehouseInfo]: {
      ...oldData,
      ...data
    }
  })
}
// 监听创建仓库信息变动
export function watchStepBaseData(listen) {
  if (typeof listen !== 'function') throw new Error('params mast be a function')
  return stepBus.watch(currentWarehouseInfo, listen)
}
// 保存节点
export function saveStepNode(id, isFinish = false) {
  const baseData = getStepBaseData();
  setStepBaseData({
    currentSaveNode: baseData.currentSaveNode < id ? id : baseData.currentSaveNode
  })
  if (isFinish) {
    return $http({
      url: '/sys/openWarehouse/submit',
      method: 'get',
      data: {
        openWarehouseCode: baseData.openWarehouseCode,
        saveNode: id,
      }
    })
  } else {
    return $http({
      url: '/sys/openWarehouse/skipOrNext',
      method: 'get',
      data: {
        openWarehouseCode: baseData.openWarehouseCode,
        saveNode: id,
      }
    })
  }
}
// 复用仓数据节点Code
export const copyWarehouseCode = {
  30: 'NEW_WAREHOUSE_DISTRICT',
  40: 'NEW_WAREHOUSE_LANEWAY',
  50: 'NEW_STORAGE_POSITIONS',
  55: 'NEW_STORAGE_POSITIONS_SETTING',
  60: 'NEW_DISTRICT_GROUP',
  70: 'SIGN',
  80: 'INSTOCK',
  90: 'SHELVES',
  100: 'OFFSHELVES_ALLOT',
  110: 'MERGE_PARCEL',
  120: 'EXCEPTION',
  140: 'SORTING_WALL',
  170: 'STORAGE_WARNING_CONFIG',
  180: 'BROADCAST_CONFIG',
  190: 'KPI_CONFIG',
  200: 'PACKAGE_DURATION'
}
// 复用仓数据
const CopyNodedataRequestBox = {}
export function getCopyWarehouseConfig(stepId, option) {
  // 默认参数
  let opt = {
    stepId: location.pathname.match(/\/warehouseConfig\/step(\d+)$/)[1],
    hasConfirm: false
  }
  // 获取参数
  if (getObjType(option) === 'Object') {
    Object.assign(opt, option)
    if (/\^d+$/.test(stepId)) {
      opt.stepId = stepId
    }
  } else if (getObjType(stepId) === 'Object') {
    Object.assign(opt, stepId)
  } else if (typeof stepId === 'boolean') {
    Object.assign(opt, {
      hasConfirm: stepId
    })
  }
// 判断是否需要复用
  const { baseWarehouseId, readOnly, warehouseName, warehouseId, currentSaveNode } = getStepBaseData()
  // 已完成开仓 或者 没有选择复用仓 或者 已保存 三种情况 不需要复用
  if (readOnly || !baseWarehouseId || +currentSaveNode > +opt.stepId) return Promise.resolve(false)
// ====开始复用====
  const baseWarehouseName = getWName(baseWarehouseId)
  const currentNode = copyWarehouseCode[opt.stepId]
  if (!CopyNodedataRequestBox[currentNode]) {
    CopyNodedataRequestBox[currentNode] = new Promise((resolve) => {
      function getCopyData (dialog) {
        return $http({
          url: '/sys/openWarehouse/copyNodeData',
          method: 'get',
          data: {
            warehouseId,
            baseWarehouseId,
            warehouseName,
            currentNode
          }
        }).then(_ => {
          Message.success('数据复用成功')
          resolve(true)
          dialog && dialog.hide()
        }).catch(e => {
          console.log(e, '报错信息----')
          // 库位配置数据量较大，需要异步处理，前端需要轮询查询进度
          const isNeedQueryStatus = ['50', '55'].some(s => s == opt.stepId);
          if (e && e.response && e.response.status && e.response.status == 504 && isNeedQueryStatus) {
            getQueryCopyStatus(currentNode, (success) => {
              if (success) {
                Message.success('数据复用成功')
                resolve(true)
              } else {
                Message.error(`数据复用失败：数据异常, 请联系IT人员处理`)
                resolve(false)
              }
              dialog && dialog.hide()
            })
          } else {
            Message.error(`数据复用失败：数据异常, 请联系IT人员处理`)
            resolve(false)
            dialog && dialog.hide()
          }
        })
      }
      if (opt.hasConfirm) {
        Dialog.confirm({
          title: '复用配置',
          content: <div>
            <p>是否复用<span className='font-bold'>【{baseWarehouseName}】</span>的数据到此页面？</p>
            <p className='warn-color'>（复用数据量较大，请耐心等待， 预计10分钟内完成复用，复用期间请勿关闭页面！）</p>
        </div>,
        onOk: async() => await getCopyData(),
        onClose: () => {resolve(false)},
        onCancel: () => {resolve(false)}
        })
      } else {
        const dialog = Dialog.notice({
          title: '复用配置',
          content: <div>
              <p>正在复用<span className='font-bold'>【{baseWarehouseName}】</span>的数据到此页面</p>
              <p className='warn-color'>（复用数据量较大，请耐心等待， 预计10分钟内完成复用，复用期间请勿关闭页面！）</p>
          </div>,
          closeable: false,
          footer: <Button loading={true} p>复用数据中...</Button>
        })
        getCopyData(dialog)
      }
    })
  }
  return CopyNodedataRequestBox[currentNode].finally(_ => {
    delete CopyNodedataRequestBox[currentNode]
  })
}

// 复用数据进度查询
export async function getQueryCopyStatus(currentNode, resolve, queryTimes = 1) {
  const { warehouseId } = getStepBaseData()
  function queryReTry() {
    const currentTimes = queryTimes + 1
    if (currentTimes > 60) {
      resolve(false)
    } else {
      setTimeout(() => {
        getQueryCopyStatus(currentNode, resolve, queryTimes + 1)
      }, 10000)
    }
  }
  return $http({
    url: '/sys/openWarehouse/copyStatusQuery',
    method: 'get',
    data: {
      warehouseId,
      currentNode
    }
  }).then(res => {
    if (res == '成功') {
      resolve(true)
    } else {
      queryReTry()
    }
  }).catch(e => {
    queryReTry()
  })
}


// 流程流转
export async function stepJump(id_msg='') {
  const [id, msg] = id_msg.split(';')
  const baseData = getStepBaseData()
  if (isNaN(baseData.currentSaveNode)) {
    return Message.warning('流程节点格式错误')
  }
  if (baseData.currentSaveNode - id > -1) {
    window.Router.push(`/warehouseConfig/step${id}`)
  } else {
    Message.warning(msg || '请先完成配置')
  }
}
export const stepConfig = {
  10: {
    title: '新增仓库',
    childrenStepType: 'arrow',
    children: [
      {title: '第一步：新增物理仓', detailTitle: '物理仓配置', path: '/warehouseConfig/step10'},
      {title: '第二步：新增虚仓', detailTitle: '虚仓配置', path: '/warehouseConfig/step20',
        disabled: ({steps}) => steps.currentSaveNode < 20
      }
    ]
  },
  20: {
    title: '场地配置',
    childrenStepType: 'arrow',
    disabled: ({steps}) => steps.currentSaveNode < 30,
    children: [
      {title: '第一步：新增库区', detailTitle: '库区配置', path: '/warehouseConfig/step30',
        disabled: ({steps}) => steps.currentSaveNode < 30
      },
      {title: '第二步：新增巷道货架', detailTitle: '巷道货架配置', path: '/warehouseConfig/step40',
        disabled: ({steps}) => steps.currentSaveNode < 40
      },
      {title: '第三步：新增库位', detailTitle: '库位管理', path: '/warehouseConfig/step50',
        disabled: ({steps}) => steps.currentSaveNode < 50
      },
      {title: '第四步：库位配置', detailTitle: '库位配置', path: '/warehouseConfig/step55',
      disabled: ({steps}) => steps.currentSaveNode < 55
      },
      {title: '第五步：新增库区组(选填)', detailTitle: '库区组配置', path: '/warehouseConfig/step60',
        disabled: ({steps}) => steps.currentSaveNode < 60
      }
    ]
  },
  30: {
    title: '实操规则配置',
    childrenStepType: 'arrow',
    disabled: ({steps}) => steps.currentSaveNode < 70,
    children: [
      {title: '第一步：签收配置', detailTitle: '签收配置', path: '/warehouseConfig/step70',
        disabled: ({steps}) => steps.currentSaveNode < 70
      },
      {title: '第二步：入库配置', detailTitle: '入库配置', path: '/warehouseConfig/step80',
        disabled: ({steps}) => steps.currentSaveNode < 80
      },
      {title: '第三步：上架配置', detailTitle: '上架配置', path: '/warehouseConfig/step90',
        disabled: ({steps}) => steps.currentSaveNode < 90
      },
      {title: '第四步：下架配置', detailTitle: '下架配置', path: '/warehouseConfig/step100',
        disabled: ({steps}) => steps.currentSaveNode < 100
      },
      {title: '第五步：合箱配置', detailTitle: '合箱配置', path: '/warehouseConfig/step110',
        disabled: ({steps}) => steps.currentSaveNode < 110
      },
      {title: '第六步：异常配置', detailTitle: '异常配置', path: '/warehouseConfig/step120',
        disabled: ({steps}) => steps.currentSaveNode < 120
      },
    ]
  },
  40: {
    title: '资源配置',
    childrenStepType: 'arrow',
    disabled: ({steps}) => steps.currentSaveNode < 130,
    children: [
      {title: '第一步：容器管理', detailTitle: '容器配置', path: '/warehouseConfig/step130',
        disabled: ({steps}) => steps.currentSaveNode < 130
      },
      {title: '第二步：分拨墙配置', detailTitle: '分拨墙配置', path: '/warehouseConfig/step140',
        disabled: ({steps}) => steps.currentSaveNode < 140
      },
      {title: '第三步：分拣计划配置(选填)', detailTitle: '分拣计划配置', path: '/warehouseConfig/step150',
        disabled: ({steps}) => steps.currentSaveNode < 150
      },
      {title: '第四步：包材配置（选填）', detailTitle: '包材配置', path: '/warehouseConfig/step160',
        disabled: ({steps}) => steps.currentSaveNode < 160
      }

    ]
  },
  50: {
    title: '运营监控配置（选填）',
    detailTitle: '运营监控配置',
    childrenStepType: 'arrow',
    disabled: ({steps}) => steps.currentSaveNode < 170,
    children: [
      {title: '第一步：异常预警配置（选填）', detailTitle: '异常预警配置', path: '/warehouseConfig/step170',
        disabled: ({steps}) => steps.currentSaveNode < 170
      },
      {title: '第二步：数据播报配置（选填）', detailTitle: '数据播报配置', path: '/warehouseConfig/step180',
        disabled: ({steps}) => steps.currentSaveNode < 180
      },
      {title: '第三步：KPI计算引擎配置（选填）', detailTitle: 'KPI计算引擎配置', path: '/warehouseConfig/step190',
        disabled: ({steps}) => steps.currentSaveNode < 190
      },
      {title: '第四步：包裹分段时长配置（选填）', detailTitle: '包裹分段时长配置', path: '/warehouseConfig/step200',
        disabled: ({steps}) => steps.currentSaveNode < 200
      }
    ]
  },
}