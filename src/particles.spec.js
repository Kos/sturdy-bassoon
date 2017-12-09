import { ParticleManager, Traits } from "./particles";

test("should update", () => {
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
