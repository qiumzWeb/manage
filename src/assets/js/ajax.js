import axios from 'axios'
import { asyncAntiShake, isType, Cookie, Bus } from './utils'
import { logout, getObjType, widList, isTrue, filterNotEmptyData } from 'assets/js'
import { getAjaxUrl } from './proxy-utils'
import Api from 'assets/api'
import qs from 'querystring'
import { Message } from '@/component'
const service = axios.create({
    timeout: 300000,
    transformRequest: [function(data, headers, ...args) {
        if (getObjType(data) === 'FormData') {
            return data
        }
        if (headers['Content-Type'].includes('form')) {
            return qs.stringify(data)
        }
        return JSON.stringify(data)
    }]
})
// 添加请求拦截器
const getMsg = (msg) => getObjType(msg) === 'Object' && msg.message || msg
service.interceptors.request.use(function (config) {  
    return config;
  }, function (error) {
      Message.error(error.message)
    return Promise.reject(error);
  });

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    if(typeof response.data === 'object') {
        response.data.responseDate = response.headers.date
    }
    return response.data;
  }, function (error) {
    /**
     * 免登录接口白名单
     */
    const noDoUrl = [
      '/pcsweb/getMenus',
      '/pcsservice/getMenus',
      '/pcsapiweb/web/monitor/collect'
    ]
    const errorCode = [error.message, error.code]
    if (errorCode.includes("Network Error") && !noDoUrl.some(url => error.config.url.includes(url))) {
      if (error.config.url.includes('/pcslogin')) {
        return logout('cainaio')
      }
      return logout()
    }
    if (noDoUrl.some(url => error.config.url.includes(url))) {
        return null
    } else {
        return Promise.reject(error);
    }
  });

// 响应JSON 数据处理
function _dataHandle(rsp, resolve, reject, extCode, options) {
    if (isType(extCode) === 'Object' && !options) {
        options = extCode
        extCode = null
    }
    if (options.oldApi) {
        rsp = {
            data: rsp,
            success: true,
            errorCode: null
        }
    }
    if (rsp && rsp.responseDate && typeof options.getResponseDate === 'function') {
        options.getResponseDate(rsp.responseDate)
    }
    const suc = rsp.success;
    const data =  rsp.data;
    if (Array.isArray(extCode) && extCode.length) {
        extCode.forEach(key => {
            data[key] = rsp[key]
        })
    }
    const resMsg = rsp.displayMsg || rsp.errorMsg || rsp.errMsg || getMsg(rsp.message)
    if (suc) {
        if (options.url === Api.getWarehouseNameList) { // 缓存仓库列表
            if (data && Array.isArray(data.data) && data.data.length) {
                data.data = data.data.map(d => ({
                    label: d.warehouseName,
                    value: d.warehouseId,
                    ...d
                }))
                data.data.sort((a, b) => a.label.localeCompare(b.label))
                Bus.setState({ [widList]: data })
            }
        }
        if (options.returnRes) {
          const message = resMsg || '';
          rsp.message = message
          rsp.errMsg = message
          resolve(rsp)
        } else {
          resolve(data);
        }
    } else {
        const errorCode = rsp.errorCode;
        const message = resMsg || '内部错误';
        if (errorCode == 'noLogin') logout() // 重新登录
        rsp.message = message
        // Message.error(message)
        reject(rsp)
    }
}

function _optionsHandle(options) {
    const {data, type, extCode, dataType, filterEmptyParams, ...args} = options
    if (type && !args.method) {
        args.method = type
    }
    args.method = (args.method || 'get').toLocaleLowerCase()
    let filterData = data
    if (getObjType(data) == 'Object' && filterEmptyParams) {
      filterData = filterNotEmptyData(data)
    }
    const qs = (obj) => {
        if (typeof obj !== 'object' || !isTrue(obj)) return obj
        const newObj = {}
        Object.entries(obj).forEach(([key,val]) => {
            newObj[key] = typeof val === 'object' && String(val) || val
        })
        return newObj
    }
    const reqData = args.method.toLocaleLowerCase() === 'get' ? { 
        params: qs(filterData)
    } : {data: filterData}
    args.url = getAjaxUrl(args.url)
    return {
        headers: dataType === 'form' ? {
          "Content-Type":"application/x-www-form-urlencoded;charset=utf-8"
        } : {
          "Content-Type": 'application/json; charset=utf-8'
        },
        ...args,
        ...reqData
    }
}

function $ajax(options) {
    // 读取仓库缓存
    const warehouseList = Bus.getState(widList)
    if (options.url === Api.getWarehouseNameList && warehouseList) {
        return Promise.resolve(warehouseList)
    }
    // 发出接口请求
    const {extCode} = options
    const requestData = _optionsHandle({...options})
    return new Promise((resolve, reject) => {
        service(requestData).then(rsp => {
            if (isType(rsp) === 'Object') {
                _dataHandle(rsp, resolve, reject, options)
            } else if (isType(rsp) === 'Blob') {
                const response = new Response(rsp)
                response.json().then(res => {
                    if (isType(res) === 'Object') {
                        _dataHandle(res, resolve, reject, extCode, options)
                    } else {
                        resolve(rsp)
                    }
                }).catch(error => {
                    resolve(rsp)
                })
            } else {
                resolve(rsp)
            }
        }).catch(error => {
            const  message = getMsg(error.message) || error.errMsg || '服务器异常，请稍后再试'
            // Message.error(message)
            reject({
                ...error,
                message
            });
        })
    })
}
const $http = asyncAntiShake($ajax, {formatData: _optionsHandle})

export default $http
