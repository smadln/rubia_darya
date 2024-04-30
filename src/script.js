import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
import html2canvas from 'html2canvas';

// LightMode
let lightMode = true;

// Clock for rotation, automatically starting it
const clock = new THREE.Clock(true);

// Set rotate boolean variable, default true for auto-rotation
let rotateModel = true;

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0, 0, 0);

// Lights
const pointLight1 = new THREE.PointLight(0xffffff, 1);
pointLight1.position.set(100, 100, 400);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, .5);
pointLight2.position.set(-500, 100, -400);
scene.add(pointLight2);

// STL Loader for model import
const stlLoader = new STLLoader();
const material = new THREE.MeshStandardMaterial({
    flatShading: true,
    side: THREE.DoubleSide
});

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera setup
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 5; // Adjust this based on your model's size and desired view

// ASCII effect
let effect = new AsciiEffect(renderer, ' .:-+*=#', { invert: true, resolution: 0.1 });
effect.setSize(window.innerWidth, window.innerHeight);
effect.domElement.style.color = 'white';
effect.domElement.style.backgroundColor = 'black';
document.body.appendChild(effect.domElement);

// Load and display the STL model
stlLoader.load('3dpea copy.stl', function (geometry) {
    const mesh = new THREE.Mesh(geometry, material);
    geometry.computeVertexNormals();
    mesh.geometry.center();
    mesh.rotation.x = -Math.PI / 2; // Adjust as necessary
    scene.add(mesh);

    // Controls setup
    const controls = new OrbitControls(camera, effect.domElement);

    // Start the animation loop
    function animate() {
        requestAnimationFrame(animate);
        if (rotateModel) {
            mesh.rotation.z += 0.01; // Adjust rotation speed if necessary
        }
        effect.render(scene, camera);
    }

    animate();
});

// Event listeners for mouse and touch interaction
document.addEventListener('mousedown', () => rotateModel = false);
document.addEventListener('mouseup', () => rotateModel = true);
document.addEventListener('touchstart', () => rotateModel = false);
document.addEventListener('touchend', () => rotateModel = true);

document.getElementById('rotateButton').addEventListener('click', function toggleRotation() {
    rotateModel = !rotateModel;
    console.log('Rotate mode toggled. Current value: ', rotateModel);
});

window.addEventListener('resize', function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    effect.setSize(window.innerWidth, window.innerHeight);
});