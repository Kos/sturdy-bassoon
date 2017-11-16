attribute vec4 aVertexPosition;
attribute float aVertexId;

uniform mat4 uProjectionMatrix;

varying lowp vec3 vBarycentric;

void main() {
  vec3 pos = aVertexPosition.xyz/aVertexPosition.w;
  float id = aVertexId;
  pos += vec3(id == 1., id == 2., 0);
  vBarycentric = vec3(id == 0., id == 1., id == 2.);
  gl_Position = uProjectionMatrix * vec4(pos.xyz, 1);
}