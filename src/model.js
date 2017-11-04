import { mat4 } from "gl-matrix";

export default class Model {
  constructor({ mesh, position }) {
    this.mesh = mesh;
    this.matrix = mat4.create();
    if (position && position.length === 3) {
      mat4.translate(this.matrix, this.matrix, position);
    } else if (position) {
      mat4.translate(this.matrix, this.matrix, [position[0], position[1], 0]);
    }
  }

  // TODO helpers for location...
}
