import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import gsap from "gsap";

/**
 * Debug
 */
const gui = new GUI();
gui.title("控制器");
const lightControl = gui.addFolder("光源控制 Lights");
const galaxyController = gui.addFolder("星系编辑器 Galaxy");

const parametersColor = {
  materialColor: "#ffeded",
};

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
// const fog = new THREE.Fog("#87CEEB", 1, 30); //(color, fog start, how far can see unclearly)
// scene.fog = fog;

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader();
const matcapsTexture = textureLoader.load("/textures/matcaps/8.png");

const textMaterial = new THREE.MeshMatcapMaterial();
textMaterial.matcap = matcapsTexture;

/**
 *  Fonts
 */
const fontLoader = new FontLoader();

/**
 * 鳄梨港
 */
// Group
const port = new THREE.Group();
scene.add(port);

// 吊机
const baseTower = new THREE.Mesh(
  new RoundedBoxGeometry(2, 0.25, 2, 4),
  new THREE.MeshStandardMaterial({ color: "#FA8C35" })
);
baseTower.position.z = 1.5;
port.add(baseTower);

const mainTower1 = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 2),
  new THREE.MeshStandardMaterial({ color: "#FA8C35" })
);
mainTower1.position.y = 1;
mainTower1.position.z = 1.5;
port.add(mainTower1);

const mainTower2 = new THREE.Mesh(
  new RoundedBoxGeometry(1.25, 0.75, 1.5, 4),
  new THREE.MeshStandardMaterial({ color: "#FA8C35" })
);
mainTower2.position.y = 2.25;
mainTower2.position.z = 1.5;
port.add(mainTower2);

const mainTower3 = new THREE.Mesh(
  new RoundedBoxGeometry(0.35, 0.35, 2.75, 4),
  new THREE.MeshStandardMaterial({ color: "#FA8C35" })
);
mainTower3.position.y = 3;
mainTower3.position.z = 0.5;
mainTower3.rotation.x = Math.PI / 4;
port.add(mainTower3);

const mainTower4 = new THREE.Mesh(
  new RoundedBoxGeometry(0.75, 1, 0.75, 4),
  new THREE.MeshStandardMaterial({ color: "#FA8C35" })
);
mainTower4.position.y = 2.75;
mainTower4.position.z = 1.5;
port.add(mainTower4);

const mainTower5 = new THREE.Mesh(
  new RoundedBoxGeometry(0.1, 0.1, 2.5, 4),
  new THREE.MeshStandardMaterial({ color: "#FA8C35" })
);
mainTower5.position.y = 2.5;
mainTower5.position.z = -0.25;
mainTower5.rotation.x = Math.PI / 2;
port.add(mainTower5);

// 船
const ship = new THREE.Mesh(
  new THREE.CapsuleGeometry(1, 2.5, 1, 3),
  new THREE.MeshStandardMaterial({ color: "#C83C23" })
);
ship.position.y = 0.5;
ship.position.z = -0.5;
ship.rotation.x = -Math.PI / 6;
ship.rotation.z = Math.PI * (1 / 2);

port.add(ship);

const shipCabin = new THREE.Mesh(
  new RoundedBoxGeometry(0.75, 1, 0.75, 4),
  new THREE.MeshStandardMaterial({ color: "#FFFFFF" })
);
shipCabin.position.x = 0.75;
shipCabin.position.y = 1.25;
shipCabin.position.z = -0.5;
shipCabin.rotation.x = Math.PI / 2;
port.add(shipCabin);

// 陆地与海

const portBase = new THREE.Group();
port.add(portBase);

const portOcean = new THREE.Mesh(
  new RoundedBoxGeometry(8, 0.4, 4, 4),
  new THREE.MeshStandardMaterial({
    color: "#1685A9",
  })
);
portOcean.position.z = -2;
portOcean.position.y = -0.2;
portBase.add(portOcean);

const portLand = new THREE.Mesh(
  new RoundedBoxGeometry(8, 0.4, 4, 4),
  new THREE.MeshStandardMaterial({
    color: "#96CE54",
  })
);
portLand.position.z = 2;
portLand.position.y = -0.2;
portBase.add(portLand);

/**
 *  白水城
 */

// Group
const pavilion = new THREE.Group();
scene.add(pavilion);

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
 * 银河
 */
// Group
const galaxy = new THREE.Group();
scene.add(galaxy);

const parameters = {};
parameters.count = 100000;
parameters.size = 0.02;
parameters.radius = 10;
parameters.branches = 3;
parameters.spin = 1;
parameters.randomness = 0.2;
parameters.randomnessPower = 3;
parameters.insideColor = "#ff6030";
parameters.outsideColor = "#1b3984";

// Let: varaible will change Const: varaible will not change
let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
  // Destroy old galaxy
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    galaxy.remove(points);
  }

  // Geometry
  geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);
  // lerp color to coverage on

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    // Position
    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2; //调整角度

    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX; //x
    positions[i3 + 1] = randomY; //y
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ; //z

    // Color
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // Material
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  // Points
  points = new THREE.Points(geometry, material);
  galaxy.add(points);
};
generateGalaxy();

// Control Panel

galaxyController
  .add(parameters, "count")
  .min(100)
  .max(200000)
  .step(100)
  .onFinishChange(generateGalaxy)
  .name("粒子数量");
galaxyController
  .add(parameters, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy)
  .name("粒子尺寸");
galaxyController
  .add(parameters, "radius")
  .min(0.01)
  .max(20)
  .step(0.01)
  .onFinishChange(generateGalaxy)
  .name("半径");
galaxyController
  .add(parameters, "branches")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy)
  .name("分支");
galaxyController
  .add(parameters, "spin")
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(generateGalaxy);
galaxyController
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy);
galaxyController
  .add(parameters, "randomnessPower")
  .min(1)
  .max(10)
  .step(0.001)
  .onFinishChange(generateGalaxy);
galaxyController
  .addColor(parameters, "insideColor")
  .onFinishChange(generateGalaxy)
  .name("内核颜色");
galaxyController
  .addColor(parameters, "outsideColor")
  .onFinishChange(generateGalaxy)
  .name("外圈颜色");

/**
 * 摆放位置与相对关系
 */
const objectDistance = 10;

port.scale.set(0.8, 0.8, 0.8);
port.rotation.x = Math.PI / 8;
pavilion.scale.set(0.8, 0.8, 0.8);
pavilion.rotation.x = Math.PI / 8;
galaxy.scale.set(0.8, 0.8, 0.8);
galaxy.rotation.x = Math.PI / 8;

//port.position.y = -objectDistance + 7;
port.position.x = 2;
pavilion.position.y = -objectDistance * 1;
pavilion.position.x = -2;
galaxy.position.y = -objectDistance * 2;
galaxy.position.x = 2;

const sectionMeshes = [port, pavilion, galaxy];

/**
 * 光源
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.6);
lightControl
  .add(ambientLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("环境光强度");
scene.add(ambientLight);
lightControl
  .addColor(colorFormats, "color")
  .onChange(() => {
    ambientLight.color.set(colorFormats.color);
  })
  .name("环境光颜色");

// 文字补充光源
const rectAreaLight = new THREE.RectAreaLight(0xd1ba29, 2, 2, 1);
rectAreaLight.position.set(0, 2, 2);
rectAreaLight.lookAt(0, 2.5, 2);
pavilion.add(rectAreaLight);

// Directional light
// 模拟太阳光
const moonLight = new THREE.DirectionalLight("#dbc869", 1);
moonLight.position.set(1, 1, 0);
lightControl
  .add(moonLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("平行光强度");
scene.add(moonLight);

lightControl
  .addColor(colorFormats, "color")
  .onChange(() => {
    moonLight.color.set(colorFormats.color);
  })
  .name("平行光颜色");

// Door Light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
pavilion.add(doorLight);

// Ghosts light
const ghost1 = new THREE.PointLight("#00a3f5", 2, 3);
pavilion.add(ghost1);

/**
 * Particles
 */
// Geometry
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] =
    objectDistance * 0.5 -
    Math.random() * objectDistance * sectionMeshes.length;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

// Material
const particlesMaterial = new THREE.PointsMaterial({
  color: parametersColor.materialColor,
  sizeAttenuation: textureLoader,
  size: 0.03,
});

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

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
 * 相机
 */
//Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  55,
  sizes.width / sizes.height,
  0.1,
  100
);
//camera.position.x = 7;
//camera.position.y = 2;
camera.position.z = 12;
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
renderer.setClearColor("#1e1a20");

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

    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2,inOut",
      y: "+=3",
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

mainTower1.castShadow = true;
mainTower2.castShadow = true;
mainTower3.castShadow = true;
mainTower4.castShadow = true;
mainTower5.castShadow = true;

baseTower.receiveShadow = true;
portLand.receiveShadow = true;

level1.castShadow = true;
level2.castShadow = true;
level3.castShadow = true;
level4.castShadow = true;

spring1.castShadow = true;
spring2.castShadow = true;
spring3.castShadow = true;

baseStone.receiveShadow = true;
floor.receiveShadow = true;

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
  // controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
