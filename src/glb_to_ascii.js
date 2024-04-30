console.log("Script loaded.");

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed.");
    init();
    animate();
});

function init() {
    console.log("Initializing scene...");

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    effect = new THREE.AsciiEffect(renderer, ' .:-+*=%@#', { invert: true });
    effect.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(effect.domElement);
    console.log("ASCII effect initialized and added to document.");

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    scene.add(pointLight);

    loader = new THREE.GLTFLoader();
    loader.load('Desert lily.glb', function (gltf) {
        console.log("GLTF model loaded successfully.");
        scene.add(gltf.scene);
    }, function (xhr) {
        console.log(`Model load progress: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`);
    }, function (error) {
        console.error('An error happened during model loading:', error);
    });

    window.addEventListener('resize', onWindowResize, false);
    console.log("Event listeners added.");
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    effect.setSize(window.innerWidth, window.innerHeight);
    console.log("Window resized.");
}

function animate() {
    requestAnimationFrame(animate);
    effect.render(scene, camera);
    console.log("Scene rendered.");
}