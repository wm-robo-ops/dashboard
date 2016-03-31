import React from 'react';
import jsmpeg from 'jsmpeg';
import CapturePhoto from './capture_photo';

export default class VideoPlayer extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var address = `ws://${this.props.serverIP}:8084`;
    this.client = new WebSocket(address);
    var canvas = this.refs.videoCanvas;
    this.player = new jsmpeg(this.client, { canvas });
  }

  componentWillUnmount() {
    this.client.close();
    this.player = null; // force GC on jsmpeg
  }

  render() {
    return <div className='ui blue padded segment'>
      <h1 className='ui dividing header'>{this.props.nameReadable}</h1>
      <div style={{width: '100%'}}>
        <canvas ref='videoCanvas' style={{width: '100%'}}/>
        <CapturePhoto camera={this.props.name} capture={this.props.capturePhoto}/>
      </div>
    </div>;
  }

}

VideoPlayer.propTypes = {
  serverIP: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  capturePhoto: React.PropTypes.func.isRequired,
  nameReadable: React.PropTypes.string.isRequired
};
