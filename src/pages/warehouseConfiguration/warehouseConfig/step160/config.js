import React from 'react';
import { ASelect, Button, Message, AFormTable, NumberPicker, Input  } from '@/component';
import $http from 'assets/js/ajax'
import { transMultipleToStr, isJSON, _getName } from 'assets/js'
import API from 'assets/api'
import { getStepBaseData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import { getRangTime, getTimeToRange, getReceiver, getReceiverToStr } from '@/report/utils'
const isEditable = () => getStepBaseData().readOnly
const isTMall = () => getStepBaseData().isTMall

// 获取包材列表数据
export function getListData(data) {
  return $http({
    url: API.getPackageMergeVolumeConfigList,
    method: 'post',
    data: {
      pageNum: 1,
      pageSize: 1000,
      ...data,
    }
  }).then(res => {
    const list = res && res.data || []
    return list.map(l => {
      return {
        ...l,
        receiver: getReceiverToStr(l.receiver)
      }
    })
  }).catch(e => {
    Message.error(e.message);
    return []
  })
}

// 保存虚仓
export async function getSavePackageInfo(data) {
  await $http({
    url: '/sys/packageMergeVolumeConfig/batchCreate',
    method: 'post',
    data
  })
}

// 新增修改
export const formModel = {
  list: {
    component: AFormTable,
    span: 24,
    attrs: {
      hasAdd: true,
      maxLength: 100,
      columns: {
        volumeCode: {
          title: '包材编码',
          required: true,
          edit: true
        },
        volumeDescribe: {
          title: '包材描述',
          edit: true
        },
        volumeWeight: {
          title: '包材重量（g）',
          component: NumberPicker,
          attrs: {
            precision: 2,
            min: 0,
            max: 99999.99
          },
          edit: true
        },
        lengthOfVolume: {
          title: '包材长(cm)',
          component: NumberPicker,
          attrs: {
            precision: 2,
            min: 0,
            max: 99999.99
          },
          edit: true
        },
        widthOfVolume: {
          title: '包材宽(cm)',
          component: NumberPicker,
          attrs: {
            precision: 2,
            min: 0,
            max: 99999.99
          },
          edit: true
        },
        heightOfVolume: {
          title: '包材高(cm)',
          component: NumberPicker,
          attrs: {
            precision: 2,
            min: 0,
            max: 99999.99
          },
          edit: true
        }
      }
    }
  }

}
