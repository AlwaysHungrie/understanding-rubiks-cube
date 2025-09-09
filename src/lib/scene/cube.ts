import * as THREE from "three";

import { COLORS, CUBE_SIZE, CUBE_SPACING } from "../constants";

const coordinates = [-1, 0, 1];
const cubeCoordinates = coordinates.flatMap((x) =>
  coordinates.flatMap((y) => coordinates.map((z) => [x, y, z]))
);
const faceColors = {
  front: COLORS.rubik_blue,
  back: COLORS.rubik_green,
  left: COLORS.rubik_red,
  right: COLORS.rubik_orange,
  top: COLORS.rubik_white,
  bottom: COLORS.rubik_yellow,
  none: COLORS.black,
};

type FaceMaterials = Record<keyof typeof faceColors, THREE.MeshLambertMaterial>;
const generateFaceMaterials = () => {
  return Object.keys(faceColors).reduce((acc, face) => {
    const faceKey = face as keyof typeof faceColors;
    acc[faceKey] = new THREE.MeshLambertMaterial({
      color: faceColors[faceKey],
    });
    return acc;
  }, {} as FaceMaterials);
};

const getCubeletFaces = (
  x: number,
  y: number,
  z: number,
  faceMaterials: FaceMaterials
) => {
  // right, left, top, bottom, front, back
  const faces = Array(6).fill(faceMaterials.none);

  if (x === 1) {
    faces[0] = faceMaterials.right;
  } else if (x === -1) {
    faces[1] = faceMaterials.left;
  }

  if (y === 1) {
    faces[2] = faceMaterials.top;
  } else if (y === -1) {
    faces[3] = faceMaterials.bottom;
  }

  if (z === 1) {
    faces[4] = faceMaterials.front;
  } else if (z === -1) {
    faces[5] = faceMaterials.back;
  }

  return faces;
};

const createCubelet = (
  x: number,
  y: number,
  z: number,
  faceMaterials: FaceMaterials
) => {
  const faces = getCubeletFaces(x, y, z, faceMaterials);
  const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
  const cube = new THREE.Mesh(geometry, faces);

  cube.position.set(
    x * (CUBE_SIZE + CUBE_SPACING),
    y * (CUBE_SIZE + CUBE_SPACING),
    z * (CUBE_SIZE + CUBE_SPACING)
  );

  cube.castShadow = true;
  cube.receiveShadow = true;

  return cube;
};

export const drawCube = (scene: THREE.Scene) => {
  const cubeGroup = new THREE.Group();
  const faceMaterials = generateFaceMaterials();
  const cubelets: THREE.Mesh[] = [];

  cubeCoordinates.forEach(([x, y, z]) => {
    const cubelet = createCubelet(x, y, z, faceMaterials);
    cubelets.push(cubelet);
    cubeGroup.add(cubelet);
  });

  cubeGroup.rotation.y = Math.PI / 4;
  scene.add(cubeGroup);

  return { cubelets, cubeGroup };
};
