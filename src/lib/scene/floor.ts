import { COLORS, CUBE_SIZE, SCENE_CLICKABLE_TYPES } from "@/lib/constants";
import { createRoundedBoxGeometry } from "@/lib/threejsHelpers/roundedBox";
import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

export const FLOOR_SIZE = 10;
export const FLOOR_HEIGHT = 0.1;

export const drawFloor = async (scene: THREE.Scene, resetCube: () => Promise<void>) => {
  const floorGroup = new THREE.Group();

  const floorGeometry = createRoundedBoxGeometry(
    FLOOR_SIZE,
    FLOOR_HEIGHT,
    FLOOR_SIZE,
    0.5,
    8
  );
  const floorMaterial = new THREE.MeshLambertMaterial({ color: COLORS.grey });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);

  floor.castShadow = false;
  floor.receiveShadow = true;
  floorGroup.add(floor);

  // Create a 3D button on the floor
  const buttonGeometry = createRoundedBoxGeometry(4, 0.2, 1, 0.1, 8);
  const buttonMaterial = new THREE.MeshLambertMaterial({ color: COLORS.white });
  const button = new THREE.Mesh(buttonGeometry, buttonMaterial);

  // Position the button on the floor surface
  button.position.set(0, -FLOOR_SIZE / 2 + 1, FLOOR_HEIGHT);
  floorGroup.add(button);
  button.castShadow = true;
  button.receiveShadow = true;

  // Add userData to identify this as a clickable button
  button.userData = {
    type: SCENE_CLICKABLE_TYPES[0],
    onClick: () => {
      resetCube();
    },
  };

  // Add text to the button
  const fontLoader = new FontLoader();
  const font = await fontLoader.loadAsync("/Oswald_Regular.json");
  const textGeometry = new TextGeometry("RESET ORIENTATION", {
    font: font,
    size: 0.3,
    depth: 0,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  
  // Center the text geometry
  textGeometry.computeBoundingBox();
  const textWidth = textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x;
  const textHeight = textGeometry.boundingBox!.max.y - textGeometry.boundingBox!.min.y;
  textGeometry.translate(-textWidth / 2, -textHeight / 2, 0);
  
  const textMaterial = new THREE.MeshPhongMaterial({ 
    color: COLORS.black,
    shininess: 30
  });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  text.position.set(0, -FLOOR_SIZE / 2 + 1, FLOOR_HEIGHT + 0.2);
  floorGroup.add(text);

  // floorGroup.position.y = -CUBE_SIZE * 3;
  floorGroup.rotation.x = -Math.PI / 2;
  floorGroup.position.y = -CUBE_SIZE * 3;
  scene.add(floorGroup);
};
