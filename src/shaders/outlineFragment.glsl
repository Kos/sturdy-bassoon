void main() {
  lowp vec3 edgeColor = vec3(1, .5, .2);
  gl_FragColor.a = 1.;
  gl_FragColor.rgb = edgeColor;
}
