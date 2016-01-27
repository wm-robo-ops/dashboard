import Immutable from 'immutable';
import {
  BATTERY_UPDATE,
  LOCATION_UPDATE
} from './actions';

const initialState = Immutable.fromJS({
  bigDaddy: {
    location: [0, 0],
    battery: 100
  },
  scout: {
    location: [0, 0],
    battery: 50
  },
  flyer: {
    location: [0, 0],
    battery: 25
  }
});

function dashboardApp(state = initialState, action) {
  switch (action.type) {
    case BATTERY_UPDATE:
      return state.setIn([action.vehicle, 'battery'], action.batteryLevel);
    case LOCATION_UPDATE:
      return state.setIn([action.vehicle, 'location'], action.location);
  }
  return state;
}

export default dashboardApp;
