import { ParticleManager, Traits } from "./particles";

test("updating particles", () => {
  const pm = new ParticleManager(3);
  pm.addParticle(p(100, 0, 1));
  pm.addParticle(p(100, 0, 2));

  expect(pm.particleAt(0)[Traits.life]).toEqual(100);
  expect(pm.particleAt(0)[Traits.x]).toEqual(0);

  expect(pm.particleAt(1)[Traits.life]).toEqual(100);
  expect(pm.particleAt(1)[Traits.x]).toEqual(0);

  pm.update(10);

  expect(pm.particleAt(0)[Traits.life]).toEqual(90);
  expect(pm.particleAt(0)[Traits.x]).toEqual(10);

  expect(pm.particleAt(1)[Traits.life]).toEqual(90);
  expect(pm.particleAt(1)[Traits.x]).toEqual(20);
});

test("overwriting oldest particles", () => {
  const pm = new ParticleManager(3);
  pm.addParticle([0]);
  pm.addParticle([1]);
  pm.addParticle([2]);
  pm.addParticle([3]);

  expect(pm.particleAt(0)[Traits.life]).toEqual(3);
  expect(pm.particleAt(1)[Traits.life]).toEqual(1);
  expect(pm.particleAt(2)[Traits.life]).toEqual(2);
});

test.only("building the buffer", () => {
  const pm = new ParticleManager(3);
  pm.addParticle(p(100, 10, 1));
  pm.addParticle(p(100, 20, 1));

  expect(pm.getVertexBuffer()).toEqual(
    new Float32Array([
      ...[0, 100, 10, 10, 10, 10, 10],
      ...[1, 100, 10, 10, 10, 10, 10],
      ...[2, 100, 10, 10, 10, 10, 10],
      ...[3, 100, 10, 10, 10, 10, 10],
      ...[0, 100, 20, 20, 20, 20, 20],
      ...[1, 100, 20, 20, 20, 20, 20],
      ...[2, 100, 20, 20, 20, 20, 20],
      ...[3, 100, 20, 20, 20, 20, 20]
    ])
  );
});

function p(lifetime, foo, deltaFoo) {
  return [
    lifetime,
    foo,
    foo,
    foo,
    foo,
    foo,
    deltaFoo,
    deltaFoo,
    deltaFoo,
    deltaFoo,
    deltaFoo
  ];
}
