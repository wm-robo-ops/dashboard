/* global THREE */
import React from 'react';

export default class BearingPitchRollVisualization extends React.Component {

  constructor(props) {
    super(props);
    this.setup = this.setup.bind(this);
    this.update = this.update.bind(this);
    this.resize = this.resize.bind(this);
  }

  componentDidMount() {
    this.setup();
    window.addEventListener('resize', this.resize);

    var address = `ws://${this.props.serverIP}:9999`;
    var client = new WebSocket(address);
    client.onmessage = (e) => {
      try {
        var data = JSON.parse(e.data);
        this.update(deg2rad(parseFloat(data.roll)), deg2rad(parseFloat(data.heading)), deg2rad(parseFloat(data.pitch)));
        window.renderer.render(this.scene, this.camera);
      }
      catch(err) {
        console.log(err);
      }
    };
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize() {
    window.renderer.setSize(this.refs.container.parentNode.offsetWidth, 220);
  }

  setup() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 1000;

    var boxGeom = new THREE.BoxGeometry(200, 200, 200);
    for (var i = 0; i < boxGeom.faces.length; i++) {
      boxGeom.faces[i].color.setHex(Math.random() * 0xffffff);
    }
    var boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.box = new THREE.Mesh(boxGeom, boxMaterial);
    this.scene.add(this.box);

    var circleGeom = new THREE.CircleGeometry(500, 64);
    var circleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    this.circle = new THREE.Mesh(circleGeom, circleMaterial);
    this.circle.rotation.x = Math.PI / 2;
    this.scene.add(this.circle);

    if (!window.renderer)
      window.renderer = new THREE.WebGLRenderer();
    window.renderer.setSize(this.refs.container.parentNode.offsetWidth, 220);

    this.refs.container.appendChild(window.renderer.domElement);
  }

  update(x, y, z) {
    this.box.rotation.x = x;
    this.box.rotation.y = y;
    this.box.rotation.z = z;
    this.circle.rotation.x = x;
    this.circle.rotation.y = y;
    this.circle.rotation.z = z;

    window.renderer.render(this.scene, this.camera);
  }

  render() {
    return <div style={{width: '100%'}}>
      <div ref='container'></div>
    </div>;
  }

}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
