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
import AllCamerasView from './components/all_cameras_view';
import NetworkSparkline from './components/network_sparkline';
import VideoPlayer from './components/video_player';
import MainMap from './components/main_map';
import Battery from './components/battery';
import BearingMap from './components/bearing_map';
import CameraControls from './components/camera_controls';

const POLL_INTERVAL = 1000; // milliseconds to wait between polling vehicles

const BIG_DADDY = 'bigDaddy';
const SCOUT = 'scout';
const FLYER = 'flyer';
const ALL_CAMERAS = 'allCameras';
const vehicles = [ BIG_DADDY, SCOUT, FLYER ];

var store = createStore(dashboardApp, Immutable.fromJS({
  bigDaddy: {
    batteryLevel: getBatteryLevel(BIG_DADDY),
    location: getLocation(BIG_DADDY),
    networkSpeed: [getNetworkSpeed(BIG_DADDY)],
    color: '#00ff99',
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
    color: '#ffff00',
    cameras: []
  },
  rocks: [[-95.081720, 29.564835], [-95.081020, 29.564835], [-95.081320, 29.564995]]
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

const viewName = {
  [BIG_DADDY]: 'Big Daddy',
  [SCOUT]: 'Scout',
  [FLYER]: 'Flyer',
  [ALL_CAMERAS]: 'All Cameras'
};

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
    let data = this.state.data;
    let batteryLevel = this.state.data.getIn([this.state.view, 'batteryLevel']);
    let loc = this.state.data.getIn([this.state.view, 'location']);
    let networkSpeed = this.state.data.getIn([this.state.view, 'networkSpeed']);
    let bearing = this.state.data.getIn([this.state.view, 'bearing']);
    let vehicleLocations = this.getVehicleLocationData();
    let rockLocations = this.state.data.get('rocks').toJS();

    return <div>

      {/* menu */}
      <div className='ui sidebar inverted vertical menu visible very thin'>
        <div className='item'><h2>W&M Robo Ops</h2></div>
        <div onClick={this.changeView.bind(this, ALL_CAMERAS)} className={`item ${this.state.view === ALL_CAMERAS ? 'active' : ''}`}>
          <div>All Cameras</div>
        </div>
        <div onClick={this.changeView.bind(this, BIG_DADDY)} className={`item ${this.state.view === BIG_DADDY ? 'active' : ''}`}>
          {data.getIn([BIG_DADDY, 'batteryLevel']) < 20 && <i className="icon warning red"></i>}
          Big Daddy
        </div>
        <div onClick={this.changeView.bind(this, SCOUT)} className={`item ${this.state.view === SCOUT ? 'active' : ''}`}>
          {data.getIn([SCOUT, 'batteryLevel']) < 20 && <i className="icon warning red"></i>}
          Scout
        </div>
        <div onClick={this.changeView.bind(this, FLYER)} className={`item ${this.state.view === FLYER ? 'active' : ''}`}>
          {data.getIn([FLYER, 'batteryLevel']) < 20 && <i className="icon warning red"></i>}
          Flyer
        </div>
      </div>


      <div className='pusher' style={{padding: '25px', marginLeft: '210px'}}>

        <div style={{marginBottom: '20px'}}>
          <h1 className='ui block header center'>{viewName[this.state.view]}</h1>
        </div>

        {this.state.view === ALL_CAMERAS && <AllCamerasView />}

        {this.state.view !== ALL_CAMERAS && <div>

          <div className='ui grid'>
            {/* cameras */}
            <div className='ten wide column'>
              <div className='ui teal padded segment'>
                <h1 className='ui dividing header'>cameras</h1>

                {/* camera controls */}
                <CameraControls />

                <VideoPlayer />

              </div>
            </div>
            {/* /cameras */}

            {/* metrics */}
            <div className='six wide column'>

              {/* location */}
              <div className='ui black padded segment'>
                <h1 className='ui dividing header'>location</h1>
                <MainMap vehicles={vehicleLocations} rockLocations={rockLocations} />
                <BearingMap bearing={bearing} center={loc} markerColor={'#ff00ff'}/>
              </div>

              {/* battery level */}
              <div className='ui pink padded segment'>
                <h1 className='ui dividing header'>battery</h1>
                <Battery batteryLevel={batteryLevel}/>
              </div>

              {/* network and quality*/}
              <div className='ui purple padded segment'>
                <h1 className='ui dividing header'>network</h1>
                <NetworkSparkline data={networkSpeed.toJS()}/>
              </div>

            </div>
            {/* /metrics */}
          </div>

        </div>}

      </div>

    </div>;
  }

}
