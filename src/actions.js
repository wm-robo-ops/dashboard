export const MUTE = 'MUTE';
export const UNMUTE = 'UNMUTE';
export const ADD_ROCK = 'ADD_ROCK';
export const SET_ROCKS = 'SET_ROCKS';
export const REMOVE_ROCK = 'REMOVE_ROCK';
export const PITCH_UPDATE = 'PITCH_UPDATE';
export const BATTERY_UPDATE = 'BATTERY_UPDATE';
export const UPDATE_BEARING = 'UPDATE_BEARING';
export const LOCATION_UPDATE = 'LOCATION_UPDATE';
export const NETWORK_SPEED_UPDATE = 'NETWORK_SPEED_UPDATE';

export function updateBattery(data) {
  let { vehicle, batteryLevel } = data;
  return { type: BATTERY_UPDATE, vehicle, batteryLevel };
}

export function updateLocation(data) {
  let { vehicle, location } = data;
  return { type: LOCATION_UPDATE, vehicle, location };
}

export function updateNetworkSpeed(data) {
  return Object.assign({ type: NETWORK_SPEED_UPDATE }, data);
}

export function updateBearing(data) {
  let { vehicle, bearing } = data;
  return { type: UPDATE_BEARING, vehicle, bearing };
}

export function updatePitch(data) {
  let { vehicle, pitch } = data;
  return { type: PITCH_UPDATE, vehicle, pitch };
}

export function addRock(data) {
  return Object.assign({ type: ADD_ROCK }, data);
}

export function setRocks(rocks) {
  return { type: SET_ROCKS, rocks };
}

export function removeRock(id) {
  return { type: REMOVE_ROCK, id };
}

export function mute() {
  return { type: MUTE };
}

export function unmute() {
  return { type: UNMUTE };
}
