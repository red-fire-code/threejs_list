//fragmentShader.js
const fragmentShader = /*glsl*/ `


precision mediump float;
varying vec2 vUv;
varying float vElevation;
uniform vec3 uNinColor;
uniform vec3 uHeightColor;

// 随机函数
float random (vec2 st) {
  return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

void main() {
    float opcity=(vElevation+1.0)/2.0;
    vec3 mixColor=mix(uNinColor,uHeightColor,opcity);
    gl_FragColor =vec4(mixColor,1.0);

} 
`
export default fragmentShader
