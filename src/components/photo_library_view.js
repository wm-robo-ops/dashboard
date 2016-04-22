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
    if (this.state.selected)
      this.setState({ selected: false });
    else
      this.setState({ selected: true, active: pic });
  }

  componentDidMount() {
    window.addEventListener('keyup', this.onEscape);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.onEscape);
  }

  render() {
    return <div className={`ui stackable ${this.state.selected ? 'one' : 'three'} column grid`}>
      {this.state.selected && <PhotoCard serverIP={this.props.serverIP} url={this.state.active} enlarge={this.enlarge} enlarged={true}/>}
      {!this.state.selected && this.props.photos.map(p => <PhotoCard serverIP={this.props.serverIP} key={p} url={p} enlarge={this.enlarge} enlarged={false}/>)}
    </div>;
  }
}

class PhotoCard extends React.Component {
  render() {
    var { url, enlarged } = this.props;
    var idx = url.lastIndexOf('.');
    var data = url.slice(0, idx).split('_');
    var camera = data[0].replace(/~/g, ' ');
    var time = data[1].replace(/-/g, ':');
    var lon = data[2];
    var lat = data[3];
    var bearing = data[4];
    return <div className='column'>
      <div className='ui fluid blue card' onClick={this.props.enlarge.bind(this, url)}>
        <div className='content'>
          {camera}
          <div className='right floated meta'>{time}</div>
        </div>
        <div className='image'>
          <img src={`http://${this.props.serverIP}:6000/${url}`}/>
        </div>
        <div className='extra content'>
          <div>coordinates:</div>
          <div>{`(${lon}, ${lat})`}</div>
          <div>bearing:</div>
          <div>{bearing}</div>
        </div>
      </div>
    </div>;
  }
}

PhotoLibraryView.propTypes = {
  photos: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
};
