import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
import html2canvas from 'html2canvas';

//LightMode
let lightMode = true

//Create a clock for rotation
const clock = new THREE.Clock()

// Set rotate boolean variable
let rotateModel = false  // Initially set to false, toggle via UI

// Creates empty mesh container
const myMesh = new THREE.Mesh();

// Scene setup
const scene = new THREE.Scene()
scene.background = new THREE.Color(0, 0, 0);

// Lights
const pointLight1 = new THREE.PointLight(0xffffff, 1);
pointLight1.position.set(100, 100, 400);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, .5);
pointLight2.position.set(-500, 100, -400);
scene.add(pointLight2);

// STL Loader for model import
const stlLoader = new STLLoader()

// Material configuration
const material = new THREE.MeshStandardMaterial()
material.flatShading = true
material.side = THREE.DoubleSide;

// Renderer setup
const renderer = new THREE.WebGLRenderer()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera setup
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 2000)

let effect;
let characters = ' .:-+*=#'
const effectSize = { amount: .205 }
let backgroundColor = 'lightblue'
let ASCIIColor = 'white'

function createEffect() {
    effect = new AsciiEffect(renderer, characters, { invert: true, resolution: effectSize.amount });
    effect.setSize(sizes.width, sizes.height);
    effect.domElement.style.color = ASCIIColor;
    effect.domElement.style.backgroundColor = backgroundColor;
}

createEffect()
document.body.appendChild(effect.domElement)
document.getElementById("ascii").style.whiteSpace = "prewrap"

// Load and display the STL model
stlLoader.load(
    '3dpea copy.stl',
    function (geometry) {
        myMesh.material = material;
        myMesh.geometry = geometry;
        geometry.computeVertexNormals();
        myMesh.geometry.center();
        myMesh.rotation.x = -Math.PI / 2;

        scene.add(myMesh);
        controls = new OrbitControls(camera, effect.domElement);
        animate(); // Starts the rendering loop
    }
);

// Rendering loop with auto-rotation
function animate() {
    requestAnimationFrame(animate);
    if (rotateModel) {
        const elapsedTime = clock.getElapsedTime();
        myMesh.rotation.z = elapsedTime / 3;
    }
    effect.render(scene, camera);
}

// Event listeners for mouse and touch interaction
document.addEventListener('mousedown', () => {
    rotateModel = false;
});
document.addEventListener('mouseup', () => {
    rotateModel = true;
});
document.addEventListener('touchstart', () => {
    rotateModel = false;
});
document.addEventListener('touchend', () => {
    rotateModel = true;
});

document.getElementById('rotateButton').addEventListener('click', toggleRotation);

function toggleRotation() {
    rotateModel = !rotateModel;
    console.log('Rotate mode toggled. Current value: ', rotateModel);
}

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    effect.setSize(window.innerWidth, window.innerHeight);
}