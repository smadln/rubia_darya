import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// Comment out STL specific imports for now
// import { STLLoader } from 'three/addons/loaders/STLLoader.js';
// import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';

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

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera setup
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 5; // Start with a basic distance

// Controls setup
const controls = new OrbitControls(camera, renderer.domElement);

// Basic geometry test
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Log camera and renderer information
console.log('Camera position:', camera.position);
console.log('Renderer info:', renderer.info);

// Start the animation loop
function animate() {
    requestAnimationFrame(animate);

    // Add a basic rotation to the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Render the scene from the perspective of the camera
    renderer.render(scene, camera);
}

animate();

// Event listeners for window resizing
window.addEventListener('resize', function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
