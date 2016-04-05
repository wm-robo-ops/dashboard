import React from 'react';
import Immutable from 'immutable';
import { createStore } from 'redux';
import hat from 'hat';

// actions
import {
  addRock,
  setRocks,
  toggleGPS,
  removeRock,
  updatePitch,
  toggleVideo,
  updatePhotos,
  updateBearing,
  setAllCameras,
  updateLocation,
  toggleDOFDevice,
  setAllGPS,
  setAllDOFDevice,
  setServerIP,
  changeFrameRate
} from './actions';

// reducers
import dashboardApp from './reducers';

// API
import Api from './api';

// components
import MainMap from './components/main_map';
import RockList from './components/rock_list';
import BearingMap from './components/bearing_map';
import RockAddForm from './components/rock_add_form';
import VideoPlayer from './components/video_player';
import CamerasView from './components/cameras_view';
import SettingsView from './components/settings_view';
import PasswordModal from './components/password_modal';
import PhotoLibraryView from './components/photo_library_view';
import BearingPitchRollVisualization from './components/bearing_pitch_roll_visualization';

const POLL_INTERVAL = 2000;

const SCOUT = 'scout';
const FLYER = 'flyer';
const CAMERAS = 'cameras';
const SETTINGS = 'settings';
const BIG_DADDY = 'bigDaddy';
const PHOTO_LIBRARY = 'photoLibrary';
const vehicles = [BIG_DADDY, SCOUT, FLYER];

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
    bigDaddyMain: {
      vehicle: BIG_DADDY,
      on: false,
      ip: '',
      nameReadable: 'Big Daddy Main',
      frameRate: 30,
      port: 8001
    },
    bigDaddyArm: {
      vehicle: BIG_DADDY,
      on: false,
      ip: '',
      nameReadable: 'Big Daddy Arm',
      frameRate: 30,
      port: 8002
    },
    scout: {
      vehicle: SCOUT,
      on: false,
      ip: '',
      nameReadable: 'Scout Main',
      frameRate: 30,
      port: 8003
    },
    flyer: {
      vehicle: FLYER,
      on: false,
      ip: '',
      nameReadable: 'Flyer Main',
      frameRate: 30,
      port: 8004
    }
  },
  gps: {
    bigDaddy: { on: false, port: 4001 },
    scout: { on: false, port: 4002 },
    flyer: { on: false, port: 4003 }
  },
  dofDevice: {
    bigDaddy: { on: false, port: 3001 },
    scout: { on: false, port: 3002 },
    flyer: { on: false, port: 3003 }
  },
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

function startPolling() {
  window.setInterval(updateFromServer, POLL_INTERVAL);
}

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

const ports = {
  dofDevice: {
    [BIG_DADDY]: 3001,
    [SCOUT]: 3002,
    [FLYER]: 3003
  },
  gps: {
    [BIG_DADDY]: 4001,
    [SCOUT]: 4002,
    [FLYER]: 4003
  }
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
    this.changeFrameRate = this.changeFrameRate.bind(this);
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
    if (this.state.data.getIn(['gps', vehicle, 'on'])) {
      store.dispatch(toggleGPS(vehicle));
      API.toggleGPS(vehicle, false);
    } else {
      store.dispatch(toggleGPS(vehicle));
      API.toggleGPS(vehicle, true);
    }
  }

  toggleDOFDevice(vehicle) {
    if (this.state.data.getIn(['dofDevice', vehicle, 'on'])) {
      store.dispatch(toggleDOFDevice(vehicle));
      API.toggleDOFDevice(vehicle, false);
    } else {
      store.dispatch(toggleDOFDevice(vehicle));
      API.toggleDOFDevice(vehicle, true);
    }
  }

  capturePhoto(camera) {
    var vehicle = store.getState().getIn(['cameras', camera, 'vehicle']);
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
        startPolling();
      })
      .catch(e => {
        console.log(e);
        alert('Incorrect Password!');
      });
  }

  changeFrameRate(camera, frameRate) {
    store.dispatch(changeFrameRate(camera, frameRate));
    API.changeFrameRate(camera, frameRate);
  }

  render() {
    var data = this.state.data;
    var view = this.state.view;

    var serverIP = data.get('serverIP');

    var cameras = data.get('cameras').toJS();

    if (vehicles.some(v => v === view)) {
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

    return <div>

      {(this.state.correctPassword === false) && <PasswordModal checkPassword={this.checkPassword.bind(this)}/>}

      {(this.state.correctPassword === true) && <div>

      {/* sidebar */}
      <div className='ui sidebar inverted vertical menu visible very thin'>
        <div className='item'><h2>Robo Ops</h2></div>
        <div onClick={this.changeView.bind(this, CAMERAS)} className={`item ${view === CAMERAS ? 'active' : ''}`}>
          <div>Cameras</div>
        </div>
        <div onClick={this.changeView.bind(this, BIG_DADDY)} className={`item ${view === BIG_DADDY ? 'active' : ''}`}>
          Big Daddy
        </div>
        <div onClick={this.changeView.bind(this, SCOUT)} className={`item ${view === SCOUT ? 'active' : ''}`}>
          Scout
        </div>
        <div onClick={this.changeView.bind(this, FLYER)} className={`item ${view === FLYER ? 'active' : ''}`}>
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

        {view === PHOTO_LIBRARY && <PhotoLibraryView photos={data.get('photos').toJS()} serverIP={serverIP} />}

        {view === SETTINGS && <SettingsView
          cameras={cameras}
          gps={gps}
          dofDevice={dofDevice}
          toggleVideo={this.toggleVideo}
          toggleDOFDevice={this.toggleDOFDevice}
          toggleGPS={this.toggleGPS}
          serverIP={serverIP}
          setServerIP={this.setServerIP}
        />}

        {vehicles.some(v => v === view) && <div>

          <div className='ui grid'>

            {/* video */}
            {cameras.map(cam => <div className='eight wide column' key={cam.name}>
              <VideoPlayer
                serverIP={serverIP}
                serverPort={cam.port}
                name={cam.name}
                capturePhoto={this.capturePhoto}
                nameReadable={cam.nameReadable}
                changeFrameRate={this.changeFrameRate}
                frameRate={cam.frameRate}/>
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

            {/* bearing-pitch-roll visualization */}
            <div className='eight wide column'>
              <div className='ui blue padded segment'>
                <h1 className='ui dividing header'>bearing, pitch, roll</h1>
                <BearingPitchRollVisualization serverIP={serverIP} serverPort={ports.dofDevice[view]}/>
              </div>
            </div>

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
