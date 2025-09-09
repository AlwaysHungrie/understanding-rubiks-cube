import * as THREE from "three";

export const magnitude = (vector: { x: number; y: number }) => {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
};

export const coordinatesToKey = (coordinates: [number, number, number]) => {
  return coordinates.join(",");
};

export const crossProductFromKeys = (key1: string, key2: string) => {
  const coordinates1 = key1.split(",").map(Number);
  const coordinates2 = key2.split(",").map(Number);

  const vector1 = new THREE.Vector3(
    coordinates1[0],
    coordinates1[1],
    coordinates1[2]
  );
  const vector2 = new THREE.Vector3(
    coordinates2[0],
    coordinates2[1],
    coordinates2[2]
  );
  const crossProduct = vector1.cross(vector2);
  return coordinatesToKey(crossProduct.toArray());
};
