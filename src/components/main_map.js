import React from 'react';
import mapboxgl from 'mapbox-gl';

export default class MainMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      vehicles: true,
      rocks: true,
      traces: true,
      path: true
    };
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
        data: `http://${this.props.serverIP}:8080/rocks/geojson`,
        type: 'geojson'
      });

      // vehicle layer
      this.map.addSource('vehicleSource', {
        data: `http://${this.props.serverIP}:8080/location`,
        type: 'geojson'
      });

      // trace layer
      let { locationHistory } = this.props;
      this.map.addSource('traceSource', {
        data: `http://${this.props.serverIP}:8080/trace`,
        type: 'geojson'
      });

      // path layer
      this.map.addSource('pathSource', {
        data: `http://${this.props.serverIP}:8080/path`,
        type: 'geojson'
      });

      // add all styles in one batch
      this.map.batch(batch => {
        Object.keys(colors).map(color => batch.addLayer(getRockStyle(color)));
        batch.addLayer(vehicleLayerStyle);
        batch.addLayer(bigDaddyTraceLayerStyle);
        batch.addLayer(scoutTraceLayerStyle);
        batch.addLayer(flyerTraceLayerStyle);
        batch.addLayer(pathStyle);
        batch.addLayer(alienStyle);
      });

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

  componentWillReceiveProps(props) {
    if (!this.map || !this.map.loaded()) {
      return;
    }
    this.map.getSource('vehicleSource').setData(props.vehicleGeoJSON);
    this.map.getSource('rocksSource').setData(`http://${this.props.serverIP}:8080/rocks/geojson`);
    this.map.getSource('traceSource').setData(`http://${this.props.serverIP}:8080/trace`);
    this.map.getSource('pathSource').setData(`http://${this.props.serverIP}:8080/path`);
  }

  componentWillUnmount() {
    this.map.remove();
    this.map = null;
  }

  mapClick(e) {
    var layers = Object.keys(colors).map(c => c + 'Rocks' );
    layers.push('alien');
    var features = this.map.queryRenderedFeatures(e.point, { layers });
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

  toggleLayer(layer) {
    var layers;
    switch (layer) {
      case 'vehicles':
        layers = ['vehicles'];
        break;
      case 'rocks':
        layers = Object.keys(colors).map(c => c + 'Rocks');
        layers.push('alien');
        break;
      case 'traces':
        layers = ['big-daddy-trace', 'scout-trace', 'flyer-trace'];
        break;
      case 'path':
        layers = ['path'];
        break;
    }
    this.setState({[layer]: !this.state[layer]}, () => {
      this.map.batch(batch => {
        layers.forEach(l => {
          batch.setLayoutProperty(l, 'visibility', this.state[layer] ? 'visible' : 'none');
        });
      });
    });
  }

  render() {
    var vd = this.props.vehicleGeoJSON.features;
    return <div>
      {vd.length && <div>
        {vd.map((v, i) => <div key={i}>{`${v.properties.name} - lon: ${v.geometry.coordinates[0]}, lat: ${v.geometry.coordinates[1]}`}</div>)}
      </div>}
      <div style={{width: '100%', height: this.props.height + 'px'}} ref='map' className='mb2' id='map'></div>
      <div>
        <div>
          <div className='ui toggle checkbox'>
            <input type='checkbox' checked={this.state.vehicles} onChange={this.toggleLayer.bind(this, 'vehicles')}/>
            <label className='bold'>vehicles</label>
          </div>
        </div>
        <div>
          <div className='ui toggle checkbox'>
            <input type='checkbox' checked={this.state.rocks} onChange={this.toggleLayer.bind(this, 'rocks')}/>
            <label className='bold'>rocks</label>
          </div>
        </div>
        <div>
          <div className='ui toggle checkbox'>
            <input type='checkbox' checked={this.state.traces} onChange={this.toggleLayer.bind(this, 'traces')}/>
            <label className='bold'>traces</label>
          </div>
        </div>
        <div>
          <div className='ui toggle checkbox'>
            <input type='checkbox' checked={this.state.path} onChange={this.toggleLayer.bind(this, 'path')}/>
            <label className='bold'>optimal path</label>
          </div>
        </div>
      </div>
    </div>;
  }
}

MainMap.propTypes = {
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

var alienStyle = {
  'id': 'alien',
  'type': 'symbol',
  'source': 'rocksSource',
  'filter': ['==', 'color', 'alien'],
  'layout': {
    'icon-image': 'aquarium-15'
  }
};

var bigDaddyTraceLayerStyle = {
  'id': 'big-daddy-trace',
  'type': 'line',
  'source': 'traceSource',
  'filter': ['==', 'vehicle', 'bigDaddy'],
  'paint': {
    'line-width': 1.7,
    'line-color': '#0000FF'
  }
};
var scoutTraceLayerStyle = {
  'id': 'scout-trace',
  'type': 'line',
  'source': 'traceSource',
  'filter': ['==', 'vehicle', 'scout'],
  'paint': {
    'line-width': 1.7,
    'line-color': '#FF0000'
  }
};
var flyerTraceLayerStyle = {
  'id': 'flyer-trace',
  'type': 'line',
  'source': 'traceSource',
  'filter': ['==', 'vehicle', 'flyer'],
  'paint': {
    'line-width': 1.7,
    'line-color': '#00FF00'
  }
};
var pathStyle = {
  'id': 'path',
  'type': 'line',
  'source': 'pathSource',
  'paint': {
    'line-width': 1.7,
    'line-color': '#000000'
  }
};

const colors = {
  purple: '#551A8B',
  orange: '#FFA500',
  yellow: '#FFFF00',
  green: '#008000',
  blue: '#0000FF',
  red: '#FF0000'
};
