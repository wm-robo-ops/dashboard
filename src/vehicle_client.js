import fs from 'fs';

export function getBatteryLevel() {
  return randomInt(100);
}

export function getLocation() {
  return [randomInt(185), randomInt(90)];
}

function randomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

export function getPhotos() {
  return fs.readdirSync('./test/photos').map(f => `./test/photos/${f}`); // make this better
}

var time = 1;
export function getNetworkSpeed() {
  return { time: time++, speed: randomInt(10) };
}
