import React from 'react';
import Immutable from 'immutable';
import { createStore } from 'redux';
import hat from 'hat';

// actions
import {
  addRock,
  setRocks,
  toggleGPS,
  setAllGPS,
  removeRock,
  setServerIP,
  updatePitch,
  toggleVideo,
  updatePhotos,
  updateBearing,
  setAllCameras,
  updateLocation,
  toggleDOFDevice,
  setAllDOFDevice,
  changeFrameRate
} from './actions';

// reducers
import dashboardApp from './reducers';

// API
import Api from './api';

// components
import Time from './components/time';
import MainMap from './components/main_map';
import RockList from './components/rock_list';
import MapView from './components/map_view';
import BearingMap from './components/bearing_map';
import RockAddForm from './components/rock_add_form';
import VideoPlayer from './components/video_player';
import CamerasView from './components/cameras_view';
import DeviceToggle from './components/device_toggle';
import SettingsView from './components/settings_view';
import PasswordModal from './components/password_modal';
import PhotoLibraryView from './components/photo_library_view';
import DOFDeviceVisualization from './components/dof_device_visualization';

const POLL_INTERVAL = 2000;

const SCOUT = 'scout';
const FLYER = 'flyer';
const CAMERAS = 'cameras';
const SETTINGS = 'settings';
const BIG_DADDY = 'bigDaddy';
const PHOTO_LIBRARY = 'photoLibrary';
const MAP = 'map';
const vehicles = [BIG_DADDY, SCOUT, FLYER];

var store = createStore(dashboardApp, Immutable.fromJS({
  bigDaddy: { location: [0, 0], pitch: [0, 0, 0] },
  scout: { location: [0, 0], pitch: [0, 0, 0] },
  flyer: { location: [0, 0], pitch: [0, 0, 0] },
  rocks: [],
  cameras: {
    bigDaddyMain: {
      vehicle: BIG_DADDY,
      on: false,
      nameReadable: 'Big Daddy Main',
      frameRate: 30,
      port: 8001
    },
    bigDaddyArm: {
      vehicle: BIG_DADDY,
      on: false,
      nameReadable: 'Big Daddy Arm',
      frameRate: 30,
      port: 8002
    },
    scout: {
      vehicle: SCOUT,
      on: false,
      nameReadable: 'Scout Main',
      frameRate: 30,
      port: 8003
    },
    flyer: {
      vehicle: FLYER,
      on: false,
      nameReadable: 'Flyer Main',
      frameRate: 30,
      port: 8004
    }
  },
  gps: {
    bigDaddy: { on: false, port: 4001, name: 'bigDaddy' },
    scout: { on: false, port: 4002, name: 'scout' },
    flyer: { on: false, port: 4003, name: 'flyer' }
  },
  dofDevice: {
    bigDaddy: { on: false, port: 3001, name: 'bigDaddy' },
    scout: { on: false, port: 3002, name: 'scout' },
    flyer: { on: false, port: 3003, name: 'flyer' }
  },
  photos: [],
  serverIP: 'ec2-54-172-2-230.compute-1.amazonaws.com',
  time: '00:00:00'
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
  [MAP]: 'Map',
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
    this.toggleCamera = this.toggleCamera.bind(this);
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

  toggleCamera(camera) {
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
    var time = data.get('time');

    var cameras = data.get('cameras').toJS();
    cameras = Object.keys(cameras)
      .map(c => {
        var cam = cameras[c];
        cam.name = c;
        return cam;
      });

    var vehicleLocations = this.getVehicleLocationData();
    var rockData = data.get('rocks').toJS();

    if (vehicles.some(v => v === view)) {
      var loc = data.getIn([view, 'location']).toJS();
      var bearing = data.getIn([view, 'pitch']).get(0);
      var gpsOn = data.getIn(['gps', view, 'on']);
      var color = data.getIn([view, 'color']);
      var dofData = data.getIn(['dofDevice', view]).toJS();
      cameras = cameras.filter(c => c.vehicle === view);
    }

    var isActive = v => v === view ? 'active' : '';

    return <div>

      {(this.state.correctPassword === false) && <PasswordModal checkPassword={this.checkPassword.bind(this)}/>}

      {(this.state.correctPassword === true) && <div>

      {/* sidebar */}
      <div className='ui left fixed vertical menu'>
        <div className='item'><h2>Robo Ops</h2></div>
        <div onClick={this.changeView.bind(this, CAMERAS)} className={`item ${isActive(CAMERAS)}`}>
          <div>Cameras</div>
        </div>
        <div onClick={this.changeView.bind(this, BIG_DADDY)} className={`item ${isActive(BIG_DADDY)}`}>
          Big Daddy
        </div>
        <div onClick={this.changeView.bind(this, SCOUT)} className={`item ${isActive(SCOUT)}`}>
          Scout
        </div>
        <div onClick={this.changeView.bind(this, FLYER)} className={`item ${isActive(FLYER)}`}>
          Flyer
        </div>
        <div onClick={this.changeView.bind(this, MAP)} className={`item ${isActive(MAP)}`}>
          Map
        </div>
        <div onClick={this.changeView.bind(this, PHOTO_LIBRARY)} className={`item ${isActive(PHOTO_LIBRARY)}`}>
          Photo Library
        </div>
        <div onClick={this.changeView.bind(this, SETTINGS)} className={`item ${isActive(SETTINGS)}`}>
          Settings
        </div>
      </div>

      <div className='pusher' style={{padding: '25px', marginLeft: '210px'}}>

        <div style={{marginBottom: '20px'}}>
          <h1 className='ui block header center'>{names[view]}</h1>
          <Time time={time}/>
        </div>

        {view === CAMERAS && <CamerasView
          serverIP={serverIP}
          capturePhoto={this.capturePhoto}
          cameras={cameras}
          toggle={this.toggleCamera}
        />}

        {view === MAP && <MapView vehicles={vehicleLocations} rockData={rockData} removeRock={this.removeRock}/>}

        {view === PHOTO_LIBRARY && <PhotoLibraryView photos={data.get('photos').toJS()} serverIP={serverIP} />}

        {view === SETTINGS && <SettingsView
          serverIP={serverIP}
          setServerIP={this.setServerIP}
        />}

        {vehicles.some(v => v === view) && <div>

          <div className='ui stackable two column grid'>

            {/* video */}
            {cameras.map(cam => <div className='column' key={cam.name}>
              <VideoPlayer
                serverIP={serverIP}
                capturePhoto={this.capturePhoto}
                changeFrameRate={this.changeFrameRate}
                cameraData={cam}
                toggle={this.toggleCamera}/>
            </div>
            )}

            {/* location */}
            <div className='column'>
              <div className='ui black padded segment'>
                <h1 className='ui dividing header'>Location</h1>
                <DeviceToggle checked={gpsOn} onChange={this.toggleGPS} name={view}/>
                <MainMap zoom={17.5} height='400' vehicles={vehicleLocations} rockData={rockData} removeRock={this.removeRock}/>
              </div>
            </div>

            <div className='column'>
              {/* rock form */}
              <div className='ui red padded segment'>
                <h1 className='ui dividing header'>Add Rock</h1>
                <RockAddForm submit={this.addRock} vehicleLocations={vehicleLocations} colors={colors}/>
              </div>

              {/* rock list */}
              <div className='ui brown padded segment'>
                <h1 className='ui dividing header'>Rocks</h1>
                <RockList rocks={rockData} removeRock={this.removeRock} />
              </div>
            </div>

            {/* dof device visualization */}
            <div className='column'>
              <div className='ui blue padded segment'>
                <h1 className='ui dividing header'>Bearing, Pitch, Roll</h1>
                <DOFDeviceVisualization
                  serverIP={serverIP}
                  deviceData={dofData}
                  toggle={this.toggleDOFDevice}/>
              </div>
            </div>

            {/* bearing map */}
            <div className='column'>
              <div className='ui yellow padded segment'>
                <h1 className='ui dividing header'>Bearing</h1>
                <BearingMap bearing={bearing} center={loc} markerColor={color}/>
              </div>
            </div>

          </div>

        </div>}

      </div>

      </div>}

    </div>;
  }

}
