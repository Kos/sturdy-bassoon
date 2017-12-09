import { ParticleManager, OutputVertexSize } from "./particles";

const VertsPerParticle = 3;
const GLFloatSizeInBytes = 4;

export default class ParticleBuffer {
  constructor(gl, capacity = 10) {
    this.gl = gl;
    this.pm = new ParticleManager(capacity);
    this.buffer = gl.createBuffer();
  }

  add(...values) {
    this.pm.addParticle(values);
  }

  tick(deltaTime) {
    this.pm.update(deltaTime);
  }

  refreshBuffer() {
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    const buf = this.pm.getVertexBuffer();
    gl.bufferData(gl.ARRAY_BUFFER, buf, gl.DYNAMIC_DRAW);
  }

  bindBuffers({ aVertexPosition, aVertexId }) {
    const { gl } = this;
    const stride = GLFloatSizeInBytes * OutputVertexSize;
    const positionOffset = GLFloatSizeInBytes * 2;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(aVertexPosition);
    gl.vertexAttribPointer(
      aVertexPosition,
      3,
      gl.FLOAT,
      false,
      stride,
      positionOffset
    );
    gl.enableVertexAttribArray(aVertexId);
    gl.vertexAttribPointer(aVertexId, 1, gl.FLOAT, false, stride, 0);
  }

  draw() {
    const { gl } = this;
    gl.drawArrays(gl.TRIANGLES, 0, VertsPerParticle * this.pm.particleCount);
  }
}
