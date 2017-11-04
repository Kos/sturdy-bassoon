import Renderer from "./renderer";
import Model from "./model";

const renderer = new Renderer({
  target: document.getElementById("root")
});

renderer.setOrthoProjection(8, 6);
renderer.updateMeshes([
  {
    name: "foo",
    data: new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, 0, 0.5, 0])
  }
]);

const scene = renderer.getCurrentScene();
scene.addModel(
  new Model({
    mesh: "foo",
    position: [5, 3]
  })
);
scene.addModel(
  new Model({
    mesh: "foo",
    position: [2, 4]
  })
);

// setInterval(() => (model.x += 1), 50);
