import React from 'react';

export default class PhotoLibraryView extends React.Component {

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

  enlarge(pic) {
    this.setState({ selected: true, active: pic });
  }

  componentDidMount() {
    window.addEventListener('keyup', this.onEscape);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.onEscape);
  }

  render() {
    return <div className='ui grid'>
      {this.state.selected && <PhotoLarge serverIP={this.props.serverIP} url={this.state.active} />}
      {!this.state.selected && this.props.photos.map(p => <PhotoCard serverIP={this.props.serverIP} key={p} url={p} enlarge={this.enlarge}/>)}
    </div>;
  }
}

class PhotoCard extends React.Component {
  render() {
    var { url } = this.props;
    var idx = url.lastIndexOf('.');
    var data = url.slice(0, idx).split('_');
    var camera = data[0].replace(/~/g, ' ');
    var time = data[1];
    var lon = data[2];
    var lat = data[3];
    var bearing = data[4];
    return <div className='five wide column'>
      <div className='ui card' onClick={this.props.enlarge.bind(this, url)}>
        <div className='image'>
          <img src={`http://${this.props.serverIP}:5555/${url}`}/>
            <div className='content'>
              <div className='description'>
                <div>camera: {camera}</div>
                <div>time: {time}</div>
                <div>coordinates: {`(${lon}, ${lat})`}</div>
                <div>bearing: {bearing}</div>
              </div>
            </div>
        </div>
      </div>
    </div>;
  }
}

class PhotoLarge extends React.Component {
  render() {
    return <div>
      <img style={{width: '100%'}} src={`http://${this.props.serverIP}:5555/${this.props.url}`}/>
    </div>;
  }
}

PhotoLibraryView.propTypes = {
  photos: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
};
