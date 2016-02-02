'use babel';
import React from 'react';
import Immutable from 'immutable';
import { createStore } from 'redux';
import {
  updateBattery,
  updateLocation,
  updateNetworkSpeed
} from './actions';
import {
  getBatteryLevel,
  getLocation,
  getPhotos,
  getNetworkSpeed
} from './vehicle_client';
import NetworkLineChart from './components/network_line_chart';
import dashboardApp from './reducers';

const POLL_INTERVAL = 1000; // milliseconds to wait between polling vehicles

const BIG_DADDY = 'bigDaddy';
const SCOUT = 'scout';
const FLYER = 'flyer';
const vehicles = [ BIG_DADDY, SCOUT, FLYER ];

var store = createStore(dashboardApp, Immutable.fromJS({
  bigDaddy: {
    batteryLevel: getBatteryLevel(BIG_DADDY),
    location: getLocation(BIG_DADDY),
    networkSpeed: [getNetworkSpeed(BIG_DADDY)],
    cameras: [1, 2, 3]
  },
  scout: {
    batteryLevel: getBatteryLevel(SCOUT),
    location: getLocation(SCOUT),
    networkSpeed: [getNetworkSpeed(SCOUT)],
    cameras: [1, 2, 3]
  },
  flyer: {
    batteryLevel: getBatteryLevel(FLYER),
    location: getLocation(FLYER),
    networkSpeed: [getNetworkSpeed(FLYER)],
    cameras: [1, 2, 3]
  }
}));

function updateStatus() {
  for (var i = 0; i < vehicles.length; i++) {
    let vehicle = vehicles[i];
    store.dispatch(updateBattery({
      vehicle,
      batteryLevel: getBatteryLevel(vehicle)
    }));
    store.dispatch(updateLocation({
      vehicle,
      location: getLocation(vehicle)
    }));
    store.dispatch(updateNetworkSpeed({
      vehicle,
      data: getNetworkSpeed(vehicle)
    }));
  }
}

// poll for battery and location information
window.setInterval(updateStatus, POLL_INTERVAL);

/*
function parsePhotoData(fname) {
  var data = fname.split('.')[1].split('$');
  var vehicle = data[0];
  var time = data[1];
  var location = data[2];
  return { vehicle, time, location };
}
*/

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: store.getState(),
      view: BIG_DADDY,
      videoQuality: 'Medium',
      connectivityData: [ {time: '1', speed: 1}, {time: '2', speed: 5}, {time: '3', speed: 3} ] // add to store
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

  changeVideoQuality(e) {
    var value = e.target.value;
    if (value > 2) {
      this.setState({ videoQuality: 'High' });
    } else if (value > 1) {
        this.setState({ videoQuality: 'Medium' });
    } else {
        this.setState({ videoQuality: 'Low' });
    }
  }

  render() {
    let batteryLevel = this.state.data.getIn([this.state.view, 'batteryLevel']);
    let location = this.state.data.getIn([this.state.view, 'location']);
    let networkSpeed = this.state.data.getIn([this.state.view, 'networkSpeed']);

    return <div style={{ padding: '20px' }}>

      {/* rover toggle */}
      <div className='ui my4'>
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

      <div className='ui grid'>

        {/* cameras */}
        <div className='ten wide column'>
          <div className='ui teal padded segment'>
            <h1 className='ui dividing header'>cameras</h1>

            {/* cameras */}
            {/* main camera */}
            Main
            <div className='mb2' style={{ backgroundColor: '#000' }}>
              <img src={getPhotos()[0]} style={{ width: '100%' }} />
            </div>
            <div>
              {getPhotos().map((p, i) => <div
                  key={i}
                  style={{
                    overflowX: 'scroll',
                    width: '100%',
                    backgroundColor: '#E6E6E6',
                    padding: '10px',
                    borderRadius: '.28571429rem'
                  }}>
                <img src={p} style={{ width: '20%' }} />
              </div>)}
            </div>

            <div className='ui grid container'>
              {/* camera 2 */}
              <div className='eight wide column'>
                Camera 2
                <div style={{ height: '200px', width: '100%', backgroundColor: 'gray' }}></div>
              </div>

              {/* camera 3 */}
              <div className='eight wide column'>
                Camera 3
                <div style={{ height: '200px', width: '100%', backgroundColor: 'gray' }}></div>
              </div>
            </div>

          </div>
        </div>

        {/* metrics */}
        <div className='six wide column'>

          {/* battery level */}
          <div className='ui pink padded segment'>
            <h1 className='ui dividing header'>battery</h1>
            <div
              className='ui indicating progress active'
              data-percent={`${batteryLevel}`}
              ref='batteryBar'>
              <div className='bar' style={{ width: batteryLevel + '%' }}></div>
              <div className='label'>battery: {batteryLevel}%</div>
            </div>
          </div>

          {/* location */}
          <div className='ui black padded segment'>
            <h1 className='ui dividing header'>location</h1>
            <div>Location: {`(${location.get(0) + ',' + location.get(1)})`}</div>
          </div>

          {/* network and quality*/}
          <div className='ui purple padded segment'>

            <h1 className='ui dividing header'>network</h1>
            <div>
              <NetworkLineChart data={networkSpeed.toJS()}/>
            </div>

            <h1 className='ui dividing header'>quality</h1>
            <div className='center'>
              {this.state.videoQuality}
            </div>
            <input
              className='full-width'
              type='range'
              min='1'
              max='3'
              step='1'
              onChange={this.changeVideoQuality.bind(this)}/>

          </div>

        </div>

      </div>

    </div>;
  }

}
