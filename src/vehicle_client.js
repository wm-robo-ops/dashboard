export function getBatteryLevel() {
  return randomInt(100);
}

export function getLocation() {
  return [randomInt(185), randomInt(90)];
}

function randomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}
