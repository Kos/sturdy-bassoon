#extension GL_OES_standard_derivatives : enable

varying lowp vec3 vBarycentric;

lowp float edgeFactor() {
  lowp float edgeWidth = 2.0;
  lowp vec3 d = fwidth(vBarycentric);
  lowp vec3 a3 = smoothstep(vec3(0.0), d * edgeWidth, vBarycentric);
  return min(min(a3.x, a3.y), a3.z);
}

void main() {
  lowp vec3 edgeColor = vec3(0, 0, 0);
  gl_FragColor.rgb = vBarycentric.xyz;
  gl_FragColor.a = 1.;
  gl_FragColor.rgb = mix(edgeColor, gl_FragColor.rgb, edgeFactor());
}
