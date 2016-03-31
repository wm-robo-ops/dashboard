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

// mock API
import {
  getPitch,
  getBearing,
  getLocation,
  getBatteryLevel,
  getNetworkSpeed
} from './mock_client';

// components
import MainMap                       from './components/main_map';
import RockList                      from './components/rock_list';
import BearingMap                    from './components/bearing_map';
import RockAddForm                   from './components/rock_add_form';
import VideoPlayer                   from './components/video_player';
import CamerasView                   from './components/cameras_view';
import SettingsView                  from './components/settings_view';
import PasswordModal                 from './components/password_modal';
import PhotoLibraryView              from './components/photo_library_view';
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
    color: '#000000',
    pitch: [0, 0, 0]
  },
  scout: {
    batteryLevel: 100,
    batteryLevelHistory: [0, 100],
    location: [0, 0],
    networkSpeed: [0],
    color: '#000000',
    pitch: [0, 0, 0]
  },
  flyer: {
    batteryLevel: 100,
    batteryLevelHistory: [0, 100],
    location: [0, 0],
    networkSpeed: [0],
    color: '#000000',
    pitch: [0, 0, 0]
  },
  rocks: [],
  cameras: {
    bigDaddyMain: { vehicle: BIG_DADDY, on: false, ip: '', nameReadable: 'Big Daddy Main' },
    bigDaddyArm: { vehicle: BIG_DADDY, on: false, ip: '', nameReadable: 'Big Daddy Arm' },
    scout: { vehicle: SCOUT, on: false, ip: '', nameReadable: 'Scout Main' },
    flyer: { vehicle: FLYER, on: false, ip: '', nameReadable: 'Flyer Main' }
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
  serverIP: 'ec2-54-172-2-230.compute-1.amazonaws.com'
}));

var API = new Api(store.getState().get('serverIP'));
window.deleteRock = function(id) {
  API.deleteRock(id);
};

function updateFromServer() {
  API.getStats()
    .then(stats => {
      let vs = stats.vehicles;
      store.dispatch(setAllCameras(stats.cameras));
      store.dispatch(setAllGPS(stats.gps));
      store.dispatch(setAllDOFDevice(stats.dofDevice));
      for (var vehicle in vs) {
        /*
        store.dispatch(updateBattery({
          vehicle,
          batteryLevel: vs[vehicle].batteryLevel
        }));
        store.dispatch(updateNetworkSpeed({
          vehicle,
          data: vs[vehicle].networkSpeed
        }));
        */
        store.dispatch(updateLocation({
          vehicle,
          location: vs[vehicle].location
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
      view: BIG_DADDY,
      correctPassword: false
    };
    this.toggleGPS = this.toggleGPS.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
    this.capturePhoto = this.capturePhoto.bind(this);
    this.toggleDOFDevice = this.toggleDOFDevice.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
  }

  componentWillMount() {
    if (localStorage.roboOpsPassword)
      this.checkPassword(localStorage.roboOpsPassword);
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
      API.toggleVideo(camera, false);
    } else {
      store.dispatch(toggleVideo(camera));
      API.toggleVideo(camera, true);
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
    console.log(photoCameras[camera]);
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

  checkPassword(password) {
    API.checkPassword(password)
      .then(() => {
        localStorage.setItem('roboOpsPassword', password);
        this.setState({correctPassword: true});
      })
      .catch(e => {
        console.log(e);
        alert('Incorrect Password!');
      });
  }

  render() {
    var data = this.state.data;
    var view = this.state.view;

    //var minBattery = data.get('minBattery');
    var serverIP = data.get('serverIP');

    var cameras = data.get('cameras').toJS();

    if (vehicles.some(v => v === view)) {
      //var batteryLevel = data.getIn([view, 'batteryLevel']);
      //var batteryLevelHistory = data.getIn([view, 'batteryLevelHistory']).toJS();
      //var networkSpeed = data.getIn([view, 'networkSpeed']).toJS();
      var vehicleLocations = this.getVehicleLocationData();
      var rockData = data.get('rocks').toJS();
      var loc = data.getIn([view, 'location']).toJS();
      var bearing = data.getIn([view, 'pitch']).get(0);
      var color = data.getIn([view, 'color']);
      cameras = Object.keys(cameras)
        .map(c => {
          var cam = cameras[c];
          cam.name = c;
          return cam;
        })
        .filter(c => c.vehicle === view);
    }

    if (view === SETTINGS) {
      var gps = data.get('gps').toJS();
      var dofDevice = data.get('dofDevice').toJS();
    }

    /*
    var lowBattery = vehicles.some(v => {
      return data.getIn([v, 'batteryLevel']) < data.get('minBattery');
    });
    */

    return <div>

      {(this.state.correctPassword === false) && <PasswordModal checkPassword={this.checkPassword.bind(this)}/>}

      {(this.state.correctPassword === true) && <div>

      {/*(lowBattery && !data.get('muted')) && <audio preload autoPlay>
        <source src='./lowBattery.mp3' type='audio/mpeg'/>
        Your browser does not support the audio tag
      </audio>*/}

      {/* sidebar */}
      <div className='ui sidebar inverted vertical menu visible very thin'>
        <div className='item'><h2>Robo Ops</h2></div>
        <div onClick={this.changeView.bind(this, CAMERAS)} className={`item ${view === CAMERAS ? 'active' : ''}`}>
          <div>Cameras</div>
        </div>
        <div onClick={this.changeView.bind(this, BIG_DADDY)} className={`item ${view === BIG_DADDY ? 'active' : ''}`}>
          {/*data.getIn([BIG_DADDY, 'batteryLevel']) < minBattery && <i className='icon warning red'></i>*/}
          Big Daddy
        </div>
        <div onClick={this.changeView.bind(this, SCOUT)} className={`item ${view === SCOUT ? 'active' : ''}`}>
          {/*data.getIn([SCOUT, 'batteryLevel']) < minBattery && <i className='icon warning red'></i>*/}
          Scout
        </div>
        <div onClick={this.changeView.bind(this, FLYER)} className={`item ${view === FLYER ? 'active' : ''}`}>
          {/*data.getIn([FLYER, 'batteryLevel']) < minBattery && <i className='icon warning red'></i>*/}
          Flyer
        </div>
        <div onClick={this.changeView.bind(this, PHOTO_LIBRARY)} className={`item ${view === PHOTO_LIBRARY ? 'active' : ''}`}>
          Photo Library
        </div>
        <div onClick={this.changeView.bind(this, SETTINGS)} className={`item ${view === SETTINGS ? 'active' : ''}`}>
          Settings
        </div>
      </div>


      <div className='pusher' style={{padding: '25px', marginLeft: '210px'}}>

        <div style={{marginBottom: '20px'}}>
          <h1 className='ui block header center'>{names[view]}</h1>
        </div>

        {view === CAMERAS && <CamerasView serverIP={serverIP} capturePhoto={this.capturePhoto} cameras={cameras}/>}

        {view === PHOTO_LIBRARY && <PhotoLibraryView photos={data.get('photos')} serverIP={serverIP} />}

        {view === SETTINGS && <SettingsView
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

        {vehicles.some(v => v === view) && <div>

          <div className='ui grid'>

            {/*<div className='three wide column'>
              <div className='ui teal padded segment'>
                <h1 className='ui dividing header'>zoom</h1>
                <ZoomControl />
              </div>

              <div className='ui teal padded segment'>
                <h1 className='ui dividing header'>pan</h1>
                <PanControl />
              </div>
            </div>*/}

            {/* video */}
            {cameras.map(cam => <div className='eight wide column' key={cam.name}>
              <VideoPlayer serverIP={serverIP} name={cam.name} capturePhoto={this.capturePhoto} nameReadable={cam.nameReadable}/>
            </div>
            )}

            {/* location */}
            <div className='eight wide column'>
              <div className='ui black padded segment'>
                <h1 className='ui dividing header'>location</h1>
                <MainMap vehicles={vehicleLocations} rockData={rockData} removeRock={this.removeRock}/>
              </div>
            </div>

            <div className='eight wide column'>
              {/* rock form */}
              <div className='ui red padded segment'>
                <h1 className='ui dividing header'>add rock</h1>
                <RockAddForm submit={this.addRock} vehicleLocations={vehicleLocations} colors={colors}/>
              </div>

              {/* rock list */}
              <div className='ui brown padded segment'>
                <h1 className='ui dividing header'>Rocks</h1>
                <RockList rocks={rockData} removeRock={this.removeRock} />
              </div>
            </div>

            {/* battery level */}
            {/*<div className='five wide column'>
              <div className='ui pink padded segment'>
                <h1 className='ui dividing header'>battery</h1>
                <Battery batteryLevel={batteryLevel}/>
                <BatterySparkline level={batteryLevelHistory}/>
              </div>
            </div>*/}

            {/* bearing-pitch-roll visualization */}
            <div className='eight wide column'>
              <div className='ui blue padded segment'>
                <h1 className='ui dividing header'>bearing, pitch, roll</h1>
                <BearingPitchRollVisualization serverIP={serverIP} />
              </div>
            </div>

            {/* network and quality*/}
            {/*<div className='five wide column'>
              <div className='ui purple padded segment'>
                <h1 className='ui dividing header'>network</h1>
                <NetworkSparkline speed={networkSpeed}/>
              </div>
            </div>*/}

            {/* bearing map */}
            <div className='eight wide column'>
              <div className='ui yellow padded segment'>
                <h1 className='ui dividing header'>bearing</h1>
                {<BearingMap bearing={bearing} center={loc} markerColor={color}/>}
              </div>
            </div>

          </div>

        </div>}

      </div>

      </div>}

    </div>;
  }

}
