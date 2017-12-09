attribute vec4 aVertexPosition;
attribute float aVertexId;

uniform mat4 uProjectionMatrix;

varying lowp vec3 vBarycentric;

void main() {
  float size = 0.2;
  vec3 pos = aVertexPosition.xyz/aVertexPosition.w;
  float id = aVertexId;
  float d120 = 3.14159 * 2. / 3.;
  pos.x += sin(id*d120) * size;
  pos.y += cos(id*d120) * size;
  vBarycentric = vec3(id == 0., id == 1., id == 2.);
  gl_Position = uProjectionMatrix * vec4(pos.xyz, 1);
}