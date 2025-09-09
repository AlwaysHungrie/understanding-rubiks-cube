import * as THREE from "three";

// Custom function to create rounded box geometry
export const createRoundedBoxGeometry = (
  width: number,
  height: number,
  depth: number,
  radius: number,
  segments: number = 8
) => {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -depth / 2;
  const w = width;
  const h = depth;
  const r = radius;

  // Create rounded rectangle shape
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  // Extrude the shape to create 3D geometry
  const extrudeSettings = {
    depth: height,
    bevelEnabled: true,
    bevelSegments: segments,
    steps: 1,
    bevelSize: 0,
    bevelThickness: 0,
  };

  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
};
