import './style.css'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
import html2canvas from 'html2canvas';

//LightMode
let lightMode = true

//Create a clock for rotation
const clock = new THREE.Clock()

//Ugh, don't ask about this stuff
var userUploaded = false
let rotateModel = true; // Set to true initially for auto-rotation to start

// Creates empty mesh container
const myMesh = new THREE.Mesh();

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0, 0, 0);

//Lights
const pointLight1 = new THREE.PointLight(0xffffff, 1);
pointLight1.position.set(100, 100, 400);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, .5);
pointLight2.position.set(-500, 100, -400);
scene.add(pointLight2);

// Parameters
const stlLoader = new STLLoader()

//Material
const material = new THREE.MeshStandardMaterial()
material.flatShading = true
material.side = THREE.DoubleSide;

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 2000)

// Renderer
const renderer = new THREE.WebGLRenderer()

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

document.body.appendChild(renderer.domElement);

createEffect();

document.body.appendChild(effect.domElement)

document.getElementById("ascii").style.whiteSpace = "prewrap"

stlLoader.load(
    './rubia_darya/3dpea copy.stl',
    function (geometry) {

        myMesh.material = material;
        myMesh.geometry = geometry;

        var tempGeometry = new THREE.Mesh(geometry, material)
        myMesh.position.copy = (tempGeometry.position)

        geometry.computeVertexNormals();
        myMesh.geometry.center()

        myMesh.rotation.x = -90 * Math.PI / 180;

        myMesh.geometry.computeBoundingBox();
        var bbox = myMesh.geometry.boundingBox;

        myMesh.position.y = ((bbox.max.z - bbox.min.z) / 5)

        camera.position.x = ((bbox.max.x * 4));
        camera.position.y = ((bbox.max.y));
        camera.position.z = ((bbox.max.z * 3));

        scene.add(myMesh);

        tick();
    }
)

function render() {
    renderer.render(scene, camera);
}

function tick() {
    requestAnimationFrame(tick);
    if (rotateModel) {
        myMesh.rotation.y += 0.01; // Adjust the rotation speed as needed
    }
    render();
}

document.getElementById('screenshotButton').addEventListener('click', takeScreenshot);

function takeScreenshot() {
    var container = document.body; // full page 
    html2canvas(container).then(function (canvas) {

        var link = document.createElement("a");
        document.body.appendChild(link);
        link.download = "ASCII.jpg";
        link.href = canvas.toDataURL("image/jpg");
        console.log(link.href);
        // link.target = '_blank';
        link.click();
    });
}

document.getElementById('lightDark').addEventListener('click', lightDark);

function lightDark() {
    lightMode = !lightMode
    if (lightMode === true) {
        document.getElementById("kofi").style.color = "white";
        document.body.style.backgroundColor = 'lightblue';

        backgroundColor = 'lightblue'
        ASCIIColor = 'white'

        effect.domElement.style.color = ASCIIColor;
        effect.domElement.style.backgroundColor = backgroundColor;
    } else {
        document.getElementById("kofi").style.color = "white";
        document.body.style.backgroundColor = 'lightblue';

        backgroundColor = 'lightblue'
        ASCIIColor = 'white'

        effect.domElement.style.color = ASCIIColor;
        effect.domElement.style.backgroundColor = backgroundColor;
    }
}

// Function to handle window focus/blur events to toggle auto-rotation
window.addEventListener('focus', function () {
    rotateModel = true; // Enable auto-rotation when window is focused
});

window.addEventListener('blur', function () {
    rotateModel = false; // Disable auto-rotation when window loses focus
});

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    effect.setSize(window.innerWidth, window.innerHeight);
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

document.getElementById("copyASCII").addEventListener("click", function () {
    var text = document.getElementsByTagName("table")[0].innerText
    var filename = "ASCII.txt";

    download(filename, text);
}, false);

document.getElementById("clipboardASCII").addEventListener("click", function () {
    const textArea = document.createElement("textarea");
    textArea.textContent = document.getElementsByTagName("td")[0].innerText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    window.alert("ASCII copied to clipboard");
}, false);
