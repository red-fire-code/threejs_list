//fragmentShader.js
const fragmentShader = /*glsl*/ `
uniform vec3 uColor;
void main() {
  //渐变圆形点
  float strength = 1.0-distance(gl_PointCoord,vec2(0.5))*2.0;
  gl_FragColor=vec4(uColor,strength); 
}
`
export default fragmentShader
