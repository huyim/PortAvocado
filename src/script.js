import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import gsap from "gsap";

/**
 * Debug
 */
const gui = new GUI();

const colorFormats = {
  color: "#ffffff",
  int: 0xffffff,
  object: { r: 1, g: 1, b: 1 },
  array: [1, 1, 1],
};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Fog
// #262837
//const fog = new THREE.Fog("#87CEEB", 1, 30); //(color, fog start, how far can see unclearly)
//scene.fog = fog;

/**
 * Textures
 */
// const loadingManager = new THREE.LoadingManager();

// loadingManager.onStart = () => {
//   console.log("onStart");
// };

// loadingManager.onProgress = () => {
//   console.log("onProgress");
// };

// loadingManager.onLoad = () => {
//   console.log("onLoaded");
// };

// loadingManager.onError = () => {
//   console.log("onError");
// };

const textureLoader = new THREE.TextureLoader();
const matcapsTexture = textureLoader.load("/textures/matcaps/8.png");

const textMaterial = new THREE.MeshMatcapMaterial();
textMaterial.matcap = matcapsTexture;

gui.addColor(colorFormats, "color").onChange(() => {
  textMaterial.color.set(colorFormats.color);
});

// Texture to pavilion

const cementColorTexture = textureLoader.load(
  "/textures/cement/ConcretePrecastPlates004_COL_2K_METALNESS.png"
);
const cementHeightTexture = textureLoader.load(
  "/textures/cement/ConcretePrecastPlates004_DISP16_2K_METALNESS.png"
);

const cementNormalTexture = textureLoader.load(
  "/textures/cement/ConcretePrecastPlates004_NRM_2K_METALNESS.png"
);

const cementRoughnessTexture = textureLoader.load(
  "/textures/cement/ConcretePrecastPlates004_ROUGHNESS_2K_METALNESS.png"
);

/**
 *  白水城
 */

// Group
const pavilion = new THREE.Group();
scene.add(pavilion);

// Fonts
const fontLoader = new FontLoader();

// bevel 斜角
fontLoader.load("/fonts/PuHuiTi_Regular.json", (font) => {
  const textGeometry = new TextGeometry("第一泉", {
    font: font,
    size: 0.3,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.computeBoundingBox();
  //console.log(textGeometry.boundingBox);
  // Move every vertices
  textGeometry.translate(
    -textGeometry.boundingBox.max.x * 0.5,
    -textGeometry.boundingBox.max.y * 0.5,
    -textGeometry.boundingBox.max.z * 0.5
  );

  const text = new THREE.Mesh(textGeometry, new THREE.MeshStandardMaterial());
  text.position.y = 2.5;
  text.position.z = 2;

  pavilion.add(text);
});

// 底座
const baseStone = new THREE.Mesh(
  new RoundedBoxGeometry(4, 0.25, 4, 4),
  new THREE.MeshStandardMaterial({ color: "#758a99" })
);
pavilion.add(baseStone);

// 柱子 1
const level1 = new THREE.Mesh(
  new THREE.CylinderGeometry(0.25, 0.25, 3),
  new THREE.MeshStandardMaterial({ color: "#ff2121" })
);

level1.position.x = -1.5;
level1.position.y = 1.5;
level1.position.z = 1.5;
pavilion.add(level1);

//柱子 2
const level2 = new THREE.Mesh(
  new THREE.CylinderGeometry(0.25, 0.25, 3),
  new THREE.MeshStandardMaterial({ color: "#ff2121" })
);

level2.position.x = 1.5;
level2.position.y = 1.5;
level2.position.z = 1.5;
pavilion.add(level2);

//柱子 3
const level3 = new THREE.Mesh(
  new THREE.CylinderGeometry(0.25, 0.25, 3),
  new THREE.MeshStandardMaterial({ color: "#ff2121" })
);

level3.position.x = -1.5;
level3.position.y = 1.5;
level3.position.z = -1.5;
pavilion.add(level3);

//柱子 4
const level4 = new THREE.Mesh(
  new THREE.CylinderGeometry(0.25, 0.25, 3),
  new THREE.MeshStandardMaterial({ color: "#ff2121" })
);

level4.position.x = 1.5;
level4.position.y = 1.5;
level4.position.z = -1.5;
pavilion.add(level4);

// 亭檐
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.7, 1.7, 4),
  new THREE.MeshStandardMaterial({ color: "#f2be45" })
);
roof.position.y = 3.5;
roof.rotation.y = Math.PI / 4;
pavilion.add(roof);

// 泉水
const springGeometry = new THREE.SphereGeometry(1, 16, 16);
const springMaterial = new THREE.MeshToonMaterial({ color: "#57b6d0" });

const spring1 = new THREE.Mesh(springGeometry, springMaterial);
spring1.scale.set(0.5, 0.5, 0.5);
spring1.position.set(0, 0.1, 2.7);

const spring2 = new THREE.Mesh(springGeometry, springMaterial);
spring2.scale.set(0.4, 0.4, 0.4);
spring2.position.set(0.7, 0, 2.7);

const spring3 = new THREE.Mesh(springGeometry, springMaterial);
spring3.scale.set(0.4, 0.4, 0.4);
spring3.position.set(-0.7, 0, 2.7);

pavilion.add(spring1, spring2, spring3);

// 底板
const floor = new THREE.Mesh(
  new RoundedBoxGeometry(8, 0.4, 8, 4),
  new THREE.MeshStandardMaterial({
    color: "#003472",
  })
);

floor.position.y = -0.2;
pavilion.add(floor);

/**
 * 摆放位置与相对关系
 */
const objectDistance = 10;
const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 60),
  new THREE.MeshToonMaterial()
);

const mesh2 = new THREE.Mesh(
  new THREE.ConeGeometry(1, 2, 32),
  new THREE.MeshToonMaterial()
);

pavilion.position.y = -2;
pavilion.position.x = 2.5;
mesh1.position.y = -objectDistance * 1.4;
mesh1.position.x = -2.5;
mesh2.position.y = -objectDistance * 2.3;
mesh2.position.x = 2.5;

scene.add(mesh1, mesh2);

const sectionMeshes = [pavilion, mesh1, mesh2];

/**
 * 光源
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.6);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// 文字补充光源
const rectAreaLight = new THREE.RectAreaLight(0xd1ba29, 2, 2, 1);
rectAreaLight.position.set(0, 2, 2);
rectAreaLight.lookAt(0, 2.5, 2);
pavilion.add(rectAreaLight);

// Directional light
// 模拟太阳光
const moonLight = new THREE.DirectionalLight("#dbc869", 1);
moonLight.position.set(1, 1, 0);
scene.add(moonLight);

// Door Light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
pavilion.add(doorLight);

// Ghosts light
const ghost1 = new THREE.PointLight("#00a3f5", 2, 3);
scene.add(ghost1);

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
//Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 7;
camera.position.y = 2.7;
camera.position.z = 11;
cameraGroup.add(camera);

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
renderer.setClearColor("#44cef6");

/**
 * Scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;

  const newSection = Math.round(scrollY / sizes.height);

  if (newSection != currentSection) {
    currentSection = newSection;

    gsap.to(sectionMeshes(currentSection).rotation, {
      duration: 1.5,
      ease: "power2,inOut",
      x: "+=6",
      y: "+=3",
      z: "+=1.5",
    });
  }
});

/**
 * Shadows
 */

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
//doorLight.castShadow = true;
ghost1.castShadow = true;

level1.castShadow = true;
level2.castShadow = true;
level3.castShadow = true;
level4.castShadow = true;

spring1.castShadow = true;
spring2.castShadow = true;
spring3.castShadow = true;

floor.receiveShadow = true;

// doorLight.shadow.mapSize.width = 256;
// doorLight.shadow.mapSize.height = 256;
// doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

/**
 * Cursor
 */
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

/**
 * Animate
 */
const clock = new THREE.Clock();

let priviousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - priviousTime;
  priviousTime = elapsedTime;

  //Animate Camera
  camera.position.y = (-scrollY / sizes.height) * objectDistance;

  const parallaxX = cursor.x * 0.5;
  const patallaxY = -cursor.y * 0.5;
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y +=
    (patallaxY - cameraGroup.position.y) * 5 * deltaTime;

  // Animate meshes
  for (const mesh of sectionMeshes) {
    //mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }

  //Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  // Update controls
  //controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
