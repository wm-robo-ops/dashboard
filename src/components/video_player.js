import React from 'react';
import jsmpeg from 'jsmpeg';
import CapturePhoto from './capture_photo';
import FrameRateSlider from './frame_rate_slider';
import DeviceToggle from './device_toggle';

export default class VideoPlayer extends React.Component {

  constructor(props) {
    super(props);
    this.changeFrameRate = this.changeFrameRate.bind(this);
    this.setupVideo = this.setupVideo.bind(this);
  }

  componentDidMount() {
    if (this.props.cameraData.on) {
      this.setupVideo();
    }
  }

  setupVideo() {
    var address = `ws://${this.props.serverIP}:${this.props.cameraData.port}`;
    this.client = new WebSocket(address);
    var canvas = this.refs.videoCanvas;
    this.player = new jsmpeg(this.client, { canvas });
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  componentWillReceiveProps(props) {
    if (!this.props.cameraData.on && props.cameraData.on) {
      this.setupVideo();
    }
  }

  componentWillUnmount() {
    if (this.client) {
      this.client.close();
    }
    this.player = null; // force GC on jsmpeg
  }

  changeFrameRate(frameRate) {
    this.props.changeFrameRate(this.props.name, frameRate);
  }

  render() {
    var { name, nameReadable, frameRate, on } = this.props.cameraData;
    return <div className='ui blue padded segment'>
      <h1 className='ui dividing header'>{nameReadable}</h1>
      <div style={{width: '100%'}}>
        <DeviceToggle checked={on} onChange={this.props.toggle} name={name}/>
        {on && <canvas ref='videoCanvas' style={{width: '100%'}}/>}
        <CapturePhoto camera={name} capture={this.props.capturePhoto}/>
        <FrameRateSlider changeFrameRate={this.changeFrameRate} frameRate={frameRate}/>
      </div>
    </div>;
  }

}

VideoPlayer.propTypes = {
  serverIP: React.PropTypes.string.isRequired,
  capturePhoto: React.PropTypes.func.isRequired,
  cameraData: React.PropTypes.shape({
    port: React.PropTypes.number.isRequired,
    frameRate: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
    nameReadable: React.PropTypes.string.isRequired,
    on: React.PropTypes.bool.isRequired
  }).isRequired,
  toggle: React.PropTypes.func.isRequired
};
