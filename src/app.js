import React from 'react';
import Immutable from 'immutable';
import { createStore } from 'redux';

import {
  addRock,
  removeRock,
  updatePitch,
  updateBearing,
  updateBattery,
  updateLocation,
  updateNetworkSpeed
} from './actions';
import dashboardApp from './reducers';

import {
  getPitch,
  getBearing,
  getLocation,
  getBatteryLevel,
  getNetworkSpeed
} from './vehicle_client';
import {
  fetchStats
} from './api';

// components
import Battery from './components/battery';
import MainMap from './components/main_map';
//import BearingMap from './components/bearing_map';
import VideoPlayer from './components/video_player';
import AllCamerasView from './components/all_cameras_view';
import BearingVisualization from './components/bearing_viz';
import NetworkSparkline from './components/network_sparkline';
import RockCoordinatesForm from './components/rock_coordinates_form';
import MainCameraView from './components/main_camera_view';
import ZoomControl from './components/zoom_control';
import PanControl from './components/pan_control';

const POLL_INTERVAL = 1000; // milliseconds to wait between polling vehicles

const BIG_DADDY = 'bigDaddy';
const SCOUT = 'scout';
const FLYER = 'flyer';
const ALL_CAMERAS = 'allCameras';
const MAIN_CAMERA = 'mainCamera';
const vehicles = [ BIG_DADDY, SCOUT, FLYER ];

var store = createStore(dashboardApp, Immutable.fromJS({
  bigDaddy: {
    batteryLevel: 100,
    location: [0, 0],
    networkSpeed: [0],
    color: '#00ff99',
    cameras: [],
    pitch: [0, 0, 0]
  },
  scout: {
    batteryLevel: 100,
    location: [0, 0],
    networkSpeed: [0],
    color: '#ff00ff',
    cameras: [],
    pitch: [0, 0, 0]
  },
  flyer: {
    batteryLevel: 100,
    location: [0, 0],
    networkSpeed: [0],
    color: '#ffff00',
    cameras: [],
    pitch: [0, 0, 0]
  },
  rocks: []
}));

function updateFromServer() {
  fetchStats()
    .then(stats => {
      for (var vehicle in stats) {
        store.dispatch(updateBattery({
          vehicle,
          batteryLevel: stats[vehicle].batteryLevel
        }));
        store.dispatch(updateLocation({
          vehicle,
          location: stats[vehicle].location
        }));
        store.dispatch(updateNetworkSpeed({
          vehicle,
          data: stats[vehicle].networkSpeed
        }));
        store.dispatch(updateBearing({
          vehicle,
          bearing: stats[vehicle].bearing
        }));
        store.dispatch(updatePitch({
          vehicle,
          pitch: stats[vehicle].pitch
        }));
      }
    })
    .catch(e => console.log(e));
}

function mock() {
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
    store.dispatch(updatePitch({
      vehicle,
      pitch: getPitch(vehicle)
    }));
  }
}

function updateStats() {
  var isDemo = location.search.split('=')[1] === 'true';
  if (!isDemo) {
    updateFromServer();
  } else {
    mock();
  }
}

// poll for battery and location information
window.setInterval(updateStats, POLL_INTERVAL);

const names = {
  [BIG_DADDY]: 'Big Daddy',
  [SCOUT]: 'Scout',
  [FLYER]: 'Flyer',
  [ALL_CAMERAS]: 'All Cameras',
  [MAIN_CAMERA]: 'Main Camera'
};

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

  getVehicleLocationData() {
    return vehicles.map(v => {
      return {
        vehicle: v,
        coordinates: this.state.data.getIn([v, 'location']).toJS(),
        color: this.state.data.getIn([v, 'color']),
        name: names[v]
      };
    });
  }

  addRock(coordinates) {
    store.dispatch(addRock(coordinates));
  }

  removeRock(id) {
    store.dispatch(removeRock(id));
  }

  render() {
    var data = this.state.data;
    if (vehicles.some(v => v === this.state.view)) {
      //var loc = data.getIn([this.state.view, 'location']);
      //var bearing = data.getIn([this.state.view, 'bearing']);
      var batteryLevel = data.getIn([this.state.view, 'batteryLevel']);
      var networkSpeed = data.getIn([this.state.view, 'networkSpeed']).toJS();
      var vehicleLocations = this.getVehicleLocationData();
      var rockLocations = data.get('rocks').toJS();
      var pitch = data.getIn([this.state.view, 'pitch']);
    }

    return <div>

      {/* menu */}
      <div className='ui sidebar inverted vertical menu visible very thin'>
        <div className='item'><h2>W&M Robo Ops</h2></div>
        <div onClick={this.changeView.bind(this, ALL_CAMERAS)} className={`item ${this.state.view === ALL_CAMERAS ? 'active' : ''}`}>
          <div>All Cameras</div>
        </div>
        <div onClick={this.changeView.bind(this, MAIN_CAMERA)} className={`item ${this.state.view === MAIN_CAMERA ? 'active' : ''}`}>
          <div>Main Camera</div>
        </div>
        <div onClick={this.changeView.bind(this, BIG_DADDY)} className={`item ${this.state.view === BIG_DADDY ? 'active' : ''}`}>
          {data.getIn([BIG_DADDY, 'batteryLevel']) < 20 && <i className='icon warning red'></i>}
          Big Daddy
        </div>
        <div onClick={this.changeView.bind(this, SCOUT)} className={`item ${this.state.view === SCOUT ? 'active' : ''}`}>
          {data.getIn([SCOUT, 'batteryLevel']) < 20 && <i className='icon warning red'></i>}
          Scout
        </div>
        <div onClick={this.changeView.bind(this, FLYER)} className={`item ${this.state.view === FLYER ? 'active' : ''}`}>
          {data.getIn([FLYER, 'batteryLevel']) < 20 && <i className='icon warning red'></i>}
          Flyer
        </div>
      </div>


      <div className='pusher' style={{padding: '25px', marginLeft: '210px'}}>

        <div style={{marginBottom: '20px'}}>
          <h1 className='ui block header center'>{names[this.state.view]}</h1>
        </div>

        {this.state.view === ALL_CAMERAS && <AllCamerasView />}

        {this.state.view === MAIN_CAMERA && <MainCameraView />}

        {((this.state.view !== ALL_CAMERAS) && (this.state.view !== MAIN_CAMERA)) && <div>

          <div className='ui grid'>

            <div className='three wide column'>
              {/* zoom control */}
              <div className='ui teal padded segment'>
                <h1 className='ui dividing header'>zoom</h1>
                <ZoomControl />
              </div>

              {/* pan control */}
              <div className='ui teal padded segment'>
                <h1 className='ui dividing header'>pan</h1>
                <PanControl />
              </div>
            </div>

            <div className='seven wide column'>
              <div className='ui teal padded segment'>
                <h1 className='ui dividing header'>cameras</h1>
                <VideoPlayer />
              </div>
            </div>

            {/* location */}
            <div className='six wide column'>
              <div className='ui black padded segment'>
                <h1 className='ui dividing header'>location</h1>
                <MainMap vehicles={vehicleLocations} rockLocations={rockLocations} removeRock={this.removeRock}/>
                {/*<BearingMap bearing={bearing} center={loc} markerColor={'#ff00ff'}/>*/}
              </div>
            </div>

            {/* rock form */}
            <div className='five wide column'>
              <div className='ui red padded segment'>
                <h1 className='ui dividing header'>add rock</h1>
                <RockCoordinatesForm submit={this.addRock} vehicleLocations={vehicleLocations}/>
              </div>
            </div>

            {/* battery level */}
            <div className='five wide column'>
              <div className='ui pink padded segment'>
                <h1 className='ui dividing header'>battery</h1>
                <Battery batteryLevel={batteryLevel}/>
              </div>

              {/* network and quality*/}
              <div className='ui purple padded segment'>
                <h1 className='ui dividing header'>network</h1>
                <NetworkSparkline speed={networkSpeed}/>
              </div>
            </div>

            {/* bearing visualization */}
            <div className='six wide column'>
              <div className='ui red padded segment'>
                <h1 className='ui dividing header'>bearing</h1>
                <BearingVisualization x={pitch.get(0)} y={pitch.get(1)} z={pitch.get(2)} />
              </div>
            </div>


          </div>

        </div>}

      </div>

    </div>;
  }

}
