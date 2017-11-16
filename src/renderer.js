import * as shaders from "./shaders";
import { initBuffer } from "./utils/buffers";
import { initShaderProgram } from "./utils/shaders";
import Scene from "./scene";
import { mat4 } from "gl-matrix";

const AttribLocations = {
  aVertexPosition: 0,
  aVertexId: 1,
  aNormal: 2
};

export default class Renderer {
  constructor({ target, width = 800, height = 600 }) {
    this._nextRender = this._nextRender.bind(this);
    this.canvas = this._createCanvas(target, width, height);
    this.gl = this._createContext();
    this.scene = new Scene();
    this.meshes = {};
    this.projectionMatrix = mat4.create();
    this.shaderContext = null;

    const particlesData = new Float32Array(10 * 3 * 3);
    particlesData[0] = particlesData[0 + 3] = particlesData[0 + 6] = 2;
    particlesData[1] = particlesData[1 + 3] = particlesData[1 + 6] = 3;
    particlesData[2] = particlesData[2 + 3] = particlesData[2 + 6] = 0;
    this.particles = {
      // TODO cyclic buffer?
      count: 10,
      data: particlesData,
      buffer: initBuffer(this.gl, particlesData, this.gl.DYNAMIC_DRAW),
      instanceIdBuffer: initBuffer(this.gl, threes(10 * 3))
    };
    window.requestAnimationFrame(() => this._setup());
    window.requestAnimationFrame(this._nextRender);
  }

  setOrthoProjection(w, h) {
    mat4.ortho(this.projectionMatrix, 0, w, 0, h, 10, -10);
  }

  updateMeshes(meshes) {
    const { gl } = this;
    meshes.forEach(({ name, mode = gl.TRIANGLES, data, normals }) => {
      this.meshes[name] = {
        name,
        mode,
        length: data.length / 3,
        buffer: initBuffer(this.gl, data),
        normalBuffer: initBuffer(this.gl, normals),
        instanceIdBuffer: initBuffer(this.gl, threes(data.length / 3))
      };
    });
  }

  getCurrentScene() {
    return this.scene;
  }

  _createCanvas(target, width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    target.appendChild(canvas);
    return canvas;
  }

  _createContext() {
    const gl = this.canvas.getContext("experimental-webgl", { stencil: true });
    if (!gl) {
      throw new Error("Cannot create webgl context");
    }
    gl.getExtension("OES_standard_derivatives"); // TODO how to check if successful?
    return gl;
  }

  _setup() {
    const { gl } = this;
    this._setupShaders();

    const that = this; // HACK: use a closure; shader hot reload won't work if we use an arrow here (`this` will be null)
    module.hot.accept("./shaders", function() {
      that._setupShaders();
    });

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 1);
  }

  _setupShaders() {
    const { gl } = this;
    const shaderProgram = initShaderProgram(
      gl,
      shaders.vertex,
      shaders.fragment,
      AttribLocations
    );
    this.shaderContext = {
      program: shaderProgram,
      locations: loadLocations(gl, shaderProgram, {
        attributes: ["aVertexPosition", "aVertexId"],
        uniforms: ["uModelMatrix", "uProjectionMatrix"]
      })
    };

    const outlineShaderProgram = initShaderProgram(
      gl,
      shaders.outlineVertex,
      shaders.outlineFragment,
      AttribLocations
    );
    this.outlineShaderContext = {
      program: outlineShaderProgram,
      locations: loadLocations(gl, outlineShaderProgram, {
        attributes: ["aVertexPosition", "aNormal"],
        uniforms: ["uModelMatrix", "uProjectionMatrix"]
      })
    };

    const particleShaderProgram = initShaderProgram(
      gl,
      shaders.particleVertex,
      shaders.fragment,
      AttribLocations
    );
    this.particleShaderContext = {
      program: particleShaderProgram,
      locations: loadLocations(gl, particleShaderProgram, {
        attributes: ["aVertexPosition", "aVertexId"],
        uniforms: ["uProjectionMatrix"]
      })
    };
  }

  _nextRender() {
    this._render();
    window.requestAnimationFrame(this._nextRender);
  }

  _render() {
    const { gl } = this;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    gl.enable(gl.STENCIL_TEST);

    // Models
    gl.stencilFunc(gl.ALWAYS, 1, 255);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
    gl.useProgram(this.shaderContext.program);
    gl.uniformMatrix4fv(
      this.shaderContext.locations.uProjectionMatrix,
      false,
      this.projectionMatrix
    );
    this.scene
      .getModels()
      .forEach(model => this._renderModel(model, this.shaderContext));

    // Model outlines
    gl.stencilFunc(gl.EQUAL, 0, 255);
    gl.useProgram(this.outlineShaderContext.program);
    gl.uniformMatrix4fv(
      this.outlineShaderContext.locations.uProjectionMatrix,
      false,
      this.projectionMatrix
    );
    this.scene
      .getModels()
      .forEach(model => this._renderModel(model, this.outlineShaderContext));

    // Particles
    const f3 = [3, gl.FLOAT, false, 0, 0];
    gl.stencilFunc(gl.ALWAYS, 0, 0);
    const { particles } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, particles.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, particles.data, gl.DYNAMIC_DRAW);
    gl.useProgram(this.particleShaderContext.program);
    gl.uniformMatrix4fv(
      this.particleShaderContext.locations.uProjectionMatrix,
      false,
      this.projectionMatrix
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, particles.buffer);
    gl.enableVertexAttribArray(AttribLocations.aVertexPosition);
    gl.vertexAttribPointer(AttribLocations.aVertexPosition, ...f3);
    gl.bindBuffer(gl.ARRAY_BUFFER, particles.instanceIdBuffer);
    gl.enableVertexAttribArray(AttribLocations.aVertexId);
    gl.vertexAttribPointer(AttribLocations.aVertexId, 1, gl.FLOAT, false, 0, 0);
    gl.disableVertexAttribArray(AttribLocations.aNormal);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * this.particles.count);
  }

  _renderModel(model, shaderContext) {
    const { gl } = this;
    const { mesh: meshName, matrix: modelMatrix } = model;
    const mesh = this.meshes[meshName];
    if (!mesh) {
      this.error("no such mesh", meshName);
    }
    const {
      aVertexPosition,
      aVertexId,
      aNormal,
      uModelMatrix
    } = shaderContext.locations;
    gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix);

    gl.enableVertexAttribArray(AttribLocations.aVertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buffer);
    gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);

    if (aVertexId) {
      gl.enableVertexAttribArray(AttribLocations.aVertexId);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.instanceIdBuffer);
      gl.vertexAttribPointer(aVertexId, 1, gl.FLOAT, false, 0, 0);
    } else {
      gl.disableVertexAttribArray(AttribLocations.aVertexId);
    }

    if (aNormal) {
      gl.enableVertexAttribArray(AttribLocations.aNormal);
      gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
    } else {
      gl.disableVertexAttribArray(AttribLocations.aNormal);
    }
    gl.drawArrays(mesh.mode, 0, mesh.length);
  }

  error(...args) {
    throw new Error(args);
  }
}

function threes(n) {
  const list = Array(n);
  for (let i = 0; i < n; ++i) {
    list[i] = i % 3;
  }
  const array = new Float32Array(list);
  return array;
}

function loadLocations(gl, program, { attributes, uniforms }) {
  const locations = {};
  attributes.forEach(attr => {
    locations[attr] = gl.getAttribLocation(program, attr);
  });
  uniforms.forEach(attr => {
    locations[attr] = gl.getUniformLocation(program, attr);
  });
  return locations;
}
