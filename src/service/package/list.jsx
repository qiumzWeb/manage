import React from "react";
import {
  Table,DatePicker,Card, Message,Range, Radio,Loading,
  Form, Input, LocaleProvider, Select, Field, Button,
  Grid, Nav, Dialog, Pagination, FormCollapse, ASelect
} from '@/component';
import moment from 'moment';
import CommonUtil from 'commonPath/common.js';
import CUSTOMER_API from 'commonPath/api/customer-api';
import ExportExcel from '@/component/ExportFile'
import AForm from "@/component/AForm/index";
//import 'commonPath/common.scss';
// import "./list.scss";
import $http from 'assets/js/ajax'
import { downloadExcel, Cookie } from 'assets/js/utils'
import { orderPlatformOptions, bigPackageSource } from '@/report/options'
import { _getName } from 'assets/js'
const formItemLayout = {
    labelCol: {fixedSpan: 4},
    wrapperCol: {fixedSpan: 10}
};

const colItemLayout = {fixedSpan: 14}
const RadioGroup = Radio.Group;
const {Row, Col} = Grid;
const maxCount = 50000;
const FormItem = Form.Item;
const endTime = moment();
const startTime = moment(moment().subtract(moment.duration(1, 'd')));
const startTime2 = moment(moment().subtract(moment.duration(3650, 'd')));
let currentSelectedRowKeys = [];
let currentPrealertPackageId = "";

let consoTypeList = [
    {"label": "请选择", "value": ""},
    {"label": "直邮", "value": "002"},
    {"label": "非直邮", "value": "000"}];
const queryString = require("querystring");

class ListQuery extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            tableDataSource: [],
            packageStatusSource: [],
            orderStatusSource: [],
            specialParcelSignSource: [],
            packageTypeSource: [],
            serviceTypeSource: [],
            platformSource: [],
            countryDataSource: [],
            exceptionTypeSource: [],
            tableColumn: [],
            consoTypeNameDisabled: false,
            consoType: '',
            rowSelection: {
                onChange: this.onRowSelectionChange.bind(this),
                onSelect: function (selected, record, records) {
                    console.log('onSelect------', selected, record, records);
                },
                onSelectAll: function (selected, records) {
                    console.log('onSelectAll------', selected, records);
                },
                selectedRowKeys: [],
            },
            paging: {
                pageSize: window._pageSize_,
                currentPage: 1,
                totalCount: 0
            },
            loadingVisible: false,
            defineSearchComponent: null
        };
        // 直接可传递到后台的field
        this.field = new Field(this, {values: {
            gmtCreateFromStr: startTime,
            gmtCreateToStr: endTime
        }});
        // this.field.setValue('gmtCreateFromStr', startTime);
        // this.field.setValue('gmtCreateToStr', endTime);
        // 需要转换一遍的field
        this.transField = new Field(this);

        
    }

    //装载后立即被调用
    componentDidMount() {
        this._init();
        this._initTableColumn();
        this.state.paging.currentPage = 1
        let params = this._getPackageRequestParams();
        if(params.mailNoList != null && params.mailNoList != '' ){
            this.field.setValue('gmtCreateFromStr', startTime2);
            this.transField.setValue('mailNoStr', params.mailNoList);
            this._queryPackageList(1);

        }
        //this._queryPackageList();
    }

    _getPackageRequestParams() {
        let urlParams = CommonUtil.getUrlParams();
        console.info("urlParams:"+JSON.stringify(urlParams));
        return urlParams;
    }

    _init(){
        this._getServiceType();
        this._getPackageStatusList();
        this._getOrderStatusList();
        this._getPackageType();
        this._getPlaformType();
        this._getCountry();
        this._getSpecialParcelSign();
        this._getPcakageExceptionType();
    }

    onRowSelectionChange(ids, records) {
        const {rowSelection} = this.state;
        rowSelection.selectedRowKeys = ids;
        currentSelectedRowKeys = ids;
        this.setState({rowSelection});
    }

    handleExport() {
        if (currentSelectedRowKeys && currentSelectedRowKeys.length > 0) {
            this.exportSelected(currentSelectedRowKeys);
        } else {
            this.exportAll();
        }
    }

    async exportSelected(ids){
        try {
            const res = await $http({
                url: CUSTOMER_API.packageDetailExportSelected,
                method: 'post',
                timeout: 100000,
                data: {
                    prealertPackageIdList: ids,
                    warehouseId: Cookie.get('warehouseId')
                },
                responseType: 'blob'
            })
            downloadExcel(res, '包裹导出' + moment().format("YYYYMMDD"))
        } catch(e) {
            Message.error(e.message)
        }
        // window.downloadFile(CUSTOMER_API.packageDetailExportSelected + "?prealertPackageIdList=" + ids);
    }

    exportAll(){
        let self = this;
        let params = self._getSearchParams();
        self.setState({loadingVisible: true});
        CommonUtil.ajax({
            url: CUSTOMER_API.queryPackageCount,
            type: 'POST',
            data: params
        }).then((count) => {
            self.setState({loadingVisible: false});
            if (count && count > maxCount) {
                let confirmDialogTitle = "导出Excel";
                let confirmDialogContent = "所选数据量为" + count + "," + "当前最多支持导出" + maxCount + "条数据";
                Dialog.confirm({
                    title: confirmDialogTitle,
                    content: confirmDialogContent,
                    onOk: () => {
                        self.doExportAll(maxCount)
                    }
                });
            }else {
                self.doExportAll(count);
            }
        }, (error) => {
            this.setState({loadingVisible: false});
            if (error && typeof error.errMsg !== 'undefined') {
                console.log("获取包裹数量失败, " + error.errMsg);
            } else {
                console.log("获取包裹数量失败。");
            }
            self.doExportAll(maxCount);
        });
    }

    async doExportAll(size){
        let queryParam = this._getSearchParams();
        queryParam = Object.assign(queryParam, {
            size: size
        });
        // var jsonStr =   JSON.stringify(queryParam);
        // let obj = JSON.parse(jsonStr);
        try {
            const res = await $http({
                url: CUSTOMER_API.packageDetailExportAll,
                method: 'post',
                data: queryParam,
                timeout: 100000,
                responseType: 'blob'
            })
            downloadExcel(res, '包裹导出' + moment().format("YYYYMMDD"))
        } catch(e) {
            Message.error(e.message)
        }
        // window.downloadFile(CUSTOMER_API.packageDetailExportAll + "?" + queryString.stringify(obj));
    }

    // 包裹状态
    _getPackageStatusList(){
        let self = this;
        // self.setState({loadingVisible: true});
        CommonUtil.ajax({
            url: CUSTOMER_API.getPackageStatusNames,
            type: 'GET',
        }).then((data) => {
            if (data) {
                let pkgStatuses = [];
                data.forEach((item) => {
                    pkgStatuses.push({
                        "label": item.label,
                        "value": item.code
                    });
                });
                self.setState({
                    packageStatusSource: pkgStatuses
                })
            }
            // self.setState({loadingVisible: false});
        }, (error) => {
            // this.setState({loadingVisible: false});
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("获取包裹状态列表失败, " + error.errMsg);
            } else {
                CommonUtil.alert("加载包裹状态失败。");
            }
        });
    }

    // 订单状态
    _getOrderStatusList(){
        let self = this;
        // self.setState({loadingVisible: true});
        CommonUtil.ajax({
            url: CUSTOMER_API.getOrderStatusNames,
            type: 'GET',
        }).then((data) => {
            if (data) {
                let orderStatusList = [];
                data.forEach((item) => {
                    orderStatusList.push({
                        "label": item.label,
                        "value": item.code
                    });
                });
                self.setState({
                    orderStatusSource: orderStatusList
                })
            }
            // self.setState({loadingVisible: false});
        }, (error) => {
            // this.setState({loadingVisible: false});
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("获取订单状态列表失败, " + error.errMsg);
            } else {
                CommonUtil.alert("加载订单状态失败。");
            }
        });
    }
    // 业务类型
    _getServiceType(){
        let self = this;
        // self.setState({loadingVisible: true});
        CommonUtil.ajax({
            url: CUSTOMER_API.getServiceTypeNames,
            type: 'GET',
        }).then((data) => {
            if (data) {
                let svsTypes = [];
                data.forEach((item) => {
                    svsTypes.push({
                        "label": item.label,
                        "value": item.code
                    });
                });
                //self._supply(svsTypes);
                self.setState({
                    serviceTypeSource: svsTypes
                })
            }
            // self.setState({loadingVisible: false});
        }, (error) => {
            // this.setState({loadingVisible: false});
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("获取业务类型失败, " + error.errMsg);
            } else {
                CommonUtil.alert("获取业务类型失败。");
            }
        });
    }
    // 包裹类型
    _getPackageType(){
        let self = this;
        // self.setState({loadingVisible: true});
        CommonUtil.ajax({
            url: CUSTOMER_API.getPackageTypeNames,
            type: 'GET',
        }).then((data) => {
            if (data) {
                let pkgTypes = [];
                data.forEach((item) => {
                    if (item.code > 0){
                        pkgTypes.push({
                            "label": item.label,
                            "value": item.code
                        });
                    }
                });
                //self._supply(pkgTypes);
                self.setState({
                    packageTypeSource: pkgTypes
                })
            }
            // self.setState({loadingVisible: false});
        }, (error) => {
            // this.setState({loadingVisible: false});
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("获取包裹类型失败, " + error.errMsg);
            } else {
                CommonUtil.alert("获取包裹类型失败。");
            }
        });
    }
    //特殊包裹
    _getSpecialParcelSign(){
        let self=this;
        // self.setState({loadingVisible: true});
        CommonUtil.ajax({
            url: CUSTOMER_API.getSpecialParcelSign,
            type: 'GET',
        }).then((data) => {
            console.log("specialParcelSignSource:" + JSON.stringify(data));
            if (data) {
                let specialParcelSigns = [];
                data.forEach((item) => {
                    specialParcelSigns.push({
                        "label": item.label,
                        "value": item.code
                    });
                });

                self.setState({
                    specialParcelSignSource: specialParcelSigns
                })
            }
            // self.setState({loadingVisible: false});
        }, (error) => {
            // this.setState({loadingVisible: false});
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("获取特殊包裹失败, " + error.errMsg);
            } else {
                CommonUtil.alert("获取特殊包裹失败。");
            }
        });
    }
    //包裹异常状态
    _getPcakageExceptionType(){
        let self=this;
        // self.setState({loadingVisible: true});
        CommonUtil.ajax({
            url: CUSTOMER_API.getPackageExceptionType,
            type: 'GET',
        }).then((data) => {
            // console.log("exceptionTypeSource:" + JSON.stringify(data));
            if (data) {
                let exceptionTypes = [];
                data.forEach((item) => {
                    exceptionTypes.push({
                        "label": item.label,
                        "value": item.code
                    });
                });

                self.setState({
                    exceptionTypeSource: exceptionTypes
                })
            }
            // self.setState({loadingVisible: false});
        }, (error) => {
            // this.setState({loadingVisible: false});
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("获取包裹异常类型失败, " + error.errMsg);
            } else {
                CommonUtil.alert("获取包裹异常类型失败。");
            }
        });
    }

    // 平台类型
    _getPlaformType(){
        let self = this;
        // self.setState({loadingVisible: true});
        CommonUtil.ajax({
            url: CUSTOMER_API.getPlatformTypeNames,
            type: 'GET',
        }).then((data) => {
            console.log("platformSource:" + JSON.stringify(data));
            if (data) {
                let pfTypeNames = [];
                data.forEach((item) => {
                    pfTypeNames.push({
                        "label": item.label,
                        "value": item.code
                    });
                });
                //self._supply(pfTypeNames);
                self.setState({
                    platformSource: pfTypeNames
                })
            }
            // self.setState({loadingVisible: false});
        }, (error) => {
            // this.setState({loadingVisible: false});
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("获取平台类型失败, " + error.errMsg);
            } else {
                CommonUtil.alert("获取平台类型失败。");
            }
        });
    }
    // 国家
    _getCountry(){
        let self = this;
        // self.setState({loadingVisible: true});
        CommonUtil.ajax({
            url: CUSTOMER_API.getCountryNames,
            type: 'GET'
        }).then((data) => {
            if (data) {
                let countries = [];
                data.forEach((item) => {
                    countries.push({
                        "label": item.areaName,
                        "value": item.areaCode
                    });
                });
                //self._supply(countries);
                self.setState({
                    countryDataSource: countries
                })
            }
            // self.setState({loadingVisible: false});
        }, (error) => {
            // this.setState({loadingVisible: false});
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("获取国家地区数据失败, " + error.errMsg);
            } else {
                CommonUtil.alert("获取国家地区数据失败。");
            }
        });
    }

    _supply(source){
        source.unshift({
            "label": "请选择",
            "value": ""
        });
    }

    handleSearch() {
        console.log("moment:" + moment(-3600).fromNow());
        // 初始化列表
        this.state.paging.currentPage = 1
        this._queryPackageList();
    }

    // 回车事件
    onEnterSearch = (e) => {
        if (e.keyCode == 13 || e.which == 13) {
            this.handleSearch()
        }
    }

    _getSearchParams(){
        let self = this;
        let fieldData = self.field.getValues();
        let tansFieldData = self.transField.getValues();
        let params = Object.assign(fieldData, {
            mailNoList: self._transferString2Array(self.transField.getValue('mailNoStr'),' '),
            outDelegationCodeList: self._transferString2Array(self.transField.getValue('outDelegationCodeStr'),' '),
            tbOrderIdList: self._transferString2Array(self.transField.getValue('tbOrderIdStr'),' '),
            referLogisticsOrderCodeList: self._transferString2Array(self.transField.getValue('referLogisticsOrderCodeStr'),' ')
        });
        return params;
    }

    //查询包裹
    _queryPackageList(flag) {
        let self = this;
        let params = self._getSearchParams();
        console.log("params:" + JSON.stringify(params));
        let paging = this.state.paging;
        this.setState({loadingVisible: true});
        CommonUtil.ajax({
            url: CUSTOMER_API.queryPackageList +
            "?pageNum=" + paging.currentPage + "&pageSize=" + paging.pageSize,
            /*url: CUSTOMER_API.queryPackageList,*/
            type: 'POST',
            data: params
        }).then((data) => {
            this.setState({loadingVisible: false});
            currentSelectedRowKeys = [];
            let tableDataSource = data.data ? data.data : [];
            let paging = self.state.paging;
            paging.totalCount = data.totalRowCount;
            const {rowSelection} = this.state;
            rowSelection.selectedRowKeys = [];
            self.setState({
                rowSelection: rowSelection,
                tableDataSource: tableDataSource,
                paging: paging,
            });
        },(error) => {
            this.setState({loadingVisible: false});
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("查询包裹失败, " + error.errMsg);
            } else {
                CommonUtil.alert("查询包裹失败");
            }
        });
    }

    _initTableColumn() {
        let self = this;
        let tableColumn = [
            {"enable": true, "key": "mailNo", "name": "包裹运单号", "width":200},
            {"enable": true, "key": "packageLp", "name": "平台跟踪号", "width":200},
            {"enable": true, "key": "buyerVipCode", "name": "买家会员号", "width":200},
            {"enable": true, "key": "mobile", "name": "买家手机号", "width":200},
            {"enable": true, "key": "referCode", "name": "买家识别码", "width":200},
            {"enable": true, "key": "tbOrderId", "name": "订单交易号", "width":200},
            {"enable": true, "key": "countryCodeLabel", "name": "国家/地区", "width":110},
            {"enable": true, "key": "storeCode", "name": "库位号", "width":100},
            {"enable": true, "key": "exceptionTypeLabel", "name": "异常状态", "width":110},
            {"enable": true, "key": "warEntryWeight", "name": "包裹实重", "width":200},
            {"enable": true, "key": "packageTypeLabel", "name": "包裹类型", "width":70},
            {"enable": true, "key": "packageSourceLabel", "name": "平台类型", "width":100},
            {"enable": true, "key": "packageStatusLabel", "name": "包裹状态", "width":80},
            {"enable": true, "key": "orderStatusLabel", "name": "订单状态", "width":80},
            {"enable": true, "key": "noAlertRecogTime", "name": "是否无预报件", "width":80, cellRender: (val) => {
              return val && '是' || '否'
            }},
            {"enable": true, "key": "serviceTypeLabel", "name": "业务类型", "width":110},
            {"enable": true, "key": "gmtCreate", "name": "生成时间", "width":200},
            {"enable": true, "key": "warReceivingTime", "name": "签收时间", "width":200},
            {"enable": true, "key": "operation", "name": "操作","width":70, lock: 'right'}
        ];
        tableColumn = self._renderTableColumns(tableColumn);
        self.setState({tableColumn: tableColumn});
    }

    _renderTableColumns(tableColumns) {
        let self = this;
        tableColumns.forEach((item) => {
            if (item.cellRender) return;
            switch (item.key) {
                case "operation":
                    item.cellRender = self._operationRender.bind(self);
                    break;
                default:
                    item.cellRender = self._commonRender.bind(self);
                    break;
            }
        });

        return tableColumns;
    }

    _operationRender(value, index, record) {
        // console.log(record);
        return <a  onClick={this.handleDetail.bind(this, record.prealertPackageId)}>详情</a>;
    }

    handleDetail(prealertPackageId){
        currentPrealertPackageId = prealertPackageId;
        console.log("handleDetail-id:" + prealertPackageId);
        this.refs.detailDialog.onDialogShow(prealertPackageId);
    }

    _commonRender(value, index, record) {
        if (value || value === 0) {
            return <span>{value}</span>;
        } else {
            return <span>-</span>;
        }
    }

    _transferString2Array(str,split) {
        if (!split){
            return [];
        }
        let r = [];
        if (str) {
            r = str.split(split);
        }
        return r;
    }

    // 翻页
    onPageChange(currentPage) {
        let paging = this.state.paging;
        paging.currentPage = currentPage;
        this.setState(paging, () => {
            this._queryPackageList();
        });
    }

    // 修改本页大小
    onPageSizeChange(pageSize) {
        let paging = this.state.paging;
        paging.pageSize = pageSize;
        paging.currentPage = 1;
        this.setState(paging, () => {
            this._queryPackageList();
        });
    }

    _isEmpty(val){
        if (typeof val === 'undefined'
            || val == null
            || val.length === 0) {
            return true;
        }
        return false
    }

    onTimeChange(name,val){
        this.field.setValue(name, val);
    }

    markDisableTime(isStartTime,comparedTimeName,currentTime){
        let self = this;
        let comparedTime = self.field.getValue(comparedTimeName);
        if (!comparedTime || !currentTime) {
            return false;
        }

        // currentTime为开始时间
        if (isStartTime) {
            return comparedTime.valueOf() < currentTime.valueOf();
        }else {
            return currentTime.valueOf() < comparedTime.valueOf();
        }
    }

    // 时间输入是否有效
    _isTimeValidate(startName,endName){
        let self = this;
        let startTime =  self.field.getValue(startName);
        let endTime = self.field.getValue(endName);
        if (!startTime || !endTime) {
            return true;
        }
        return startTime.valueOf() < endTime.valueOf();
    }

    render() {
        const init = this.field.init;
        const transInit = this.transField.init;
        const {tableColumn, tableDataSource, paging,rowSelection, defineSearchComponent} = this.state;
        return (
            <div className="page-content pam-wrap">
            <FormCollapse>
                <Form field={this.field} size="small" direction="hoz" className="search-con" defineSearch
                    getDefineComponent={(data) => {
                        this.setState({defineSearchComponent: data})
                    }}
                    code="service_packageList"
                >
                    <Row>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="mailNoStr" show required>
                            <FormItem label="包裹运单号" labelTextAlign="right"
                                        {...formItemLayout}>
                                <Input onKeyDown={this.onEnterSearch} {...transInit('mailNoStr')} style={{width: '100%'}} placeholder='批量查询以空格分隔'/>
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="referLogisticsOrderCodeStr" show required>
                            <FormItem label="平台跟踪号" labelTextAlign="right" {...formItemLayout}>
                                <Input onKeyDown={this.onEnterSearch} {...transInit('referLogisticsOrderCodeStr')} style={{width: '100%'}} placeholder='批量查询以空格分隔'/>
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="tbOrderIdStr" show required>
                            <FormItem label="订单交易号" labelTextAlign="right" {...formItemLayout}>
                                <Input onKeyDown={this.onEnterSearch} {...transInit('tbOrderIdStr')} style={{width: '100%'}} placeholder='批量查询以空格分隔'/>
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="buyerVipCode">
                            <FormItem label="买家会员号" labelTextAlign="right" {...formItemLayout}>
                                <Input {...init('buyerVipCode')} style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="mobile">
                            <FormItem label="买家手机号" {...formItemLayout}>
                                <Input {...init('mobile')} style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="referCode">
                            <FormItem label="买家识别码" labelTextAlign="right" {...formItemLayout}>
                                <Input {...init('referCode')} style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="gmtCreateFromStr" show required>
                            <FormItem label="生成时间起" labelTextAlign="right" {...formItemLayout}>
                                <DatePicker
                                    {...init('gmtCreateFromStr')}
                                    disabledDate={this.markDisableTime.bind(this,true,"gmtCreateToStr")}
                                    showTime={{format: 'HH:mm:ss'}}
                                    onChange={this.onTimeChange.bind(this,"gmtCreateFromStr")}
                                    style={{width: '100%'}}
                                />
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="gmtCreateToStr" show required>
                            <FormItem label="生成时间止" labelTextAlign="right" {...formItemLayout}>
                                <DatePicker
                                    {...init('gmtCreateToStr')}
                                    disabledDate={this.markDisableTime.bind(this,false,"gmtCreateFromStr")}
                                    showTime={{format: 'HH:mm:ss'}}
                                    onChange={this.onTimeChange.bind(this,"gmtCreateToStr")}
                                    style={{width: '100%'}}
                                />
                            </FormItem>

                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="warReceivingTimeFromStr">
                            <FormItem label="签收时间起" labelTextAlign="right" {...formItemLayout}>
                                <DatePicker
                                    name="warReceivingTimeFromStr"
                                    disabledDate={this.markDisableTime.bind(this,true,"warReceivingTimeToStr")}
                                    showTime={{format: 'HH:mm', minuteStep: 15}}
                                    onChange={this.onTimeChange.bind(this,"warReceivingTimeFromStr")}
                                    style={{width: '100%'}}
                                />
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="warReceivingTimeToStr">
                            <FormItem label="签收时间止" labelTextAlign="right" {...formItemLayout}>
                                <DatePicker
                                    name="warReceivingTimeToStr"
                                    disabledDate={this.markDisableTime.bind(this,false,"warReceivingTimeFromStr")}
                                    showTime={{format: 'HH:mm', minuteStep: 15}}
                                    onChange={this.onTimeChange.bind(this,"warReceivingTimeToStr")}
                                    style={{width: '100%'}}
                                />
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="warEntryTimeFromStr">
                            <FormItem label="入库时间起" labelTextAlign="right" {...formItemLayout}>
                                <DatePicker
                                    name="warEntryTimeFromStr"
                                    disabledDate={this.markDisableTime.bind(this,true,"warEntryTimeToStr")}
                                    showTime={{format: 'HH:mm', minuteStep: 15}}
                                    onChange={this.onTimeChange.bind(this,"warEntryTimeFromStr")}
                                    style={{width: '100%'}}
                                />
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="warEntryTimeToStr">
                            <FormItem label="入库时间止" labelTextAlign="right" {...formItemLayout}>
                                <DatePicker
                                    name="warEntryTimeToStr"
                                    disabledDate={this.markDisableTime.bind(this,false,"warEntryTimeFromStr")}
                                    showTime={{format: 'HH:mm', minuteStep: 15}}
                                    onChange={this.onTimeChange.bind(this,"warEntryTimeToStr")}
                                    style={{width: '100%'}}
                                />
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="onShelvesTimeFromStr">
                            <FormItem label="上架时间起" labelTextAlign="right" {...formItemLayout}>
                                <DatePicker
                                    name="onShelvesTimeFromStr"
                                    disabledDate={this.markDisableTime.bind(this,true,"onShelvesTimeToStr")}
                                    showTime={{format: 'HH:mm', minuteStep: 15}}
                                    onChange={this.onTimeChange.bind(this,"onShelvesTimeFromStr")}
                                    style={{width: '100%'}}
                                />
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="onShelvesTimeToStr">
                            <FormItem label="上架时间止" labelTextAlign="right" {...formItemLayout}>
                                <DatePicker
                                    name="onShelvesTimeToStr"
                                    disabledDate={this.markDisableTime.bind(this,false,"onShelvesTimeFromStr")}
                                    showTime={{format: 'HH:mm', minuteStep: 15}}
                                    onChange={this.onTimeChange.bind(this,"onShelvesTimeToStr")}
                                    style={{width: '100%'}}
                                />
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="offShelvesTimeFromStr">
                            <FormItem label="下架时间起" labelTextAlign="right" {...formItemLayout}>
                                <DatePicker
                                    name="offShelvesTimeFromStr"
                                    disabledDate={this.markDisableTime.bind(this,true,"offShelvesTimeToStr")}
                                    showTime={{format: 'HH:mm', minuteStep: 15}}
                                    onChange={this.onTimeChange.bind(this,"offShelvesTimeFromStr")}
                                    style={{width: '100%'}}
                                />
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="offShelvesTimeToStr">
                            <FormItem label="下架时间止" labelTextAlign="right" {...formItemLayout}>
                                <DatePicker
                                    name="offShelvesTimeToStr"
                                    disabledDate={this.markDisableTime.bind(this,false,"offShelvesTimeFromStr")}
                                    showTime={{format: 'HH:mm', minuteStep: 15}}
                                    onChange={this.onTimeChange.bind(this,"offShelvesTimeToStr")}
                                    style={{width: '100%'}}
                                />
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="packageSourceList">
                            <FormItem label="平台类型(可多选)" labelTextAlign="right" {...formItemLayout}>
                                <Select {...init('packageSourceList')}
                                        mode="multiple"
                                        dataSource={this.state.platformSource}
                                        showSearch
                                        style={{width: '100%'}}
                                />
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="packageTypeList">
                            <FormItem label="包裹类型(可多选)" labelTextAlign="right" {...formItemLayout}>
                                <Select {...init('packageTypeList')}
                                        mode="multiple"
                                        dataSource={this.state.packageTypeSource}
                                        showSearch
                                        style={{width: '100%'}}
                                />
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="serviceTypeList">
                            <FormItem label="业务类型(可多选)" labelTextAlign="right" {...formItemLayout}>
                                <Select {...init('serviceTypeList')}
                                        mode="multiple"
                                        dataSource={this.state.serviceTypeSource}
                                        showSearch
                                        style={{width: '100%'}}
                                />
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="countryCodeList">
                            <FormItem label="国家或地区(可多选)" labelTextAlign="right" {...formItemLayout}>
                                <Select {...init('countryCodeList')}
                                        mode="multiple"
                                        dataSource={this.state.countryDataSource}
                                        showSearch
                                        style={{width: '100%'}}
                                />
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="packageStatusList">
                            <FormItem label="包裹状态(可多选)" labelTextAlign="right" {...formItemLayout}>
                                <Select {...init('packageStatusList')}
                                        mode="multiple"
                                        dataSource={this.state.packageStatusSource}
                                        showSearch
                                        style={{width: '100%'}}
                                />
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="outDelegationCodeStr">
                            <FormItem label="出库委托号" labelTextAlign="right" {...formItemLayout}>
                                <Input {...transInit('outDelegationCodeStr')} style={{width: '100%'}} placeholder='批量查询以空格分隔'/>
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="qualityCheckTimeFromStr">
                            <FormItem label="质检时间起" labelTextAlign="right" {...formItemLayout}>
                                <DatePicker
                                    name="qualityCheckTimeFromStr"
                                    disabledDate={this.markDisableTime.bind(this,true,"qualityCheckTimeToStr")}
                                    showTime={{format: 'HH:mm:ss'}}
                                    onChange={this.onTimeChange.bind(this,"qualityCheckTimeFromStr")}
                                    style={{width: '100%'}}
                                />
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="qualityCheckTimeToStr">
                            <FormItem label="质检时间止" labelTextAlign="right" {...formItemLayout}>
                                <DatePicker
                                    name="qualityCheckTimeToStr"
                                    disabledDate={this.markDisableTime.bind(this,false,"qualityCheckTimeFromStr")}
                                    showTime={{format: 'HH:mm:ss'}}
                                    onChange={this.onTimeChange.bind(this,"qualityCheckTimeToStr")}
                                    style={{width: '100%'}}
                                />
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="specialParcelSign">
                            <FormItem label="特殊包裹" labelTextAlign="right" {...formItemLayout}>
                                <Select {...init('specialParcelSign')}
                                        dataSource={this.state.specialParcelSignSource}
                                        showSearch
                                        style={{width: '100%'}}
                                />
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="exceptionTypeList">
                            <FormItem label="异常状态(可多选)" labelTextAlign="right" {...formItemLayout}>
                                <Select {...init('exceptionTypeList')}
                                        mode="multiple"
                                        dataSource={this.state.exceptionTypeSource}
                                        showSearch
                                        style={{width: '100%'}}
                                />
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="reversalReceivingTimeFromStr">
                            <FormItem label="逆向签收时间起" labelTextAlign="right" 
                                        {...{labelCol: {fixedSpan: 5}, wrapperCol: {fixedSpan: 10}}}>
                                <DatePicker
                                    name="reversalReceivingTimeFromStr"
                                    disabledDate={this.markDisableTime.bind(this,true,"reversalReceivingTimeToStr")}
                                    showTime={{format: 'HH:mm:ss'}}
                                    onChange={this.onTimeChange.bind(this,"reversalReceivingTimeFromStr")}
                                    style={{width: '100%'}}
                                />
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="reversalReceivingTimeToStr">
                            <FormItem label="逆向签收时间止" labelTextAlign="right" 
                                        {...{labelCol: {fixedSpan: 5}, wrapperCol: {fixedSpan: 10}}}>
                                <DatePicker
                                    name="reversalReceivingTimeToStr"
                                    disabledDate={this.markDisableTime.bind(this,false,"reversalReceivingTimeFromStr")}
                                    showTime={{format: 'HH:mm:ss'}}
                                    onChange={this.onTimeChange.bind(this,"reversalReceivingTimeToStr")}
                                    style={{width: '100%'}}
                                />
                            </FormItem>
                        </Col>
                        <Col fixedSpan={colItemLayout.fixedSpan} key="consoType">
                            <FormItem label="是否直邮" labelTextAlign="right" {...formItemLayout}>
                                <Select
                                    {...init('consoType', {

                                    })} trim hasClear
                                    dataSource={consoTypeList}
                                    style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Row>
                    <Col>
                        {/* <Button mr="10" onClick={this.handleExport.bind(this)} type="primary">包裹数据导出</Button> */}
                        <ExportExcel
                            params={() => this._getSearchParams()}
                        ></ExportExcel>
                        <Button mr="10" onClick={this.handleSearch.bind(this)} type="primary">查 询</Button>
                        {defineSearchComponent}
                        
                    </Col>
                </Row>
              </FormCollapse>
                <DetailDialog ref="detailDialog"/>

                {/* <Loading visible={this.state.loadingVisible} size="large" fullScreen="true"/> */}
                <Table dataSource={tableDataSource}
                    primaryKey = "prealertPackageId"
                    className="data-table"
                    rowSelection={rowSelection}
                    loading={this.state.loadingVisible}
                >
                    {
                        tableColumn.map((item, index) => {
                            return <Table.Column title={item.name} key={index} lock={item.lock} dataIndex={item.key} cell={item.cellRender} width={item.width}/>
                        })
                    }
                </Table>
                <Pagination className="custom-pagination"
                    type="normal"
                    size="small"
                    pageSizePosition="start"
                    shape="arrow-only"
                    pageSizeSelector="dropdown"
                    pageSize={paging.pageSize}
                    current={paging.currentPage}
                    total={paging.totalCount}
                    totalRender={total => `总记录条数: ${paging.totalCount}`}
                    onChange={this.onPageChange.bind(this)}
                    onPageSizeChange={this.onPageSizeChange.bind(this)}/>
            </div>
        );
    }
}

export class DetailDialog extends React.Component {
    constructor(props) {
        super(props);
        this.packageField = new Field(this);
        this.logsField = new Field(this);
        this.buyerUserInfo = new Field(this);
        this.remarkInfoField = new Field(this);
        this.sellerUserInfo = new Field(this);
        this.state = {
            loadingVisible:false,
            visible: false,
            logTableColumn:[],
            logTableDataSource:[],
            remarkTableColumn:[],
            remarkTableDataSource:[],
            productTableColumn:[],
            productTableDataSource:[]
        }
        this.remarkForm = React.createRef()
    }

    componentDidMount() {
        this._initTableColumn();
    }
    _clear(){
        let self = this;
        self.setState(
            {
                loadingVisible:false,
                visible: false,
                logTableDataSource:[],
                remarkTableDataSource:[],
                productTableDataSource:[]
            }
        );
        self.packageField.reset();
        self.logsField.reset();
        self.buyerUserInfo.reset();
        self.sellerUserInfo.reset();
        self.remarkInfoField.reset();
        currentPrealertPackageId = '';
    }

    onDialogClose() {
        setTimeout(() => {
            this.setState({
                visible: false
            });
        }, 10);
        this._clear();
    }

    _initTableColumn() {
        let self = this;
        let logTableColumn = [
            {"enable": true, "key": "actionLabel", "name": "动作", "width":200},
            {"enable": true, "key": "content", "name": "备注内容", "width":450},
            {"enable": true, "key": "createUser", "name": "操作人", "width":160},
            {"enable": true, "key": "createTime", "name": "备注时间", "width":170}
        ];
        let remarkTableColumn = [
            {"enable": true, "key": "action", "name": "动作", "width":200},
            {"enable": true, "key": "content", "name": "备注内容", "width":450},
            {"enable": true, "key": "createUser", "name": "操作人", "width":160},
            {"enable": true, "key": "createTime", "name": "备注时间", "width":170}
        ];
        let productTableColumn = [
            {"enable": true, "key": "itemCategoryName", "name": "商品品类", "width":200, cellRender: (val, index, record) => {
                return val && <Button text type="primary" onClick={() => {
                    window.downloadFile('https://item.taobao.com/item.htm?id=' + record.referItemId, '_blank')
                }}>{val}</Button> || '--'
            }},
            {"enable": true, "key": "itemName", "name": "商品名称", "width":300},
            {"enable": true, "key": "itemUnitPrice", "name": "商品单价", "width":100},
            {"enable": true, "key": "itemQuantity", "name": "商品数量", "width":90},
            {"enable": true, "key": "currency", "name": "价格币种", "width":100},
            {"enable": true, "key": "itemRemark", "name": "备注", "width":150}
        ];
        logTableColumn = self._renderTableColumns(logTableColumn);
        remarkTableColumn = self._renderTableColumns(remarkTableColumn);
        productTableColumn = self._renderTableColumns(productTableColumn);
        self.setState({
            logTableColumn: logTableColumn,
            remarkTableColumn: remarkTableColumn,
            productTableColumn: productTableColumn
        });
    }

    _renderTableColumns(tableColumns) {
        let self = this;
        tableColumns.forEach((item) => {
            if (item.cellRender) return;
            switch (item.key) {
                default:
                    item.cellRender = self._commonRender.bind(self);
                    break;
            }
        });

        return tableColumns;
    }

    _commonRender(value, index, record) {
        if (value || value === 0) {
            return <span>{value}</span>;
        } else {
            return <span>-</span>;
        }
    }

    _getPackageByDetail(prealertPackageId){
        console.log(("_getPackageByDetail id"+prealertPackageId));
        let self = this;
        self.setState({loadingVisible: true});
        CommonUtil.ajax({
            url: CUSTOMER_API.queryPackageDetail.replace('{prealertPackageId}',prealertPackageId),
            type: 'GET',
        }).then((data) => {
            if (data) {
                console.log(data);
                self._buildData(self.packageField, data.packageInfo);
                self._buildData(self.sellerUserInfo,data.userInfo.sellerUserInfo);
                self._buildData(self.buyerUserInfo,data.userInfo.buyerUserInfo);
                self.setState({
                    logTableDataSource: data.actionLogs == null ? []:data.actionLogs,
                    remarkTableDataSource: data.csmRemarkList == null ? []:data.csmRemarkList,
                    productTableDataSource: data.itemList == null ? []:data.itemList
                });
                self.setState({
                    visible: true
                });
            }
            self.setState({loadingVisible: false});
        },(error) => {
            this.setState({loadingVisible: false});
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("查询详情失败, " + error.errMsg);
            } else {
                CommonUtil.alert("查询详情失败");
            }
        });
    }

    _buildData(field,data){
        if(data){
            for (let d in data){
                field.setValue(d,data[d]);
            }
        }
    }

    onDialogShow(prealertPackageId) {
        let self = this;
        self._getPackageByDetail(prealertPackageId);
        currentPrealertPackageId=prealertPackageId;
    }

    _saveRemark(prealertPackageId){
        let self = this;
        // let param = self.remarkInfoField.getValues();
        let param = this.remarkForm && this.remarkForm.getData()
        self.setState({loadingVisible: true});
        CommonUtil.ajax({
            url: CUSTOMER_API.savePackageRemark.replace('{prealertPackageId}',prealertPackageId),
            type: 'POST',
            data:param,
        }).then((data) => {
            CommonUtil.alert("保存成功");
            self.remarkInfoField.reset();
            self._getPackageByDetail(prealertPackageId);
            self.setState({loadingVisible: false});
        },(error) => {
            this.setState({loadingVisible: false});
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("保存备注失败, " + error.errMsg);
            } else {
                CommonUtil.alert("保存备注失败");
            }
        });
    }

    render() {
        const packageInit = this.packageField.init;
        const logsInit = this.logsField.init;
        const buyerUserInfo = this.buyerUserInfo.init;
        const remarkInfo = this.remarkInfoField.init;
        const sellerUserInfo =  this.sellerUserInfo.init;
        const {logTableColumn, logTableDataSource,remarkTableColumn,remarkTableDataSource,productTableColumn,productTableDataSource} = this.state;
        return (
            <Dialog title="包裹详情" visible={this.state.visible} isFullScreen="true" onClose={this.onDialogClose.bind(this)} footer={false}>
                <Loading visible={this.state.loadingVisible} size="large" fullScreen="true"></Loading>
                <div className="page-content pam-wrap">
                            <Card contentHeight='450px' title="包裹信息" style={{height:'360px',overflow:'auto'}}>
                                <Row>
                                    <Form field={this.packageField} size="small" direction="hoz">
                                        <Row className="condition-main">
                                            <Col fixedSpan='16'>
                                                <FormItem label="包裹运单号" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...packageInit('mailNo')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="包裹状态" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...packageInit('statusLabel')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="异常状态" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...packageInit('exceptionTypeLabel')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={"16"}>
                                                <FormItem label="交易订单号" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...packageInit('referOrderId')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="平台跟踪号" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...packageInit('packageLp')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="平台类型" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...packageInit('sourceLabel')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={16}>
                                                <FormItem label="包裹实重(g)" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...packageInit('weight')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="包裹计费重(g)" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...packageInit('payWeight')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="包裹尺寸(cm)" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...packageInit('packageSizeLabel')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={16}>
                                                <FormItem label="包裹类型" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...packageInit('packageTypeLabel')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="出库委托号" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...packageInit('outDelegateCode')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="运输类型" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...packageInit('carrierTypeLabel')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={16}>
                                                <FormItem label="库位号" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...packageInit('storeCode')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="是否拆分包裹" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...packageInit('isSplitLabel')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="是否带电" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...packageInit('isElectricLabel')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={16}>
                                                <FormItem label="入库委托号" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...packageInit('inDelegationCode')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="是否直转集" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...packageInit('dsToConsoLabel')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="特殊包裹" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...packageInit('specialParcelSign')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={16}>
                                                <FormItem label="是否包包标记" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...packageInit('consoTypeLabel')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="揽收仓名称" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...packageInit('pickupResName')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="来源仓名称">
                                                        <ASelect name="preCpcode"
                                                          isDetail getOptions={async() => bigPackageSource}
                                                          defaultValue={this.packageField.getValue('preCpcode') || '-'}
                                                          style={{fontWeight: 'bold'}}
                                                        ></ASelect>
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Row>
                            </Card>

                            <Card title="买家信息" contentHeight='170px'>
                                <Row>
                                    <Form field={this.buyerUserInfo} size="small" direction="hoz">
                                        <Row className="condition-main">
                                            <Col fixedSpan={16}>
                                                <FormItem label="买家姓名" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...buyerUserInfo('name')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="买家会员号" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...buyerUserInfo('referUserId')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="买家识别码" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...buyerUserInfo('referCode')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={16}>
                                                <FormItem label="买家手机" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...buyerUserInfo('mobile')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="买家电话" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...buyerUserInfo('mobile')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="买家邮箱" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...buyerUserInfo('email')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={16}>
                                                <FormItem label="国家/地区" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...buyerUserInfo('country')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="省份/州" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...buyerUserInfo('province')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="城市" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...buyerUserInfo('city')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={16}>
                                                <FormItem label="区域" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...buyerUserInfo('district')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="详细地址" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...buyerUserInfo('streetAddress')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={16}>
                                                <FormItem label="邮编" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...buyerUserInfo('zipCode')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Row>
                            </Card>

                            <Card title="卖家信息">
                                <Row>
                                    <Form field={this.sellerUserInfo} size="small" direction="hoz">
                                        <Row className="condition-main">
                                            <Col fixedSpan={16}>
                                                <FormItem label="卖家会员号" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...sellerUserInfo('referUserId')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="卖家手机号" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...sellerUserInfo('mobile')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="卖家邮箱" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...sellerUserInfo('email')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={16}>
                                                <FormItem label="国家/地区" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...sellerUserInfo('country')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="省份/州" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...sellerUserInfo('province')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="城市" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...sellerUserInfo('city')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={16}>
                                                <FormItem label="区域" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...sellerUserInfo('district')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="详细地址" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...sellerUserInfo('streetAddress')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="邮编" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...sellerUserInfo('zipCode')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Row>
                            </Card>

                            <Card title="商品信息">
                                    <Table dataSource={productTableDataSource} fixedHeader={false} className="data-table">
                                        {
                                            productTableColumn.map((item, index) => {
                                                return <Table.Column title={item.name} key={index} dataIndex={item.key} cell={item.cellRender} width={item.width}/>
                                            })
                                        }
                                    </Table>
                            </Card>

                            <Card title="状态日志信息">
                                    <Table dataSource={logTableDataSource} fixedHeader={false} className="data-table">
                                        {
                                            logTableColumn.map((item, index) => {
                                                return <Table.Column title={item.name} key={index} dataIndex={item.key} cell={item.cellRender} width={item.width}/>
                                            })
                                        }
                                    </Table>
                            </Card>

                            <Card title="系统日志信息">
                                    <Table dataSource={remarkTableDataSource} fixedHeader={false} sort={this.state.sorts} className="data-table">
                                        {
                                            remarkTableColumn.map((item, index) => {
                                                return <Table.Column title={item.name} key={index} dataIndex={item.key} cell={item.cellRender} width={item.width}/>
                                            })
                                        }
                                    </Table>
                            </Card>

                            <Card title="备注" contentHeight='400px'>
                                <Card.Content>
                                <AForm ref={ref => (this.remarkForm = ref)} formModel={{
                                    content: {
                                        label: '',
                                        span: 12,
                                        component: Input.TextArea,
                                        attrs: {
                                            autoHeight: {minRows: 6, maxRows: 20},
                                            maxLength: 400,
                                            showLimitHint: true,
                                        }
                                    }
                                }}></AForm>
                                <Button mt="10" mb="10" onClick={this._saveRemark.bind(this,currentPrealertPackageId)} type="primary">保存备注</Button>
                                </Card.Content>
                            </Card>
                </div>
            </Dialog>
        );
    }
}
ListQuery.title ="包裹查询"
export default  ListQuery