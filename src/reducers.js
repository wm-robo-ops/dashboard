import Immutable from 'immutable';
import {
  MUTE,
  UNMUTE,
  ADD_ROCK,
  SET_ROCKS,
  TOGGLE_GPS,
  REMOVE_ROCK,
  PITCH_UPDATE,
  UPDATE_PHOTOS,
  TOGGLE_CAMERA,
  UPDATE_BEARING,
  BATTERY_UPDATE,
  SET_MIN_BATTERY,
  LOCATION_UPDATE,
  SET_ALL_CAMERAS,
  TOGGLE_DOF_DEVICE,
  NETWORK_SPEED_UPDATE
} from './actions';

function dashboardApp(state, action) {
  let { vehicle } = action;
  switch (action.type) {
    case BATTERY_UPDATE:
      state = state.setIn([vehicle, 'batteryLevel'], action.batteryLevel);
      return state.setIn([vehicle, 'batteryLevelHistory'], state.getIn([vehicle, 'batteryLevelHistory']).push(action.batteryLevel));
    case LOCATION_UPDATE:
      return state.setIn([vehicle, 'location'], Immutable.List(action.location)); // eslint-disable-line new-cap
    case NETWORK_SPEED_UPDATE:
      let s = state.setIn([vehicle, 'networkSpeed'], state.getIn([vehicle, 'networkSpeed']).push(Immutable.fromJS(action.data)));
      if (s.getIn([vehicle, 'networkSpeed']).size > 10) {
        s = s.setIn([vehicle, 'networkSpeed'], s.getIn([vehicle, 'networkSpeed']).shift()); // limit to 6 max in the array of data
      }
      return s;
    case UPDATE_BEARING:
      return state.setIn([vehicle, 'bearing'], action.bearing);
    case PITCH_UPDATE:
      return state.setIn([vehicle, 'pitch'], Immutable.List(action.pitch)); // eslint-disable-line new-cap
    case ADD_ROCK:
      let data = {
        lat: action.lat,
        lon: action.lon,
        color: action.color,
        id: action.id
      };
      return state.set('rocks', state.get('rocks').push(Immutable.fromJS(data))); // eslint-disable-line new-cap
    case REMOVE_ROCK:
      return state.set('rocks', state.get('rocks').filter(r => r.get('id') !== action.id));
    case SET_ROCKS:
      return state.set('rocks', Immutable.fromJS(action.rocks));
    case MUTE:
      return state.set('muted', true);
    case UNMUTE:
      return state.set('muted', false);
    case SET_MIN_BATTERY:
      return state.set('minBattery', action.min);
    case TOGGLE_CAMERA:
      return state.setIn(['cameras', action.camera, 'on'], !state.getIn(['cameras', action.camera, 'on']));
    case SET_ALL_CAMERAS:
      return state.set('cameras', Immutable.fromJS(action.cameras));
    case TOGGLE_GPS:
      return state.setIn(['gps', action.vehicle], !state.getIn(['gps', action.vehicle]));
    case TOGGLE_DOF_DEVICE:
      return state.setIn(['dofDevice', action.vehicle], !state.getIn(['dofDevice', action.vehicle]));
    case UPDATE_PHOTOS:
      return state.set('photos', action.photos);
  }
  return state;
}

export default dashboardApp;
