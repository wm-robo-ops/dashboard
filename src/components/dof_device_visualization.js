/* global THREE */
import React from 'react';
import DeviceToggle from './device_toggle';

export default class DOFDeviceVisualization extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      heading: 0,
      pitch: 0,
      roll: 0
    };
    this.setupViz = this.setupViz.bind(this);
    this.update = this.update.bind(this);
    this.resize = this.resize.bind(this);
    this.connectSocket = this.connectSocket.bind(this);
  }

  componentDidMount() {
    this.setupViz();
    if (this.props.deviceData.on) {
      this.connectSocket();
    }
  }

  connectSocket() {
    if (this.client) return;
    this.address = `ws://${this.props.serverIP}:${this.props.deviceData.port}`;
    this.client = new WebSocket(this.address);
    this.client.onmessage = (e) => {
      try {
        var data = JSON.parse(e.data);
        this.update(deg2rad(parseFloat(data.pitch)), deg2rad(parseFloat(data.roll)), deg2rad(parseFloat(data.heading - 133)));
        window.renderer.render(this.scene, this.camera);
      }
      catch(err) {
        console.log(err);
      }
    };
  }

  disconnectSocket() {
    if (this.client) {
      this.client.close();
      this.client = null;
    }
  }

  componentWillReceiveProps(props) {
    // switching views
    if (props.deviceData.name !== this.props.deviceData.name) {
      this.disconnectSocket();
    }
  }
  componentDidUpdate() {
    if (this.props.deviceData.on) {
      this.connectSocket();
    } else {
      this.disconnectSocket();
    }
  }

  componentWillUnmount() {
    this.disconnectSocket();
    window.removeEventListener('resize', this.resize);
  }


  setupViz() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 1000;

    // draw box
    var boxGeom = new THREE.BoxGeometry(200, 200, 200);
    for (var i = 0; i < boxGeom.faces.length; i++) {
      boxGeom.faces[i].color.setHex(Math.random() * 0xffffff);
    }
    var boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.box = new THREE.Mesh(boxGeom, boxMaterial);
    this.scene.add(this.box);

    // draw circle
    var circleGeom = new THREE.CircleGeometry(500, 64);
    var circleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    this.circle = new THREE.Mesh(circleGeom, circleMaterial);
    this.circle.rotation.x = Math.PI / 2;
    this.scene.add(this.circle);

    if (!window.renderer) {
      window.renderer = new THREE.WebGLRenderer();
    }
    window.renderer.setSize(this.refs.container.parentNode.offsetWidth, 400);

    this.refs.container.appendChild(window.renderer.domElement);
    window.addEventListener('resize', this.resize);
  }

  resize() {
    window.renderer.setSize(this.refs.container.parentNode.offsetWidth, 220);
  }

  update(x, y, z) {
    if (x) {
      this.box.rotation.x = x;
      this.circle.rotation.x = x + Math.PI / 2;
      this.setState({ pitch: x });
    }
    if (y) {
      this.box.rotation.y = y;
      this.circle.rotation.y = y;
      this.setState({ roll: y });
    }
    if (z) {
      this.box.rotation.z = z;
      this.circle.rotation.z = z;
      this.setState({ heading: z });
    }

    window.renderer.render(this.scene, this.camera);
  }

  render() {
    var { toggle } = this.props;
    var { name, on } = this.props.deviceData;
    var { heading, pitch, roll } = this.state;
    return <div style={{width: '100%'}}>
      <DeviceToggle checked={on} onChange={toggle} name={name}/>
      <div>{`heading: ${rad2deg(heading)}°`}</div>
      <div>{`pitch: ${rad2deg(pitch)}°`}</div>
      <div>{`roll: ${rad2deg(roll)}°`}</div>
      <div className={`${on ? '' : 'hidden' }`} ref='container'></div>
    </div>;
  }

}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function rad2deg(rad) {
  return rad * (180 / Math.PI);
}

DOFDeviceVisualization.propTypes = {
  serverIP: React.PropTypes.string.isRequired,
  toggle: React.PropTypes.func.isRequired,
  deviceData: React.PropTypes.object.isRequired
};
