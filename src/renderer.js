import * as shaders from "./shaders";
import { initBuffer } from "./utils/buffers";
import { initShaderProgram } from "./utils/shaders";
import Scene from "./scene";
import { mat4 } from "gl-matrix";

export default class Renderer {
  constructor({ target, width = 800, height = 600 }) {
    this._nextRender = this._nextRender.bind(this);
    this.canvas = this._createCanvas(target, width, height);
    this.gl = this._createContext();
    this.scene = new Scene();
    this.meshes = {};
    this.projectionMatrix = mat4.create();
    this.shaderContext = null;
    window.requestAnimationFrame(() => this._setup());
    window.requestAnimationFrame(this._nextRender);
  }

  setOrthoProjection(w, h) {
    mat4.ortho(this.projectionMatrix, 0, w, h, 0, 1, -1);
  }

  updateMeshes(meshes) {
    const { gl } = this;
    meshes.forEach(({ name, mode = gl.TRIANGLES, data }) => {
      this.meshes[name] = {
        name,
        mode,
        length: data.length / 3,
        buffer: initBuffer(this.gl, data)
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
    const gl = this.canvas.getContext("experimental-webgl");
    if (!gl) {
      throw new Error("Cannot create webgl context");
    }
    return gl;
  }

  _setup() {
    const { gl } = this;
    this._setupShaders();

    const that = this; // HACK: use a closure; shader hot reload won't work if we use an arrow here (`this` will be null)
    module.hot.accept("./shaders", function() {
      that._setupShaders();
    });
    gl.clearColor(0, 0, 0, 0);
  }

  _setupShaders() {
    const { gl } = this;
    const shaderProgram = initShaderProgram(
      gl,
      shaders.vertex,
      shaders.fragment
    );
    gl.useProgram(shaderProgram);
    const aVertexPosition = gl.getAttribLocation(
      shaderProgram,
      "aVertexPosition"
    );
    gl.enableVertexAttribArray(aVertexPosition);
    this.shaderContext = {
      locations: {
        aVertexPosition
      }
    };
  }

  _nextRender() {
    this._render();
    window.requestAnimationFrame(this._nextRender);
  }

  _render() {
    const { gl } = this;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.scene.getModels().forEach(model => this._renderModel(model));
  }

  _renderModel(model) {
    const { gl } = this;
    const { mesh: meshName } = model; // TODO use model.position
    const mesh = this.meshes[meshName];
    if (!mesh) {
      this.error("no such mesh", meshName);
    }
    const { aVertexPosition } = this.shaderContext.locations;
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buffer);
    gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(mesh.mode, 0, mesh.length);
  }

  error(...args) {
    throw new Error(args);
  }
}
