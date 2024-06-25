import React from "react";
import {
    Table,
    Input,
    Form,
    Select,
    Field,
    Button,
    Grid,
    Dialog,
    Pagination,
    Loading,
    Radio,
    Message,
    Upload,
    NumberPicker,
    FormCollapse
} from '@/component';

import CommonUtil from 'commonPath/common.js';
import API from 'commonPath/api';
import AForm from '@/component/AForm'
import ASelect from '@/component/ASelect'
import ExportFile from "@/component/ExportFile/index";
import $http from 'assets/js/ajax'
import { isTrue, isEmpty } from 'assets/js'
import { getStepBaseData, setStepBaseData, saveStepNode, InitDefaultData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';

// 分拨墙配置管理页面

const { Row, Col } = Grid;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const formItemLayout = {
    labelCol: {
        span: 0
    },
    wrapperCol: {
        span: 14
    }
};

const uploadFormItemLayout = {
    labelCol: {fixedSpan: 5},
    wrapperCol: {fixedSpan: 9}
};

let warehouseShortNameList = [];
const batchHandle = "batchHandle";
let operation = "";
let dialogTitle = "";

let sortingWallSpecsList = null;
let wallTypeList = [
    {label: "人工分拨墙", value: '0'},
    {label: "PTL分拨墙", value: '1'},
    {label: "双面灯PTL分拨墙", value: '2'},
    {label: "入库分拨墙", value: '3'},
    {label: "边拣边分分拨墙", value: '4'},
    {label: "软PTL播种墙", value: '5'},
    {label: "闪电播分拨墙", value: '6'},
    {label: "尾包集分分拨墙", value: '7'},
]

class SortingWallSlotDialog extends React.Component {
    enableStatusSource = [
        {
            value: 1,
            label: '启用',
        },
        {
            value: 0,
            label: '禁用',
        }
    ]


    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            visible: false,               // 是否显示
            shouldUpdatePosition: true,   // 更新位置
            currentSortingWall: {},       // 当前选择的分拨墙
            enableStatus: 0,
        }
        this.field = new Field(this, { scrollToFirstError: true });
    }

    onDialogShow() {
        this.field.reset();
        this.field.setValue("warehouseId", this.state.currentSortingWall.warehouseId);
        this.field.setValue("sortingWallId", this.state.currentSortingWall.sortingWallId);
        this.field.setValue("sortingWallCode", this.state.currentSortingWall.sortingWallCode);
        this.field.setValue("slotCode", "");
        this.field.setValue("enableStatus", this.state.enableStatus);
        this.field.setValue("volume","")
        this.setState({
            visible: true
        });
    }

    onDialogClose() {
        this.setState({
            visible: false
        });
    }

    onSubmit() {
        let self = this;
        self.field.validate((errors, values) => {

            if (errors != null) {
                CommonUtil.alert(errors[Object.keys(errors)[0]].errors[0]);
                return;
            }
            let params = self.field.getValues();
            let [from, to] = params.slotCode.split('-');
            console.log(JSON.stringify({ from, to }));
            if (!from) {
                CommonUtil.alert('起始格口不能为空');
                return;
            }
            if (!to) {
                to = from;
            }
            [from, to] = [parseInt(from), parseInt(to)];
            if (from > to) {
                CommonUtil.alert('首格口号不能大于尾格口号');
                return;
            }
            self._createSlotCode(params, parseInt(from), parseInt(to));
        });
    }

    /**
     * 创建分拨墙格口
     * @param {*} sortingWallId 
     * @param {*} params 
     * @param {*} progress 从 1 开始
     * @param {*} total 
     */
    _createSlotCode(params, progress, total) {
        self = this;
        if (progress > total) {
            CommonUtil.alert("新增分拨墙格口成功", "提示信息", () => {
                setTimeout(() => {
                    self.onDialogClose();
                    self.props.onOkCallback();
                }, 10)
            });
            return;
        }

        params.slotCode = progress

        CommonUtil.ajax({
            url: API.createSortingWallSlot.replace("{sortingWallId}", params.sortingWallId),
            type: 'POST',
            data: params
        }).then((data) => {
            if (data) {
                self.setState({
                    title: `${progress} 已创建`
                })
                self._createSlotCode(params, progress + 1, total);
            }
        }, (error) => {
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("新增分拨墙格口失败, " + error.errMsg);
            } else {
                CommonUtil.alert("新增分拨墙格口失败");
            }
        })
    }

    onSlotCodeChange(value) {
        this.field.setValue("slotCode", value);
    }

    onVolumeChange(value) {
        this.field.setValue("volume", value);
    }

    onEnableStatusChange(value) {
        this.field.setValue("enableStatus", value)
        this.setState({ enableStatus: value })
    }

    onSlotPriorityChange(value) {
        this.field.setValue("priority", value);
    }

    render() {
        const init = this.field.init;
        return (
            <Dialog visible={this.state.visible}
                onClose={this.onDialogClose.bind(this)}
                onCancel={this.onDialogClose.bind(this)}
                onOk={this.onSubmit.bind(this)}
                title={this.state.title}>
                <Form field={this.field} size="small" direction="hoz" className="pcs-search-form">
                    <Row>
                        <Col fixedSpan="20">
                            <FormItem label="分拨墙编号" labelTextAlign="right"
                                {...{ wrapperCol: { fixedSpan: 14 } }}>
                                <Input
                                    {...init('sortingWallCode', {})}
                                    trim hasClear
                                    disabled={true}
                                    style={{ width: '100%' }} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col fixedSpan="20">
                            <FormItem label="格口编号" labelTextAlign="right"
                                {...{ wrapperCol: { fixedSpan: 14 } }}>
                                <Input
                                    {...init('slotCode', {
                                        rules: {
                                            required: true,
                                            message: '格口编号为必填项',
                                            trigger: ['onBlur', 'onChange']
                                        },
                                        props: {
                                            onChange: this.onSlotCodeChange.bind(this)
                                        }
                                    })}
                                    trim hasClear
                                    maxLength={60}
                                    placeholder="格式：1-30 或 1"
                                    style={{ width: '100%' }} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col fixedSpan="20">
                            <FormItem label="格口体积" labelTextAlign="right"
                                      {...{ wrapperCol: { fixedSpan: 14 } }}>
                                <Input
                                    {...init('volume', {
/*                                        rules: {
                                            required: false,
                                            message: '格口体积为必填项',
                                            trigger: ['onBlur', 'onChange']
                                        },*/
                                        props: {
                                            onChange: this.onVolumeChange.bind(this)
                                        }
                                    })}
                                    trim hasClear
                                    maxLength={60}
                                    /*placeholder="格式：[1-30] 或 1"*/
                                    style={{ width: '100%' }} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col fixedSpan="20">
                            <FormItem label="格口优先级" labelTextAlign="right"
                                      {...{ wrapperCol: { fixedSpan: 14 } }}>
                                <Input
                                    {...init('priority', {
                                        rules: {
                                            required: true,
                                            message: '格口优先级为必填项',
                                            trigger: ['onBlur', 'onChange']
                                        },
                                        props: {
                                            onChange: this.onSlotPriorityChange.bind(this)
                                        }
                                    })}
                                    trim hasClear
                                    maxLength={60}
                                    placeholder="格式：大于0的正整数"
                                    style={{ width: '100%' }} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col fixedSpan="20">
                            <FormItem label="是否启用" labelTextAlign="right"
                                {...{ wrapperCol: { fixedSpan: 14 } }}>
                                <RadioGroup 
                                    onChange={this.onEnableStatusChange.bind(this)}
                                    value={this.state.enableStatus}
                                    dataSource={this.enableStatusSource}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Dialog>
        );
    }
}

class SortingWallSlotQuery extends React.Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            visible: false,               // 是否显示
            shouldUpdatePosition: true,   // 更新位置
            tableColumns: [],             // 表格列

            currentSortingWall: {},       // 当前选择的分拨墙
            sortingWallSlotSource: [],    // 分拨墙格口列表
        }
        this.field = new Field(this, { scrollToFirstError: true });
    }

    onDialogShow() {
        this.field.reset();
        this.field.setValue("warehouseId", this.state.currentSortingWall.warehouseId);
        this.field.setValue("sortingWallId", this.state.currentSortingWall.sortingWallId);
        this.field.setValue("sortingWallCode", this.state.currentSortingWall.sortingWallCode);

        let tableColumns = [
            { "enable": true, "key": "slotCode", "name": "格口编号", "width": 100 },
            { "enable": true, "key": "priority", "name": "格口优先级", "width": 100 },
            { "enable": true, "key": "enableStatusName", "name": "格口状态", "width": 100 },
            { "enable": true, "key": "lastModifiedByName", "name": "最后修改人", "width": 100 },
            { "enable": true, "key": "lastModifiedTime", "name": "最后修改时间", "width": 170 },
            { "enable": true, "key": "operation", "name": "操作", "width": 100 }
        ];

        tableColumns = this._renderTableColumns(tableColumns);
        this.setState({ tableColumns: tableColumns });

        this._loadSlotList();
    }

    onDialogClose() {
        this.setState({
            visible: false
        });
        this.props.onCloseCallback();
    }

    // 操作列
    _renderCellByOperation(value, index, record, context) {
        return <div className="operation-div">
            <a  onClick={this._enableSelectedSlotWithConfirmation.bind(this, index, record)}>启用</a>
            <a  onClick={this._disableSelectedSlotWithConfirmation.bind(this, index, record)}>禁用</a></div>;
    }

    // 常规列
    _renderCellByNormal(value, index, record, context) {
        if (value || value === 0) {
            return <span>{value}</span>;
        } else {
            return <span>-</span>;
        }
    }

    // 表格绑定事件
    _renderTableColumns(tableColumns) {
        let self = this;
        tableColumns.forEach((item) => {
            switch (item.key) {
                case 'operation':
                    item.cellRender = self._renderCellByOperation.bind(self);
                    break;
                default:
                    item.cellRender = self._renderCellByNormal.bind(self);
                    break;
            }
        });
        return tableColumns;
    }

    // 加载格口列表
    _loadSlotList() {
        let self = this;

        self.setState({ loadingVisible: true });
        CommonUtil.ajax({
            url: API.getSortingWallSlots.replace("{sortingWallId}", self.state.currentSortingWall.sortingWallId),
            type: 'GET',
            data: {}
        }).then((data) => {
            self.setState({ loadingVisible: false });
            if (data) {
                self.setState({
                    sortingWallSlotSource: data.data ? data.data : [],
                    visible: true,
                });
            } else {
                self.setState({
                    sortingWallSlotSource: [],
                    visible: true,
                });
            }
        }, (error) => {
            self.setState({ loadingVisible: false });
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("加载格口列表失败, " + error.errMsg);
            } else {
                CommonUtil.alert("加载格口列表失败");
            }
        })
    }

    // 新增分拨墙格口
    _createSlot() {
        this.refs.sortingWallSlotDialog.setState({
            title: "新增格口",
            currentSortingWall: this.state.currentSortingWall,
        }, () => {
            this.refs.sortingWallSlotDialog.onDialogShow();
        });
    }

    // 启用分拨墙格口
    _enableSelectedSlotWithConfirmation(index, record) {
        let confirmDialogTitle = "启用分拨墙格口";
        let confirmDialogContent = "确认启用分拨墙格口 [" + record.slotCode + "] 吗？";
        Dialog.confirm({
            title: confirmDialogTitle,
            content: confirmDialogContent,
            onOk: () => {
                this._enableSelectedSlot(record);
            }
        });
    }

    // 启用分拨墙格口已经过用户确认
    _enableSelectedSlot(record) {
        let self = this;
        this.setState({ loadingVisible: true });
        CommonUtil.ajax({
            url: API.enableSortingWallSlot.replace("{sortingWallId}", record.sortingWallId).replace("{slotId}", record.slotId),
            type: 'POST',
            data: { slotId: record.slotId, sortingWallId: record.sortingWallId }
        }).then((data) => {
            this.setState({ loadingVisible: false });
            if (data) {
                CommonUtil.alert("启用分拨墙格口成功");
                self._loadSlotList();
            }
        }, (error) => {
            this.setState({ loadingVisible: false });
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("启用分拨墙格口失败, " + error.errMsg);
            } else {
                CommonUtil.alert("启用分拨墙格口失败");
            }
        })
    }

    // 禁用分拨墙格口
    _disableSelectedSlotWithConfirmation(index, record) {
        let confirmDialogTitle = "禁用分拨墙格口";
        let confirmDialogContent = "确认禁用分拨墙格口 [" + record.slotCode + "] 吗？";
        Dialog.confirm({
            title: confirmDialogTitle,
            content: confirmDialogContent,
            onOk: () => {
                this._disableSelectedSlot(record);
            }
        });
    }

    // 禁用分拨墙格口已经过用户确认
    _disableSelectedSlot(record) {
        let self = this;
        this.setState({ loadingVisible: true });
        CommonUtil.ajax({
            url: API.disableSortingWallSlot.replace("{sortingWallId}", record.sortingWallId).replace("{slotId}", record.slotId),
            type: 'POST',
            data: { slotId: record.slotId, sortingWallId: record.sortingWallId }
        }).then((data) => {
            this.setState({ loadingVisible: false });
            if (data) {
                CommonUtil.alert("禁用分拨墙格口成功");
                self._loadSlotList();
            }
        }, (error) => {
            this.setState({ loadingVisible: false });
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("禁用分拨墙格口失败, " + error.errMsg);
            } else {
                CommonUtil.alert("禁用分拨墙格口失败");
            }
        })
    }

    render() {
        const { sortingWallSlotSource, tableColumns } = this.state;
        const init = this.field.init;
        return (
            <Dialog visible={this.state.visible}
                footer={<Button type="normal" onClick={this.onDialogClose.bind(this)}>关闭</Button>}
                onClose={this.onDialogClose.bind(this)}
                onCancel={this.onDialogClose.bind(this)}
                title={this.state.title}>
                <div className="page-content pcs-page-content">
                    <Form field={this.field} size="small" direction="hoz" className="pcs-search-form">
                        <Row>
                            <Col fixedSpan="20">
                                <FormItem label="分拨墙编号"
                                    labelTextAlign="right"
                                    {...{ wrapperCol: { fixedSpan: 14 } }}>
                                    <Input {...init('sortingWallCode', {})}
                                        disabled={true}
                                        style={{ width: '100%' }} />
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <Row className="pcs-add-button">
                        <Col fixedSpan="6">
                            <Button type="primary" onClick={this._createSlot.bind(this)}>新增格口</Button>
                        </Col>
                    </Row>
                    <SortingWallSlotDialog ref="sortingWallSlotDialog"
                        onOkCallback={this._loadSlotList.bind(this)} />
                    <Table dataSource={sortingWallSlotSource} className="pcs-data-table-slots">
                        {
                            tableColumns.map((item, index) => {
                                if (item.key == 'operation') {
                                    return <Table.Column title={item.name} dataIndex={item.key} key={index} 
                                        cell={item.cellRender} width={item.width} lock="right" />
                                } else {
                                    return <Table.Column title={item.name} dataIndex={item.key} key={index} 
                                        cell={item.cellRender} width={item.width} />
                                }
                            })
                        }
                    </Table>
                </div>
            </Dialog>
        );
    }
}

class BatchSortingWallDialog extends React.Component {
    wallCodes = '';
    failedWallCodeList = [];

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            warehouseName: '',
            warehouseId: '',
            wallCodes: '',
            wallType: '',
            message: '',
            wallSpecs: '',
        }
    }

    onDialogShow() {
        this.setState({ 
            message: '', 
            visible: true 
        });
    }

    onDialogClose() {
        this.setState({ visible: false });
    }

    onSubmit() {
        const wallCodeList = this.wallCodes.trim().split('\n');
        if (!wallCodeList || wallCodeList.length == 0) {
            CommonUtil.alert('请检查墙号格式');
            return;
        }
        const {warehouseId} = this.state;
        const sortingWallType = this.wallType;
        const sortingWallSpecs = this.wallSpecs;
        if (! sortingWallType){
            CommonUtil.alert('请选择分拨墙类型');
            return;
        }
        this._requestCreateSortingWall(warehouseId, wallCodeList, sortingWallType, sortingWallSpecs);
    }

    _requestCreateSortingWall(warehouseId, wallCodeList, sortingWallType, sortingWallSpecs) {
        if (wallCodeList.length === 0) {
            Message.success('批量创建成功');
            this.onDialogClose();
            this.props.onOkCallback();
            saveStepNode(150)
            return;
        }
        console.log('request...');
        console.log(wallCodeList);
        console.log(sortingWallType);
        const sortingWallCode = wallCodeList[0];
        CommonUtil.ajax({
            url: API.createWarehouseSortingWall.replace("{warehouseId}", warehouseId),
            type: 'POST',
            data: {
                sortingWallCode,
                sortingWallType,
                warehouseId,
                sortingWallSpecs
            }
        }).then((data) => {
          saveStepNode(150)
            wallCodeList.shift();
            this.setState({message: `${sortingWallCode}创建成功`});
            this._requestCreateSortingWall(warehouseId, wallCodeList, sortingWallType, sortingWallSpecs);
        }, (error) => {
            // 如果有错误，直接中断
            if (!!error && !!error.errMsg) {
                CommonUtil.alert(error.errMsg);
            }
            this.props.onOkCallback();
        })  
    }

    onWallCodesChange(value) {
        this.wallCodes = value;
    }

    onWallTypeChange(value) {
        this.wallType = value;
    }

    render() {
        return (
            <Dialog visible={this.state.visible}
                onClose={this.onDialogClose.bind(this)}
                onCancel={this.onDialogClose.bind(this)}
                onOk={this.onSubmit.bind(this)}
                title={'批量创建分拨墙'}>
                    <div>{this.state.message}</div>
                    <row>
                        <Col fixedSpan="20">
                            分拨墙类型:  
                            <Select
                                id="wallType"
                                maxLength={250}
                                placeholder="请选择分拨墙类型"
                                style={{ width: '60%',marginLeft: 10 }}
                                onChange={this.onWallTypeChange.bind(this)}
                                dataSource={wallTypeList}
                            ></Select>
                        </Col>
                    </row>
                    <br />
                    <row>
                    <Input.TextArea 
                        style={{width: '100%', height: '100%'}}
                        rows={20}
                        onChange={this.onWallCodesChange.bind(this)}
                        placeholder="请输入分拨墙编码，一行一个"/>
                    </row>
            </Dialog>
        )
    }
}

class SortingWallDialog extends React.Component {

    // 构造函数
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            wallGrid: 0, // 规格
            visible: false,               // 是否显示
            shouldUpdatePosition: true,   // 更新位置

            currentOperation: "",         // 当前操作
            currentSortingWall: {},       // 当前选择的分拨墙

            warehouseSource: [],          // 仓列表
            warehouseNameDisabled: false, // 是否允许修改仓
            warehouseNameValue: "",       // 仓ID

            sortingWallCodeDisabled: false, // 是否允许修改分拨墙边编号

            sortingWallCode: '',
            sortingWallId: '',
            //分拨墙类型设置
            sortingWallType: '',
            sortingWallTypeList: wallTypeList
        }
        this.field = new Field(this, { scrollToFirstError: true });
    }

    onDialogShow() {
        const wallData = this.state.currentSortingWall
        const rows = (wallData.rows || 0)
        const cols = (wallData.cols || 0)
        this.field.reset();
        const extend = wallData.expand && wallData.expand.split(';') || []
        const extendData = {}
        extend.forEach(e => {
            const [key, val] = e && e.split(':') || [];
            key && (extendData[key] = val)
        })

        this.field.setValue("warehouseId", getStepBaseData().warehouseId);
        this.field.setValue("warehouseName", getStepBaseData().warehouseName);
        this.field.setValue("sortingWallType", this.state.sortingWallType);
        this.field.setValue("sortingWallCode", this.state.sortingWallCode);
        this.field.setValue("sortingWallId", this.state.sortingWallId);
        this.field.setValue("sortingWallSpecs", this.state.sortingWallSpecs)
        this.field.setValue('relevanceCodeId', extendData.relevanceCodeId)
        this.field.setValue('slotTimeout', extendData.slotTimeout)
        this.field.setValue('rows', rows)
        this.field.setValue('cols', cols)
        this.setState({ visible: true });
        this.setState({ visible: true, wallGrid:  rows * cols});
    }

    onDialogClose() {
        this.setState({
            visible: false
        });
    }

    async onSubmit() {
        let self = this;
        if (self.state.currentOperation === "create") {
            self.field.validate((errors, values) => {
                if (errors != null) {
                    // CommonUtil.alert(errors[Object.keys(errors)[0]].errors[0]);
                    return;
                }

                let data = {...self.field.getValues()};
                const expand = {
                    relevanceCodeId:data.relevanceCodeId,
                    slotTimeout:data.slotTimeout
                }
                data.expand = ''
                Object.entries(expand).forEach(([key,val]) => {
                    if (isTrue(val)) {
                        data.expand += `${key}:${val};`
                    }
                })
                delete data.relevanceCodeId
                delete data.slotTimeout
                this.setState({
                    loading: true
                })
                CommonUtil.ajax({
                    url: API.createWarehouseSortingWall.replace("{warehouseId}", self.field.getValue("warehouseId")),
                    type: 'POST',
                    data: data
                }).then((data) => {
                    if (data) {
                        saveStepNode(150)
                        CommonUtil.alert("新增分拨墙成功", "提示信息", () => {
                            setTimeout(() => {
                                self.onDialogClose();
                                self.props.onOkCallback();
                                this.setState({
                                    wallGrid: 0,
                                })
                            }, 10)
                        });
                    } else {
                        CommonUtil.alert("新增分拨墙失败");
                    }
                }, (error) => {
                    if (error && typeof error.errMsg !== 'undefined') {
                        CommonUtil.alert("新增分拨墙失败, " + error.errMsg);
                    } else {
                        CommonUtil.alert("新增分拨墙失败");
                    }
                }).finally(() => {
                    this.setState({
                        loading:false
                    })
                })
            })
        } else if (self.state.currentOperation === "modify") {
            self.field.validate((errors, values) => {
                if (errors != null) {
                    // CommonUtil.alert(errors[Object.keys(errors)[0]].errors[0]);
                    return;
                }
                this.setState({
                    loading: true
                })
                // let data = self.field.getValues();
                let data = {...self.field.getValues()};
                const expand = {
                    relevanceCodeId:data.relevanceCodeId,
                    slotTimeout:data.slotTimeout
                }
                data.expand = ''
                Object.entries(expand).forEach(([key,val]) => {
                    if (isTrue(val)) {
                        data.expand += `${key}:${val};`
                    }
                })
                delete data.relevanceCodeId
                delete data.slotTimeout
                CommonUtil.ajax({
                    url: API.modifyWarehouseSortingWall.replace("{warehouseId}", self.field.getValue("warehouseId")).replace("{sortingWallId}", self.field.getValue("sortingWallId")),
                    type: 'POST',
                    data: data
                }).then((data) => {
                    if (data) {
                        saveStepNode(150)
                        CommonUtil.alert("修改分拨墙成功", "提示信息", () => {
                            setTimeout(() => {
                                self.onDialogClose();
                                self.props.onOkCallback();
                                this.setState({
                                    wallGrid: 0,
                                })
                            }, 10)
                        });
                    } else {
                        CommonUtil.alert("修改分拨墙失败");
                    }
                }, (error) => {
                    if (error && typeof error.errMsg !== 'undefined') {
                        CommonUtil.alert("修改分拨墙失败, " + error.errMsg);
                    } else {
                        CommonUtil.alert("修改分拨墙失败");
                    }
                }).finally(() => {
                    this.setState({
                        loading:false
                    })
                })
            })
        }
    }

    onWarehouseNameChange(value) {
        this.field.setValue("warehouseId", value);
        this.state.warehouseNameValue = value;
    }

    onSortingWallCodeChange(value) {
        this.field.setValue("sortingWallCode", value);
        this.state.currentSortingWall.sortingWallCode = value;
    }

    onSortingWallTypeChange(value) {
        this.field.setValue("sortingWallType", value);
        this.state.currentSortingWall.sortingWallType = value;
    }

    onSortingWallGridChange(value) {
        this.field.setValue("sortingWallGrid", value);
        this.state.currentSortingWall.sortingWallGrid = value;
    }

    onSortingWallSpecsChange(value) {
        this.field.setValue("sortingWallSpecs", value);
        this.state.currentSortingWall.sortingWallSpecs = value;
    }

    render() {
        const init = this.field.init;
        return (
            <Dialog visible={this.state.visible}
                onClose={this.onDialogClose.bind(this)}
                onCancel={this.onDialogClose.bind(this)}
                okProps={{loading: this.state.loading}}
                onOk={this.onSubmit.bind(this)}
                style={{width: 650}}
                title={this.state.title}>
                <Form field={this.field} size="small" direction="hoz" className="pcs-search-form">
                    <Row>
                        <Col fixedSpan="15">
                            <FormItem label="选择仓库" labelTextAlign="right"
                                {...{ wrapperCol: { fixedSpan: 14 } }}>
                                <Input name="warehouseName" disabled style={{ width: '100%' }} />
                            </FormItem>
                        </Col>
                        <Col fixedSpan="15">
                            <FormItem label="分拨墙编号" labelTextAlign="right"
                                {...{ wrapperCol: { fixedSpan: 14 } }}>
                                <Input
                                    {...init('sortingWallCode', {
                                        rules: {
                                            required: true,
                                            message: '分拨墙编号为必填项',
                                            trigger: ['onBlur', 'onChange']
                                        },
                                        props: {
                                            onChange: this.onSortingWallCodeChange.bind(this)
                                        }
                                    })}
                                    trim hasClear
                                    maxLength={255}
                                    placeholder="请输入分拨墙编号"
                                    style={{ width: '100%' }} />
                            </FormItem>
                        </Col>
                        <Col fixedSpan="15">
                            <FormItem label="分拨墙类型" labelTextAlign="right"
                                      {...{ wrapperCol: { fixedSpan: 14 } }}>
                                <Select
                                    {...init('sortingWallType', {
                                        rules: {
                                            required: true,
                                            message: '分拨墙类型为必填项',
                                            trigger: ['onBlur', 'onChange']
                                        },
                                        props: {
                                            onChange: this.onSortingWallTypeChange.bind(this)
                                        }
                                    })}
                                    showSearch hasClear dataSource={this.state.sortingWallTypeList}
                                    maxLength={255}
                                    placeholder="请选择分拨墙类型"
                                    style={{ width: '100%' }} />
                            </FormItem>
                        </Col>
                    {this.field.getValue('sortingWallType') == '6' && 
                        <Col fixedSpan="15">
                            <FormItem label="关联分播墙" required requiredMessage="必填" labelTextAlign="right"
                                      {...{ wrapperCol: { fixedSpan: 14 } }}>
                                <ASelect
                                    name="relevanceCodeId"
                                    showSearch hasClear
                                    field={this.field}
                                    watchKey="warehouseId,sortingWallType"
                                    getOptions={async() => {
                                        const warehouseId = this.field.getValue('warehouseId')
                                        const sortingWallType = this.field.getValue('sortingWallType')
                                        const sortingWallId = this.field.getValue('sortingWallId')
                                        try {
                                            const res = await $http({
                                                url: `/sys/warehouses/${warehouseId}/sorting-walls/wallcode`,
                                                method: 'post',
                                                data: {
                                                    warehouseId,
                                                    sortingWallType,
                                                    sortingWallId
                                                }
                                            })
                                            return res && Object.entries(res).map(([key, val]) => ({label: val, value: key})) || []
                                        } catch(e) {
                                            return []
                                        }
                                    }}
                                    placeholder="请选择关联分播墙"
                                    style={{ width: '100%' }} />
                            </FormItem>
                        </Col>
                    || null}
                        <Col fixedSpan="15">
                            <FormItem label="超时预警时间（分钟）" required requiredMessage="必填" labelTextAlign="right"
                                      {...{ wrapperCol: { fixedSpan: 14 } }}>
                                <NumberPicker
                                    name="slotTimeout"
                                    min="1"
                                    max='10'
                                    placeholder="请输入1-10之间的整数"
                                    style={{ width: '100%' }} />
                            </FormItem>
                        </Col>
                        <Col fixedSpan="15">
                            <FormItem label="播种墙规格" labelTextAlign="right"
                                      {...{ wrapperCol: { fixedSpan: 14 } }}>
                                <Select
                                    {...init('sortingWallSpecs', {
                                        /*rules: {
                                            required: false,
                                            message: '播种墙规格为必填项',
                                            trigger: ['onBlur', 'onChange']
                                        },*/
                                        props: {
                                            onChange: this.onSortingWallSpecsChange.bind(this)
                                        }
                                    })}
                                    showSearch hasClear dataSource={sortingWallSpecsList}
                                    maxLength={255}
                                    /*placeholder="请选择播种墙规格"*/
                                    style={{ width: '100%' }} />
                            </FormItem>
                        </Col>
                        <Col fixedSpan="15">
                            <FormItem label="规格" labelTextAlign="right"
                                      {...{ wrapperCol: { fixedSpan: 14 } }}>
                                <Input style={{width: '80px', marginRight: '10px'}}
                                    {...init('rows', {
                                        props: {
                                            onChange: (val) => {
                                               this.setState({
                                                    wallGrid: val * (this.field.getValues().cols || 0)
                                               })
                                            }
                                        }
                                    })}
                                ></Input>
                                      x
                                <Input style={{width: '80px', margin: '0 10px'}}
                                    {...init('cols', {
                                        props: {
                                            onChange: (val) => {
                                                this.setState({
                                                     wallGrid: val * (this.field.getValues().rows || 0)
                                                })
                                            }
                                        }
                                    })}
                                ></Input>
                                      =
                                <span style={{marginLeft: '10px'}}>{this.state.wallGrid}</span>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Dialog>
        );
    }
}

/**
 * 查询页面
 */
class SortingWallQuery extends React.Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            loadingVisible: false,
            warehouseSource: [],             // 仓库列表
            sortingWallSource: [],           // 分拨墙列表
            tableColumns: [],                // 表格列
            paging: {                        // 分页
                currentPage: 1,
                pageSize: window._pageSize_,
                totalRowCount: 0           // 总数据行数
            },
            selectedRow: [],
            batchTypeLoading: false
        }
        this.field = new Field(this);
        this.searchForm = {}
        this.batchTypeRef = {}
        // this.field.setValue("warehouseId", this.getWid());
    }

    // 渲染前触发一次
    componentWillMount() {
        let self = this;

        let tableColumns = [
            { "enable": true, "key": "warehouseId", "name": "仓库ID", "width": 100 },
            { "enable": true, "key": "warehouseName", "name": "仓库名称", "width": 200 },
            { "enable": true, "key": "sortingWallType", "name": "分拨墙类型", "width": 100 },
            { "enable": true, "key": "sortingWallSpecs", "name": "分拨墙规格", "width": 100 },
            { "enable": true, "key": "sortingWallCode", "name": "分拨墙编号", "width": 100 },
            { "enable": true, "key": "enableStatusName", "name": "分拨墙状态", "width": 100 },
            { "enable": true, "key": "slotCount", "name": "格口数量", "width": 100 },
            { "enable": true, "key": "lastModifiedByName", "name": "最后修改人", "width": 100 },
            { "enable": true, "key": "lastModifiedTime", "name": "最后修改时间", "width": 170 },
            { "enable": true, "key": "operation", "name": "操作", "width": 250 }
        ];

        tableColumns = self._renderTableColumns(tableColumns);
        self.setState({ tableColumns: tableColumns });

        CommonUtil.ajax({
            url: API.getWallSpecs,
            type: 'GET'
        }).then((data) => {
            if (data) {
                sortingWallSpecsList = [];
                data.forEach((item) => {
                    sortingWallSpecsList.push({
                        "label": item.description,
                        "value": item.code
                    });
                })
            }
        });
    }

    // 绑定后触发一次
    componentDidMount() {
        // this.field.setValue("warehouseId", this.getWid());
        // this._loadWarehouseList();
        this._searchSortingWallList();
    }

    refresh() {
      this._searchSortingWallList();
    }

    // 操作列
    _renderCellByOperation(value, index, record, context) {
        return <div className="operation-div">
            <a  onClick={this._manageSortingWallSlots.bind(this, index, record)}>格口维护</a>
            <a  onClick={this._enableSelectedSortingWallWithConfirmation.bind(this, index, record)}>启用</a>
            <a  onClick={this._disableSelectedSortingWallWithConfirmation.bind(this, index, record)}>禁用</a>
            <a  onClick={this._modifySelectedSortingWall.bind(this, index, record)}>修改</a>
            <a  onClick={this._deleteSelectedSortingWallWithConfirmation.bind(this, index, record)}>删除</a></div>;
    }

    // 常规列
    _renderCellByNormal(value, index, record, context) {
        if (value || value === 0) {
            return <span>{value}</span>;
        } else {
            return <span>-</span>;
        }
    }

    // 表格绑定事件
    _renderTableColumns(tableColumns) {
        let self = this;
        tableColumns.forEach((item) => {
            switch (item.key) {
                case 'operation':
                    item.cellRender = self._renderCellByOperation.bind(self);
                    break;
                case 'sortingWallType':
                    item.cellRender = self._renderCellBysortingWallType.bind(self);
                    break;
                case 'sortingWallSpecs':
                    item.cellRender = self._renderSortingWallSpecs.bind(self);
                    break;
                default:
                    item.cellRender = self._renderCellByNormal.bind(self);
                    break;
            }
        });
        return tableColumns;
    }

    _renderCellBysortingWallType(value, index, record, context) {
        return (wallTypeList.find(w => w.value == value) || {}).label
    }

    _renderSortingWallSpecs(value, index, record, context) {
        if (value == 1) {
            return <span>边拣边分1号墙</span>;
        }
    }

    // 加载仓库列表
    _loadWarehouseList() {
        let self = this;
        let params = Object.assign({
            companyId: "",
        });

        // this.setState({ loadingVisible: true });
        CommonUtil.ajax({
            url: API.getWarehouseNameList,
            type: 'GET',
            data: params
        }).then((data) => {
            this.setState({ loadingVisible: false });
            if (data && data.data) {
                let warehouseNameList = [];
                data.data.forEach((item) => {
                    warehouseNameList.push({
                        "label": item.warehouseName,
                        "value": item.warehouseId
                    });
                })
                warehouseNameList.unshift({
                    "label": "全部",
                    "value": ""
                });
                self.setState({
                    warehouseSource: warehouseNameList
                });
            }
        }, (error) => {
            // this.setState({ loadingVisible: false });
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("加载仓库列表失败, " + error.errMsg);
            } else {
                CommonUtil.alert("加载仓库列表失败");
            }
        })
    }
    _getSearchParams() {
        return {
            pageNum: this.state.paging.currentPage,
            pageSize: this.state.paging.pageSize,
            warehouseId: getStepBaseData().warehouseId
        }
    }
    // 查询分拨墙列表
    _searchSortingWallList() {
        let self = this;
        let params = this._getSearchParams();
        this.setState({ loadingVisible: true });
        CommonUtil.ajax({
            url: API.getSortingWallListNew,
            type: 'post',
            data: {
              ...params,
              warehouseId: getStepBaseData().warehouseId
            }
        }).then((data) => {
            this.setState({ loadingVisible: false });
            if (data) {
                let paging = self.state.paging;
                paging.totalRowCount = data.totalRowCount;
                self.setState({
                    sortingWallSource: data.data ? data.data : [],
                    paging: paging,
                    selectedRow: []
                })
            }
        }, (error) => {
            this.setState({ loadingVisible: false });
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("加载分拨墙列表失败, " + error.errMsg);
            } else {
                CommonUtil.alert("加载分拨墙列表失败");
            }
        })
    }

    // 新增分拨墙
    _createSortingWall() {
        this.refs.sortingWallDialog.setState({
            warehouseSource: this.state.warehouseSource,
            warehouseNameValue: this.field.getValue("warehouseId"),
            title: "新增分拨墙",
            currentSortingWall: {},
            sortingWallType: '',
            sortingWallCode: '',
            sortingWallId: '',
            sortingWallSpecs: '',
            currentOperation: "create",
            warehouseNameDisabled: false,
            sortingWallCodeDisabled: false,
        }, () => {
            this.refs.sortingWallDialog.onDialogShow();
        });
    }

    // 批量新增分拨墙
    _batchSortingWall() {
        this.refs.batchSortingWallDialog.setState({
            warehouseName: getStepBaseData().warehouseName,
            warehouseId: getStepBaseData().warehouseId,
        }, () => {
            this.refs.batchSortingWallDialog.onDialogShow();
        })
    }

    // 修改分拨墙
    _modifySelectedSortingWall(index, record) {
        this.refs.sortingWallDialog.setState({
            warehouseSource: this.state.warehouseSource,
            title: "修改分拨墙",
            currentSortingWall: record,
            currentOperation: "modify",
            warehouseNameDisabled: true,
            warehouseNameValue: record.warehouseId,
            sortingWallId: record.sortingWallId,
            sortingWallCode: record.sortingWallCode,
            sortingWallType: record.sortingWallType,
            sortingWallSpecs: record.sortingWallSpecs,
            sortingWallCodeDisabled: true,
        }, () => {
            this.refs.sortingWallDialog.onDialogShow();
        });
    }

    // 删除分拨墙
    _deleteSelectedSortingWallWithConfirmation(index, record) {
        let confirmDialogTitle = "删除分拨墙";
        let confirmDialogContent = "确认删除分拨墙 [" + record.sortingWallCode + "] 吗？";
        Dialog.confirm({
            title: confirmDialogTitle,
            content: confirmDialogContent,
            onOk: () => {
                this._deleteSelectedSortingWall(record);
            }
        });
    }

    // 删除分拨墙已经过用户确认
    _deleteSelectedSortingWall(record) {
        let self = this;
        self.setState({ loadingVisible: true });
        CommonUtil.ajax({
            url: API.deleteWarehouseSortingWall.replace("{warehouseId}", record.warehouseId).replace("{sortingWallId}", record.sortingWallId),
            type: 'POST',
            data: { sortingWallId: record.sortingWallId, warehouseId: record.warehouseId }
        }).then((data) => {
            self.setState({ loadingVisible: false });
            ("删除分拨墙成功");
            self._searchSortingWallListByPaging();
        }, (error) => {
            self.setState({ loadingVisible: false });
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("删除分拨墙失败, " + error.errMsg);
            } else {
                CommonUtil.alert("删除分拨墙失败");
            }
        })
    }

    // 启用分拨墙
    _enableSelectedSortingWallWithConfirmation(index, record) {
        let confirmDialogTitle = "启用分拨墙";
        let confirmDialogContent = "确认启用分拨墙 [" + record.sortingWallCode + "] 吗？";
        Dialog.confirm({
            title: confirmDialogTitle,
            content: confirmDialogContent,
            onOk: () => {
                this._enableSelectedSortingWall(record);
            }
        });
    }

    // 启用分拨墙已经过用户确认
    _enableSelectedSortingWall(record) {
        let self = this;
        this.setState({ loadingVisible: true });
        CommonUtil.ajax({
            url: API.enableWarehouseSortingWall.replace("{warehouseId}", record.warehouseId).replace("{sortingWallId}", record.sortingWallId),
            type: 'POST',
            data: { sortingWallId: record.sortingWallId, warehouseId: record.warehouseId }
        }).then((data) => {
            this.setState({ loadingVisible: false });
            if (data) {
                Message.success("启用分拨墙成功");
                self._searchSortingWallListByPaging();
            }
        }, (error) => {
            this.setState({ loadingVisible: false });
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("启用分拨墙失败, " + error.errMsg);
            } else {
                CommonUtil.alert("启用分拨墙失败");
            }
        })
    }

    // 禁用分拨墙
    _disableSelectedSortingWallWithConfirmation(index, record) {
        let confirmDialogTitle = "禁用分拨墙";
        let confirmDialogContent = "确认禁用分拨墙 [" + record.sortingWallCode + "] 吗？";
        Dialog.confirm({
            title: confirmDialogTitle,
            content: confirmDialogContent,
            onOk: () => {
                this._disableSelectedSortingWall(record);
            }
        });
    }

    // 禁用分拨墙已经过用户确认
    _disableSelectedSortingWall(record) {
        let self = this;
        this.setState({ loadingVisible: true });
        CommonUtil.ajax({
            url: API.disableWarehouseSortingWall.replace("{warehouseId}", record.warehouseId).replace("{sortingWallId}", record.sortingWallId),
            type: 'POST',
            data: { sortingWallId: record.sortingWallId, warehouseId: record.warehouseId }
        }).then((data) => {
            this.setState({ loadingVisible: false });
            if (data) {
                CommonUtil.alert("禁用分拨墙成功");
                self._searchSortingWallListByPaging();
            }
        }, (error) => {
            this.setState({ loadingVisible: false });
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("禁用分拨墙失败, " + error.errMsg);
            } else {
                CommonUtil.alert("禁用分拨墙失败");
            }
        })
    }

    // 格口维护
    _manageSortingWallSlots(index, record) {
        this.refs.sortingWallSlotQuery.setState({
            title: "格口维护",
            currentSortingWall: record,
        }, () => {
            this.refs.sortingWallSlotQuery.onDialogShow();
        });
    }

    // 页查询
    _searchSortingWallListByPaging() {
        console.log("分页查询开始了啊");
        let paging = this.state.paging;
        paging.currentPage = 1;
        paging.pageSize = window._pageSize_;
        this.setState(paging, () => {
            this._searchSortingWallList();
        });
    }

    // 页码变化
    onPageNumChange(value) {
        let paging = this.state.paging;
        paging.currentPage = value;
        this.setState(paging, () => {
            this._searchSortingWallList();
        });
    }

    // 页行数变化
    onPageSizeChange(value) {
        let paging = this.state.paging;
        paging.pageSize = value;
        paging.currentPage = 1;
        this.setState(paging, () => {
            this._searchSortingWallList();
        });
    }

    onWarehouseChange(value) {
        this.field.setValue('warehouseId', value)
        this._searchSortingWallListByPaging();
    }

    _batchHandleSlot() {
        operation = batchHandle;
        dialogTitle = "批量维护格口";
        this.refs.batchHandleDialog.onDialogShow();
    }
    // 修改分播墙类型
    batchTypeShow = () => {
        this.setState({
            batchTypeVisible: true
        })
    }
    batchTypeClose = () => {
        this.setState({
            batchTypeVisible: false
        })
    }
    _batchTypeModify = () => {
        if (isEmpty(this.state.selectedRow)) {
            return Message.warning('请选择数据')
        }
        this.batchTypeShow()
    }
    batchTypeModify = async () => {
        const result = await this.batchTypeRef.validate()
        if (!result) return
        const data = this.state.selectedRow.map(s => ({
            ...s,
            ...this.batchTypeRef.getData()
        }))
        this.setState({
            batchTypeLoading: true
        })
        try {
            await $http({
                url: API.batchTypeModify(data[0].warehouseId),
                method: 'post',
                data
            })
            Message.success('修改成功')
            this.batchTypeClose()
            this._searchSortingWallList();
        } catch(e) {
            Message.error(e.message || e)
        } finally {
            this.setState({
                batchTypeLoading: false
            })
        }
    }

    // 页面渲染
    render() {
        const { warehouseSource, sortingWallSource, tableColumns, paging } = this.state;
        const { currentPage, pageSize, totalRowCount } = paging;
        const init = this.field.init;
        return (
            <div className="page-content pcs-page-content">
                  <FormCollapse>
                        <Row>
                          {!getStepBaseData().readOnly && <>
                            <Button mr="10" onClick={this._createSortingWall.bind(this)} type="normal">新增分拨墙</Button>
                            <Button mr="10" onClick={this._batchSortingWall.bind(this)} type="normal">批量新增分拨墙</Button>
                            <Button mr="10" onClick={this._batchHandleSlot.bind(this)} type="normal">批量维护格口</Button>
                            <Button mr="10" onClick={this._batchTypeModify} >批量修改分播墙类型</Button>
                          </>}
                            <Button mr="10" onClick={this._searchSortingWallListByPaging.bind(this)} type="primary">查 询</Button> 
                        </Row>
                    </FormCollapse>
                        <SortingWallDialog ref="sortingWallDialog"
                            onOkCallback={this._searchSortingWallListByPaging.bind(this)} />

                        <BatchSortingWallDialog ref="batchSortingWallDialog"
                            onOkCallback={this._searchSortingWallListByPaging.bind(this)} />

                        <BatchHandleDialog ref="batchHandleDialog" title={dialogTitle}
                                        onOkCallback={this._searchSortingWallListByPaging.bind(this)}/>

                        <SortingWallSlotQuery ref="sortingWallSlotQuery"
                            onCloseCallback={this._searchSortingWallListByPaging.bind(this)} />
                        {/* <Loading visible={this.state.loadingVisible} size="large" fullScreen></Loading> */}
                        <Table dataSource={sortingWallSource} inset className="data-table" loading={this.state.loadingVisible}
                            primaryKey='uuid'
                            rowSelection={{
                                onChange: (keys, records) => {
                                    this.setState({selectedRow: [...records]})
                                },
                                selectedRowKeys: this.state.selectedRow.map(s => s.uuid) || []
                            }}
                        >
                            {
                                tableColumns.map((item, index) => {
                                    if (item.key == 'operation') {
                                        return <Table.Column title={item.name} dataIndex={item.key} key={index} 
                                            cell={item.cellRender} width={item.width} lock="right" />
                                    } else {
                                        return <Table.Column title={item.name} dataIndex={item.key} key={index} 
                                            cell={item.cellRender} width={item.width} />
                                    }
                                })
                            }
                        </Table>
                        <Pagination className="pcs-data-pagination"
                            inset={true}
                            current={currentPage} // 受控）当前页码
                                // 非受控）初始页码
                            total={totalRowCount} // 总记录数
                            pageSize={pageSize} // 一页中的记录数
                                // 每页显示选择器在组件中的位置
                                // 每页显示选择器类型
                                // 当分页数为1时，是否隐藏分页器
                            onChange={this.onPageNumChange.bind(this)} // 页码发生改变时的回调函数
                            onPageSizeChange={this.onPageSizeChange.bind(this)} // 每页显示记录数量改变时的回调函数
                        />
                        <Dialog
                            title="修改分播墙类型"
                            visible={this.state.batchTypeVisible}
                            onOk={this.batchTypeModify}
                            onCancel={this.batchTypeClose}
                            onClose={this.batchTypeClose}
                            okProps={{loading: this.state.batchTypeLoading}}
                        >
                            <AForm ref={(ref) => this.batchTypeRef = ref} formModel={{
                                sortingWallType: {
                                    label: '分拨墙类型',
                                    span: 24,
                                    component: ASelect,
                                    required: true,
                                    attrs: {
                                        getOptions: async() => {
                                            return wallTypeList
                                        },
                                    }
                                },
                            }}></AForm>
                        </Dialog>
            </div>
        )
    }
}

// 批量维护格口
class BatchHandleDialog extends React.Component{
    constructor(props) {
        super(props);
        let headers = this._buildHeaders();
        this.state = {
            warehouseList: [],
            headers: headers,
            warehouseId: getStepBaseData().warehouseId,
            title: props.title,
            visible: false,
            loadingVisible: false
        }
        this.field = new Field(this, {values: {
          warehouseName: getStepBaseData().warehouseName,
          warehouseId: getStepBaseData().warehouseId
        }});
    }

    _buildHeaders() {
        let headers = {};
        if (document.getElementsByName("_csrf_header").length > 0) {
            let csrfHeader = document.getElementsByName("_csrf_header")[0].getAttributeNode("content").value;
            let csrfToken = document.getElementsByName("_csrf_token")[0].getAttributeNode("content").value;
            let additionalHeaders = {};
            additionalHeaders[csrfHeader] = csrfToken;
            headers = additionalHeaders;
        }
        return headers;
    }

    onDialogClose() {
        setTimeout(() => {
            this.setState({
                visible: false
            });
        }, 10);
    }

    getSearchParams() {
        let searchData = this.field.getValues();
        console.log(searchData, '99')
        // return searchData;
        return {
          warehouseId : getStepBaseData().warehouseId
        }
    }

    onWarehouseChange(value) {
        let self = this;
        self.field.setValue("warehouseId", value);
        self.setState({
            warehouseId: value
        });
    }
    onSuccess(info) {
        this.closeLoading();
        if (info.response.response.success && info.response.response.success === true) {
            let self = this;
            CommonUtil.alert("新增成功", info.response.response.message);
            setTimeout(() => {
                self.props.onOkCallback();
            }, 10)
        } else {
            CommonUtil.alert(info.response.response.message);
        }
    }

    onError(info) {
        this.closeLoading();
        CommonUtil.alert("处理失败!" + JSON.stringify(info));
    }
    closeLoading() {
        this.setState({
            loadingVisible: false
        });
    }


    onDialogShow() {
        let self = this;
        self.field.reset();
        if (operation === batchHandle) {
            self.setState({
                warehouseList: [],
                warehouseId: "",
                visible: false,
            });
            CommonUtil.ajax({
                url: API.getWarehouseNameList,
                type: 'GET',
            }).then((data) => {
                if (data && data.data) {
                    let warehouseNameList = [];
                    data.data.forEach((item) => {
                        warehouseNameList.push({
                            "label": item.warehouseName,
                            "value": item.warehouseId
                        });
                    })
                    warehouseNameList.unshift({
                        "label": "全部",
                        "value": ""
                    });
                    let self = this;
                    warehouseShortNameList = warehouseNameList;
                    self.setState({
                        warehouseList: warehouseNameList,
                        warehouseShortNames: warehouseShortNameList,
                        visible: true,
                        title: dialogTitle
                    })
                }
            });
        }
    }
    //下载模板
    downloadTemplate(){
        window.downloadFile(API.exportSortWallTemplate);
    }

    render() {
        const init = this.field.init;
        const {warehouseShortNames} = this.state;
        return (
            <Dialog visible={this.state.visible}
                    title={this.state.title}
                    onClose={this.onDialogClose.bind(this)}
                    onCancel={this.onDialogClose.bind(this)}>
                <Loading tip="处理中,请耐心等待..." visible={this.state.loadingVisible}>
                    <Form size="large" direction="hoz" className="search-con">
                        <Row>
                            <Col fixedSpan="15">
                                <FormItem label="仓库名称" labelTextAlign="right" {...uploadFormItemLayout}>
                                  <Input name="warehouseName" value={getStepBaseData().warehouseName} disabled style={{width: '100%'}}></Input>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <h4 >请先选择仓库 -&gt; 下载模板 -&gt; 上传文件</h4>
                        </Row>
                        <Row>
                            <hr/>
                            <hr/>
                        </Row>
                        <Row>
                            <Button mr="10" type="secondary" onClick={this.downloadTemplate.bind(this)} >下载模板</Button>
                            <Upload
                                action={API.batchHandleSlot}
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                data={this.getSearchParams.bind(this)}
                                onSuccess={this.onSuccess.bind(this)}
                                onError={this.onError.bind(this)}
                                headers={this.state.headers}>
                                <Button className="upload-btn" type="primary">上传Excel表格</Button>
                            </Upload>
                        </Row>
                    </Form>
                </Loading>
            </Dialog>
        );
    }
}

export default  SortingWallQuery 
