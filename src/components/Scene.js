import React, { Component } from 'react';
import './Scene.css';
import * as THREE from 'three';

class Scene extends Component {
  constructor(props) {
    super(props);

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
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
    camera.position.y = 3;
    camera.lookAt(0, 0, -3);

    const renderer = new THREE.WebGLRenderer({ antialias: true });

    this.mesh = this.createMesh();
    scene.add(this.mesh);

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

    this.mount.appendChild(this.renderer.domElement);
    this.start();
  }

  createMesh() {
    const width = 10;
    const height = 10;

    // Create vertices for our height map
    var geom = new THREE.Geometry();
    for (let i = 0; i < width * height; i++) {
      const x = i % width - (width - 1) / 2;
      const y = Math.random();
      const z = Math.floor(i / width) - (height - 1) / 2;
      geom.vertices.push(new THREE.Vector3(x, y, z));
    }

    // Create faces from our vertices
    for (let i = 0; i < width * height; i++) {
      if ((i % width) === (width - 1)) {
        // We're in the rightmost column. This is a column in which faces end,
        // and no new start.
        continue;
      }
      if (i >= (width * (height - 1))) {
        // We're in the last row. Faces end in this row, and no new start here.
        continue;
      }

      const p0 = i;
      const p_right = i + 1;
      const p_down = i + width;
      const p_right_down = i + width + 1;

      geom.faces.push(new THREE.Face3(p0, p_right, p_down));
      geom.faces.push(new THREE.Face3(p_down, p_right, p_right_down));
    }

    geom.computeFaceNormals();

    const material = new THREE.MeshLambertMaterial();
    material.side = THREE.DoubleSide;

    return new THREE.Mesh( geom, material );
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
    this.camera.position.z -= 0.01;
    while (this.camera.position.z < -1.0) {
      // FIMXE: Add more terrain
      this.camera.position.z += 1.0;
    }

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
