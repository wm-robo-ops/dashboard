import React from 'react';
import jsmpeg from 'jsmpeg';

export default class VideoPlayer extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var address = `ws://${this.props.serverIP}:8084`;
    this.client = new WebSocket(address);
    var canvas = this.refs.videoCanvas;
    this.player = new jsmpeg(this.client, { canvas }); // eslint-disable-line new-cap, no-unused-vars
  }

  componentWillUnmount() {
    this.client.close();
    this.player = null; // force GC on jsmpeg
  }

  render() {
    return <div className='ui black padded segment'>
      <h1 className='ui dividing header'>{this.props.name}</h1>
      <div style={{width: '100%'}}>
        <canvas ref='videoCanvas' style={{width: '100%'}}/>
      </div>
    </div>;
  }

}

VideoPlayer.propTypes = {
  serverIP: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired
};
