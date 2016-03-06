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

  enlarge() {
    this.setState({ selected: true });
  }

  render() {
    return <div>

      {this.state.selected && <div className='ui teal padded segment' onClick={this.onEscape}>
        <h1 className='ui dividing header'></h1>
        <VideoPlayer />
      </div>}

      {!this.state.selected && <div className='ui grid'>

        <div className='eight wide column' onClick={this.enlarge}>
          <div className='ui teal padded segment'>
            <h1 className='ui dividing header'></h1>
            <VideoPlayer />
          </div>
        </div>

        <div className='eight wide column' onClick={this.enlarge}>
          <div className='ui teal padded segment'>
            <h1 className='ui dividing header'></h1>
            <VideoPlayer />
          </div>
        </div>

        <div className='eight wide column' onClick={this.enlarge}>
          <div className='ui teal padded segment'>
            <h1 className='ui dividing header'></h1>
            <VideoPlayer />
          </div>
        </div>

        <div className='eight wide column' onClick={this.enlarge}>
          <div className='ui teal padded segment'>
            <h1 className='ui dividing header'></h1>
            <VideoPlayer />
          </div>
        </div>

      </div>}

    </div>;
  }

}
