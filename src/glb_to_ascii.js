import './style.css'
import * as THREE from './three.module.min.js';
import { GLTFLoader } from './GLTFLoader.js';
import { AsciiEffect } from './AsciiEffect.js';

let camera, scene, renderer, effect, loader;

document.addEventListener('DOMContentLoaded', function() {
    init();
    animate();
});

function init() {
    console.log("Initializing scene...");

    // Create a new Three.js scene
    scene = new THREE.Scene();
    
    // Set up the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Create a WebGL renderer and set its size
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Initialize the ASCII effect and add it to the document
    effect = new AsciiEffect(renderer, ' .:-+*=#', { invert: true });
    effect.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(effect.domElement);

    // Add lighting to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    scene.add(pointLight);

    // Initialize the GLTFLoader and load a model
    loader = new GLTFLoader();
    loader.load('./Desert lily.glb', function (gltf) {
        console.log("GLTF model loaded successfully.");
        scene.add(gltf.scene);  // Add the loaded model to the scene
    }, function (xhr) {
        console.log(`Model load progress: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`);
    }, function (error) {
        console.error('An error happened during model loading:', error);
    });

    // Set up window resize listener
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    effect.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    effect.render(scene, camera);  // Render the scene using the ASCII effect
}