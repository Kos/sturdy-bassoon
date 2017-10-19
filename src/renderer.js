import * as shaders from "./shaders";
import { initBuffer } from "./utils/buffers";
import { initShaderProgram } from "./utils/shaders";
import Scene from "./scene";

export default class Renderer {
  constructor({ target, width = 800, height = 600 }) {
    this._nextRender = this._nextRender.bind(this);
    this.canvas = this._createCanvas(target, width, height);
    this.gl = this._createContext();
    this.scene = new Scene();
    window.requestAnimationFrame(() => this._setup());
    window.requestAnimationFrame(this._nextRender);
  }

  setOrthoProjection(w, h) {
    // TODO
  }

  updateMeshes(meshes) {
    // TODO
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
    this.tmp_buffer = initBuffer(gl);

    this._setupShaders();

    const that = this;
    module.hot.accept("./shaders", function() {
      that._setupShaders();
    });
  }

  _setupShaders() {
    const { gl } = this;
    const shaderProgram = initShaderProgram(
      gl,
      shaders.vertex,
      shaders.fragment
    );
    gl.useProgram(shaderProgram);
    const location = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.bindBuffer(gl.ARRAY_BUFFER, this.tmp_buffer);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
  }

  _nextRender() {
    this._render();
    window.requestAnimationFrame(this._nextRender);
  }

  _render() {
    const { gl } = this;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
  }
}
