import React from 'react';
import jsmpeg from 'jsmpeg';

export default class VideoPlayer extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var address = 'ws://localhost:8084';
    var client = new WebSocket(address);
    var canvas = this.refs.videoCanvas;
    var player = new jsmpeg(client, { canvas }); // eslint-disable-line new-cap, no-unused-vars
  }

  render() {
    return <div style={{width: '100%'}}>
      <canvas ref='videoCanvas' style={{width: '100%'}}/>
    </div>;
  }

}
