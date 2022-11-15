//fragmentShader.js
const fragmentShader = /*glsl*/ `
// highp~ 2^-16-2^16
// mediump~ 2^-10-2^10
// lowp~ 2^-8-2^8

precision mediump float;
varying vec2 vUv;
uniform sampler2D uTexture;
void main() {
  // gl_FragColor = vec4(vUV, 0.0, 1.0);
  // 根据UV来进行采样
  vec4 textureColor= texture2D(uTexture,vUv);
  gl_FragColor =textureColor;

}
`
export default fragmentShader
