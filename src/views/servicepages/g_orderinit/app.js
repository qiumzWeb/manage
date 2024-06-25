import React, { useEffect, useState } from 'react';
import { Tab } from '@/component'
import Assigned from './component/g_allocated'
import Finished from './component/g_orderfinished'
import UnAssign from './component/g_orderinit'
export default function App(props) {
    return <Tab>
        <Tab.Item title='未分配任务' key="unassign">
          <UnAssign></UnAssign>
        </Tab.Item>
        <Tab.Item title="已分配任务" key="assigned">
          <Assigned></Assigned>
        </Tab.Item>
        <Tab.Item title="已完成任务" key="finished">
          <Finished></Finished>
        </Tab.Item>
    </Tab>
}