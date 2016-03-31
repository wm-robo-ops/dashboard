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
    var { active } = this.state;

    return <div>

      {this.state.selected && <div onClick={this.onEscape}>
        <VideoPlayer
          serverIP={this.props.serverIP}
          name={cameras[active].vehicle}
          nameReadable={cameras[active].nameReadable}
          capturePhoto={this.props.capturePhoto}/>
      </div>}

      {!this.state.selected && <div className='ui grid'>

        {Object.keys(cameras).map(cam => <div key={cam} className='eight wide column' onClick={this.enlarge.bind(this, cam)}>
          <VideoPlayer
            name={cameras[cam].vehicle}
            nameReadable={cameras[cam].nameReadable}
            serverIP={this.props.serverIP}
            capturePhoto={this.props.capturePhoto}/>
        </div>)}

      </div>}

    </div>;
  }

}

CamerasView.propTypes = {
  serverIP: React.PropTypes.string.isRequired,
  capturePhoto: React.PropTypes.func.isRequired,
  cameras: React.PropTypes.object.isRequired
};
