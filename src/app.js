import React from 'react';
import Immutable from 'immutable';
import { createStore } from 'redux';
import {
  updateBattery,
  updateLocation,
  updateNetworkSpeed,
  updateBearing,
  setMap
} from './actions';
import {
  getBatteryLevel,
  getLocation,
  getNetworkSpeed,
  getBearing
} from './vehicle_client';
import dashboardApp from './reducers';

// components
import NetworkSparkline from './components/network_sparkline';
import VideoPlayer from './components/video_player';
import MainMap from './components/main_map';
import BatteryPanel from './components/battery_panel';
import BearingMap from './components/bearing_map';

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
    color: '#ff00ff',
    cameras: []
  },
  scout: {
    batteryLevel: getBatteryLevel(SCOUT),
    location: getLocation(SCOUT),
    networkSpeed: [getNetworkSpeed(SCOUT)],
    color: '#ff00ff',
    cameras: []
  },
  flyer: {
    batteryLevel: getBatteryLevel(FLYER),
    location: getLocation(FLYER),
    networkSpeed: [getNetworkSpeed(FLYER)],
    color: '#ff00ff',
    cameras: []
  },
  rocks: [[-95.081320, 29.564835]]
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
    store.dispatch(updateBearing({
      vehicle,
      bearing: getBearing(vehicle)
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
      view: BIG_DADDY,
      videoQuality: 'Medium'
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

  setMap(vehicle, map) {
    store.dispatch(setMap({ vehicle, map }));
  }

  getVehicleLocationData() {
    return vehicles.map(v => {
      return {
        vehicle: v,
        coordinates: this.state.data.getIn([v, 'location']).toJS(),
        color: this.state.data.getIn([v, 'color'])
      };
    });
  }

  render() {
    let batteryLevel = this.state.data.getIn([this.state.view, 'batteryLevel']);
    let loc = this.state.data.getIn([this.state.view, 'location']);
    let networkSpeed = this.state.data.getIn([this.state.view, 'networkSpeed']);
    let bearing = this.state.data.getIn([this.state.view, 'bearing']);
    let vehicleLocations = this.getVehicleLocationData();
    let rockLocations = this.state.data.get('rocks').toJS();

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
            <div className='ui grid container'>
                <VideoPlayer />
            </div>

          </div>
        </div>

        {/* metrics */}
        <div className='six wide column'>

          {/* battery level */}
          <BatteryPanel batteryLevel={batteryLevel}/>

          {/* location */}
          <div className='ui black padded segment'>
            <h1 className='ui dividing header'>location</h1>
            <MainMap vehicles={vehicleLocations} rockLocations={rockLocations} />
            <BearingMap bearing={bearing} center={loc} markerColor={'#ff00ff'}/>
            <div>Location: {`(${loc.get(0) + ',' + loc.get(1)})`}</div>

          </div>

          {/* network and quality*/}
          <div className='ui purple padded segment'>

            <h1 className='ui dividing header'>network</h1>
            <div>
              <NetworkSparkline data={networkSpeed.toJS()}/>
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
