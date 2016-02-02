export const BATTERY_UPDATE = 'BATTERY_UPDATE';
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

export function updateNetworkSpeed(d) {
  let { vehicle, data } = d;
  return { type: NETWORK_SPEED_UPDATE, vehicle, data };
}
