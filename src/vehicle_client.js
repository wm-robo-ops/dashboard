import fs from 'fs';

export function getBatteryLevel(vehicle) {
  console.log(vehicle);
  return randomInt(100);
}

export function getLocation(vehicle) {
  console.log(vehicle);
  return [randomInt(185), randomInt(90)];
}

export function getPhotos(vehicle) {
  console.log(vehicle);
  return fs.readdirSync('./test/photos').map(f => `./test/photos/${f}`); // make this better
}

var time = 1;
export function getNetworkSpeed(vehicle) {
  console.log(vehicle);
  return { time: time++, speed: randomInt(10) };
}

// utils
function randomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}
