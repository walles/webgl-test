import React, { Component } from 'react';
import './Scene.css';
import * as THREE from 'three';

class Scene extends Component {
  constructor(props) {
    super(props);

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
    this.camera_angle_rad = 0;  // In radians
    this.camera_distance = 2;   // From center
  }

  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    camera.position.y = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color: '#ffffff' });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // create a point light
    const pointLight = new THREE.PointLight(0xff8888);
    pointLight.position.x = 2;
    pointLight.position.y = 2;
    pointLight.position.z = 2;
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x88ff88);
    pointLight2.position.x = -2;
    pointLight2.position.y = 2;
    pointLight2.position.z = -2;
    scene.add(pointLight2);

    renderer.setClearColor('#000000');
    renderer.setSize(width, height);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.material = material;
    this.cube = cube;

    this.mount.appendChild(this.renderer.domElement);
    this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  animate() {
    this.camera_angle_rad += 0.01;
    this.camera.position.x = this.camera_distance * Math.cos(this.camera_angle_rad);
    this.camera.position.z = this.camera_distance * Math.sin(this.camera_angle_rad);
    this.camera.lookAt(0, 0, 0);

    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div
        ref={(mount) => { this.mount = mount; }}
      />
    );
  }
}

export default Scene;
