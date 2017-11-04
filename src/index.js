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
const rotatingModel = new Model({
  mesh: "foo",
  position: [4, 3]
});
scene.addModel(rotatingModel);

setInterval(() => (rotatingModel.rotation += 0.02), 20);
setInterval(() => (rotatingModel.x = 3 + Math.sin(rotatingModel.rotation)), 20);
