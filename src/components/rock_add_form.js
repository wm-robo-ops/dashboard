import React from 'react';

export default class RockAddForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lon: null,
      lat: null,
      color: null
    };
  }

  setLon(e) {
    this.setState({ lon: parseFloat(e.target.value) });
  }

  setLat(e) {
    this.setState({ lat: parseFloat(e.target.value) });
  }

  setVehicleLocation() {
    let coords = this.refs.vehicleSelect.value.split(',').map(parseFloat);
    this.setState({ lon: coords[0], lat: coords[1] });
  }

  setColor() {
    let color = this.refs.colorSelect.value;
    this.setState({ color });
  }

  submit(fromSelect) {
    if (fromSelect) {
      this.setVehicleLocation();
    }
    for (var key in this.state) {
      if (this.state[key] === null) {
        return console.log('ERROR: Invalid coordinates or color'); // visible warning
      }
    }
    this.props.submit(Object.assign({}, this.state)); // MUTATIONS?!?!
    this.resetForm();
  }

  resetForm() {
    this.setState({ lon: null, lat: null, color: null });
    this.refs.colorSelect.value = '---';
    this.refs.vehicleSelect.value = '---';
    this.refs.lonInput.value = '';
    this.refs.latInput.value = '';
  }

  render() {
    let vehicles = this.props.vehicleGeoJSON.features;

    return <div>

      <div>
        <div className='ui form'>
          <div className='field'>
            <label>color</label>
            <select className='ui fluid dropdown' ref='colorSelect' onChange={this.setColor.bind(this)}>
              <option ref='default'>---</option>
              {Object.keys(this.props.colors).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className='ui divider'></div>

      <div className='ui segment'>
        <div className='ui two column middle aligned very relaxed stackable grid'>

          <div className='column'>
            <div className='ui form'>
              <div className='field'>
                <label>longitude</label>
                <input type='text' placeholder='longitude' ref='lonInput' onChange={this.setLon.bind(this)}/>
              </div>
              <div className='field'>
                <label>latitude</label>
                <input type='text' placeholder='latitude' ref='latInput' onChange={this.setLat.bind(this)}/>
              </div>
              <button className='ui button' type='submit' onClick={this.submit.bind(this)}>Add</button>
            </div>
          </div>

          <div className="ui vertical divider">or</div>

          <div className='column'>
            <div className='ui form'>
              <div className='field'>
                <label>use vehicle location</label>
                <select className='ui fluid dropdown' ref='vehicleSelect' onChange={this.setVehicleLocation.bind(this)}>
                  <option>---</option>
                  {vehicles.map(v => <option key={v.properties.name} value={v.geometry.coordinates}>{v.properties.name}</option>)}
                </select>
              </div>
              <button className='ui button' type='submit' onClick={this.submit.bind(this)}>Add</button>
            </div>
          </div>

        </div>
      </div>

    </div>;
  }

}

RockAddForm.propTypes = {
  submit: React.PropTypes.func.isRequired,
  colors: React.PropTypes.object.isRequired
};
