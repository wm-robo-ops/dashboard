'use babel';
import React from 'react';
import Immutable from 'immutable';
import { createStore } from 'redux';
import {
  updateBattery,
  updateLocation
} from './actions';
import {
  getBatteryLevel,
  getLocation
} from './vehicle_client';
import dashboardApp from './reducers';

const POLL_INTERVAL = 2000; // milliseconds to wait between polling vehicles

const BIG_DADDY = 'bigDaddy';
const SCOUT = 'scout';
const FLYER = 'flyer';
const vehicles = [ BIG_DADDY, SCOUT, FLYER ];

var store = createStore(dashboardApp, Immutable.fromJS({
  bigDaddy: {
    batteryLevel: getBatteryLevel(BIG_DADDY),
    location: getLocation(BIG_DADDY)
  },
  scout: {
    batteryLevel: getBatteryLevel(SCOUT),
    location: getLocation(SCOUT)
  },
  flyer: {
    batteryLevel: getBatteryLevel(FLYER),
    location: getLocation(FLYER)
  }
}));

function updateStatus() {
  for (var i = 0; i < vehicles.length; i++) {
    let vehicle = vehicles[0];
    store.dispatch(updateBattery({
      vehicle,
      batteryLevel: getBatteryLevel(vehicle)
    }));
    store.dispatch(updateLocation({
      vehicle,
      location: getLocation(vehicle)
    }));
  }
}
// poll for battery and location information
window.setInterval(updateStatus, POLL_INTERVAL);

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: store.getState(),
      view: BIG_DADDY
    };
  }

  componentDidMount() {
    store.subscribe(() => {
      this.setState({data: store.getState()});
    });
  }

  changeView(view) {
    this.setState({ view });
  }

  render() {
    let batteryLevel = this.state.data.getIn([this.state.view, 'batteryLevel']);
    let location = this.state.data.getIn([this.state.view, 'location']);

    return <div>

      {/* rover toggle */}
      <div className='ui container my4'>
        <div className='ui three item stackable tabs menu'>
          <div
            onClick={this.changeView.bind(this, BIG_DADDY)}
            className={`item ${this.state.view === BIG_DADDY && 'active'}`}>Big Daddy</div>
          <div
            onClick={this.changeView.bind(this, SCOUT)}
            className={`item ${this.state.view === SCOUT && 'active'}`}>Scout</div>
          <div
            onClick={this.changeView.bind(this, FLYER)}
            className={`item ${this.state.view === FLYER && 'active'}`}>Flyer</div>
        </div>
      </div>

      <div className='ui grid container'>

        {/* cameras */}
        <div className='ten wide column'>
          <div className='ui teal padded segment'>
            <h1 className='ui dividing header'>cameras</h1>

            {/* fake cameras */}
            Main
            <div className='mb2' style={{ height: '300px', width: '650px', backgroundColor: 'gray' }}></div>

            <div className='ui grid container'>
              <div className='eight wide column'>
                Camera 2
                <div style={{ height: '200px', width: '300px', backgroundColor: 'gray' }}></div>
              </div>

              <div className='eight wide column'>
                Camera 3
                <div style={{ height: '200px', width: '300px', backgroundColor: 'gray' }}></div>
              </div>
            </div>

          </div>
        </div>

        {/* metrics */}
        <div className='six wide column'>
          <div className='ui pink padded segment'>
            <h1 className='ui dividing header'>metrics</h1>

            {/* battery level */}
            <div
              className='ui indicating progress active'
              data-percent={`${batteryLevel}`}
              ref='batteryBar'>
              <div className='bar' style={{ width: batteryLevel + '%' }}></div>
              <div className='label'>battery: {batteryLevel}%</div>
            </div>

            {/* location */}
            <div>Location: {`${location.get(0) + ',' + location.get(1)}`}</div>

          </div>
        </div>
      </div>

    </div>;
  }

}
