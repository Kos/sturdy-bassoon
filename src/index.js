import Renderer from "./renderer";

const renderer = new Renderer({
  target: document.getElementById("root")
});

renderer.setOrthoProjection(800, 600);
renderer.updateMeshes([
  {
    name: "foo",
    data: "......"
  }
]);

const scene = renderer.getCurrentScene();
const model = {
  mesh: "foo",
  position: new Float32Array([10, 20])
};
scene.addModel(model);

setInterval(() => (model.x += 1), 50);
