import React, { useEffect, useState, useRef } from 'react';
import { Tab, Button, Message } from '@/component'
import InStore from './instore'
import OnShelves from './onShelves'
App.title = '安检包裹'
export default function App(props) {
    return <div>
    <Tab>
        <Tab.Item title='入库包裹' key="inStore">
            <InStore></InStore>
        </Tab.Item>
        <Tab.Item title="在架包裹" key="onShelves">
            <OnShelves></OnShelves>
        </Tab.Item>
    </Tab>
    </div>
}