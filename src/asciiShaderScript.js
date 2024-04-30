import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { GLTFLoader } from './GLTFLoader.js';

// Setup basic scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Load your GLTF model
const loader = new GLTFLoader();
loader.load('path/to/yourModel.glb', (gltf) => {
    // Apply the ASCII shader material to the loaded model here
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.material = asciiShaderMaterial;
        }
    });
    scene.add(gltf.scene);
    animate();
});

// Ascii Shader
// This shader code will need to be the ASCII effect shader code adapted from the example you choose
const asciiShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    },
    vertexShader: `...`, // Your ASCII shader's vertex shader code
    fragmentShader: `...` // Your ASCII shader's fragment shader code
});

// Camera settings
camera.position.set(0, 0, 5);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    asciiShaderMaterial.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
});
