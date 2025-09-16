import * as THREE from "three";

import { COLORS, CUBE_SIZE, CUBE_SPACING, FACE_LEVELS } from "../constants";
import { drawLine } from "../threejsHelpers/line";
import { coordinatesToKey } from "../threejsHelpers/helpers";

const coordinates = [-1, 0, 1];
const cubeCoordinates = coordinates.flatMap((x) =>
  coordinates.flatMap((y) => coordinates.map((z) => [x, y, z]))
);

export const faceNormalCoordinates = cubeCoordinates.filter(
  ([x, y, z]) => Math.abs(x) + Math.abs(y) + Math.abs(z) === 1
);

export const CENTER_PIECE_COORDINATES = cubeCoordinates
  .filter(([x, y, z]) => Math.abs(x) + Math.abs(y) + Math.abs(z) === 1)
  .reduce((acc, curr) => {
    acc.add(coordinatesToKey([curr[0], curr[1], curr[2]]));
    return acc;
  }, new Set<string>());

export const ALL_CUBE_COORDINATES = cubeCoordinates.reduce((acc, curr) => {
  acc.add(coordinatesToKey([curr[0], curr[1], curr[2]]));
  return acc;
}, new Set<string>());

const faceColors = {
  front: COLORS.rubik_blue,
  back: COLORS.rubik_green,
  left: COLORS.rubik_red,
  right: COLORS.rubik_orange,
  top: COLORS.rubik_white,
  bottom: COLORS.rubik_yellow,
  none: COLORS.black,
};

const getCubeletFaces = (
  x: number,
  y: number,
  z: number,
  isVisible: boolean
) => {
  // right, left, top, bottom, front, back
  const faces = Array(6).fill(
    new THREE.MeshLambertMaterial({ color: faceColors.none })
  );

  if (!isVisible) {
    return faces;
  }

  if (x === 1) {
    faces[0] = new THREE.MeshLambertMaterial({ color: faceColors.right });
  } else if (x === -1) {
    faces[1] = new THREE.MeshLambertMaterial({ color: faceColors.left });
  }

  if (y === 1) {
    faces[2] = new THREE.MeshLambertMaterial({ color: faceColors.top });
  } else if (y === -1) {
    faces[3] = new THREE.MeshLambertMaterial({ color: faceColors.bottom });
  }

  if (z === 1) {
    faces[4] = new THREE.MeshLambertMaterial({ color: faceColors.front });
  } else if (z === -1) {
    faces[5] = new THREE.MeshLambertMaterial({ color: faceColors.back });
  }

  return faces;
};

const createCubelet = (x: number, y: number, z: number, isVisible: boolean) => {
  const faces = getCubeletFaces(x, y, z, isVisible);
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

export const drawCube = (
  scene: THREE.Scene,
  visibleCoordinates: Set<string>
) => {
  const cubeGroup = new THREE.Group();
  const cubelets: THREE.Mesh[] = [];
  const faceNormals: { key: string; normal: THREE.Group }[] = [];

  cubeCoordinates.forEach(([x, y, z]) => {
    const key = coordinatesToKey([x, y, z]);
    const cubelet = createCubelet(x, y, z, visibleCoordinates.has(key));
    cubelets.push(cubelet);
    cubeGroup.add(cubelet);
  });

  const axisLength = 3.5;
  faceNormalCoordinates.forEach(([x, y, z]) => {
    const line = drawLine({
      x: x * axisLength,
      y: y * axisLength,
      z: z * axisLength,
    });
    faceNormals.push({ key: coordinatesToKey([x, y, z]), normal: line });
    cubeGroup.add(line);
  });

  cubeGroup.rotation.y = Math.PI / 4;
  scene.add(cubeGroup);

  return { cubelets, cubeGroup, faceNormals };
};

const getNormalColor = (color: number) => {
  if (color === COLORS.rubik_highlightwhite) return COLORS.rubik_white;
  if (color === COLORS.rubik_highlightred) return COLORS.rubik_red;
  if (color === COLORS.rubik_highlightgreen) return COLORS.rubik_green;
  if (color === COLORS.rubik_highlightblue) return COLORS.rubik_blue;
  if (color === COLORS.rubik_highlightorange) return COLORS.rubik_orange;
  if (color === COLORS.rubik_highlightyellow) return COLORS.rubik_yellow;

  return color;
};

const getHighlightColor = (color: number) => {
  if (color === COLORS.rubik_white) return COLORS.rubik_highlightwhite;
  if (color === COLORS.rubik_red) return COLORS.rubik_highlightred;
  if (color === COLORS.rubik_green) return COLORS.rubik_highlightgreen;
  if (color === COLORS.rubik_blue) return COLORS.rubik_highlightblue;
  if (color === COLORS.rubik_orange) return COLORS.rubik_highlightorange;
  if (color === COLORS.rubik_yellow) return COLORS.rubik_highlightyellow;

  return color;
};

export const highlightCubelet = (cubelet: THREE.Mesh) => {
  const cubeletMaterials = cubelet.material;

  if (!Array.isArray(cubeletMaterials)) return;

  cubeletMaterials.forEach((material) => {
    const cubeletMaterial = material as THREE.MeshLambertMaterial;
    cubeletMaterial.color.set(
      getHighlightColor(cubeletMaterial.color.getHex())
    );
    cubeletMaterial.needsUpdate = true;
  });
};

export const removeHighlights = (cubelets: THREE.Mesh[]) => {
  cubelets.forEach((cubelet) => {
    const cubeletMaterials = cubelet.material;
    if (!Array.isArray(cubeletMaterials)) return;

    cubeletMaterials.forEach((material) => {
      const cubeletMaterial = material as THREE.MeshLambertMaterial;
      cubeletMaterial.color.set(getNormalColor(cubeletMaterial.color.getHex()));
      cubeletMaterial.needsUpdate = true;
    });
  });
};

export const findFace = (
  cubelets: THREE.Mesh[],
  normalKey: string,
  cube: THREE.Group | null,
  distance: (typeof FACE_LEVELS)[number]
) => {
  if (!cube) return;
  const normalKeyCoordinates = normalKey.split(",").map(Number);
  const normalVector = new THREE.Vector3(
    normalKeyCoordinates[0] * 5,
    normalKeyCoordinates[1] * 5,
    normalKeyCoordinates[2] * 5
  );

  const axis = normalVector.applyMatrix4(cube.matrixWorld);

  const distances = cubelets
    .map((cubelet) => {
      const cubeCenter = new THREE.Vector3(
        cubelet.position.x + CUBE_SIZE / 2,
        cubelet.position.y + CUBE_SIZE / 2,
        cubelet.position.z + CUBE_SIZE / 2
      );
      const transformedCubeCenter = cubeCenter.applyMatrix4(cube.matrixWorld);
      const distance = transformedCubeCenter.distanceTo(axis);
      return { distance, cubelet };
    })
    .sort((a, b) => a.distance - b.distance);

  const faceCubelets = distances.slice(distance * 9, (distance + 1) * 9);
  faceCubelets.forEach((cubelet) => {
    highlightCubelet(cubelet.cubelet);
  });
  return { faceCubelets, axis };
};

export const rotateFace = (
  cubelets: THREE.Mesh[],
  normalKey: string,
  cube: THREE.Group | null,
  distance: (typeof FACE_LEVELS)[number]
) => {
  if (!cube) return;
  removeHighlights(cubelets);

  const face = findFace(cubelets, normalKey, cube, distance);
  if (!face) return;

  const { faceCubelets } = face;

  const vertices = normalKey.split(",").map(Number);
  const axis = new THREE.Vector3(vertices[0], vertices[1], vertices[2]);

  // Remove any existing temporary group from previous rotations
  cube.children
    .filter((child) => child.userData.isTemporaryGroup)
    .forEach((group) => {
      cube.remove(group);
    });

  // Remove cubes from main group
  faceCubelets.forEach(({ cubelet }) => {
    cube.remove(cubelet);
  });

  // Create a new temporary group for rotation
  const tempGroup = new THREE.Group();
  tempGroup.userData.isTemporaryGroup = true;
  tempGroup.add(...faceCubelets.map(({ cubelet }) => cubelet));

  cube.add(tempGroup);

  return { tempGroup, axis };
};
