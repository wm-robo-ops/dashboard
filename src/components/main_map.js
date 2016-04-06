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
      style: 'mapbox://styles/mapbox/satellite-hybrid-v8',
      center: [-95.081320, 29.564835],
      zoom: this.props.zoom
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
      this.map.batch(batch => {
        Object.keys(colors).map(color => batch.addLayer(getRockStyle(color)));
      });

      // vehicles layer
      let { vehicles } = this.props;
      this.map.addSource('vehicleSource', {
        data: this.getVehicleGeoJSON(vehicles),
        type: 'geojson'
      });
      this.map.addLayer(vehicleLayerStyle);

      // setup popup
      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });
      this.map.on('mousemove', e => {
        var features = this.map.queryRenderedFeatures(e.point, { layers: ['vehicles'] });
        this.map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
        if (!features.length) {
          popup.remove();
          return;
        }
        var f = features[0];
        popup.setLngLat(f.geometry.coordinates)
          .setHTML(f.properties.name)
          .addTo(this.map);
      });
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
            id: r.id,
            color: r.color
          },
          geometry: {
            type: 'Point',
            coordinates: [r.lon, r.lat]
          }
        };
      })
    };
  }

  getVehicleGeoJSON(vehicles) {
    var icon, name;
    return {
      type: 'FeatureCollection',
      features: vehicles.map(v => {
        switch (v.vehicle) {
          case 'bigDaddy':
            icon = 'bus';
            name = 'bigDaddy';
            break;
          case 'scout':
            icon = 'car';
            name = 'scout';
            break;
          case 'flyer':
            icon = 'airfield';
            name = 'flyer';
            break;
        }
        return {
          type: 'Feature',
          properties: {
            icon, name
          },
          geometry: {
            type: 'Point',
            coordinates: v.coordinates
          }
        };
      })
    };
  }

  componentWillReceiveProps(props) {
    if (!this.map || !this.map.loaded()) {
      return;
    }
    this.map.getSource('vehicleSource').setData(this.getVehicleGeoJSON(props.vehicles));
    this.map.getSource('rocksSource').setData(this.getRockGeoJSON(props.rockData));
  }

  componentWillUnmount() {
    this.map.remove();
    this.map = null;
  }

  mapClick(e) {
    var features = this.map.queryRenderedFeatures(e.point, { layers: Object.keys(colors).map(c => c + 'Rocks' )});
    if (!features.length) {
      return;
    }
    var f = features[0];
    var content = '<div style="text-align: center">' +
                    '<div style="padding: 10px">' +
                      f.properties.color + ' rock!' +
                    '</div>' +
                    '<div style="padding: 10px">' +
                      f.geometry.coordinates[0].toFixed(2) + ', ' + f.geometry.coordinates[1].toFixed(2) +
                    '</div>' +
                    '<div >' +
                      '<button onclick="window.deleteRock(\'' + f.properties.id + '\')">' +
                        'delete' +
                      '</button>' +
                    '</div>' +
                  '</div>';
    new mapboxgl.Popup()
      .setLngLat(f.geometry.coordinates)
      .setHTML(content)
      .addTo(this.map);
  }

  render() {
    let { vehicles } = this.props;
    return <div>
      <div style={{width: '100%', height: this.props.height + 'px'}} ref='map' id='map'></div>
    </div>;
  }
}

MainMap.propTypes = {
  vehicles: React.PropTypes.arrayOf(React.PropTypes.shape({
    vehicle: React.PropTypes.string.isRequired,
    coordinates: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
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

var vehicleLayerStyle = {
  'id': 'vehicles',
  'type': 'symbol',
  'source': 'vehicleSource',
  'layout': {
    'icon-image': '{icon}-15'
  }
};

function getRockStyle(color) {
  return {
    'id': color + 'Rocks',
    'type': 'circle',
    'source': 'rocksSource',
    'filter': ['all', ['==', '$type', 'Point'], ['==', 'color', color]],
    'paint': {
      'circle-radius': 8,
      'circle-color': colors[color]
    }
  };
}

const colors = {
  purple: '#551A8B',
  orange: '#FFA500',
  yellow: '#FFFF00',
  green: '#008000',
  blue: '#0000FF',
  red: '#FF0000'
};
