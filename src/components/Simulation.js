// frontend/src/components/Modal.js

import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Media, DropdownItem
} from "reactstrap";
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';

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
        if (fcn.substring(0, 4) === 'init') {
            let i = localStorage.getItem(`${fcn}_last`);
            i = i ? parseInt(i) + 1 : 1;
            time.push({ t: i, s: getTime(i) });
        } else {
            let k = localStorage.getItem(`${fcn}_last`);
            k = k ? parseInt(k) : 1;
            for (let i = 1; i <= k; i++) {
                time.push({ t: i, s: getTime(i) });
            }
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
                    <img className="float-left" src="https://library.kissclipart.com/20180829/ge/kissclipart-coal-power-plants-clipart-coal-power-station-clip-227f7055f7365f7a.png" height='100' width='100' />
                    <img className="float-right" src="https://cdn0.iconfinder.com/data/icons/real-estate-151/65/25-512.png" height='100' width='100' />
                    <img className="align-items-center" src="https://icon2.kisspng.com/20180609/sui/kisspng-electric-power-transmission-electrical-grid-electr-5b1be8f42cb006.3864795215285557641831.jpg" height='100' width='100' />
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() => { this.performTask(this.state) }}>
                        {buttonText}
                    </Button>
                </ModalFooter>
                <Sparklines data={[1, 2, 3, 4]}>
                    <SparklinesLine style={{ fill: "none" }} />
                    <SparklinesSpots />
                </Sparklines>
            </Modal>
        );
    }
}
