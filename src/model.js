import { mat4, vec3, quat } from "gl-matrix";

export default class Model {
  constructor({ mesh, position = [], rotation = 0, scale = 1 }) {
    this.mesh = mesh;
    this.matrix = mat4.create();
    this._euler = vec3.fromValues(0, 0, rotation);
    this._quat = quat.create();
    this._rotation = mat4.create();
    this._position = vec3.fromValues(...position, 0, 0, 0);
    this._scale = scale;
    this.updateMatrix();
  }

  updateMatrix() {
    const {
      _position: position,
      matrix,
      _rotation: rotation,
      _scale: scale
    } = this;
    mat4.identity(matrix);
    mat4.translate(matrix, matrix, position);
    // Z axis is opposite of what we expect in rotateZ, negate the angle
    mat4.multiply(matrix, matrix, rotation);
    mat4.scale(matrix, matrix, [scale, scale, scale]);
  }

  // TODO one setter-like method that updates multiple fields
  // and updates the matrix only once.

  get rotation() {
    return this._euler[2];
  }
  set rotation(value) {
    this._euler[2] = value;
    const radToDeg = 180 / Math.PI;

    quat.fromEuler(
      this._quat,
      this._euler[0] * radToDeg,
      this._euler[1] * radToDeg,
      this._euler[2] * radToDeg
    );
    mat4.fromQuat(this._rotation, this._quat);
    this.updateMatrix();
  }

  setQuaternion(val) {
    quat.copy(this._quat, val);
    mat4.fromQuat(this._rotation, this._quat);
    this.updateMatrix();
  }

  get scale() {
    return this._scale;
  }
  set scale(value) {
    this._scale = value;
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
