import React from 'react';
import mapboxgl from 'mapbox-gl';

export default class BearingMap extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2VsdmluYWJyb2t3YSIsImEiO' +
      'iJkcUF1TWlVIn0.YzBtz0O019DJGk3IpFi72g';
    window.map = new mapboxgl.Map({
      container: this.refs.map,
      style: 'mapbox://styles/mapbox/satellite-v8',
      center: [-95.081320, 29.564835],
      zoom: 17
    });
  }

  componentsWillReceiveProps(/*props*/) {
    //map.setBearing(props.bearing);
  }

  render() {
    return <div>
      <div style={{width: '100%', height: '300px'}} ref='map' id='map'></div>
    </div>;
  }

}
