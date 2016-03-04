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
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize() {
    this.renderer.setSize(this.refs.container.parentNode.offsetWidth, 220);
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

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.refs.container.parentNode.offsetWidth, 220);

    this.refs.container.appendChild(this.renderer.domElement);
  }

  update(x, y, z) {
    this.box.rotation.x = x;
    this.box.rotation.y = y;
    this.box.rotation.z = z;
    this.circle.rotation.x = x;
    this.circle.rotation.y = y;
    this.circle.rotation.z = z;

    this.renderer.render(this.scene, this.camera);
  }

  componentWillReceiveProps(props) {
    this.update(props.x, props.y, props.z);
  }

  render() {
    return <div style={{width: '100%'}}>
      <div ref='container'></div>
    </div>;
  }

}
