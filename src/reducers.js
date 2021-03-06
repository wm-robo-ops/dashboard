import Immutable from 'immutable';
import {
  ADD_ROCK,
  SET_ROCKS,
  TOGGLE_GPS,
  REMOVE_ROCK,
  UPDATE_PHOTOS,
  TOGGLE_VIDEO,
  LOCATION_UPDATE,
  SET_ALL_CAMERAS,
  TOGGLE_DOF_DEVICE,
  SET_ALL_GPS,
  SET_ALL_DOF_DEVICE,
  SET_SERVER_IP,
  CHANGE_FRAME_RATE,
  UPDATE_START_TIME,
  SET_VEHICLE_GEOJSON,
  SET_START_TIME
} from './actions';

function dashboardApp(state, action) {
  let { vehicle } = action;
  switch (action.type) {
    case LOCATION_UPDATE:
      return state.setIn([vehicle, 'location'], Immutable.List(action.location));
    case ADD_ROCK:
      let data = {
        lat: action.lat,
        lon: action.lon,
        color: action.color,
        id: action.id
      };
      return state.set('rocks', state.get('rocks').push(Immutable.fromJS(data)));
    case REMOVE_ROCK:
      return state.set('rocks', state.get('rocks').filter(r => r.get('id') !== action.id));
    case SET_ROCKS:
      return state.set('rocks', Immutable.fromJS(action.rocks));
    case TOGGLE_VIDEO:
      return state.setIn(['cameras', action.camera, 'on'], !state.getIn(['cameras', action.camera, 'on']));
    case SET_ALL_CAMERAS:
      return state.set('cameras', Immutable.fromJS(action.cameras));
    case TOGGLE_GPS:
      return state.setIn(['gps', action.vehicle, 'on'], !state.getIn(['gps', action.vehicle, 'on']));
    case SET_ALL_GPS:
      return state.set('gps', Immutable.fromJS(action.gps));
    case TOGGLE_DOF_DEVICE:
      return state.setIn(['dofDevice', action.vehicle, 'on'], !state.getIn(['dofDevice', action.vehicle, 'on']));
    case SET_ALL_DOF_DEVICE:
      return state.set('dofDevice', Immutable.fromJS(action.dofDevice));
    case UPDATE_PHOTOS:
      return state.set('photos', Immutable.List(action.photos));
    case SET_SERVER_IP:
      return state.set('serverIP', action.ip);
    case CHANGE_FRAME_RATE:
      return state.setIn(['cameras', action.camera, 'frameRate'], action.frameRate);
    case UPDATE_START_TIME:
      return state.setIn(['startTime', action.startTime]);
    case SET_VEHICLE_GEOJSON:
      return state.set('vehicleGeoJSON', Immutable.fromJS(action.geojson));
    case SET_START_TIME:
      return state.set('startTime', action.time);
  }
  return state;
}

export default dashboardApp;
