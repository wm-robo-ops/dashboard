import React from 'react';
import mapboxgl from 'mapbox-gl';
import grid from '../grid';

export default class MainMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      vehicles: true,
      rocks: true,
      traces: true,
      path: true,
      grid: true
    };
    this.jumpTo = this.jumpTo.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2VsdmluYWJyb2t3YSIsImEiO' +
        'iJkcUF1TWlVIn0.YzBtz0O019DJGk3IpFi72g';
    this.map = new mapboxgl.Map({
      container: this.refs.map,
      style: 'mapbox://styles/kelvinabrokwa/cio7x5q690018bdnjqxr9yt6w',
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

      // grid layer
      this.map.addSource('gridSource', {
        data: grid,
        type: 'geojson'
      });

      // add all styles
      this.map.addLayer(gridStyle);
      this.map.addLayer(gridLabelStyle);
      this.map.addLayer(scoutTraceLayerStyle);
      this.map.addLayer(flyerTraceLayerStyle);
      this.map.addLayer(pathStyle);
      this.map.addLayer(alienStyle);
      Object.keys(colors).map(color => this.map.addLayer(getRockStyle(color)));
      this.map.addLayer(bigDaddyTraceLayerStyle);
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
                    '<div style="padding: 3px">' +
                      f.properties.color + ' rock' +
                    '</div>' +
                    '<div style="padding: 3px">' +
                      'id: ' + f.properties.name +
                    '</div>' +
                    '<div style="padding: 3px">' +
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
      case 'grid':
        layers = ['grid', 'gridLabel'];
        break;
    }
    this.setState({[layer]: !this.state[layer]}, () => {
      layers.forEach(l => {
        this.map.setLayoutProperty(l, 'visibility', this.state[layer] ? 'visible' : 'none');
      });
    });
  }

  jumpTo(coords) {
    this.map.flyTo({ center: coords });
  }

  reset() {
    this.map.flyTo({ center: [-95.081320, 29.564835], zoom: this.props.zoom });
  }

  render() {
    var vd = this.props.vehicleGeoJSON.features;
    return <div>
      {(vd.length > 0) && <div className='mb2'>
        {vd.map((v, i) => <div key={i}><span className='bold'>{`${names[v.properties.name]}`}</span> &#8594; {` lon: ${v.geometry.coordinates[0]}, lat: ${v.geometry.coordinates[1]}`}</div>)}
      </div>}
      <div style={{width: '100%', height: this.props.height + 'px'}} ref='map' className='mb2' id='map'></div>
      <div className='ui stackable three column grid'>
        <div className='column'>
          <div className='bold mb1'>Layers:</div>
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
          <div>
            <div className='ui toggle checkbox'>
              <input type='checkbox' checked={this.state.grid} onChange={this.toggleLayer.bind(this, 'grid')}/>
              <label className='bold'>grid</label>
            </div>
          </div>
        </div>
        {(vd.length > 0) && <div className='column'>
          <div className='bold mb1'>Jump To:</div>
          {vd.map((v, i) => <div key={i}>
            <button className='ui button basic blue' onClick={this.jumpTo.bind(this, v.geometry.coordinates)}>{names[v.properties.name]}</button>
          </div>)}
        </div>}
        <div className='column'>
          <div className='bold mb1'>Reset center/zoom</div>
          <button className='ui button basic blue' onClick={this.reset}>Reset</button>
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
var gridStyle = {
  'id': 'grid',
  'type': 'line',
  'source': 'gridSource',
  'paint': {
    'line-width': 1.7,
    'line-color': '#000000'
  }
};
var gridLabelStyle = {
  'id': 'gridLabel',
  'type': 'symbol',
  'source': 'gridSource',
  'layout': {
    'text-field': '{label}',
    'text-size': 10
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

const names = {
  bigDaddy: 'Big Daddy',
  scout: 'Scout',
  flyer: 'Flyer'
};
