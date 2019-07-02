// frontend/src/App.js

import React, { Component } from "react";
import Modal from "./components/Event";
import { api } from './api';
const filters = ['All', 'Frequencies', 'Units', 'Bills'];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: 'All',
      blockList: [],
      price: 0,
      simulationText: 'Run Simulation',
      pruneText: 'Reset',
      fetchText: 'Fetch All Events',
    };
  }
  componentDidMount() {
    this.refreshList();
  }
  refreshList = () => {
  };

  renderTabList = () => {
    const { filter } = this.state;
    return (
      <div>
        <div className="my-5 tab-list">
          {filters.map((f) => (
            <span onClick={() => this.setState({ filter: f })}
              className={filter === f ? "" : "active"}
            >
              {f}
            </span>
          ))}
        </div>
        Total Bill: Rs. {this.state.price}
        <span>
          <button
            onClick={() => { this.hideAll() }}
            className="btn btn-danger float-right mb-2"
          >
            Hide All
          </button>
        </span>
      </div>
    );
  };
  renderItem = (item) => {
    const i = item.time;
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
    switch (item.fcn) {
      case 'readFreq':
        return `Frequency at ${d(i - 1, 4) > 9 ? d(i - 1, 4) : '0' + d(i - 1, 4)}:${minutes(i - 1)}-${d(i, 4) > 9 ? d(i, 4) : '0' + d(i, 4)}:${minutes(i)} is ${item.data.avgFreq} Hz`;
      case 'initFreq':
        return `Got Frequceny for ${d(i - 1, 4) > 9 ? d(i - 1, 4) : '0' + d(i - 1, 4)}:${minutes(i - 1)}-${d(i, 4) > 9 ? d(i, 4) : '0' + d(i, 4)}:${minutes(i)}`;
      case 'readUnit':
        return `Units at ${d(i - 1, 4) > 9 ? d(i - 1, 4) : '0' + d(i - 1, 4)}:${minutes(i - 1)}-${d(i, 4) > 9 ? d(i, 4) : '0' + d(i, 4)}:${minutes(i)} is ${item.data.units} kWh`;
      case 'initUnit':
        return `Got Units for ${d(i - 1, 4) > 9 ? d(i - 1, 4) : '0' + d(i - 1, 4)}:${minutes(i - 1)}-${d(i, 4) > 9 ? d(i, 4) : '0' + d(i, 4)}:${minutes(i)}`;
      case 'readBill':
        return `Bill for ${d(i - 1, 4) > 9 ? d(i - 1, 4) : '0' + d(i - 1, 4)}:${minutes(i - 1)}-${d(i, 4) > 9 ? d(i, 4) : '0' + d(i, 4)}:${minutes(i)} is Rs.${item.data.price}`;
      case 'initBill':
        return `Got Bill for ${d(i - 1, 4) > 9 ? d(i - 1, 4) : '0' + d(i - 1, 4)}:${minutes(i - 1)}-${d(i, 4) > 9 ? d(i, 4) : '0' + d(i, 4)}:${minutes(i)}`;
      default:
        return `Unsuccessful event ${item.fcn}`;
    }
  };

  showItem(item) {
    switch (filters.indexOf(this.state.filter)) {
      case 0: return true;
      case 1: return item.fcn === 'initFreq' || item.fcn === 'readFreq';
      case 2: return item.fcn === 'initUnit' || item.fcn === 'readUnit';
      case 3: return item.fcn === 'initBill' || item.fcn === 'readBill';
      default: return true;
    }
  };

  renderItems = () => {
    const newItems = this.state.blockList.filter(
      item => this.showItem(item)
    );
    return newItems.map((item) => (
      <li
        key={item.org}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`block-title mr-2`}
          title={item.fcn}
        >
          {this.renderItem(item)}
        </span>
        <span>
          <button
            onClick={() => { this.handleDelete(item) }}
            className="btn btn-danger"
          >
            Hide{" "}
          </button>
        </span>
      </li>
    ));
  };
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };
  toggleSim = () => {
    this.setState({ simModal: !this.state.simModal });
  };
  handleSubmit = (item, t = false) => {
    let { blockList, price } = this.state;
    if (!t) this.toggle();
    const p = blockList.find((i) => { return i.fcn === item.fcn && i.time === item.time });
    if (item.fcn && !p) {
      if (item.fcn === 'readBill' && item.data.price) {
        price = parseFloat((price + item.data.price).toFixed(3));
      }
      blockList.push(item);
      this.setState({ blockList, price });
    }
    return;
  };

  fetchAll = () => {
    let f = localStorage.getItem('initFreq_last'),
      u = localStorage.getItem('initUnit_last'),
      b = localStorage.getItem('initBill_last'), i;
    f = f ? parseInt(f) : 0;
    u = u ? parseInt(u) : 0;
    b = b ? parseInt(b) : 0;
    for (i = 1; i <= f; i++) {
      const fcn = 'readFreq', timeBlock = i, org = 'Org2';
      api.read({ fcn, timeBlock, org })
        .then(res => {
          this.handleSubmit({ data: res, fcn: fcn, org: org, time: timeBlock }, true);
        })
        .catch(err => console.log(err));
    }
    for (i = 1; i <= u; i++) {
      const fcn = 'readUnit', timeBlock = i, org = 'Org2';
      api.read({ fcn, timeBlock, org })
        .then(res => {
          this.handleSubmit({ data: res, fcn: fcn, org: org, time: timeBlock }, true);
        })
        .catch(err => console.log(err));
    }
    for (i = 1; i <= b; i++) {
      const fcn = 'readBill', timeBlock = i, org = 'Org2';
      api.read({ fcn, timeBlock, org })
        .then(res => {
          this.handleSubmit({ data: res, fcn: fcn, org: org, time: timeBlock }, true);
        })
        .catch(err => console.log(err));
    }
  };

  pruneAll = () => {
    let f = localStorage.getItem('initFreq_last'),
      u = localStorage.getItem('initUnit_last'),
      b = localStorage.getItem('initBill_last'), i;
    f = f ? parseInt(f) : 0;
    u = u ? parseInt(u) : 0;
    b = b ? parseInt(b) : 0;
    for (i = f; i >0; i--) {
      const fcn = 'deleteFreq', timeBlock = i, org = 'Org2';
      api.del({ fcn, timeBlock, org })
        .then(res => {
          if (res.data.success)  {
            localStorage.setItem('initFreq_last', i);
          }
          this.handleDelete({ fcn: 'readFreq', org: org, time: timeBlock }, true);
        })
        .catch(err => console.log(err));
    }
    for (i = b; i > 0; i--) {
      const fcn = 'deleteUnit', timeBlock = i, org = 'Org2';
      api.del({ fcn, timeBlock, org })
        .then(res => {
          if (res.data.success)  {
            localStorage.setItem('initUnit_last', i);
          }
          this.handleDelete({ fcn: 'readUnit', org: org, time: timeBlock }, true);
        })
        .catch(err => console.log(err));
    }
    for (i = b; i > 0; i--) {
      const fcn = 'deleteBill', timeBlock = i, org = 'Org2';
      api.del({ fcn, timeBlock, org })
        .then(res => {
          if (res.data.success)  {
            localStorage.setItem('initBill_last', i);
          }
          this.handleDelete({ fcn: 'readBill', org: org, time: timeBlock }, true);
        })
        .catch(err => console.log(err));
    }
  };

  performTask(options) {
    let { fcn, org, timeBlock } = options;
    api.init(options)
      .then(res => {
        if (!res.data.success) {
          fcn = fcn + ' Error'
        } else {
          localStorage.setItem(`${fcn}_last`, timeBlock);
        }
        this.handleSubmit({ data: res.data, fcn: fcn, org: org, time: timeBlock }, true);
      })
      .catch(err => console.log(err));
  };

  performAsyncTask(options) {
    let { fcn, org, timeBlock } = options;
    api.init(options)
      .then(res => {
        if (!res.data.success) {
          fcn = fcn + ' Error'
        } else {
          this.performTask({ fcn: 'initBill', org: 'Org2', timeBlock })
          localStorage.setItem(`${fcn}_last`, timeBlock);
        }
        this.handleSubmit({ data: res.data, fcn: fcn, org: org, time: timeBlock }, true);
      })
      .catch(err => console.log(err));
  };

  autoFetch = () => {
    let f = localStorage.getItem('initFreq_last'),
      u = localStorage.getItem('initUnit_last'),
      b = localStorage.getItem('initBill_last'), i;
    f = f ? parseInt(f) + 1 : 1;
    u = u ? parseInt(u) + 1 : 1;
    b = b ? parseInt(b) + 1 : 1;
    for (u; u < f; u++) {
      this.performAsyncTask({ fcn: 'initUnit', org: 'Org3', timeBlock: u });
    }
    for (f; f < 97; f++) {
      this.performTask({ fcn: 'initFreq', org: 'Org1', timeBlock: f });
      this.performAsyncTask({ fcn: 'initUnit', org: 'Org3', timeBlock: f });
    }
  };

  hideAll = () => {
    this.setState({ blockList: [], price: 0 });
  }

  handleDelete = item => {
    let { blockList, price } = this.state;
    const len = blockList.length;
    blockList = blockList.filter((b) => { return b.fcn !== item.fcn || b.time !== item.time });
    if (item.fcn === 'readBill' && len !== blockList.length) {
      if (item.data.price)
        price = price - item.data.price;
      price = parseFloat(price.toFixed(3));
    }
    this.setState({ blockList, price });
  };
  showModal = () => {
    this.setState({ modal: !this.state.modal });
  };
  showSimModal = () => {
    this.setState({ simModal: !this.state.simModal });
  };
  render() {
    let { simulationText, pruneText, fetchText } = this.state;
    return (
      <main className="content">
        <h1 className="text-blue text-uppercase text-center my-4">Energyblocks</h1>
        <div className="row ">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="">
                <button onClick={this.showModal} className="btn btn-primary mr-2">
                  Add Event
                    </button>
                <button onClick={this.fetchAll} className="btn btn-primary mr-2">
                  {fetchText}
                    </button>
                <button onClick={this.autoFetch} className="btn btn-primary mr-2 float-right">
                  {simulationText}
                    </button>
                <button onClick={this.pruneAll} className="btn btn-primary mr-2 float-right">
                  {pruneText}
                    </button>
                <button onClick={this.resetLedger} className="btn btn-primary mr-2 float-right">
                  Reset
                    </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}
export default App;
