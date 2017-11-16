import { initBuffer, threes } from "./utils/buffers";

let m = 0;
const Traits = {
  x: m++,
  y: m++,
  z: m++,
  vx: m++,
  vy: m++,
  vz: m++,
  COUNT: m++
};

const VertsPerParticle = 3;
const ParticleSize = Traits.COUNT * VertsPerParticle;

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
    const insertionIndex = this.particlesCount * ParticleSize;
    this.particlesCount += 1; // TODO use a cyclic buffer here
    for (let vertexIndex = 0; vertexIndex < VertsPerParticle; ++vertexIndex) {
      for (let traitIndex = 0; traitIndex < values.length; ++traitIndex) {
        this.particlesData[
          insertionIndex + Traits.COUNT * vertexIndex + traitIndex
        ] =
          values[traitIndex];
      }
    }
  }

  tick(deltaTime) {
    // TODO use a cyclic buffer here
    for (let i = 0; i < this.particlesCount; ++i) {
      const particleIndex = i * ParticleSize;
      for (let j = 0; j < VertsPerParticle; ++j) {
        console.log("updating particle");
        const vertexIndex = particleIndex + j * Traits.COUNT;
        this.particlesData[vertexIndex + Traits.x] +=
          this.particlesData[vertexIndex + Traits.vx] * deltaTime;
        this.particlesData[vertexIndex + Traits.y] +=
          this.particlesData[vertexIndex + Traits.vy] * deltaTime;
        this.particlesData[vertexIndex + Traits.z] +=
          this.particlesData[vertexIndex + Traits.vz] * deltaTime;
      }
    }
  }

  refreshBuffer() {
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.particlesData, gl.DYNAMIC_DRAW);
  }
}
