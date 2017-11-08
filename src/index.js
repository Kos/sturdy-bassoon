import Renderer from "./renderer";
import Model from "./model";
import { loadObj } from "./loader";

const renderer = new Renderer({
  target: document.getElementById("root")
});

renderer.setOrthoProjection(8, 6);
renderer.updateMeshes([
  {
    name: "foo",
    data: new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, 0, 0.5, 0])
  },
  loadObj()
]);

const scene = renderer.getCurrentScene();
const dod = scene.addModel(
  new Model({
    mesh: "dodecahedron",
    position: [5, 3]
  })
);
scene.addModel(
  new Model({
    mesh: "foo",
    position: [2, 4]
  })
);
const rotatingModel = scene.addModel(
  new Model({
    mesh: "foo",
    position: [4, 3],
    scale: 0.5
  })
);

function everyAnimationFrame(timedeltaFn) {
  requestAnimationFrame(time => {
    let prevTime = time;
    // start the loop!
    const tick = time => {
      requestAnimationFrame(tick);
      const timedelta = time - prevTime;
      prevTime = time;
      if (timedelta > 1000) return;
      timedeltaFn(timedelta);
    };
    requestAnimationFrame(tick);
  });
}

everyAnimationFrame(delta => {
  rotatingModel.rotation += 0.02 * delta / 16;
  rotatingModel.x = 3 + Math.sin(rotatingModel.rotation);
  dod.rotation -= 0.03 * delta / 20;
});
