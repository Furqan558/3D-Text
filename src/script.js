import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const textureOptions = {
  "Texture 1": "textures/matcaps/1.png",
  "Texture 2": "textures/matcaps/2.png",
  "Texture 3": "textures/matcaps/3.png",
  "Texture 4": "textures/matcaps/4.png",
  "Texture 5": "textures/matcaps/5.png",
  "Texture 6": "textures/matcaps/6.png",
  "Texture 7": "textures/matcaps/7.png",
  "Texture 8": "textures/matcaps/8.png",
};
const textureNames = Object.keys(textureOptions); // Human-friendly names
let matcapTexture = textureLoader.load(textureOptions[textureNames[0]]);

/**
 * Fonts
 */
const fontLoader = new FontLoader();
let textMesh = null;

const createText = (text) => {
  if (textMesh) {
    scene.remove(textMesh);
  }

  const textGeometry = new TextGeometry(text, {
    font: loadedFont,
    size: 0.5,
    height: 0.2,
    depth: 0.1,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  textGeometry.center();

  textMesh = new THREE.Mesh(textGeometry, sharedMaterial); // Use sharedMaterial
  scene.add(textMesh);
};

let loadedFont = null;
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  loadedFont = font;

  // Initial text
  createText(
    "Furqan - Creative Developer",
    new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
  );
});

/**
 * GUI Controls
 */
const guiControls = {
  text: "Furqan - Creative Developer",
  texture: textureNames[0], // Default to the first texture name
};

// Shared material for both text and donuts
const sharedMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

gui.add(guiControls, "text").onChange((value) => {
  if (loadedFont) {
    createText(value); // Use sharedMaterial for text
  }
});

gui.add(guiControls, "texture", textureNames).onChange((value) => {
  const texturePath = textureOptions[value]; // Get the file path from the name
  matcapTexture = textureLoader.load(texturePath);
  matcapTexture.needsUpdate = true; // Ensure the texture is updated
  sharedMaterial.matcap = matcapTexture; // Update the shared material
  sharedMaterial.needsUpdate = true; // Mark the material as needing an update
});

/**
 * Donuts
 */
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64);

for (let i = 0; i < 300; i++) {
  const donut = new THREE.Mesh(donutGeometry, sharedMaterial);
  donut.position.x = (Math.random() - 0.5) * 10;
  donut.position.y = (Math.random() - 0.5) * 10;
  donut.position.z = (Math.random() - 0.5) * 10;
  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;
  const scale = Math.random();
  donut.scale.set(scale, scale, scale);

  scene.add(donut);
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
