export function getBatteryLevel(/*vehicle*/) {
  return randomInt(100);
}

export function getLocation(/*vehicle*/) {
  return [randomInt(185), randomInt(90)];
}

var time = 1;
export function getNetworkSpeed(/*vehicle*/) {
  return { time: time++, speed: randomInt(10) };
}

export function getBearing() {
  return randomInt(50);
}

// utils
function randomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}
