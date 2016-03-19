import React from 'react';
import mapboxgl from 'mapbox-gl';

class MainMap extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2VsdmluYWJyb2t3YSIsImEiO' +
        'iJkcUF1TWlVIn0.YzBtz0O019DJGk3IpFi72g';
    this.map = new mapboxgl.Map({
      container: this.refs.map,
      style: 'mapbox://styles/mapbox/satellite-v8',
      center: [-95.081320, 29.564835],
      zoom: 17.5
    });

    this.map.on('click', this.mapClick.bind(this));
    this.setStyle();
  }

  setStyle() {
    var set = () => {
      // rock layer
      this.map.addSource('rocksSource', {
        data: this.getRockGeoJSON(this.props.rockData),
        type: 'geojson'
      });
      this.map.addLayer(rocksStyle);

      // vehicles layer
      let { vehicles } = this.props;
      for (var i = 0; i < vehicles.length; i++) {
        this.map.addSource(vehicles[i].vehicle, {
          data: this.getVehicleGeoJSON(vehicles[i].coordinates),
          type: 'geojson'
        });
        this.map.addLayer(createVehicleStyle(vehicles[i]));
      }
    };

    // wait until map is loaded to set
    if (this.map.style.loaded()) {
      set();
    } else {
      this.map.on('load', () => {
        set();
      });
    }
  }

  getRockGeoJSON(rocks) {
    return {
      type: 'FeatureCollection',
      features: rocks.map(r => {
        return {
          type: 'Feature',
          properties: {
            id: r.id
          },
          geometry: {
            type: 'Point',
            coordinates: [r.lon, r.lat]
          }
        };
      })
    };
  }

  getVehicleGeoJSON(coordinates) {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates
      }
    };
  }

  componentWillReceiveProps(props) {
    if (!this.map.loaded()) {
      return;
    }
    props.vehicles.forEach(v => {
      this.map.getSource(v.vehicle).setData(this.getVehicleGeoJSON(v.coordinates));
    });
    this.map.getSource('rocksSource').setData(this.getRockGeoJSON(props.rockData));
  }

  componentWillUnmount() {
    this.map = null;
  }

  mapClick(e) {
    this.map.featuresAt(e.point, {
      radius: 1,
      layer: 'rocks'
    }, (err, results) => {
      if (err) console.log(err);
      if (!results.length) return;
      this.props.removeRock(results[0].properties.id);
    });
  }

  render() {
    let { vehicles } = this.props;
    return <div>
      <div style={{width: '100%', height: '300px'}} ref='map' id='map'></div>
      {/* legend */}
      <div>
        {vehicles.map(v => <div key={v.vehicle} style={{padding: '5px'}}>
          <div
            style={{
              display: 'inline-block',
              height: '10px',
              width: '10px',
              backgroundColor: v.color,
              marginRight: '5px',
              borderRadius: '5px'
            }}></div>
          <div style={{display: 'inline-block'}}>{v.vehicle}</div>
        </div>)}
      </div>
    </div>;
  }
}

MainMap.propTypes = {
  vehicles: React.PropTypes.arrayOf(React.PropTypes.shape({
    vehicle: React.PropTypes.string.isRequired,
    coordinates: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    color: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
  })),
  rockData: React.PropTypes.arrayOf(React.PropTypes.shape({
    color: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    lon: React.PropTypes.number.isRequired,
    lat: React.PropTypes.number.isRequired
  })),
  removeRock: React.PropTypes.func.isRequired
};

export default MainMap;

function createVehicleStyle(v) {
  return {
    'id': v.vehicle,
    'type': 'circle',
    'source': v.vehicle,
    'filter': ['all', ['==', '$type', 'Point']],
    'paint': {
      'circle-radius': 5,
      'circle-color': v.color
    },
    'interactive': true
  };
}

var rocksStyle = {
  'id': 'rocks',
  'type': 'circle',
  'source': 'rocksSource',
  'filter': ['all', ['==', '$type', 'Point']],
  'paint': {
    'circle-radius': 5,
    'circle-color': '#fff'
  },
  'interactive': true
};
