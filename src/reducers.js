import Immutable from 'immutable';
import {
  BATTERY_UPDATE,
  LOCATION_UPDATE
} from './actions';

function dashboardApp(state, action) {
  switch (action.type) {
    case BATTERY_UPDATE:
      return state.setIn([action.vehicle, 'batteryLevel'], action.batteryLevel);
    case LOCATION_UPDATE:
      return state.setIn([action.vehicle, 'location'], Immutable.List(action.location)); // eslint-disable-line new-cap
  }
  return state;
}

export default dashboardApp;
