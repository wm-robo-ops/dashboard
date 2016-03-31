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
      this.map.batch(batch => {
        Object.keys(colors).map(color => batch.addLayer(getRockStyle(color)));
      });

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
    if (!this.map || !this.map.loaded()) {
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
    var features = this.map.queryRenderedFeatures(e.point, { layers: Object.keys(colors).map(c => c + 'Rocks' )});
    if (!features.length) {
      return;
    }
    var feature = features[0];
    var content = '<div style="text-align: center">' +
                    '<div style="padding: 10px">' +
                      feature.properties.color + ' rock!' +
                    '</div>' +
                    '<div >' +
                      '<button onclick="window.deleteRock(\'' + feature.properties.id + '\')">' +
                        'delete' +
                      '</button>' +
                    '</div>' +
                  '</div>';
    new mapboxgl.Popup()
      .setLngLat(feature.geometry.coordinates)
      .setHTML(content)
      .addTo(this.map);
  }

  render() {
    let { vehicles } = this.props;
    return <div>
      <div style={{width: '100%', height: '400px'}} ref='map' id='map'></div>
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
