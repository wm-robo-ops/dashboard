import React from 'react';

export default class RockCoordinatesForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lon: null,
      lat: null
    };
  }

  setLon(e) {
    this.setState({ lon: parseFloat(e.target.value) });
  }

  setLat(e) {
    this.setState({ lat: parseFloat(e.target.value) });
  }

  setVehicleLocation() {
    let coords = this.refs.select.value.split(',').map(parseFloat);
    this.setState({ lon: coords[0], lat: coords[1] });
  }

  submit(fromSelect) {
    if (fromSelect) {
      this.setVehicleLocation();
    }
    for (var key in this.state) {
      if (this.state[key] === null) {
        return console.log('invalid coordinates'); // visible warning
      }
    }
    this.props.submit([this.state.lon, this.state.lat]);
  }

  render() {
    let vehicles = this.props.vehicleLocations;

    return <div className='ui two column middle aligned very relaxed stackable grid'>

      <div className='column'>
        <div className='ui form'>
          <div className='field'>
            <label>longitude</label>
            <input type='text' placeholder='longitude' onChange={this.setLon.bind(this)}/>
          </div>
          <div className='field'>
            <label>latitude</label>
            <input type='text' placeholder='latitude' onChange={this.setLat.bind(this)}/>
          </div>
          <button className='ui button' type='submit' onClick={this.submit.bind(this)}>Add</button>
        </div>
      </div>

      <div className="ui vertical divider">or</div>

      <div className='column'>
        <div className='ui form'>
          <div className='field'>
            <label>use vehicle location</label>
            <select className='ui fluid dropdown' ref='select' onChange={this.setVehicleLocation.bind(this)}>
              <option>---</option>
              {vehicles.map(v => <option key={v.vehicle} value={v.coordinates}>{v.name}</option>)}
            </select>
          </div>
          <button className='ui button' type='submit' onClick={this.submit.bind(this)}>Add</button>
        </div>
      </div>

    </div>;
  }

}
