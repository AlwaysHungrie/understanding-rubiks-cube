import * as THREE from "three";
import { COLORS } from "../constants";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const setupLights = (scene: THREE.Scene) => {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(COLORS.white, 1);

  // Main light
  const mainLight = new THREE.DirectionalLight(COLORS.white, 1);
  mainLight.position.set(10, 15, 5);
  mainLight.castShadow = true;

  // Window light
  const windowLight = new THREE.DirectionalLight(COLORS.white, 0.8);
  windowLight.position.set(0, 10, 15);
  windowLight.castShadow = false;

  // Side light
  const sideLight = new THREE.DirectionalLight(COLORS.white, 0.6);
  sideLight.position.set(15, 8, 0);
  sideLight.castShadow = false;

  // Back light
  const backLight = new THREE.DirectionalLight(COLORS.white, 0.4);
  backLight.position.set(0, 5, -15);
  backLight.castShadow = false;

  // Main light Shadow Properties
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  mainLight.shadow.camera.near = 0.5;
  mainLight.shadow.camera.far = 50;
  mainLight.shadow.camera.left = -20;
  mainLight.shadow.camera.right = 20;
  mainLight.shadow.camera.top = 20;
  mainLight.shadow.camera.bottom = -20;
  mainLight.shadow.bias = -0.0001;

  scene.add(ambientLight);
  scene.add(mainLight);
  scene.add(windowLight);
  scene.add(sideLight);
  scene.add(backLight);
};

export const setupScene = (window: Window) => {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 10, 20);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(COLORS.offwhite);
  renderer.setSize(window.innerWidth, window.innerHeight - 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  setupLights(scene);

  // Helpers
  // const axesHelper = new THREE.AxesHelper(10);
  // scene.add(axesHelper);
  // const controls = new OrbitControls(camera, renderer.domElement);

  return { scene, camera, renderer };
};
