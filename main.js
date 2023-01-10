import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import * as THREE from "three";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(60);
camera.position.setY(5);
camera.rotateX(-50);

//create object
const geometry = new THREE.TorusGeometry(11, 1.5, 50, 50);
const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
});
const geometrySphere = new THREE.SphereGeometry(8, 50, 50);
const materialSphere = new THREE.MeshStandardMaterial({
  color: 0xff6347,
});
// const material = new THREE.MeshBasicMaterial({
//   color: 0xff6347,
//   wireframe: true,
// });

const torus = new THREE.Mesh(geometry, material);
scene.add(torus);
const sphere = new THREE.Mesh(geometrySphere, materialSphere);
scene.add(sphere);

//light to the scene
const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(ambientLight, pointLight);

//light and grid helpers
// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

// orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

torus.position.setY(20);
sphere.position.setY(20);

let starsMap = [];

const createStar = () => {
  const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
  const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(starGeometry, starMaterial);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  starsMap.push(star);
  scene.add(star);
};

Array(600).fill().forEach(createStar);

console.log(starsMap, "stars");

//multiplying stars
// Array(200).fill().forEach(addStar);

// adding space texture
const spaceTexture = new THREE.TextureLoader().load("textures/space.jpg");
scene.background = spaceTexture;

// adding mari texture
const mariTexture = new THREE.TextureLoader().load("textures/mari.png");

const mari = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: mariTexture })
);

scene.add(mari);

// creating the moon
const moonTexture = new THREE.TextureLoader().load("textures/moon.jpg");
const normalTexture = new THREE.TextureLoader().load("textures/normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalTexture })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

// setting up camera movement onScroll
const moveCamera = () => {
  const distanceTop = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  mari.rotation.y += 0.01;
  mari.rotation.z += 0.01;

  camera.position.z = distanceTop * -0.01;
  camera.position.x = distanceTop * -0.0002;
  camera.position.y = distanceTop * -0.0002;
};

document.body.onscroll = moveCamera;

const beforeRenderAction = () => {
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  const getPositive = (number) => {
    if (number < 0) return null;
    return number;
  };

  // if (starsMap)
  // starsMap.map((s) => {
  //   s.position.y += getPositive(THREE.MathUtils.randFloatSpread(0.2));
  //   s.position.x += getPositive(THREE.MathUtils.randFloatSpread(0.2));
  //   s.position.z += getPositive(THREE.MathUtils.randFloatSpread(0.2));
  // });
};
//GAME LOOP
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  beforeRenderAction();

  renderer.render(scene, camera);
};

animate();
