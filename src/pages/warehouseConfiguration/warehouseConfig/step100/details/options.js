import { pickingModelOptions } from '@/report/options'

// 枚举值初始化
export let strategyNameList = [
  { "label": "手动分配", "value": "1", desc: 'PDA边检边分下架的手动分配，仓管待分配任务那里分配（Tmall嘉诚仓香港）' },
  // {"label": "自动分配", "value": "2", desc: '自动汇波，扫库区拉波次，PDA的先捡后分下架'},
  // {"label": "尾单直拣", "value": "3", desc: '尾包扫描生成下架波次'},
  // {"label": "手动波次", "value": "4", desc: '仓管系统的手动汇波功能，手动分配PDA先捡后分下架'},
  { "label": "自动汇波", "value": "2", desc: '自动汇波，扫库区拉波次，PDA的先捡后分下架' },
  { "label": "尾包直拣", "value": "3", desc: '尾包扫描生成下架波次' },
  { "label": "手动汇波", "value": "4", desc: '仓管系统的手动汇波功能，手动分配PDA先捡后分下架' },
];

// 波次类型
export let waveTypeList = [
  { "label": "混合波次", "value": "1" },
  { "label": "单票波次", "value": "2" },
  { "label": "多票波次", "value": "3" },
  { "label": "退货波次", "value": "4" },
  { "label": "调拨波次", "value": "6" },
  { "label": "尾包波次", "value": "9" }
];

// 拣货模式
export let pickingModeList = pickingModelOptions;

// 判断是不是 边拣边分 和 闪电播
export function isFOrB(mode) {
  return ['3', '7'].some(v => v == mode)
}
export let waveHuiDanList = [
  { "label": "订单个数(个)", "value": "1" },
  // {"label": "时间(分钟)", "value": "2"}
];

export let waveCreationPriorityList = [
  { label: '时效优先', value: '0' },
  { label: '路径优先', value: '1' }
];
export let waveHuiDanScopeList = [
  { "label": "库区组", "value": "1" },
  { "label": "库区", "value": "2" },
  { "label": "汇波组", "value": "3" }
];

export let missionSplitScopeList = [
  { label: "全仓", value: '0' },
  { "label": "库区组", "value": "1" },
  { "label": "库区", "value": "2" },
  { "label": "巷道", "value": "3" }
];

export let waveCreationTimeConfigScopeTypeList = [
  { "label": "全部", "value": "0" },
  // {"label": "库区组", "value": "1"},
  { "label": "库区", "value": "2" }];

export const YN = [
  { "label": "是", "value": "1" },
  { "label": "否", "value": "2" },
]

export const YN1 = [
  { "label": "是", "value": "1" },
  { "label": "否", "value": "0" },
]

export const YN2 = [
  { "label": "是", "value": true },
  { "label": "否", "value": false },
]

export let enableOrDisableOptions = [
  { label: '启用', value: '0' },
  { label: '禁用', value: '1' }
]

export const NF = [
  { label: '开启', value: true },
  { label: '关闭', value: false },
]

// 汇波订单类型
export const orderTypeList = [
  { label: 'outside', value: 'outside' },
  { label: 'mix', value: 'mix' },
  { label: 'taobao', value: 'taobao' },
]