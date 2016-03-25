/* eslint no-multi-spaces:0 */
import React from 'react';
import Immutable from 'immutable';
import { createStore } from 'redux';
import hat from 'hat';

// actions
import {
  mute,
  unmute,
  addRock,
  setRocks,
  toggleGPS,
  removeRock,
  updatePitch,
  toggleVideo,
  updatePhotos,
  setMinBattery,
  updateBearing,
  updateBattery,
  setAllCameras,
  updateLocation,
  toggleDOFDevice,
  updateNetworkSpeed,
  setAllGPS,
  setAllDOFDevice,
  setServerIP
} from './actions';

// reducers
import dashboardApp from './reducers';

// API
import Api from './api';
var API = new Api();

// mock API
import {
  getPitch,
  getBearing,
  getLocation,
  getBatteryLevel,
  getNetworkSpeed
} from './mock_client';

// components
import Battery                       from './components/battery';
import MainMap                       from './components/main_map';
import RockList                      from './components/rock_list';
import PanControl                    from './components/pan_control';
import ZoomControl                   from './components/zoom_control';
import VideoPlayer                   from './components/video_player';
import CamerasView                   from './components/cameras_view';
import SettingsView                  from './components/settings_view';
import CapturePhoto                  from './components/capture_photo';
import BatterySparkline              from './components/battery_sparkline';
import NetworkSparkline              from './components/network_sparkline';
import PhotoLibraryView              from './components/photo_library_view';
import RockCoordinatesForm           from './components/rock_coordinates_form';
import BearingPitchRollVisualization from './components/bearing_pitch_roll_visualization';

const POLL_INTERVAL = 2000; // milliseconds to wait between polling vehicles

const SCOUT = 'scout';
const FLYER = 'flyer';
const CAMERAS = 'cameras';
const SETTINGS = 'settings';
const BIG_DADDY = 'bigDaddy';
const PHOTO_LIBRARY = 'photoLibrary';
const vehicles = [BIG_DADDY, SCOUT, FLYER];

const BIG_DADDY_MAIN = 'BIG_DADDY_MAIN';
const BIG_DADDY_ARM = 'BIG_DADDY_ARM';
const SCOUT_1 = 'SCOUT_1';
const FLYER_1 = 'FLYER_1';

const photoCameras = {
  [BIG_DADDY_MAIN]: { vehicle: BIG_DADDY },
  [BIG_DADDY_ARM]: { vehicle: BIG_DADDY },
  [SCOUT_1]: { vehicle: SCOUT },
  [FLYER_1]: { vehicle: FLYER }
};

var store = createStore(dashboardApp, Immutable.fromJS({
  bigDaddy: {
    batteryLevel: 100,
    batteryLevelHistory: [0, 100],
    location: [0, 0],
    networkSpeed: [0],
    color: '#00ff00',
    pitch: [0, 0, 0]
  },
  scout: {
    batteryLevel: 100,
    batteryLevelHistory: [0, 100],
    location: [0, 0],
    networkSpeed: [0],
    color: '#ff00ff',
    pitch: [0, 0, 0]
  },
  flyer: {
    batteryLevel: 100,
    batteryLevelHistory: [0, 100],
    location: [0, 0],
    networkSpeed: [0],
    color: '#ffff00',
    pitch: [0, 0, 0]
  },
  rocks: [],
  cameras: {
    bigDaddyMain: { on: false, ip: '' },
    bigDaddyArm: { on: false, ip: '' },
    scout: { on: false, ip: '' },
    flyer: { on: false, ip: '' }
  },
  gps: {
    bigDaddy: false,
    scout: false,
    flyer: false
  },
  dofDevice: {
    bigDaddy: false,
    scout: false,
    flyer: false
  },
  muted: true,
  minBattery: 20,
  photos: [],
  serverIP: 'localhost'
}));

function updateFromServer() {
  API.getStats()
    .then(stats => {
      let vs = stats.vehicles;
      store.dispatch(setAllCameras(stats.cameras));
      store.dispatch(setAllGPS(stats.gps));
      store.dispatch(setAllDOFDevice(stats.dofDevice));
      for (var vehicle in vs) {
        store.dispatch(updateBattery({
          vehicle,
          batteryLevel: vs[vehicle].batteryLevel
        }));
        store.dispatch(updateLocation({
          vehicle,
          location: vs[vehicle].location
        }));
        store.dispatch(updateNetworkSpeed({
          vehicle,
          data: vs[vehicle].networkSpeed
        }));
        store.dispatch(updateBearing({
          vehicle,
          bearing: vs[vehicle].bearing
        }));
        store.dispatch(updatePitch({
          vehicle,
          pitch: vs[vehicle].pitch
        }));
      }
    })
    .catch(e => console.log(e));

  API.getRocks()
    .then(rocks => store.dispatch(setRocks(rocks)));

  API.getPhotos()
    .then(photos => store.dispatch(updatePhotos(photos)));
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
  [CAMERAS]: 'Cameras',
  [PHOTO_LIBRARY]: 'Photo Library',
  [SETTINGS]: 'Settings'
};

const colors = {
  purple: '',
  green: '',
  blue: '',
  red: '',
  orange: '',
  yellow: ''
};

/**
 * App class
 */
export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: store.getState(),
      view: BIG_DADDY
    };
    this.toggleGPS = this.toggleGPS.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
    this.capturePhoto = this.capturePhoto.bind(this);
    this.toggleDOFDevice = this.toggleDOFDevice.bind(this);
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

  addRock(data) {
    data.id = hat();
    store.dispatch(addRock(data));
    API.postRock(data);
  }

  removeRock(id) {
    store.dispatch(removeRock(id));
    API.deleteRock(id);
  }

  setMinBattery(min) {
    store.dispatch(setMinBattery(min));
  }

  toggleVideo(camera) {
    if (this.state.data.getIn(['cameras', camera, 'on'])) {
      store.dispatch(toggleVideo(camera));
      toggleVideo(camera, false);
    } else {
      store.dispatch(toggleVideo(camera));
      toggleVideo(camera, true);
    }
  }

  toggleGPS(vehicle) {
    if (this.state.data.getIn(['gps', vehicle])) {
      store.dispatch(toggleGPS(vehicle));
      API.toggleGPS(vehicle, false);
    } else {
      store.dispatch(toggleGPS(vehicle));
      API.toggleGPS(vehicle, true);
    }
  }

  toggleDOFDevice(vehicle) {
    if (this.state.data.getIn(['dofDevice', vehicle])) {
      store.dispatch(toggleDOFDevice(vehicle));
      API.toggleDOFDevice(vehicle, false);
    } else {
      store.dispatch(toggleDOFDevice(vehicle));
      API.toggleDOFDevice(vehicle, true);
    }
  }

  capturePhoto(camera) {
    var vehicle = photoCameras[camera].vehicle;
    var date = new Date();
    var time = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
    var lonLat = this.state.data.getIn([vehicle, 'location']);
    var loc = `${lonLat.get(0)}_${lonLat.get(1)}`;
    var bearing = this.state.data.getIn([vehicle, 'pitch', 0]);
    var name = `${camera.replace(/_/g, '~')}_${time}_${loc}_${bearing}.png`;
    API.capturePhoto(name);
  }

  setServerIP(ip) {
    store.dispatch(setServerIP(ip));
    API.setIP(ip);
  }

  render() {
    var data = this.state.data;

    var minBattery = data.get('minBattery');
    var serverIP = data.get('serverIP');

    if (vehicles.some(v => v === this.state.view)) {
      var batteryLevel = data.getIn([this.state.view, 'batteryLevel']);
      var batteryLevelHistory = data.getIn([this.state.view, 'batteryLevelHistory']).toJS();
      var networkSpeed = data.getIn([this.state.view, 'networkSpeed']).toJS();
      var vehicleLocations = this.getVehicleLocationData();
      var rockData = data.get('rocks').toJS();
    }

    if (this.state.view === SETTINGS) {
      var cameras = data.get('cameras').toJS();
      var gps = data.get('gps').toJS();
      var dofDevice = data.get('dofDevice').toJS();
    }

    var lowBattery = vehicles.some(v => {
      return data.getIn([v, 'batteryLevel']) < data.get('minBattery');
    });

    return <div>

      {(lowBattery && !data.get('muted')) && <audio preload autoPlay>
        <source src='./lowBattery.mp3' type='audio/mpeg'/>
        Your browser does not support the audio tag
      </audio>}

      {/* sidebar */}
      <div className='ui sidebar inverted vertical menu visible very thin'>
        <div className='item'><h2>W&M Robo Ops</h2></div>
        <div onClick={this.changeView.bind(this, CAMERAS)} className={`item ${this.state.view === CAMERAS ? 'active' : ''}`}>
          <div>Cameras</div>
        </div>
        <div onClick={this.changeView.bind(this, BIG_DADDY)} className={`item ${this.state.view === BIG_DADDY ? 'active' : ''}`}>
          {data.getIn([BIG_DADDY, 'batteryLevel']) < minBattery && <i className='icon warning red'></i>}
          Big Daddy
        </div>
        <div onClick={this.changeView.bind(this, SCOUT)} className={`item ${this.state.view === SCOUT ? 'active' : ''}`}>
          {data.getIn([SCOUT, 'batteryLevel']) < minBattery && <i className='icon warning red'></i>}
          Scout
        </div>
        <div onClick={this.changeView.bind(this, FLYER)} className={`item ${this.state.view === FLYER ? 'active' : ''}`}>
          {data.getIn([FLYER, 'batteryLevel']) < minBattery && <i className='icon warning red'></i>}
          Flyer
        </div>
        <div onClick={this.changeView.bind(this, PHOTO_LIBRARY)} className={`item ${this.state.view === PHOTO_LIBRARY ? 'active' : ''}`}>
          Photo Library
        </div>
        <div onClick={this.changeView.bind(this, SETTINGS)} className={`item ${this.state.view === SETTINGS ? 'active' : ''}`}>
          Settings
        </div>
      </div>


      <div className='pusher' style={{padding: '25px', marginLeft: '210px'}}>

        <div style={{marginBottom: '20px'}}>
          <h1 className='ui block header center'>{names[this.state.view]}</h1>
        </div>

        {this.state.view === CAMERAS && <CamerasView />}

        {this.state.view === PHOTO_LIBRARY && <PhotoLibraryView photos={data.get('photos')} />}

        {this.state.view === SETTINGS && <SettingsView
          cameras={cameras}
          gps={gps}
          dofDevice={dofDevice}
          toggleVideo={this.toggleVideo}
          toggleDOFDevice={this.toggleDOFDevice}
          toggleGPS={this.toggleGPS}
          muted={data.get('muted')}
          mute={store.dispatch.bind(this, mute())}
          unmute={store.dispatch.bind(this, unmute())}
          setMinBattery={this.setMinBattery}
          minBattery={data.get('minBattery')}
          serverIP={serverIP}
          setServerIP={this.setServerIP}
        />}

        {vehicles.some(v => v === this.state.view) && <div>

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

            {/* video */}
            <div className='seven wide column'>
              <VideoPlayer serverIP={serverIP} name='camera'/>
            </div>

            {/* location */}
            <div className='six wide column'>
              <div className='ui black padded segment'>
                <h1 className='ui dividing header'>location</h1>
                <MainMap vehicles={vehicleLocations} rockData={rockData} removeRock={this.removeRock}/>
              </div>
            </div>

            {/* rock form */}
            <div className='five wide column'>
              <div className='ui red padded segment'>
                <h1 className='ui dividing header'>add rock</h1>
                <RockCoordinatesForm submit={this.addRock} vehicleLocations={vehicleLocations} colors={colors}/>
              </div>
            </div>

            {/* battery level */}
            <div className='five wide column'>
              <div className='ui pink padded segment'>
                <h1 className='ui dividing header'>battery</h1>
                <Battery batteryLevel={batteryLevel}/>
                <BatterySparkline level={batteryLevelHistory}/>
              </div>
            </div>

            {/* bearing-pitch-roll visualization */}
            <div className='six wide column'>
              <div className='ui red padded segment'>
                <h1 className='ui dividing header'>bearing, pitch, roll</h1>
                <BearingPitchRollVisualization serverIP={serverIP} />
              </div>
            </div>

            {/* rock list */}
            <div className='six wide column'>
              <div className='ui red padded segment'>
                <h1 className='ui dividing header'>Rocks</h1>
                <RockList rocks={rockData} removeRock={this.removeRock} />
              </div>
            </div>

            {/* network and quality*/}
            <div className='five wide column'>
              <div className='ui purple padded segment'>
                <h1 className='ui dividing header'>network</h1>
                <NetworkSparkline speed={networkSpeed}/>
              </div>
            </div>

            {/* capature photo */}
            <div className='five wide column'>
              <div className='ui red padded segment'>
                <h1 className='ui dividing header'>capture photo</h1>
                <CapturePhoto camera={BIG_DADDY_MAIN} capture={this.capturePhoto}/>
              </div>
            </div>

            {/* bearing map */}
            <div className='five wide column'>
              <div className='ui red padded segment'>
                <h1 className='ui dividing header'>bearing</h1>
                {/*<BearingMap bearing={bearing} center={loc} markerColor={'#ff00ff'}/>*/}
              </div>
            </div>

          </div>

        </div>}

      </div>

    </div>;
  }

}
