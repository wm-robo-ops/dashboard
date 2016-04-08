export const ADD_ROCK = 'ADD_ROCK';
export const SET_ROCKS = 'SET_ROCKS';
export const TOGGLE_GPS = 'TOGGLE_GPS';
export const REMOVE_ROCK = 'REMOVE_ROCK';
export const UPDATE_PHOTOS = 'UPDATE_PHOTOS';
export const TOGGLE_VIDEO = 'TOGGLE_VIDEO';
export const BATTERY_UPDATE = 'BATTERY_UPDATE';
export const LOCATION_UPDATE = 'LOCATION_UPDATE';
export const SET_MIN_BATTERY = 'SET_MIN_BATTERY';
export const SET_ALL_CAMERAS = 'SET_ALL_CAMERAS';
export const TOGGLE_DOF_DEVICE = 'TOGGLE_DOF_DEVICE';
export const NETWORK_SPEED_UPDATE = 'NETWORK_SPEED_UPDATE';
export const SET_ALL_GPS = 'SET_ALL_GPS';
export const SET_ALL_DOF_DEVICE = 'SET_ALL_DOF_DEVICE';
export const SET_SERVER_IP = 'SET_SERVER_IP';
export const CHANGE_FRAME_RATE = 'CHANGE_FRAME_RATE';
export const UPDATE_START_TIME = 'UPDATE_START_TIME';
export const UPDATE_LOCATION_HISTORY = 'UPDATE_LOCATION_HISTORY';

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

export function addRock(data) {
  return Object.assign({ type: ADD_ROCK }, data);
}

export function setRocks(rocks) {
  return { type: SET_ROCKS, rocks };
}

export function removeRock(id) {
  return { type: REMOVE_ROCK, id };
}

export function setMinBattery(min) {
  return { type: SET_MIN_BATTERY, min };
}

export function toggleVideo(camera) {
  return { type: TOGGLE_VIDEO, camera };
}

export function setAllCameras(cameras) {
  return { type: SET_ALL_CAMERAS, cameras };
}

export function toggleGPS(vehicle) {
  return { type: TOGGLE_GPS, vehicle };
}

export function setAllGPS(gps) {
  return { type: SET_ALL_GPS, gps };
}

export function toggleDOFDevice(vehicle) {
  return { type: TOGGLE_DOF_DEVICE, vehicle };
}

export function setAllDOFDevice(dofDevice) {
  return { type: SET_ALL_DOF_DEVICE, dofDevice };
}

export function updatePhotos(photos) {
  return { type: UPDATE_PHOTOS, photos };
}

export function setServerIP(ip) {
  return { type: SET_SERVER_IP, ip };
}

export function changeFrameRate(camera, frameRate) {
  return { type: CHANGE_FRAME_RATE, camera, frameRate };
}

export function updateStartTime(startTime) {
  return { type: UPDATE_START_TIME, startTime };
}
