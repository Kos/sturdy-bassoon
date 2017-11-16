import { initBuffer, threes } from "./utils/buffers";

const Traits = {
  x: 0,
  y: 1,
  z: 2,
  COUNT: 3
};

const VertsPerParticle = 3;

export default class ParticleBuffer {
  constructor(gl, capacity = 10) {
    this.gl = gl;
    this.particlesData = new Float32Array(
      capacity * Traits.COUNT * VertsPerParticle
    );
    this.particlesCount = 0;
    /*
    Layout of particlesData:
    p1.x p1.y p1.z
    p1.x p1.y p1.z
    p1.x p1.y p1.z

    p2.x p2.y p2.z
    p2.x p2.y p2.z
    p2.x p2.y p2.z
    
    ...
    */
    this.buffer = initBuffer(gl, this.particlesData, gl.DYNAMIC_DRAW);
    this.instanceIdBuffer = initBuffer(gl, threes(capacity * VertsPerParticle));
  }

  add(...values) {
    if (values.length > Traits.COUNT) {
      throw new Error("Too many args to add()");
    }
    const insertionIndex = this.particlesCount;
    this.particlesCount += 1; // TODO use a cyclic buffer here
    for (let i = 0; i < VertsPerParticle; ++i) {
      for (let j = 0; j < values.length; ++j) {
        this.particlesData[insertionIndex + Traits.COUNT * i + j] = values[j];
      }
    }
  }

  refreshBuffer() {
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.particlesData, gl.DYNAMIC_DRAW);
  }
}
