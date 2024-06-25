import React from 'react'
import ASelect from '@/component/ASelect'
import { kpiEndOperationOptions, flowPickBigbagStatusOptions } from '@/report/options'
import { getASelectOptions } from '@/views/servicepages/config'
import { isEmpty } from 'assets/js'


// 闪电播订单状态
export const flowPickerOrderOptions = [
  {label: '逆向入库', value: '-5'},
  {label: '逆向签收', value: '-4'},
  {label: '已关闭', value: '-3'},
  {label: '已退件', value: '-2'},
  {label: '已申请退件', value: '-1'},
  {label: '待下架', value: '0'},
  {label: '下架中', value: '1'},
  {label: '已下架', value: '2'},
  {label: '已打单', value: '3'},
  {label: '已码板', value: '4'},
  {label: '已出库', value: '5'},
  {label: '分拨中', value: '6'},
  {label: '已分拨', value: '7'},
  {label: '已称重校验', value: '8'},
  {label: '交接完成', value: '10'},
  {label: '终止履行', value: '11'},
]



// 列表
export const tColumns = {
  warehouseShort: {
    title: '仓库名称',
    lock: 'left'
  },
  referLogisticsOrderCode: {
    title: '二段LP号',
    width: 200,
  },
  delegateNo: {
    title: '二段订单号',
    width: 200
  },
  examineNode: {
    title: 'KPI考核节点',
    cell: val => <ASelect value={val} getOptions={async() => kpiEndOperationOptions} isDetail defaultValue={'-'}></ASelect>
  },
  kpiExamineRule: {
    title: 'KPI考核规则',
  },
  orderCarriageCreate: {
    title: '订单生成时间',
    width: 200
  },
  endKpiExaminationDate: {
    title: 'KPI考核时间',
    width: 200
  },
  carrierType: {
    title: '订单业务类型',
  },
  status: {
    title: '订单状态',
    cell: (val, index, data) => {
      if (data.pickingMode != '7') {
        return <ASelect value={val} getOptions={getASelectOptions('orderCarriageStatus')} isDetail defaultValue="待生成"></ASelect>
      } else {
        return <ASelect value={val} getOptions={async() => flowPickerOrderOptions} isDetail defaultValue="待生成"></ASelect>
      }
    }
  },
  containerCode: {
    title: '下架容器号',
    show: isNotFlowPick,
  },
  waveCode: {
    title: '波次号'
  },
  inReBatchTime: {
    title: '集包时长'
  },
  districtGroupName: {
    title: '库区组',
  },
  districtName: {
    title: '库区',
  },
  totalWeight: {
    title: '订单实重',
  },
  wallCode: {
    title: '播种墙号',
    show: isNotFlowPick,
  },
  wallOperator: {
    title: '播种操作员',
    show: isNotFlowPick,
  },
  bagCode: {
    title: '大包号',
    show: isNotFlowPick,
  },
  deliveryCode: {
    title: '一段包裹号',
    width: 200,
    listKey: "packageList",
    show: isNotFlowPick,
  },
  packageLp: {
    title: '一段LP号',
    width: 200,
    renderKey: 'referLogisticsOrderCode',
    listKey: 'packageList',
    show: isNotFlowPick,
  },
  storeCode: {
    title: '库位号',
    width: 200,
    listKey: 'packageList',
    show: isNotFlowPick,
  },
  packageStatus: {
    title: '包裹状态',
    listKey: 'packageList',
    show: isNotFlowPick,
    cell: (val) => <ASelect isDetail value={val} getOptions={getASelectOptions('packageStatus')} defaultValue='-'></ASelect>
  },
  packageModified: {
    title: '包裹下架时间',
    width: 230,
    listKey: 'packageList',
    show: isNotFlowPick,
  },
  /**
   * 闪电播字段
   */
  flowPickContainerCode: {
    title: '容器号',
    width: 200,
    show: isFlowPick,
    renderKey: 'containerCode',
    listKey: ['bigbagList', 'pkgList'],
    renderLevel: 0,
  },
  flowPickBigbagStatus: {
    title: '大包状态',
    width: 200,
    show: isFlowPick,
    listKey: ['bigbagList', 'pkgList'],
    renderLevel: 0,
    cell: (val) => {
      return <ASelect isDetail value={val} getOptions={async() => flowPickBigbagStatusOptions} defaultValue='-'></ASelect>
    }
  },
  flowPickBigNodeTime: {
    title: '大包节点时间',
    width: 200,
    show: isFlowPick,
    listKey: ['bigbagList', 'pkgList'],
    renderLevel: 0,
    cell: (val, index, record, data) => {
      // flowPickBigbagNode:  大包节点；1：闪电播库位推荐；2：ReBatch区格口摆出；3：闪电播集包入区；4：闪电播集包移区；5：闪电播下架；6：闪电播关包换袋
      const flowPickBigbagNode = data.flowPickBigbagNode
      const config = {
        1: 'scanRecommendTime',
        2: 'beltOutTime',
        3: 'flowpickInstockTime',
        4: 'flowpickInstockTime',
        6: 'flowPickBigbagFinishedTime'
      }
      return config[flowPickBigbagNode] ? data[config[flowPickBigbagNode]] : '-'
    }
  },
  reBatchDistrict: {
    title: '集包库区',
    width: 200,
    show: isFlowPick,
    listKey: ['bigbagList', 'pkgList'],
    renderLevel: 0,
  },
  allotSortingWall: {
    title: '播种墙号',
    width: 200,
    listKey: ['bigbagList', 'pkgList'],
    renderLevel: 1,
    show: isFlowPick,
  },
  allotOperator: {
    title: '播种操作员',
    listKey: ['bigbagList', 'pkgList'],
    renderLevel: 1,
    show: isFlowPick,
    width: 200,
  },
  flowPickDeliveryCode: {
    title: '一段包裹号',
    width: 200,
    renderKey: 'deliveryCode',
    listKey: ['bigbagList', 'pkgList'],
    renderLevel: 1,
    show: isFlowPick,
  },
  flowPickPackageLp: {
    title: '一段LP号',
    width: 200,
    renderKey: 'referLogisticsOrderCode',
    listKey: ['bigbagList', 'pkgList'],
    renderLevel: 1,
    show: isFlowPick,
  },
  flowPickStoreCode: {
    title: '库位号',
    width: 200,
    renderKey: 'storeCode',
    listKey: ['bigbagList', 'pkgList'],
    renderLevel: 1,
    show: isFlowPick,
  },
  flowPickPackageStatus: {
    title: '包裹状态',
    renderKey: 'packageStatus',
    listKey: ['bigbagList', 'pkgList'],
    renderLevel: 1,
    show: isFlowPick,
    cell: (val) => <ASelect isDetail value={val} getOptions={getASelectOptions('packageStatus')} defaultValue='-'></ASelect>
  },
  flowPickPackageModified: {
    title: '包裹下架时间',
    width: 230,
    renderKey: 'offShelvesTime',
    listKey: ['bigbagList', 'pkgList'],
    renderLevel: 1,
    show: isFlowPick,
  },
}


// 判断闪电播
function isFlowPick(vm) {
  const { pickingMode } = vm.field.getValues();
  return pickingMode == '7'
}


// 判断非闪电播
function isNotFlowPick(vm) {
  return !isFlowPick(vm)
}