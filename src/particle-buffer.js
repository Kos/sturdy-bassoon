import { ParticleManager } from "./particles";
import { bindAttributes, unbindAttributes } from "./utils/shaders";

const VertsPerParticle = 3;

export default class ParticleBuffer {
  constructor(gl, capacity = 10) {
    this.gl = gl;
    this.pm = new ParticleManager(capacity);
    this.attributes = this.pm.getAttributes(gl);
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

  draw(program) {
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    bindAttributes(this.gl, program, this.attributes);
    gl.drawArrays(gl.TRIANGLES, 0, VertsPerParticle * this.pm.particleCount);
    unbindAttributes(this.gl, program, this.attributes);
  }
}
