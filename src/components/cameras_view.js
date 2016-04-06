import React from 'react';
import VideoPlayer from './video_player';

export default class CamerasView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };
    this.onEscape = this.onEscape.bind(this);
    this.enlarge = this.enlarge.bind(this);
  }

  onEscape() {
    this.setState({ selected: false });
  }

  componentDidMount() {
    window.addEventListener('keyup', this.onEscape);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.onEscape);
  }

  enlarge(active) {
    this.setState({ selected: true, active });
  }

  render() {
    var { cameras } = this.props;
    var { active, selected } = this.state;

    var camera;
    if (selected) {
      camera = cameras.find(c => c.name === active);
    }

    return <div>
      {this.state.selected && <div onClick={this.onEscape}>
        <VideoPlayer
          serverIP={this.props.serverIP}
          capturePhoto={this.props.capturePhoto}
          cameraData={camera}
          toggle={this.props.toggle}/>
      </div>}

      {!this.state.selected && <div className='ui stackable two column grid'>

        {cameras.map(cam => <div key={cam.name} className='column' onClick={this.enlarge.bind(this, cam.name)}>
          <VideoPlayer
            serverIP={this.props.serverIP}
            capturePhoto={this.props.capturePhoto}
            cameraData={cam}
            toggle={this.props.toggle}/>
        </div>)}

      </div>}

    </div>;
  }

}

CamerasView.propTypes = {
  serverIP: React.PropTypes.string.isRequired,
  capturePhoto: React.PropTypes.func.isRequired,
  cameras: React.PropTypes.array.isRequired
};
