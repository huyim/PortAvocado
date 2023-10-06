import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Debug
 */
const gui = new GUI();

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
  console.log("onStart");
};

loadingManager.onProgress = () => {
  console.log("onProgress");
};

loadingManager.onLoad = () => {
  console.log("onLoaded");
};

loadingManager.onError = () => {
  console.log("onError");
};

const textureLoader = new THREE.TextureLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
//const material = new THREE.MeshBasicMaterial();
//material.map = doorColorTexture;

//不能直接使用material.color = xxx, 这种方式只能在初始化↑ 【例，({color: "red"})】时使用
//material.color = "yellow" // ×
//material.color = new THREE.Color("yellow"); // √
//material.color.set("#ff00ff"); // √

//material.wireframe = true;

//material.opacity = 0.5;
//material.transparent = true;
//material.alphaMap = alphaTexture;
//material.side = THREE.DoubleSide;

// Normals can be use for lighting, reflection, refraction, etc.
//const material = new THREE.MeshNormalMaterial();
//material.flatShading = true

// 转动视角，光影不变 aka 模拟光影
//const material = new THREE.MeshMatcapMaterial();
//material.matcap = matcapsTexture;

// white if it's close to the camera, black if it's far to the camera
//const material = new THREE.MeshDepthMaterial();

//const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshPhongMaterial();
// material.shiness = 100;
// material.specular = new THREE.Color(0x1188ff); //change color

//卡通风
//const material = new THREE.MeshToonMaterial();
//material.gradientMap = gradientTexture;

// const material = new THREE.MeshStandardMaterial();
// //material.metalness = 0.45;
// //material.roughness = 0.65;
// // UV coordinates: how textures can be applied to geometries
// material.map = doorColorTexture;
// //ambient light: 环境光
// material.aoMap = ambientOcclusionTexture;
// material.aoMapIntensity = 1;
// //变得立体
// material.displacementMap = heightTexture;
// material.displacementScale = 0.05;
// //金属感等 注：不与material.metalness同用
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// //Add more details
// material.normalMap = normalTexture;
// material.normalScale.set(0.5, 0.5);
// // if want to play with opacity、alpha, do not forget material.transparent
// material.alphaMap = alphaTexture;
// material.transparent = true;

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = environmentMapTexture;

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
gui.add(material, "aoMapIntensity").min(0).max(10).step(0.0001);
gui.add(material, "displacementScale").min(0).max(1).step(0.0001);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
//sphere.position.x = -1.5;

sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);

scene.add(sphere);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

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

  //Update objects
  sphere.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
