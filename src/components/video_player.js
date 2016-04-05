import React from 'react';
import jsmpeg from 'jsmpeg';
import CapturePhoto from './capture_photo';
import FrameRateSlider from './frame_rate_slider';

export default class VideoPlayer extends React.Component {

  constructor(props) {
    super(props);
    this.changeFrameRate = this.changeFrameRate.bind(this);
  }

  componentDidMount() {
    var address = `ws://${this.props.serverIP}:${this.props.serverPort}`;
    this.client = new WebSocket(address);
    var canvas = this.refs.videoCanvas;
    this.player = new jsmpeg(this.client, { canvas });
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    if (this.client)
      this.client.close();
    this.player = null; // force GC on jsmpeg
  }

  changeFrameRate(frameRate) {
    this.props.changeFrameRate(this.props.name, frameRate);
  }

  render() {
    return <div className='ui blue padded segment'>
      <h1 className='ui dividing header'>{this.props.nameReadable}</h1>
      <div style={{width: '100%'}}>
        <canvas ref='videoCanvas' style={{width: '100%'}}/>
        <CapturePhoto camera={this.props.name} capture={this.props.capturePhoto}/>
        <FrameRateSlider changeFrameRate={this.changeFrameRate} frameRate={this.props.frameRate}/>
      </div>
    </div>;
  }

}

VideoPlayer.propTypes = {
  serverIP: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  capturePhoto: React.PropTypes.func.isRequired,
  nameReadable: React.PropTypes.string.isRequired,
  serverPort: React.PropTypes.number.isRequired,
  frameRate: React.PropTypes.number.isRequired
};
