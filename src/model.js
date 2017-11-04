import { mat4, vec3 } from "gl-matrix";

export default class Model {
  constructor({ mesh, position = [], rotation = 0 }) {
    this.mesh = mesh;
    this.matrix = mat4.create();
    this._position = vec3.fromValues(...position, 0, 0, 0);
    this._rotation = rotation;
    this.updateMatrix();
  }

  updateMatrix() {
    const { _position: position, matrix, _rotation: rotation } = this;
    mat4.identity(matrix);
    mat4.translate(matrix, matrix, position);
    // Z axis is opposite of what we expect in rotateZ, negate the angle
    mat4.rotateZ(matrix, matrix, -rotation);
  }

  // TODO one setter-like method that updates multiple fields
  // and updates the matrix only once.

  get rotation() {
    return this._rotation;
  }
  set rotation(value) {
    this._rotation = value;
    this.updateMatrix();
  }

  get x() {
    return this._position[0];
  }
  set x(value) {
    this._position[0] = value;
    this.updateMatrix();
  }

  get y() {
    return this._position[1];
  }
  set y(value) {
    this._position[1] = value;
    this.updateMatrix();
  }

  get z() {
    return this._position[2];
  }
  set z(value) {
    this._position[2] = value;
    this.updateMatrix();
  }
}
