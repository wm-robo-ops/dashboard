var flags = '-fps 200 -demuxer h264es ffmpeg://tcp://192.168.0.13:2222'.split(' ');
export default function getVideoStream() {
  var spawn = require('child_process').spawn;
  var videoStream = spawn('mplayer', flags).stdout;
  return videoStream;
}
