import { COLORS, CUBE_SIZE, SCENE_CLICKABLE_TYPES } from "@/lib/constants";
import { createRoundedBoxGeometry } from "@/lib/threejsHelpers/roundedBox";
import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader, Font } from "three/addons/loaders/FontLoader.js";

export const FLOOR_SIZE = 10;
export const FLOOR_HEIGHT = 0.1;

const getTextGeometry = async (text: string, font: Font) => {
  const textGeometry = new TextGeometry(text, {
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
  const textWidth =
    textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x;
  const textHeight =
    textGeometry.boundingBox!.max.y - textGeometry.boundingBox!.min.y;
  textGeometry.translate(-textWidth / 2, -textHeight / 2, 0);

  return textGeometry;
};

const getButton = (width: number) => {
  // Create a 3D button on the floor
  const buttonGeometry = createRoundedBoxGeometry(width, 0.2, 1, 0.1, 8);
  const buttonMaterial = new THREE.MeshLambertMaterial({ color: COLORS.white });
  const button = new THREE.Mesh(buttonGeometry, buttonMaterial);

  button.castShadow = true;
  button.receiveShadow = true;

  return button;
};

export const drawFloor = async (
  scene: THREE.Scene,
  resetCube: () => Promise<void>,
  shuffleCube?: () => Promise<void>
) => {
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

  const width = 4;
  const spacing = 0.25;
  const fontLoader = new FontLoader();
  const font = await fontLoader.loadAsync("/Oswald_Regular.json");
  const textMaterial = new THREE.MeshPhongMaterial({
    color: COLORS.black,
    shininess: 30,
  });

  const resetButton = getButton(width);
  resetButton.position.set(
    shuffleCube ? width / 2 + spacing : 0,
    -FLOOR_SIZE / 2 + 1,
    FLOOR_HEIGHT
  );
  // Add userData to identify this as a clickable button
  resetButton.userData = {
    type: SCENE_CLICKABLE_TYPES[0],
    onClick: () => {
      resetCube();
    },
  };
  floorGroup.add(resetButton);
  const resetTextGeometry = await getTextGeometry("RESET ORIENTATION", font);
  const resetText = new THREE.Mesh(resetTextGeometry, textMaterial);
  resetText.position.set(
    shuffleCube ? width / 2 + spacing : 0,
    -FLOOR_SIZE / 2 + 1,
    FLOOR_HEIGHT + 0.2
  );
  floorGroup.add(resetText);

  if (shuffleCube) {
    const shuffleButton = getButton(width);
    shuffleButton.position.set(
      -width / 2 - spacing,
      -FLOOR_SIZE / 2 + 1,
      FLOOR_HEIGHT
    );
    shuffleButton.userData = {
      type: SCENE_CLICKABLE_TYPES[0],
      onClick: () => {
        shuffleCube();
      },
    };
    floorGroup.add(shuffleButton);
    const shuffleTextGeometry = await getTextGeometry("SHUFFLE", font);
    const shuffleText = new THREE.Mesh(shuffleTextGeometry, textMaterial);
    shuffleText.position.set(
      -width / 2 - spacing,
      -FLOOR_SIZE / 2 + 1,
      FLOOR_HEIGHT + 0.2
    );
    floorGroup.add(shuffleText);
  }

  // floorGroup.position.y = -CUBE_SIZE * 3;
  floorGroup.rotation.x = -Math.PI / 2;
  floorGroup.position.y = -CUBE_SIZE * 3;
  scene.add(floorGroup);
};
