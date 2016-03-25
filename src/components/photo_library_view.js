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
    return <div>
      {this.state.selected && <PhotoLarge url={this.state.active} />}
      {!this.state.selected && this.props.photos.map(p => <PhotoCard key={p} url={p} enlarge={this.enlarge}/>)}
    </div>;
  }
}

class PhotoCard extends React.Component {
  render() {
    var data = this.props.url.split('.')[0].split('_');
    var camera = data[0];
    var time = data[1];
    var lon = data[2];
    var lat = data[3];
    var bearing = data[4];
    return <div className='ui card' onClick={this.props.enlarge.bind(this, this.props.url)}>
      <div className='image'>
        <img src={`http://localhost:5555/${this.props.url}`}/>
          <div className='content'>
            <div className='description'>
              <div>camera: {camera}</div>
              <div>time: {time}</div>
              <div>coordinates: {`(${lon}, ${lat})`}</div>
              <div>bearing: {bearing}</div>
            </div>
          </div>
      </div>
    </div>;
  }
}

class PhotoLarge extends React.Component {
  render() {
    return <div>
      <img style={{width: '100%'}} src={`http://localhost:5555/${this.props.url}`}/>
    </div>;
  }
}

PhotoLibraryView.propTypes = {
  photos: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
};
