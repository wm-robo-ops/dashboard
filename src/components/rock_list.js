import React from 'react';

class RockList extends React.Component {

  constructor(props) {
    super(props);
  }

  removeRock(id) {
    this.props.removeRock(id);
  }

  render() {
    return <div>
      <table className='ui celled table'>
        <thead>
          <tr>
            <th></th>
            <th>id</th>
            <th>Color</th>
            <th>Longitude</th>
            <th>Latitude</th>
          </tr>
        </thead>
        <tbody>
          {this.props.rocks.map(r => <tr key={r.id}>
            <td>
              <i className='remove icon hover-red' onClick={this.removeRock.bind(this, r.id)}></i>
            </td>
            <td>{r.name}</td>
            <td>{r.color}</td>
            <td>{r.lon.toFixed(4)}</td>
            <td>{r.lat.toFixed(4)}</td>
          </tr>)}
        </tbody>
      </table>
    </div>;
  }

}

RockList.propTypes = {
  removeRock: React.PropTypes.func.isRequired,
  rocks: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    color: React.PropTypes.string.isRequired,
    lon: React.PropTypes.number.isRequired,
    lat: React.PropTypes.number.isRequired
  })).isRequired
};

export default RockList;
