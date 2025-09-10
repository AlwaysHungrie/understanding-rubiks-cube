import * as THREE from "three";
import { COLORS } from "../constants";
import { faceNormalCoordinates } from "../scene/cube";
import { coordinatesToKey, crossProductFromKeys } from "./helpers";

export const drawLine = (
  end: { x: number; y: number; z: number },
  start: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 },
  color: number = COLORS.red
) => {
  const lineGroup = new THREE.Group();
  const points = [
    new THREE.Vector3(start.x, start.y, start.z), // Center of cube group
    new THREE.Vector3(end.x, end.y, end.z), // Target point - made longer for visibility
  ];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: color, // Red line
    linewidth: 10, // Make it thicker
  });
  const line = new THREE.Line(lineGeometry, lineMaterial);
  lineGroup.add(line);

  // add a sphere to the end of the line
  const sphereGeometry = new THREE.SphereGeometry(0.1);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: color });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.copy(end);
  lineGroup.add(sphere);

  return lineGroup;
};

export const recolorLine = (line: THREE.Line, color: number) => {
  const lineMaterial = line.material as THREE.LineBasicMaterial;
  lineMaterial.color.set(color);
  lineMaterial.needsUpdate = true;
};

export const recolorSphere = (sphere: THREE.Mesh, color: number) => {
  const sphereMaterial = sphere.material as THREE.MeshBasicMaterial;
  sphereMaterial.color.set(color);
  sphereMaterial.needsUpdate = true;
};

const recolorFaceNormal = (faceNormal: THREE.Group, color: number) => {
  const line = faceNormal.children[1] as THREE.Line;
  recolorLine(line, color);
  const sphere = faceNormal.children[0] as THREE.Mesh;
  recolorSphere(sphere, color);
};

export const findPrimaryNormals = (
  faceNormals: { key: string; normal: THREE.Group }[],
  parent: THREE.Group,
  primaryNormals: {
    front: string;
    top: string;
    left: string;
  }
) => {
  const directions = faceNormalCoordinates.map(([x, y, z]) => {
    const key = coordinatesToKey([x, y, z]);
    const normalVector = new THREE.Vector3(x, y, z);
    const direction = normalVector.transformDirection(parent.matrixWorld);
    return { key, direction };
  });

  const zAxis = new THREE.Vector3(0.25, 0, 1);
  const yAxis = new THREE.Vector3(0, 1, 0);

  const frontFaceAngles = directions
    .map(({ key, direction }) => {
      const angle = zAxis.angleTo(direction);
      return { key, angle };
    })
    .sort((a, b) => a.angle - b.angle);

  const frontFaceKey = frontFaceAngles[0].key;

  const topFaceAngles = directions
    .filter(({ key }) => key !== frontFaceKey)
    .map(({ key, direction }) => {
      const angle = yAxis.angleTo(direction);
      return { key, angle };
    })
    .sort((a, b) => a.angle - b.angle);

  const topFaceKey = topFaceAngles[0].key;

  const leftFaceKey = crossProductFromKeys(frontFaceKey, topFaceKey);

  faceNormals.forEach((normal) => {
    if (frontFaceKey === normal.key) {
      recolorFaceNormal(normal.normal, COLORS.rubik_green);
    } else if (topFaceKey === normal.key) {
      recolorFaceNormal(normal.normal, COLORS.rubik_blue);
    } else if (leftFaceKey === normal.key) {
      recolorFaceNormal(normal.normal, COLORS.rubik_yellow);
    } else {
      recolorFaceNormal(normal.normal, COLORS.rubik_red);
    }
  });

  return {
    front: frontFaceKey,
    top: topFaceKey,
    left: leftFaceKey,
  };
};
