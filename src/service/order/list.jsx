import React from "react";
import {
  Table,DatePicker,Card, Message,Range, Radio,Loading,
  Form, Input, LocaleProvider, Select, Field, Button,
  Grid, Nav, Dialog, Pagination, FormCollapse
} from '@/component';
import moment from 'moment';
import CommonUtil from 'commonPath/common.js';
import CUSTOMER_API from 'commonPath/api/customer-api';
import ExportFile from "@/component/ExportFile/index";
import { getQuery } from 'assets/js'
import OverTips from "@/component/overTips/index";
import AForm from "@/component/AForm/index";
import { getUuid } from "@/assets/js/common";
//import 'commonPath/common.scss';
// import "./list.scss";

const formItemLayout = {
    labelCol: {fixedSpan: 4},
    wrapperCol: {fixedSpan: 10}
};

const colItemLayout = {fixedSpan: 14}
const RadioGroup = Radio.Group;
const {Row, Col} = Grid;
const maxCount = 50000;
const maxPackageCount = 2000;
const FormItem = Form.Item;
let endTime = moment();
let startTime = moment(moment().subtract(moment.duration(1, 'd')));
let currentSelectedRowKeys = [];
let _currentPrealertOrderId = "";
const queryString = require("querystring");
if (getQuery('delegationCode')) {
    endTime = undefined
    startTime = undefined

}
class ListQuery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDataSource: [],
            orderStatusSource: [],
            serviceTypeSource: [],
            exceptionTypeSource: [],
            countryDataSource: [],
            specialParcelSignSource: [],
            channelSource:[],
            tableColumn: [],
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
            orderPreAlertTimeFromStr: startTime,
            orderPreAlertTimeToStr: endTime
        }});
        // 需要转换一遍的field
        this.transField = new Field(this,  {values: {
            delegationCodeListStr: getQuery('delegationCode') || '',
        }});
    }

    //装载后立即被调用
    componentDidMount() {
        this._init();
        this._initTableColumn();
        if (getQuery('delegationCode')) {
            this.handleSearch()
        }
    }

    _init(){
        this._getChannelType();
        this._getServiceType();
        this._getOrderStatus();
        this._getOrderExpType();
        this._getCountry();
        this._getSpecialParcelSign();

    }

    onRowSelectionChange(ids, records) {
        const {rowSelection} = this.state;
        rowSelection.selectedRowKeys = ids;
        currentSelectedRowKeys = ids;
        console.log("onRowSelectionChange:" + currentSelectedRowKeys);
        this.setState({rowSelection});
    }

    handleExport() {
        if (currentSelectedRowKeys && currentSelectedRowKeys.length > 0) {
            this.exportSelected(currentSelectedRowKeys);
        } else {
            this.exportAll();
        }
    }

    handlePackageExport() {
        if (currentSelectedRowKeys && currentSelectedRowKeys.length > 0) {
            this.exportPackageSelected(currentSelectedRowKeys);
        }else {
            this.exportPackageAll();
        }
    }

    exportSelected(ids){
        window.downloadFile(CUSTOMER_API.orderDetailExportSelected + "?prealertOrderIdList=" + ids);
    }

    exportPackageSelected(ids){
        window.downloadFile(CUSTOMER_API.orderPackageExportSelected + "?prealertOrderIdList=" + ids);
    }

    exportPackageAll(){
        let self = this;
        let params = self._getSearchParams();
        self.setState({loadingVisible: true});
        CommonUtil.ajax({
            url: CUSTOMER_API.queryOrderCount,
            type: 'POST',
            data: params
        }).then((count) => {
            self.setState({loadingVisible: false});
            if (count && count > maxPackageCount) {
                let confirmDialogTitle = "导出Excel";
                let confirmDialogContent = "所选数据量为" + count + "," + "当前最多支持导出" + maxPackageCount + "条订单关联包裹数据导出";
                Dialog.confirm({
                    title: confirmDialogTitle,
                    content: confirmDialogContent,
                    onOk: () => {
                        self.doOrderPackageExportAll(maxPackageCount);
                    }
                });
            }else {
                self.doOrderPackageExportAll(count);
            }
        }, (error) => {
            this.setState({loadingVisible: false});
            if (error && typeof error.errMsg !== 'undefined') {
                console.log("获取订单数量失败, " + error.errMsg);
            } else {
                console.log("获取订单数量失败。");
            }
            self.doOrderPackageExportAll(maxPackageCount);
        });
    }

    exportAll(){
        let self = this;
        let params = self._getSearchParams();
        self.setState({loadingVisible: true});
        CommonUtil.ajax({
            url: CUSTOMER_API.queryOrderCount,
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
                        self.doExportAll(maxCount);
                    }
                });
            }else {
                self.doExportAll(count);
            }
        }, (error) => {
            this.setState({loadingVisible: false});
            if (error && typeof error.errMsg !== 'undefined') {
                console.log("获取订单数量失败, " + error.errMsg);
            } else {
                console.log("获取订单数量失败。");
            }
            self.doExportAll(maxCount);
        });
    }

    doExportAll(size){
        let queryParam = this._getSearchParams();
        queryParam = Object.assign(queryParam, {
            size: size
        });
        var jsonStr =   JSON.stringify(queryParam);
        let obj = JSON.parse(jsonStr);
        console.log(queryString.stringify(obj));
        window.downloadFile(CUSTOMER_API.orderDetailExportAll + "?" + queryString.stringify(obj));
    }
    doOrderPackageExportAll(size){
        let queryParam = this._getSearchParams();
        queryParam = Object.assign(queryParam, {
            size: size
        });
        var jsonStr =   JSON.stringify(queryParam);
        let obj = JSON.parse(jsonStr);
        console.log(queryString.stringify(obj));
        window.downloadFile(CUSTOMER_API.orderPackageExportAll + "?" + queryString.stringify(obj));
    }


    doExcel(size) {
        console.log("currentSelectedRowKeys:" + currentSelectedRowKeys);
        if (currentSelectedRowKeys && currentSelectedRowKeys.length > 0) {
            window.downloadFile(CUSTOMER_API.orderDetailExportSelected + "?prealertOrderIdList=" + currentSelectedRowKeys);
        } else {
            let queryParam = this._getSearchParams();
            queryParam = Object.assign(queryParam, {
                size: size
            });
            var jsonStr =   JSON.stringify(queryParam);
            let obj = JSON.parse(jsonStr);
            console.log(queryString.stringify(obj));
            window.downloadFile(CUSTOMER_API.orderDetailExportAll + "?" + queryString.stringify(obj));
        }
    }

    // 订单状态
    _getOrderStatus(){
        let self = this;
        // self.setState({loadingVisible: true});
        CommonUtil.ajax({
            url: CUSTOMER_API.getOrderStatusNames,
            type: 'GET',
        }).then((data) => {
            let orderStatus = [];
            data.forEach((item) => {
                orderStatus.push({
                    "label": item.label,
                    "value": item.code
                });
            });
            self.setState({
                orderStatusSource: orderStatus
            });
            // self.setState({loadingVisible: false});
        }, (error) => {
            // this.setState({loadingVisible: false});
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("获取订单状态下拉失败, " + error.errMsg);
            } else {
                CommonUtil.alert("获取订单状态下拉失败。");
            }
        });
    }

    // 渠道类型
    _getChannelType(){
        let self = this;
        // self.setState({loadingVisible: true});
        CommonUtil.ajax({
            url: CUSTOMER_API.getChannelNames,
            type: 'GET',
        }).then((data) => {
            let channelTypes = [];
            data.forEach((item) => {
                channelTypes.push({
                    "label": item.label,
                    "value": item.code
                });
            });
            self.setState({
                channelSource: channelTypes
            });
            // self.setState({loadingVisible: false});
        }, (error) => {
            // this.setState({loadingVisible: false});
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("获取渠道下拉失败, " + error.errMsg);
            } else {
                CommonUtil.alert("获取渠道下拉失败。");
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
    // 订单异常类型
    _getOrderExpType(){
        let self = this;
        // self.setState({loadingVisible: true});
        CommonUtil.ajax({
            url: CUSTOMER_API.getOrderExceptionNames,
            type: 'GET',
        }).then((data) => {
            let orderExpTypes = [];
            data.forEach((item) => {
                orderExpTypes.push({
                    "label": item.label,
                    "value": item.code
                });
            });
            self.setState({
                exceptionTypeSource: orderExpTypes
            });
            // self.setState({loadingVisible: false});
        }, (error) => {
            // this.setState({loadingVisible: false});
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("获取订单异常类型失败, " + error.errMsg);
            } else {
                CommonUtil.alert("获取订单异常类型失败。");
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

    handleSearch() {
        // 初始化列表
        this.state.paging.currentPage = 1
        this._queryOrderList();
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
            orderLpList: self._transferString2Array(self.transField.getValue('orderLpListStr'),' '),
            endMailNoList:self._transferString2Array(self.transField.getValue('endMailNoListStr'),' '),
            tbOrderIdList:self._transferString2Array(self.transField.getValue('tbOrderIdListStr'),' '),
            delegationCodeList:self._transferString2Array(self.transField.getValue('delegationCodeListStr'),' ')
        });
        return params;
    }

    //查询订单
    _queryOrderList() {
        let self = this;
        let params = self._getSearchParams();
        console.log("params:" + JSON.stringify(params));
        let paging = this.state.paging;
        this.setState({loadingVisible: true});
        CommonUtil.ajax({
            url: CUSTOMER_API.queryOrderList +
                "?pageNum=" + paging.currentPage + "&pageSize=" + paging.pageSize,
            //url: CUSTOMER_API.queryOrderList,
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
                CommonUtil.alert("查询订单失败, " + error.errMsg);
            } else {
                CommonUtil.alert("查询订单失败");
            }
        });
    }

    _initTableColumn() {
        let self = this;
        let tableColumn = [
            {"enable": true, "key": "outDelegationCode", "name": "出库委托号", "width":150},
            {"enable": true, "key": "referLogisticsOrderCode", "name": "平台物流号", "width":130},
            {"enable": true, "key": "tbOrderId", "name": "订单交易号", "width":150},
            {"enable": true, "key": "endMailNo", "name": "末端面单号", "width":110},
            {"enable": true, "key": "buyerVipCode", "name": "买家会员号", "width":110},
            {"enable": true, "key": "mobile", "name": "手机", "width":100},
            {"enable": true, "key": "orderCarriageStatusLabel", "name": "订单状态", "width":100},
            {"enable": true, "key": "name", "name": "收件人姓名", "width":110},
            {"enable": true, "key": "endCarrierLabel", "name": "渠道", "width":120},
            {"enable": true, "key": "countryLabel", "name": "国家", "width":90},
            {"enable": true, "key": "exceptionTypeLabel", "name": "异常状态", "width":100},
            {"enable": true, "key": "orderPreAlertTime", "name": "订单生成时间", "width":120},
            {"enable": true, "key": "totalWeight", "name": "重量(g)", "width":120},
            {"enable": true, "key": "boxLength", "name": "长（cm）", "width":120},
            {"enable": true, "key": "boxWidth", "name": "宽(cm)", "width":120},
            {"enable": true, "key": "boxHeight", "name": "高(cm)", "width":120},
            {"enable": true, "key": "timeEfficiencyType", "name": "时效类型", "width":120},
            {"enable": true, "key": "bbOperMark", "name": "是否包包直邮", "width":120},
            {"enable": true, "key": "groupServiceOrderCode", "name": "拼团团号", "width":120},
            {"enable": true, "key": "totalOrderActualPrice", "name": "订单货值", "width":120},
            {"enable": true, "key": "operation", "name": "操作", locked: 'right', "width":70}
        ];
        tableColumn = self._renderTableColumns(tableColumn);
        self.setState({tableColumn: tableColumn});
    }

    _renderTableColumns(tableColumns) {
        let self = this;
        tableColumns.forEach((item) => {
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
        return <a  onClick={this.handleDetail.bind(this, record.orderCarriageId)}>详情</a>;
    }

    handleDetail(orderCarriageId){
        _currentPrealertOrderId = orderCarriageId;
        console.log("handleDetail-id:" + orderCarriageId);
        this.refs.detailDialog.onDialogShow(orderCarriageId);
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
            this._queryOrderList();
        });
    }

    // 修改本页大小
    onPageSizeChange(pageSize) {
        let paging = this.state.paging;
        paging.pageSize = pageSize;
        paging.currentPage = 1;
        this.setState(paging, () => {
            this._queryOrderList();
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
                        <Form field={this.field} size="small" direction="hoz" className="search-con"
                            defineSearch
                            getDefineComponent={(component) => {this.setState({defineSearchComponent: component})}}
                            code="service_orderList"
                        >
                            <Row>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="delegationCodeListStr" show required>
                                    <FormItem label="出库委托号" labelTextAlign="right"
                                              {...formItemLayout}>
                                        <Input onKeyDown={this.onEnterSearch} {...transInit('delegationCodeListStr')} style={{width: '100%'}} placeholder='批量查询以空格分隔'/>
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="tbOrderIdListStr" show required>
                                    <FormItem label="交易订单号" labelTextAlign="right" {...formItemLayout}>
                                        <Input onKeyDown={this.onEnterSearch} {...transInit('tbOrderIdListStr')} style={{width: '100%'}} placeholder='批量查询以空格分隔'/>
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="endMailNoListStr" show required>
                                    <FormItem onKeyDown={this.onEnterSearch} label="末端面单号" labelTextAlign="right" {...formItemLayout}>
                                        <Input {...transInit('endMailNoListStr')} style={{width: '100%'}} placeholder='批量查询以空格分隔'/>
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="orderLpListStr" show required>
                                    <FormItem onKeyDown={this.onEnterSearch} label="平台跟踪号" labelTextAlign="right" {...formItemLayout}>
                                        <Input {...transInit('orderLpListStr')} style={{width: '100%'}} placeholder='批量查询以空格分隔'/>
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="name">
                                    <FormItem label="收货人姓名" labelTextAlign="right" {...formItemLayout}>
                                        <Input {...init('name')} style={{width: '100%'}}/>
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="buyerVipCode">
                                    <FormItem label="买家识别码" labelTextAlign="right" {...formItemLayout}>
                                        <Input {...init('buyerVipCode')} style={{width: '100%'}}/>
                                    </FormItem>
                                </Col>

                                <Col fixedSpan={colItemLayout.fixedSpan} key="endCarrierCodeList">
                                    <FormItem label="渠道(可多选)" labelTextAlign="right" {...formItemLayout}>
                                        <Select {...init('endCarrierCodeList')}
                                                mode="multiple"
                                                dataSource={this.state.channelSource}
                                                showSearch
                                                style={{width: '100%'}}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="mobile">
                                    <FormItem label="手机号" {...formItemLayout}>
                                        <Input {...init('mobile')} style={{width: '100%'}}/>
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="orderCarriageStatusList">
                                    <FormItem label="订单状态(可多选)" labelTextAlign="right" {...formItemLayout}>
                                        <Select {...init('orderCarriageStatusList')}
                                                mode="multiple"
                                                dataSource={this.state.orderStatusSource}
                                                showSearch
                                                style={{width: '100%'}}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="exceptionTypeList">
                                    <FormItem label="异常类型(可多选)" labelTextAlign="right" {...formItemLayout}>
                                        <Select {...init('exceptionTypeList')}
                                                mode="multiple"
                                                dataSource={this.state.exceptionTypeSource}
                                                showSearch
                                                style={{width: '100%'}}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="serviceTypeList">
                                    <FormItem label="运输类型(可多选)" labelTextAlign="right" {...formItemLayout}>
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
                                <Col fixedSpan={colItemLayout.fixedSpan} key="orderPreAlertTimeFromStr" show required>
                                    <FormItem label="生成时间起" labelTextAlign="right" {...formItemLayout}>
                                        <DatePicker
                                            defaultValue={startTime}
                                            disabledDate={this.markDisableTime.bind(this,true,"orderPreAlertTimeToStr")}
                                            showTime={{format: 'HH:mm:ss'}}
                                            onChange={this.onTimeChange.bind(this,"orderPreAlertTimeFromStr")}
                                            style={{width: '100%'}}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="orderPreAlertTimeToStr" show required>
                                    <FormItem label="生成时间止" labelTextAlign="right" {...formItemLayout}>
                                        <DatePicker
                                            defaultValue={endTime}
                                            disabledDate={this.markDisableTime.bind(this,false,"orderPreAlertTimeFromStr")}
                                            showTime={{format: 'HH:mm:ss'}}
                                            onChange={this.onTimeChange.bind(this,"orderPreAlertTimeToStr")}
                                            style={{width: '100%'}}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="offShelvesTimeFromStr">
                                    <FormItem label="下架时间起" labelTextAlign="right" {...formItemLayout}>
                                        <DatePicker
                                            disabledDate={this.markDisableTime.bind(this,true,"offShelvesTimeToStr")}
                                            showTime={{format: 'HH:mm'}}
                                            onChange={this.onTimeChange.bind(this,"offShelvesTimeFromStr")}
                                            style={{width: '100%'}}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="offShelvesTimeToStr">
                                    <FormItem label="下架时间止" labelTextAlign="right" {...formItemLayout}>
                                        <DatePicker
                                            disabledDate={this.markDisableTime.bind(this,false,"offShelvesTimeFromStr")}
                                            showTime={{format: 'HH:mm', minuteStep: 15}}
                                            onChange={this.onTimeChange.bind(this,"offShelvesTimeToStr")}
                                            style={{width: '100%'}}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="allotTimeFromStr">
                                    <FormItem label="分拨时间起" labelTextAlign="right" {...formItemLayout}>
                                        <DatePicker
                                            disabledDate={this.markDisableTime.bind(this,true,"allotTimeToStr")}
                                            showTime={{format: 'HH:mm', minuteStep: 15}}
                                            onChange={this.onTimeChange.bind(this,"allotTimeFromStr")}
                                            style={{width: '100%'}}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="allotTimeToStr">
                                    <FormItem label="分拨时间止" labelTextAlign="right" {...formItemLayout}>
                                        <DatePicker
                                            disabledDate={this.markDisableTime.bind(this,false,"allotTimeFromStr")}
                                            showTime={{format: 'HH:mm', minuteStep: 15}}
                                            onChange={this.onTimeChange.bind(this,"allotTimeToStr")}
                                            style={{width: '100%'}}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="printTimeFromStr">
                                    <FormItem label="合箱时间起" labelTextAlign="right" {...formItemLayout}>
                                        <DatePicker
                                            disabledDate={this.markDisableTime.bind(this,true,"printTimeToStr")}
                                            showTime={{format: 'HH:mm', minuteStep: 15}}
                                            onChange={this.onTimeChange.bind(this,"printTimeFromStr")}
                                            style={{width: '100%'}}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="printTimeToStr">
                                    <FormItem label="合箱时间止" labelTextAlign="right" {...formItemLayout}>
                                        <DatePicker
                                            disabledDate={this.markDisableTime.bind(this,false,"printTimeFromStr")}
                                            showTime={{format: 'HH:mm', minuteStep: 15}}
                                            onChange={this.onTimeChange.bind(this,"printTimeToStr")}
                                            style={{width: '100%'}}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="baggingTimeFromStr">
                                    <FormItem label="装袋时间起" labelTextAlign="right" {...formItemLayout}>
                                        <DatePicker
                                            disabledDate={this.markDisableTime.bind(this,true,"baggingTimeToStr")}
                                            showTime={{format: 'HH:mm', minuteStep: 15}}
                                            onChange={this.onTimeChange.bind(this,"baggingTimeFromStr")}
                                            style={{width: '100%'}}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="baggingTimeToStr">
                                    <FormItem label="装袋时间止" labelTextAlign="right" {...formItemLayout}>
                                        <DatePicker
                                            disabledDate={this.markDisableTime.bind(this,false,"baggingTimeFromStr")}
                                            showTime={{format: 'HH:mm', minuteStep: 15}}
                                            onChange={this.onTimeChange.bind(this,"baggingTimeToStr")}
                                            style={{width: '100%'}}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="warOutTimeFromStr">
                                    <FormItem label="出库时间起" labelTextAlign="right" {...formItemLayout}>
                                        <DatePicker
                                            disabledDate={this.markDisableTime.bind(this,true,"warOutTimeToStr")}
                                            showTime={{format: 'HH:mm', minuteStep: 15}}
                                            onChange={this.onTimeChange.bind(this,"warOutTimeFromStr")}
                                            style={{width: '100%'}}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="warOutTimeToStr">
                                    <FormItem label="出库时间止" labelTextAlign="right" {...formItemLayout}>
                                        <DatePicker
                                            disabledDate={this.markDisableTime.bind(this,false,"warOutTimeFromStr")}
                                            showTime={{format: 'HH:mm', minuteStep: 15}}
                                            onChange={this.onTimeChange.bind(this,"warOutTimeToStr")}
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
                                <Col fixedSpan={colItemLayout.fixedSpan} key="reversalReceivingTimeFromStr">
                                    <FormItem label="逆向签收时间起" labelTextAlign="right" 
                                                {...{labelCol: {fixedSpan: 5}, wrapperCol: {fixedSpan: 10}}}>
                                        <DatePicker
                                            disabledDate={this.markDisableTime.bind(this,true,"reversalReceivingTimeToStr")}
                                            showTime={{format: 'HH:mm', minuteStep: 15}}
                                            onChange={this.onTimeChange.bind(this,"reversalReceivingTimeFromStr")}
                                            style={{width: '100%'}}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="reversalReceivingTimeToStr">
                                    <FormItem label="逆向签收时间止" labelTextAlign="right" 
                                                {...{labelCol: {fixedSpan: 5}, wrapperCol: {fixedSpan: 10}}}>
                                        <DatePicker
                                            disabledDate={this.markDisableTime.bind(this,false,"reversalReceivingTimeFromStr")}
                                            showTime={{format: 'HH:mm', minuteStep: 15}}
                                            onChange={this.onTimeChange.bind(this,"reversalReceivingTimeToStr")}
                                            style={{width: '100%'}}
                                        />
                                    </FormItem>
                                </Col>

                            </Row>
                        </Form>
                        <Row>
                                <Col>
                                    
                                    <ExportFile params={() => this._getSearchParams()}>订单导出Excel</ExportFile>
                                    <ExportFile params={() => this._getSearchParams()} message="当前最多支持导出2000条订单关联包裹数据导出" commandKey="serviceOrderPackage">关联包裹导出Excel</ExportFile>
                                    {/* <Button mr="10" onClick={this.handleExport.bind(this)} type="primary">订单数据导出</Button>

                                    <Button mr="10" onClick={this.handlePackageExport.bind(this)} type="primary">关联包裹数据导出</Button> */}

                                    <Button mr="10" onClick={this.handleSearch.bind(this)} type="primary">查 询</Button>
                                    {defineSearchComponent}
                                </Col>
                            </Row>
                      </FormCollapse>
                        <DetailDialog ref="detailDialog"/>

                        {/* <Loading visible={this.state.loadingVisible} size="large" fullScreen="true"/> */}
                            <Table dataSource={tableDataSource} loading={this.state.loadingVisible} primaryKey = "orderCarriageId" className="data-table" rowSelection={rowSelection}>
                                {
                                    tableColumn.map((item, index) => {
                                        return <Table.Column title={item.name} lock={item.locked || false} key={index} dataIndex={item.key} cell={item.cellRender} width={item.width}/>
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
                                    totalRender={ total => `总记录条数: ${paging.totalCount}`}
                                    onChange={this.onPageChange.bind(this)}
                                    onPageSizeChange={this.onPageSizeChange.bind(this)}/>
            </div>
        );
    }
}

export class DetailDialog extends React.Component {
    constructor(props) {
        super(props);
        this.orderField = new Field(this);
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
            packageTableColumn:[],
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
        self.orderField.reset();
        self.logsField.reset();
        self.buyerUserInfo.reset();
        self.sellerUserInfo.reset();
        self.remarkInfoField.reset();
        _currentPrealertOrderId = '';
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
            {"enable": true, "key": "action", "name": "动作", "width":200},
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
        let packageTableColumn = [
            {"enable": true, "key": "mailNo", "name": "包裹运单号", "width":200},
            {"enable": true, "key": "carrierCodeLabel", "name": "物流公司", "width":150},
            {"enable": true, "key": "weight", "name": "包裹实重", "width":100},
            {"enable": true, "key": "packageStatusLabel", "name": "包裹状态", "width":90},
            {"enable": true, "key": "packageExceptionTypeLabel", "name": "异常状态", "width":100},
            {"enable": true, "key": "referOrderId", "name": "订单交易号", "width":200},
            {"enable": true, "key": "itemQuantity", "name": "数量", "width":50},
            {"enable": true, "key": "totalItemActualPrice", "name": "实付金额", "width":150},
            {"enable": true, "key": "currency", "name": "币种", "width":150},
            {"enable": true, "key": "itemCategoryName", "name": "商品分类", "width":300},
        ];
        logTableColumn = self._renderTableColumns(logTableColumn);
        remarkTableColumn = self._renderTableColumns(remarkTableColumn);
        packageTableColumn = self._renderTableColumns(packageTableColumn);
        self.setState({
            logTableColumn: logTableColumn,
            remarkTableColumn: remarkTableColumn,
            packageTableColumn: packageTableColumn
        });
    }

    _renderTableColumns(tableColumns) {
        let self = this;
        tableColumns.forEach((item) => {
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

    _getOrderByDetail(prealertOrderId){
        console.log(("_getOrderByDetail id"+prealertOrderId));
        let self = this;
        self.setState({loadingVisible: true});
        CommonUtil.ajax({
            url: CUSTOMER_API.queryOrderDetail.replace('{prealertOrderId}',prealertOrderId),
            type: 'GET',
        }).then((data) => {
            if (data) {
                console.log(data);
                self._buildData(self.orderField,data.orderCarriage);
                const buyInfo = data.buyerUserInfo
                buyInfo.buyerAddress = `${buyInfo.country || ''}-${buyInfo.province || ''}-${buyInfo.city || ''}-${buyInfo.district || ''}-${buyInfo.streetAddress}`
                self._buildData(self.buyerUserInfo,buyInfo);
                self.setState({
                    logTableDataSource: data.actionLogs == null ? []:data.actionLogs,
                    remarkTableDataSource: data.systemLogList == null ? []: data.systemLogList.map(s => ({...s, uuid: getUuid()})),
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

    onDialogShow(prealertOrderId) {
        let self = this;
        self._getOrderByDetail(prealertOrderId);
        _currentPrealertOrderId= prealertOrderId;
    }

    _saveRemark(prealertOrderId){
        let self = this;
        // let param = self.remarkInfoField.getValues();
        let param = this.remarkForm && this.remarkForm.getData()
        self.setState({loadingVisible: true});
        // console.log(param, 999, prealertOrderId)
        CommonUtil.ajax({
            url: CUSTOMER_API.saveOrderRemark.replace('{prealertOrderId}',prealertOrderId),
            type: 'POST',
            data:param,
        }).then((data) => {
            CommonUtil.alert("保存成功");
            self.remarkInfoField.reset();
            self._getOrderByDetail(prealertOrderId);
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
        const orderInit = this.orderField.init;
        const logsInit = this.logsField.init;
        const buyerUserInfo = this.buyerUserInfo.init;
        const remarkInfo = this.remarkInfoField.init;
        const sellerUserInfo =  this.sellerUserInfo.init;
        const {logTableColumn, logTableDataSource,remarkTableColumn,remarkTableDataSource,packageTableColumn,productTableDataSource} = this.state;
        const getTips = () => {
            const data = this.orderField.getValues()
            const zitiAddress = (data.selfPickupStation ? data.selfPickupStation.address : '无')
            const zitiTime = (data.selfPickupStation ? data.selfPickupStation.businessHours: '无')
            return <div>
                <div>自提点地址：{zitiAddress}</div>
                <div>营业时间：{zitiTime}</div>
            </div>
        }
        return <>
            <Loading visible={this.state.loadingVisible} size="large" fullScreen="true"></Loading>
            <Dialog align="cc cc" title="包裹详情" visible={this.state.visible} isFullScreen="true" onClose={this.onDialogClose.bind(this)} footer={false}>
                
                <div className="page-content pam-wrap">
                            <Card contentHeight='400px' title="订单信息" style={{height:'250px',overflow:'auto'}}>
                                <Row>
                                    <Form field={this.orderField} size="small" direction="hoz">
                                        <Row className="condition-main">
                                            <Col fixedSpan={16}>
                                                <FormItem label="出库委托号" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...orderInit('delegateNo')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="订单状态" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...orderInit('orderCarriageStatusLabel')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="异常状态" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...orderInit('exceptionTypeLabel')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={16}>
                                                <FormItem label="交易订单号" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...orderInit('referOrderId')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="平台跟踪号" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...orderInit('referLogisticsOrderCode')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="内部跟踪号" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...orderInit('fpxTrackingNo')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={16}>
                                                <FormItem label="订单计费重" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...orderInit('payableWeight')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="订单实重" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...orderInit('orderActualWeight')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="订单体积重" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...orderInit('volumeWelght')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={16}>
                                                <FormItem label="订单支付费用" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...orderInit('shippingFee')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="订单附加费用" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...orderInit('orderSurcharge')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="平台类型" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...orderInit('sourceLabel')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={16}>
                                                <FormItem label="渠道名称" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...orderInit('endCarrierLabel')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="服务类型" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...orderInit('deliveryTypeLabel')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="末端面单号" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...orderInit('endMailNo')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={16}>
                                                <FormItem label="派送区域类型" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...orderInit('deliveryAreaType')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="运输类型" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...orderInit('carrierTypeLabel')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="自提点名称" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...orderInit('deliveryAreaType')} detail disabled={true} style={{width: '100%'}}/>
                                                    <OverTips showTips trigger={<Button ml="10" text type="primary">详情</Button>}>
                                                        {getTips()}
                                                    </OverTips>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={16}>
                                                <FormItem label="干线运输物流单号" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...orderInit('referLineLogisticsOrderCode')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="特殊包裹" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 8}
                                                          }}>
                                                    <Input {...orderInit('specialParcelSign')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Row>
                            </Card>

                            <Card title="收件人信息">
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
                                                    <Input {...buyerUserInfo('phone')} detail disabled={true} style={{width: '100%'}}/>
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
                                                <FormItem label="地址信息" labelTextAlign="right"
                                                          {...{
                                                              labelCol: {fixedSpan: 6},
                                                              wrapperCol: {fixedSpan: 6}
                                                          }}>
                                                    <Input {...buyerUserInfo('buyerAddress')} detail disabled={true} style={{width: '100%'}}/>
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
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

                            <Card title="关联包裹信息">
                                    <Table dataSource={productTableDataSource} fixedHeader={false} className="data-table">
                                        {
                                            packageTableColumn.map((item, index) => {
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
                                    <Table primaryKey="uuid" dataSource={remarkTableDataSource} fixedHeader={false} sort={this.state.sorts} className="data-table">
                                        {
                                            remarkTableColumn.map((item, index) => {
                                                return <Table.Column title={item.name} key={index} dataIndex={item.key} cell={item.cellRender} width={item.width}/>
                                            })
                                        }
                                    </Table>
                            </Card>

                            <Card title="备注">
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
                                <Button mt="10" mb="10" onClick={this._saveRemark.bind(this,_currentPrealertOrderId)} type="primary">保存备注</Button>
                                </Card.Content>
                            </Card>
                </div>
            </Dialog>
        </>

    }
}
ListQuery.title="订单查询"
export default  ListQuery
