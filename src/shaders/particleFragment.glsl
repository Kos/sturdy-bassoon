varying lowp vec3 vBarycentric;

void main() {
  gl_FragColor.a = 1.;
  gl_FragColor.rgb = vec3(0, 0, 0);
  lowp float m = min(vBarycentric.x, min(vBarycentric.y, vBarycentric.z));
  if (m < 0.02) {
    gl_FragColor.rgb = vec3(1., 1., 1.);
  }
}
