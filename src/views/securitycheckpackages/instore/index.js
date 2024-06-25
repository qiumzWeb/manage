import React, { useEffect, useState, useRef } from 'react';
import QueryList from '@/component/queryList'
import { inStoreSearch, inStoreColumns } from './config'
import { searchUrl } from '../config'
import { getRangTime } from '@/views/servicepages/config'
import ImagePreview from '@/component/ImagePreview'
export default function App(props) {
    // 格式化查询参数
    function getSearchParams(req, type) {
        const time = getRangTime(req.data, {
            time: 'createTime',
            start: 'startTime',
            end: 'endTime'
        })
        return {
            ...req,
            data: { ...req.data, type, ...time }
        }
    }
    // 渲染图片
    function renderImg(val, index, record) {
        return <ImagePreview urlList={val}></ImagePreview>
    }
    return <div>
        <QueryList
            toolSearch
            initSearch={false}
            columnWidth={150}
            searchModel={inStoreSearch}
            columns={inStoreColumns}
            // 格式化查询参数
            formatSearchParams={(req) => {
                return getSearchParams(req, '0')
            }}
            // 格式化接口数据
            formatData={(data) => {}}
            // 配置
            tableOptions={{
                url: searchUrl,
                method: 'post',
                defineFieldCode: 'securitycheckpackagesInstore'
            }}
        >
            <div slot="tableCell" prop="packageImgUrlList">
                {renderImg}
            </div>
            <div slot="tableCell" prop="itemImgUrlList">
                {renderImg}
            </div>
        </QueryList>
    </div>
}