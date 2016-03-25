import React from 'react';
import mapboxgl from 'mapbox-gl';

export default class BearingMap extends React.Component {

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
      zoom: 16
    });
    this.setStyle();
  }

  setStyle() {
    var set = () => {
      this.map.addSource('markerSource', {
        data: this.getGeoJSON(),
        type: 'geojson'
      });
      this.map.addLayer(createMarkerStyle(this.props.markerColor));
    };
    if (this.map.style.loaded()) {
      set();
    } else {
      this.map.on('load', () => {
        set();
      });
    }
  }

  getGeoJSON() {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: this.props.center
      }
    };
  }

  componentWillReceiveProps(props) {
    this.map.setBearing(props.bearing);
    //this.map.setCenter(props.center);
  }

  render() {
    return <div style={{border: '5px solid #000', width: '33%'}}>
      <div style={{width: '100%', height: '100px'}} ref='map' id='map'></div>
    </div>;
  }

}

function createMarkerStyle(color) {
  return {
    'id': 'marker',
    'type': 'circle',
    'source': 'markerSource',
    'filter': ['all', ['==', '$type', 'Point']],
    'paint': {
      'circle-radius': 5,
      'circle-color': color
    },
    'interactive': true
  };
}

BearingMap.propTypes = {
  bearing: React.propTypes.number.isRequired,
  markerColor: React.propTypes.string.isRequired
};
