import React from 'react';
import queryString from 'querystring';
import ajax from 'assets/js/ajax'
import {
    Button,
    Dialog
} from '@alifd/next';

const CommonUtil = {
    getUrlParams: function () {
        const searchParams = location.search.replace(/^\?/, '');
        const urlParams = queryString.parse(searchParams);
        return urlParams;
    },
    alert: function (msg, title,callback) {
        const dialog = Dialog.alert({
            content: msg,
            title: title || "提示信息",
            language: 'en-us',
            footer: <Button type="primary" onClick={ () => { if(callback){ callback() } dialog.hide(); }} >确定</Button>
        });
    },
    ajax
}
export default CommonUtil;