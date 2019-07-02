// frontend/src/components/Modal.js

import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup, Row, Col,
    Label,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown
} from "reactstrap";
import { data } from '../config';
import { api } from '../api';

function d(a, b) { return (a - a % b) / b; };

function minutes(i) {
    switch (i % 4) {
        case 0: return '00';
        case 1: return '15';
        case 2: return '30';
        case 3: return '45';
        default: return '00';
    }
};

function getTime(i) {
    return `${d(i - 1, 4) > 9 ? d(i - 1, 4) : '0' + d(i - 1, 4)}:${minutes(i - 1)}-${d(i, 4) > 9 ? d(i, 4) : '0' + d(i, 4)}:${minutes(i)}`;
}

const options = ['Org1: Grid', 'Org2: Station', 'Org3: Society'];

export default class CustomModal extends Component {
    constructor(props) {
        super(props);
        let i = localStorage.getItem('initFreq_last');
        i = i ? parseInt(i) + 1 : 1;
        if (i<1)i=1;
        this.state = {
            orgDropdownOpen: false,
            fcnDropdownOpen: false,
            timeDropdownOpen: false,
            org: 'Org1',
            fcn: 'initFreq',
            timeBlock: i,
            time: getTime(i),
            buttonText: 'Add',
        };
    }
    performTask(options) {
        let { fcn, org, timeBlock } = this.state;
        this.setState({ buttonText: 'Adding' });
        if (fcn.substring(0, 4) === 'init') {
            api.init(options)
                .then(res => {
                    if (!res.data.success) {
                        fcn = fcn + ' Error'
                    } else {
                        localStorage.setItem(`${fcn}_last`, timeBlock);
                    }
                    this.props.onSave({ data: res.data, fcn: fcn, org: org, time: timeBlock });
                    this.setState({ buttonText: 'Add' });
                })
                .catch(err => console.log(err));
        }
        else {
            api.read(options)
                .then(res => {
                    this.props.onSave({ data: res, fcn: fcn, org: org, time: timeBlock });
                    this.setState({ buttonText: 'Add' });
                })
                .catch(err => console.log(err));
        }

    }

    changeTime(fcn) {
        let i = localStorage.getItem(`${fcn}_last`);
        i = i ? parseInt(i) + 1 : 1;
        if (i<1) i=1;
        if (fcn.substring(0, 4) === 'read')
            i = 1;
        this.setState({ timeBlock: i, time: getTime(i) });
    };

    orgDropdown() {
        return options.map((e) => <DropdownItem onClick={(o) => { this.setState({ org: o.target.innerText.substring(0, 4), fcn: data[o.target.innerText.substring(0, 4)].permissions[0] }); this.changeTime(data[o.target.innerText.substring(0, 4)].permissions[0]); }}>{e}</DropdownItem>)
    };

    fcnDropdown() {
        const { org } = this.state;
        return data[org].permissions.map((e) => <DropdownItem onClick={(o) => { this.setState({ fcn: o.target.innerText }); this.changeTime(o.target.innerText) }}>{e}</DropdownItem>)
    };

    timeDropdown() {
        const time = [];
        const { fcn } = this.state;
        // if (fcn.substring(0, 4) === 'init') {
        //     let i = localStorage.getItem(`${fcn}_last`);
        //     i = i ? parseInt(i) + 1 : 1;
        //     time.push({ t: i, s: getTime(i) });
        // } else {
        //     let k = localStorage.getItem(`init${fcn.substring(4, 4)}_last`);
        //     k = k ? parseInt(k) : 1;
        //     for (let i = 1; i <= k; i++) {
        //         time.push({ t: i, s: getTime(i) });
        //     }
        // }
        for (let i = 1; i <= 96; i++) {
            time.push({ t: i, s: getTime(i) });
        }
        return time.map((e) => <DropdownItem onClick={() => { this.setState({ timeBlock: e.t, time: e.s }) }}>{e.s}</DropdownItem>)
    };

    render() {
        const { toggle } = this.props;
        const { orgDropdownOpen, fcnDropdownOpen, timeDropdownOpen, org, fcn, time, buttonText } = this.state;
        return (
            <Modal isOpen={true} toggle={toggle}>
                <ModalHeader toggle={toggle}> Add Event </ModalHeader>
                <ModalBody>
                    <Form>
                        <Row form>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="title">Org</Label>
                                    <Dropdown isOpen={orgDropdownOpen} toggle={() => { this.setState({ orgDropdownOpen: !orgDropdownOpen }) }}>
                                        <DropdownToggle caret>
                                            {org}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {this.orgDropdown()}
                                        </DropdownMenu>
                                    </Dropdown>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="description">Function</Label>
                                    <Dropdown isOpen={fcnDropdownOpen} toggle={() => { this.setState({ fcnDropdownOpen: !fcnDropdownOpen }) }}>
                                        <DropdownToggle caret>
                                            {fcn}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {this.fcnDropdown()}
                                        </DropdownMenu>
                                    </Dropdown>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="description">Time</Label>
                                    <UncontrolledDropdown size="sm" isOpen={timeDropdownOpen} toggle={() => { this.setState({ timeDropdownOpen: !timeDropdownOpen }) }}>
                                        <DropdownToggle caret>
                                            {time}
                                        </DropdownToggle>
                                        <DropdownMenu
                                            modifiers={{
                                                setMaxHeight: {
                                                    enabled: true,
                                                    order: 890,
                                                    fn: (data) => {
                                                        return {
                                                            ...data,
                                                            styles: {
                                                                ...data.styles,
                                                                overflow: 'auto',
                                                                maxHeight: 200,
                                                            },
                                                        };
                                                    },
                                                },
                                            }}>
                                            {this.timeDropdown()}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </FormGroup>
                            </Col>
                        </Row>
                        Date: {data.date}
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() => { this.performTask(this.state) }}>
                        {buttonText}
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}
