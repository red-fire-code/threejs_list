//vertexShader.js

const vertexShader = /*glsl*/ `
attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
// uniform float utime;
varying vec4 v_gPosition;//模型点局部坐标
varying vec3 v_Position;//模型变化后的坐标

varying vec2 vUv;
void main() {
  vUv=uv;
  vec4 modelPosition=modelMatrix* vec4(position, 1.0);
  v_Position=position;
  v_gPosition=modelPosition;


  gl_Position =projectionMatrix * viewMatrix* modelPosition;
  
}
`
export default vertexShader
