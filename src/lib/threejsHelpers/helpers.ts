export const magnitude = (vector: { x: number; y: number }) => {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
};