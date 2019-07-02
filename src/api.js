import { data }  from './config';
import axios from "axios";

const BASE_URL = data.base,
CHANNEL = data.channel,
CHAINCODE = data.chaincode,
BASE_TIME = data.base_time,
FREQ = data.freqs,
API = axios.create({baseURL: BASE_URL}),
// twoPeers = ['peer0.org1.example.com', 'peer0.org2.example.com'],
threePeers = ['peer0.org1.example.com', 'peer0.org2.example.com', 'peer0.org3.example.com'];

function getData(options) {
    let data = {fcn: options.fcn};
    const {timeBlock} = options;
    switch(data.fcn) {
        case 'initFreq': 
            data.peers = threePeers;
            data.args = [`${BASE_TIME + (timeBlock-1)*900}`, `${BASE_TIME + timeBlock*900}`, `${options.freq}`];
        break;
        case 'initUnit': 
            data.peers = threePeers;
            data.args = ['Org2', 'Org3', `${BASE_TIME + (timeBlock-1)*900}`, `${BASE_TIME + timeBlock*900}`, `${options.unit}`];
        break;
        case 'initBill': 
            data.peers = threePeers;
            data.args = ['Org2', 'Org3', `${BASE_TIME + (timeBlock-1)*900}`, `${BASE_TIME + timeBlock*900}`];
        break;
        default:
    }
    return data;
}

function getDelData(options) {
    let data = {fcn: options.fcn};
    const {timeBlock} = options;
    switch(data.fcn) {
        case 'deleteFreq': 
            data.peers = threePeers;
            data.args = [`${BASE_TIME + (timeBlock-1)*900}`];
        break;
        case 'deleteUnit': 
            data.peers = threePeers;
            data.args = ['Org2', 'Org3', `${BASE_TIME + (timeBlock-1)*900}`];
        break;
        case 'deleteBill': 
            data.peers = threePeers;
            data.args = ['Org2', 'Org3', `${BASE_TIME + (timeBlock-1)*900}`];
        break;
        default:
    }
    return data;
}

export const api = {
    init({fcn, org, timeBlock}) {
        const freq = FREQ[timeBlock-1];
        const unit = parseFloat(((Math.random() - 0.5)/2).toFixed(2));
        return API.post(`/channels/${CHANNEL}/chaincodes/${CHAINCODE}`, getData({fcn: fcn, timeBlock, freq, unit}),
            {headers: {'authorization': `Bearer ${data[org].token}`, 'content-type': 'application/json'}} );
    },

    read({fcn, org, timeBlock}) {
        let args;
        if (fcn === 'readFreq') {
            args = `${BASE_TIME + 900*(timeBlock-1)}`;
        } else {
            args = `Org2","Org3","${BASE_TIME + 900*(timeBlock-1)}`;
        }
        return API.get(`/channels/${CHANNEL}/chaincodes/${CHAINCODE}?peer=peer0.${org.toLowerCase()}.example.com&fcn=${fcn}&args=["${args}"]`,
            {headers: {'authorization': `Bearer ${data[org].token}`, 'content-type': 'application/json'}} )
            .then(res => {return res.data;})
            .catch(err => console.log(err));
    },

    del({fcn, org, timeBlock}) {
        return API.post(`/channels/${CHANNEL}/chaincodes/${CHAINCODE}`, getDelData({fcn: fcn, timeBlock}),
            {headers: {'authorization': `Bearer ${data[org].token}`, 'content-type': 'application/json'}} );
    },
}