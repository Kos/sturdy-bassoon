attribute vec4 aVertexPosition;
attribute vec3 aNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;

lowp float thickness = 0.03;

void main() {
  vec4 viewPosition = uModelMatrix * aVertexPosition;
  // Use inverse transpose for normal?
  mat3 normalMatrix = mat3(uModelMatrix);
  vec3 transformedNormal = normalize(normalMatrix * normalize(aNormal));
  viewPosition.xyz += transformedNormal * thickness;
  gl_Position = uProjectionMatrix * viewPosition;
}