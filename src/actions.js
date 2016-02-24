export const BATTERY_UPDATE = 'BATTERY_UPDATE';
export const LOCATION_UPDATE = 'LOCATION_UPDATE';
export const NETWORK_SPEED_UPDATE = 'NETWORK_SPEED_UPDATE';
export const UPDATE_BEARING = 'UPDATE_BEARING';
export const ADD_ROCK = 'ADD_ROCK';
export const REMOVE_ROCK = 'REMOVE_ROCK';

export function updateBattery(data) {
  let { vehicle, batteryLevel } = data;
  return { type: BATTERY_UPDATE, vehicle, batteryLevel };
}

export function updateLocation(data) {
  let { vehicle, location } = data;
  return { type: LOCATION_UPDATE, vehicle, location };
}

export function updateNetworkSpeed(d) {
  let { vehicle, data } = d;
  return { type: NETWORK_SPEED_UPDATE, vehicle, data };
}

export function updateBearing(data) {
  let { vehicle, bearing } = data;
  return { type: UPDATE_BEARING, vehicle, bearing };
}

export function addRock(coordinates) {
  return { type: ADD_ROCK, coordinates };
}

export function removeRock(id) {
  return { type: REMOVE_ROCK, id };
}
