import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

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
const fog = new THREE.Fog("#87CEEB", 1, 30); //(color, fog start, how far can see unclearly)
scene.fog = fog;

//gui.add(scene.fog, "fog");

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

textMaterial.wireframe = false;
gui.add(textMaterial, "wireframe");
gui.addColor(colorFormats, "color").onChange(() => {
  textMaterial.color.set(colorFormats.color);
});

// Texture to house
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const bricksAmbientOcclusionTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const bricksRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);

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

// Texture for plane
const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

grassColorTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

/**
 * Fonts
 */

const fontLoader = new FontLoader();

// bevel 斜角
fontLoader.load("/fonts/PuHuiTi_Regular.json", (font) => {
  const textGeometry = new TextGeometry("鳄梨港", {
    font: font,
    size: 0.5,
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
  text.position.y = 7;

  scene.add(text);
});

fontLoader.load("/fonts/PuHuiTi_Regular.json", (font) => {
  const textGeometry = new TextGeometry("港口一期建设公示牌", {
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

  const text = new THREE.Mesh(
    textGeometry,
    new THREE.MeshStandardMaterial({ color: "#ff0000" })
  );
  text.position.z = 0.9;
  text.position.y = 6;

  scene.add(text);
});

/**
 * Texts and donuts
 */
const cloud = new THREE.Group();
scene.add(cloud);
const donutGeometry = new THREE.TorusGeometry(0.2, 0.1, 18, 45);

for (let i = 0; i < 100; i++) {
  const donut = new THREE.Mesh(donutGeometry, textMaterial);

  donut.position.x = (Math.random() - 0.5) * 10;
  donut.position.y = (Math.random() - 0.5) * 10 + 10;
  donut.position.z = (Math.random() - 0.5) * 10;

  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;

  const scale = Math.random();
  donut.scale.x = scale;
  donut.scale.y = scale;
  donut.scale.z = scale;

  scene.add(donut);
}

/**
 * House
 */
// Group
const house = new THREE.Group();
scene.add(house);

//Walls - Level 层1
const level1 = new THREE.Mesh(
  new THREE.BoxGeometry(4, 3, 1.5),
  new THREE.MeshStandardMaterial({
    map: cementColorTexture,
    displacementMap: cementHeightTexture,
    displacementScale: 0.00001,
    normalMap: cementNormalTexture,
    roughnessMap: cementRoughnessTexture,
  })
);
// aoMap: bricksAmbientOcclusionTexture,
// walls.geometry.setAttribute(
//   "uv2",
//   new THREE.Float32BufferAttribute(walls.geometry.attributes.uv, 2)
// );

level1.position.y = 5;
house.add(level1);

//Walls - Level 层2
const level2 = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 1, 4, 8),
  new THREE.MeshStandardMaterial({
    map: cementColorTexture,

    normalMap: cementNormalTexture,
    roughnessMap: cementRoughnessTexture,
  })
);

level2.position.y = 2;
house.add(level2);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.position.y = 8;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// Door
// const door = new THREE.Mesh(
//   new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
//   new THREE.MeshStandardMaterial({
//     map: doorColorTexture,
//     transparent: true,
//     alphaMap: doorAlphaTexture,
//     displacementMap: doorHeightTexture,
//     displacementScale: 0.1,
//     normalMap: doorNormalTexture,
//     metalnessMap: doorMetalnessTexture,
//     roughnessMap: doorRoughnessTexture,
//   })
// );

// door.position.y = 1;
// door.position.z = 0.95;
// house.add(door);

// Bush
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0, z);
  grave.rotation.y = Math.random() - 0.5;
  grave.rotation.x = Math.random() - 0.5;
  grave.rotation.z = Math.random() - 0.5;

  grave.castShadow = true;

  graves.add(grave);
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);

floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.6);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 0.5);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

// gui.addColor(colorFormats, "color").onChange(() => {
//   pointLight.color.set(colorFormats.color);
// });

//Light for text
const rectAreaLight = new THREE.RectAreaLight(0xd1ba29, 2, 2, 1);
rectAreaLight.position.set(0, 6.5, 0);
rectAreaLight.lookAt(0, 7, 0);
scene.add(rectAreaLight);

// const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
// scene.add(rectAreaLightHelper);

// Directional light
// 模拟太阳光
const moonLight = new THREE.DirectionalLight("#ff8400", 0.26);
moonLight.position.set(-3.48, 1.19, -1.22);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

// Door Light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight("#00a3f5", 2, 3);
scene.add(ghost1);

const ghost2 = new THREE.PointLight("#ffffff", 2, 3);
scene.add(ghost2);

const ghost3 = new THREE.PointLight("red", 2, 3);
scene.add(ghost3);

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
camera.position.x = 7;
camera.position.y = 3;
camera.position.z = 11;
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
renderer.setClearColor("#87CEEB");

/**
 * Shadows
 */

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
//doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

level1.castShadow = true;
level2.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

floor.receiveShadow = true;

// doorLight.shadow.mapSize.width = 256;
// doorLight.shadow.mapSize.height = 256;
// doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Update objects
  //donut.rotation.x = 0.15 * elapsedTime;
  //donut.rotation.y = 0.1 * elapsedTime;
  //Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
