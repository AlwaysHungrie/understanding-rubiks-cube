import { COLORS, CUBE_SIZE, SCENE_CLICKABLE_TYPES } from "@/lib/constants";
import { createRoundedBoxGeometry } from "@/lib/threejsHelpers/roundedBox";
import * as THREE from "three";

export const FLOOR_SIZE = 10;
export const FLOOR_HEIGHT = 0.1;

export const drawFloor = (scene: THREE.Scene, resetCube: () => void) => {
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
  const buttonGeometry = createRoundedBoxGeometry(4, 0.1, 1, 0.1, 8);
  const button = new THREE.Mesh(buttonGeometry, floorMaterial);

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

  // floorGroup.position.y = -CUBE_SIZE * 3;
  floorGroup.rotation.x = -Math.PI / 2;
  floorGroup.position.y = -CUBE_SIZE * 3;
  scene.add(floorGroup);

  // TODO: Add a text to the button
};
