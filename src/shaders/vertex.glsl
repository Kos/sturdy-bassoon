attribute vec4 aVertexPosition;

uniform mat4 uModelMatrix;

void main() {
  gl_Position = uModelMatrix * aVertexPosition;
}