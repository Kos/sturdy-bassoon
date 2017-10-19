export function initBuffer(gl) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [[-0.5, -0.5, 0], [0.5, -0.5, 0], [0, 0.5, 0]];
  const flatPositions = [].concat.apply([], positions);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(flatPositions),
    gl.STATIC_DRAW
  );
  return positionBuffer;
}
