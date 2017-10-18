import helloShader from "./shaders/hello.glsl";

export default class Renderer {
  constructor({ target, width = 800, height = 600 }) {
    this.nextRender = this.nextRender.bind(this);
    this.canvas = this.createCanvas(target, width, height);
    this.gl = this.createContext();
    window.requestAnimationFrame(this.nextRender);
    this.b = 0;
    window.console.log(helloShader);
  }

  createCanvas(target, width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    target.appendChild(canvas);
    return canvas;
  }

  createContext() {
    const gl = this.canvas.getContext("experimental-webgl");
    if (!gl) {
      throw new Error("Cannot create webgl context");
    }
    return gl;
  }

  nextRender() {
    this.render();
    window.requestAnimationFrame(this.nextRender);
  }

  render() {
    const { gl } = this;
    this.b += 0.01;
    gl.clearColor(1, this.b % 1, 0, 0.5);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
}
