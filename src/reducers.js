import Immutable from 'immutable';
import {
  BATTERY_UPDATE,
  LOCATION_UPDATE,
  NETWORK_SPEED_UPDATE,
  UPDATE_BEARING,
  ADD_ROCK
} from './actions';

function dashboardApp(state, action) {
  let { vehicle } = action;
  switch (action.type) {
    case BATTERY_UPDATE:
      return state.setIn([vehicle, 'batteryLevel'], action.batteryLevel);
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
    case ADD_ROCK:
      return state.set('rocks', state.get('rocks').push(Immutable.List(action.coordinates))); // eslint-disable-line new-cap
  }
  return state;
}

export default dashboardApp;
