import 'style3.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
import html2canvas from 'html2canvas';

//LightMode
let lightMode = true;

//Create a clock for rotation
const clock = new THREE.Clock();

// Set rotate boolean variable to true so model rotates by default
let rotateModel = true;

//Ugh, don't ask about this stuff
var userUploaded = false;
let controls;

// Creates empty mesh container
const myMesh = new THREE.Mesh();

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0, 0, 0);

//Lights
const pointLight1 = new THREE.PointLight(0xffffff, 1);
pointLight1.position.set(100, 100, 400);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, .5);
pointLight2.position.set(-500, 100, -400);
scene.add(pointLight2);

// Parameters
const stlLoader = new STLLoader();

//Material
const material = new THREE.MeshStandardMaterial();
material.flatShading = true;
material.side = THREE.DoubleSide;

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 2000);

// Renderer
const renderer = new THREE.WebGLRenderer();

let effect;

let characters = ' .:-+*=#';
const effectSize = { amount: .205 };
let backgroundColor = 'lightblue';
let ASCIIColor = 'white';

function createEffect() {
    effect = new AsciiEffect(renderer, characters, { invert: true, resolution: effectSize.amount });
    effect.setSize(sizes.width, sizes.height);
    effect.domElement.style.color = ASCIIColor;
    effect.domElement.style.backgroundColor = backgroundColor;
}

createEffect();

document.body.appendChild(effect.domElement);

document.getElementById("ascii").style.whiteSpace = "pre-wrap";

stlLoader.load(
    '3dpea copy.stl',
    function (geometry) {
        myMesh.material = material;
        myMesh.geometry = geometry;

        geometry.computeVertexNormals();
        myMesh.geometry.center();

        myMesh.rotation.x = -90 * Math.PI / 180;

        myMesh.geometry.computeBoundingBox();
        var bbox = myMesh.geometry.boundingBox;

        myMesh.position.y = ((bbox.max.z - bbox.min.z) / 5);

        camera.position.x = ((bbox.max.x * 4));
        camera.position.y = ((bbox.max.y));
        camera.position.z = ((bbox.max.z * 3));

        scene.add(myMesh);

        controls = new OrbitControls(camera, effect.domElement);

        // Set up rotation of model by default
        function tick() {
            if (rotateModel) {
                const elapsedTime = clock.getElapsedTime();
                myMesh.rotation.z = elapsedTime;
            }
            render();
            window.requestAnimationFrame(tick);
        }

        function render() {
            effect.render(scene, camera);
        }

        tick(); // Start the animation loop

        document.getElementById('rotateButton').value = "*"; // Set button to indicate rotation can be stopped

        document.getElementById('file-selector').addEventListener('change', openFile, false);

        function openFile(evt) {
            const fileObject = evt.target.files[0];

            const reader = new FileReader();
            reader.readAsArrayBuffer(fileObject);
            reader.onload = function () {
                if (userUploaded == false) {
                    userUploaded = true;
                }
                const geometry = stlLoader.parse(this.result);
                myMesh.geometry = geometry;
                myMesh.geometry.center();

                myMesh.rotation.x = -90 * Math.PI / 180;

                myMesh.geometry.computeBoundingBox();
                var bbox = myMesh.geometry.boundingBox;

                myMesh.position.y = ((bbox.max.z - bbox.min.z) / 6)

                scene.add(myMesh);
            };
        }
    }
);

// Rotate button event listener
document.getElementById('rotateButton').addEventListener('click', function() {
    rotateModel = !rotateModel;
    console.log('Rotate model:', rotateModel); // This will log the current state of rotation
    this.value = rotateModel ? "*" : "Rotate";
});

// ... rest of the event listeners and functions ...

document.getElementById('screenshotButton').addEventListener('click', takeScreenshot);

function takeScreenshot() {
    html2canvas(document.body).then(function (canvas) {
        var link = document.createElement("a");
        document.body.appendChild(link);
        link.download = "ASCII.jpg";
        link.href = canvas.toDataURL("image/jpg");
        link.click();
        document.body.removeChild(link);
    });
}

document.getElementById('updateASCII').addEventListener('click', updateASCII);

function updateASCII() {
    document.body.removeChild(effect.domElement);
    characters = " " + "." + document.getElementById('newASCII').value;
    createEffect();
    onWindowResize();
    document.body.appendChild(effect.domElement);
    controls = new OrbitControls(camera, effect.domElement);
}

document.getElementById('resetASCII').addEventListener('click', resetASCII);

function resetASCII() {
    document.body.removeChild(effect.domElement);
    characters = ' .:-+*=#';
    createEffect();
    onWindowResize();
    document.body.appendChild(effect.domElement);
    controls = new OrbitControls(camera, effect.domElement);
}

// Light/Dark mode button event listener
document.getElementById('lightDark').addEventListener('click', function() {
    lightMode = !lightMode;
    let lightDarkButton = document.getElementById('lightDark');
    if (lightMode) {
        document.getElementById("kofi").style.color = "black";
        document.body.style.backgroundColor = 'white';
        backgroundColor = 'white';
        ASCIIColor = 'black';
        lightDarkButton.style.color = 'lightblue'; // Change the button text color to lightblue
    } else {
        document.getElementById("kofi").style.color = "white";
        document.body.style.backgroundColor = 'black';
        backgroundColor = 'black';
        ASCIIColor = 'white';
        lightDarkButton.style.color = ''; // Revert the button text color to default
    }
    
    effect.domElement.style.color = ASCIIColor;
    effect.domElement.style.backgroundColor = backgroundColor;
});

document.getElementById('lightDark').addEventListener('click', function() {
    // Assume lightMode is a boolean that tracks whether light mode is active
    lightMode = !lightMode; 

    // Toggle light mode styles
    if (lightMode) {
        // Apply light mode styles
        document.body.style.backgroundColor = 'white'; // Example: changing the background to white
        this.classList.add('light-mode-active'); // Add the class to change the text color
    } else {
        // Revert to dark mode styles
        document.body.style.backgroundColor = 'lightblue'; // Example: changing the background to black
        this.classList.remove('light-mode-active'); // Remove the class to revert the text color
    }
});


// Ensure the onWindowResize function is declared to handle any resizing of the window
window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    effect.setSize(window.innerWidth, window.innerHeight);
}

document.getElementById("copyASCII").addEventListener("click", function () {
    var text = document.getElementsByTagName("table")[0].innerText;
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

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function toggleRotation() {
    rotateModel = !rotateModel;
    document.getElementById('rotateButton').value = rotateModel ? "*" : "Rotate";
}