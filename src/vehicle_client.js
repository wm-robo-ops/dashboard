export function getBatteryLevel(/*vehicle*/) {
  return random(0, 100, true);
}

export function getLocation(/*vehicle*/) {
  var center = [-95.081320, 29.564835];
  return [
    random(center[0] - 0.0004, center[0] + 0.0004),
    random(center[1] - 0.0004, center[1] + 0.0004)
  ];
}

var time = 1;
export function getNetworkSpeed(/*vehicle*/) {
  return { time: time++, speed: random(0, 10, true) };
}

export function getBearing() {
  return random(0, 179, true);
}

function random(min, max, integer) {
  var d = max - min;
  var n = Math.random() * d + min;
  n = integer ? Math.floor(n) + 1 : n;
  return n;
}
