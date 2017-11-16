export function initBuffer(gl, array, mode = gl.STATIC_DRAW) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, array, mode);
  return buffer;
}

export function threes(n) {
  const list = Array(n);
  for (let i = 0; i < n; ++i) {
    list[i] = i % 3;
  }
  const array = new Float32Array(list);
  return array;
}
