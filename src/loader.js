import OBJ from "webgl-obj-loader";
import dodecahedron from "meshes/asteroid.obj";

export function loadObj(name = "dodecahedron", data = dodecahedron) {
  const mesh = new OBJ.Mesh(data);
  if (!mesh.vertexNormals) {
    throw new Error("Model has no normals");
  }

  const newVertices = new Float32Array(mesh.indices.length * 3);
  const newNormals = new Float32Array(mesh.indices.length * 3);
  for (let i = 0; i < mesh.indices.length; ++i) {
    const vertexIndex = mesh.indices[i];
    const inputXIndex = vertexIndex * 3;
    const outputXIndex = i * 3;
    for (let j = 0; j < 3; ++j) {
      newVertices[outputXIndex + j] = mesh.vertices[inputXIndex + j];
      newNormals[outputXIndex + j] = mesh.vertexNormals[inputXIndex + j];
    }
  }

  return {
    name,
    data: newVertices,
    normals: newNormals
  };
}
