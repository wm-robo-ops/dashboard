import React from 'react';

const CAM_ONE = 'cam1';
const CAM_TWO = 'cam2';
const CAM_THREE = 'cam3';
const CAM_FOUR = 'cam4';
const CAM_FIVE = 'cam5';

const cameras = {
  [CAM_ONE]: {
    name: 'Camera One',
    url: 'URL_ONE'
  },
  [CAM_TWO]: {
    name: 'Camera Two',
    url: 'URL_TWO'
  },
  [CAM_THREE]: {
    name: 'Camera Three',
    url: 'URL_THREE'
  },
  [CAM_FOUR]: {
    name: 'Camera Four',
    url: 'URL_FOUR'
  },
  [CAM_FIVE]: {
    name: 'Camera Five',
    url: 'URL_FIVE'
  }
};


export default class MainCameraView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      camera: CAM_ONE
    };
  }

  setCameraView() {
    this.setState({ camera: this.refs.select.value })
  }

  render() {
    return <div className='ui grid'>

      <div className='sixteen wide column'>
        <div className='ui teal padded segment'>
          <h1 className='ui dividing header'></h1>
          <VideoPlayer url={cameras[this.state.camera].url} />
        </div>
        <select className='ui fluid dropdown' ref='select' onChange={this.setCameraView.bind(this)}>
          <option value={CAM_ONE}>{cameras[CAM_ONE].name}</option>
          <option value={CAM_TWO}>{cameras[CAM_TWO].name}</option>
          <option value={CAM_THREE}>{cameras[CAM_THREE].name}</option>
          <option value={CAM_FOUR}>{cameras[CAM_FOUR].name}</option>
          <option value={CAM_FIVE}>{cameras[CAM_FIVE].name}</option>
        </select>
      </div>

    </div>;
  }

}

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div>
      {this.props.url}
      <video src="http://v2v.cc/~j/theora_testsuite/320x240.ogg" controls style={{width: '100%'}}>
        Your browser does not support the <code>video</code> element.
      </video>
    </div>;
  }
}
