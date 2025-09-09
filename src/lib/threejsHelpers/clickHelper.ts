import * as THREE from "three";

// Helper function to handle 3D object clicks using raycasting
export const checkObjectClick = (
  event: MouseEvent,
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
  objectTypes: string[]
) => {
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  // Calculate mouse position in normalized device coordinates
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children, true);

  // Check if we clicked on a button
  for (let intersect of intersects) {
    if (
      intersect.object.userData &&
      objectTypes.includes(intersect.object.userData.type)
    ) {
      intersect.object.userData.onClick();
      break;
    }
  }
};