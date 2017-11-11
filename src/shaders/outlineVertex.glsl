attribute vec4 aVertexPosition;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;

void main() {
  // TODO instead of multiplying adjustedPosition in model space,
  // translate by normal
  // (we need normals)
  vec3 adjustedPosition = aVertexPosition.xyz/aVertexPosition.w*1.03;
  gl_Position = uProjectionMatrix * uModelMatrix * vec4(adjustedPosition.xyz, 1.0);
}