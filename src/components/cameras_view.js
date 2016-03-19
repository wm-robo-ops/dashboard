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
    return <div>

      {this.state.selected && <div onClick={this.onEscape}>
        <VideoPlayer name={this.state.active}/>
      </div>}

      {!this.state.selected && <div className='ui grid'>

        <div className='eight wide column' onClick={this.enlarge.bind(this, 'Big Daddy Main')}>
          <VideoPlayer name='Big Daddy Main'/>
        </div>

        <div className='eight wide column' onClick={this.enlarge.bind(this, 'Big Daddy Arm')}>
          <VideoPlayer name='Big Daddy Arm'/>
        </div>

        <div className='eight wide column' onClick={this.enlarge.bind(this, 'Scout')}>
          <VideoPlayer name='Scout'/>
        </div>

        <div className='eight wide column' onClick={this.enlarge.bind(this, 'Flyer')}>
          <VideoPlayer name='Flyer'/>
        </div>

      </div>}

    </div>;
  }

}
