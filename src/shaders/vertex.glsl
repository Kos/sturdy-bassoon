attribute vec4 aVertexPosition;
attribute float aVertexId;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;

varying lowp vec3 vBarycentric;

void main() {
  gl_Position = uProjectionMatrix * uModelMatrix * aVertexPosition;
  float id = aVertexId;
  vBarycentric = vec3(id == 0., id == 1., id == 2.);
}