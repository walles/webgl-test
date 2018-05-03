import React, { Component } from 'react';
import './Scene.css';
import * as THREE from 'three';

class Scene extends Component {
  constructor(props) {
    super(props);

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);

    this.mesh_width = 10;
    this.mesh_height = 10;
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

    // Lighting!
    this.light = new THREE.DirectionalLight(0xffffcc, 1.0);
    this.light.position.y = 2;
    scene.add(this.light);

    renderer.setClearColor('#000000');
    renderer.setSize(width, height);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.mount.appendChild(this.renderer.domElement);
    this.start();
  }

  createMesh() {
    const width = this.mesh_width;
    const height = this.mesh_height;

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

  shiftTerrain() {
    const width = this.mesh_width;
    const height = this.mesh_height;

    for (let i = (width * height - 1) ; i >= width; i--) {
      const vertex = this.mesh.geometry.vertices[i];
      const next_row_vertex = this.mesh.geometry.vertices[i - width];
      vertex.set(vertex.x, next_row_vertex.y, vertex.z);
    }
    for (let i = 0; i < width; i++) {
      const vertex = this.mesh.geometry.vertices[i];
      vertex.set(vertex.x, Math.random(), vertex.z);
    }

    this.mesh.geometry.verticesNeedUpdate = true;
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
      this.shiftTerrain();
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
