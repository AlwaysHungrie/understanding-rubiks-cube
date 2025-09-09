import * as THREE from "three";
import { magnitude } from "./helpers";
import {
  ACCELERATION_FACTOR,
  DAMPING_FACTOR,
  MAX_VELOCITY,
} from "../constants";

export const rotateObjectToTarget = (
  cube: THREE.Group,
  targetRotation: { x: number; y: number },
  currentVelocity: { x: number; y: number },
  accelerationFactor: number = ACCELERATION_FACTOR,
  dampingFactor: number = DAMPING_FACTOR,
  maxVelocity: number = MAX_VELOCITY
) => {
  const currentRotation = { x: cube.rotation.x, y: cube.rotation.y };
  const distance = {
    x: targetRotation.x - currentRotation.x,
    y: targetRotation.y - currentRotation.y,
  };

  // without normalization, cube will rotate on a longer path in some cases
  // todo: understand why and the formula used here
  const normalizedDistance = {
    x: ((distance.x + Math.PI) % (2 * Math.PI)) - Math.PI,
    y: ((distance.y + Math.PI) % (2 * Math.PI)) - Math.PI,
  };

  const acceleration = {
    x: normalizedDistance.x * accelerationFactor,
    y: normalizedDistance.y * accelerationFactor,
  };

  let velocity = {
    x: (currentVelocity.x + acceleration.x) * dampingFactor,
    y: (currentVelocity.y + acceleration.y) * dampingFactor,
  };

  // Limit velocity to MAX_VELOCITY
  let velocityMagnitude = magnitude(velocity);
  if (velocityMagnitude > maxVelocity) {
    const scale = maxVelocity / velocityMagnitude;
    velocity = {
      x: velocity.x * scale,
      y: velocity.y * scale,
    };
  }
  velocityMagnitude = magnitude(velocity);
  const distanceMagnitude = magnitude(normalizedDistance);

  // Apply rotation to object
  cube.rotation.x += velocity.x;
  cube.rotation.y += velocity.y;

  // Stop condition check
  const E = 0.0001;
  if (distanceMagnitude < E && velocityMagnitude < E * 10) {
    // Snap to exact target and stop
    cube.rotation.x = targetRotation.x;
    cube.rotation.y = targetRotation.y;
    velocity = { x: 0, y: 0 };
  }

  return velocity;
};
