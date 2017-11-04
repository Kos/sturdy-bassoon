attribute vec4 aVertexPosition;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;

void main() {
  gl_Position = uProjectionMatrix * uModelMatrix * aVertexPosition;
}