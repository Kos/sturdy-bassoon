// adapted from MDN

export function initShaderProgram(gl, vsSource, fsSource, attribLocations) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  Object.keys(attribLocations).forEach(name => {
    gl.bindAttribLocation(shaderProgram, attribLocations[name], name);
  });
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error(
      "Unable to initialize the shader program:",
      gl.getProgramInfoLog(shaderProgram)
    );
    throw new Error("Shader failed to link");
  }
  return shaderProgram;
}

export function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "An error occurred compiling the shaders:",
      gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    throw new Error("Shader failed to compile");
  }
  return shader;
}

export function bindAttributes(gl, program, attributes) {
  Object.keys(attributes).forEach(name => {
    const location = gl.getAttribLocation(program, name);
    if (location !== -1) {
      gl.enableVertexAttribArray(location);
      console.log(
        "gl.vertexAttribPointer",
        name,
        location,
        ...attributes[name]
      );
      gl.vertexAttribPointer(location, ...attributes[name]);
    }
  });
}

export function unbindAttributes(gl, program, attributes) {
  Object.keys(attributes).forEach(name => {
    const location = gl.getAttribLocation(program, name);
    if (location !== -1) {
      gl.disableVertexAttribArray(location);
    }
  });
}
