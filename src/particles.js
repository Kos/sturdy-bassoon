let iota = 0;
export const Traits = {
  life: iota++,

  x: iota++,
  y: iota++,
  z: iota++,
  r: iota++,
  s: iota++,

  dx: iota++,
  dy: iota++,
  dz: iota++,
  dr: iota++,
  ds: iota++,

  Count: iota++
};
const ParticleSize = Traits.Count;

export class ParticleManager {
  constructor(capacity) {
    this.capacity = capacity;
    this.data = new Float32Array(capacity * Traits.Count);
    this.firstParticleIndex = 0;
    this.particleCount = 0;
    this.output = [];
  }

  addParticle(values) {
    const newParticle = this.particleAt(this.particleCount);
    newParticle.set(values);
    this.particleCount = Math.min(this.capacity, this.particleCount + 1);
  }

  update(dt) {
    for (let i = 0; i < this.particleCount; ++i) {
      const particle = this.particleAt(i);
      particle[Traits.life] -= dt;
      particle[Traits.x] += particle[Traits.dx] * dt;
      particle[Traits.y] += particle[Traits.dy] * dt;
      particle[Traits.z] += particle[Traits.dz] * dt;
      particle[Traits.r] += particle[Traits.dr] * dt;
      particle[Traits.s] += particle[Traits.ds] * dt;
    }
  }

  particleAt(particleIndex) {
    let particleLocation = this.firstParticleIndex + particleIndex;
    if (particleLocation > this.capacity) {
      particleLocation -= this.capacity;
    }
    const dataIndex = particleLocation * ParticleSize;
    return this.data.subarray(dataIndex, dataIndex + ParticleSize);
  }

  build() {
    // TODO
    // fill this.output
    return this.output;
  }
}
