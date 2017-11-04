import Renderer from "./renderer";
import Model from "./model";

const renderer = new Renderer({
  target: document.getElementById("root")
});

renderer.setOrthoProjection(800, 600);
renderer.updateMeshes([
  {
    name: "foo",
    data: new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, 0, 0.5, 0])
  }
]);

const scene = renderer.getCurrentScene();
const model = new Model({
  mesh: "foo",
  position: [0.1, 0.5]
});
scene.addModel(model);

setInterval(() => (model.x += 1), 50);
