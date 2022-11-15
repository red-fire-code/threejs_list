//fragmentShader.js
const fragmentShader = /*glsl*/ `
// highp~ 2^-16-2^16
// mediump~ 2^-10-2^10
// lowp~ 2^-8-2^8

precision mediump float;
varying vec2 vUv;
varying vec3 v_Position;
varying vec4 v_gPosition;


uniform sampler2D uTexture;
uniform float utime;
// 随机函数
float random (vec2 st) {
  return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

void main() {
 
  // 利用条纹相乘实现渐变格子

  vec4 redColor=vec4(1.0,0.0,0.0,1.0);
  vec4 yellowColor=vec4(1.0,1.0,0.0,1.0);
  vec4 mixColor = mix(yellowColor,redColor,v_Position.y/4.5);
  if(gl_FrontFacing){
    gl_FragColor =vec4(mixColor.xyz-(v_gPosition.y-30.0)/100.0-0.1,1.0);
  }else{
    gl_FragColor =mixColor;
  }
  
} 
`
export default fragmentShader
