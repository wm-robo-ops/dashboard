import React from 'react';
import mapboxgl from 'mapbox-gl';

export default class MainMap extends React.Component {

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
      zoom: 17
    });

    this.setStyle();
  }

  setStyle() {
    var set = () => {
      // rock layer
      this.map.addSource('rocks', {
        data: this.getRockGeoJSON(),
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

  getRockGeoJSON() {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiPoint',
        coordinates: this.props.rockLocations
      }
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

  componentWillReceiveProps(/*props*/) {
  }

  render() {
    return <div>
      <div style={{width: '100%', height: '300px'}} ref='map' id='map'></div>
    </div>;
  }
}

function createVehicleStyle(v) {
  return {
    'id': v.vehicle,
    'type': 'circle',
    'source': 'draw',
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
  'source': 'rockSource',
  'filter': ['all', ['==', '$type', 'Point']],
  'paint': {
    'circle-radius': 5,
    'circle-color': '#000'
  },
  'interactive': true
};
