//vertexShader.js

const vertexShader = /*glsl*/ `
attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
// uniform float utime;


varying vec2 vUv;
void main() {
  vUv=uv;
  vec4 modelPosition=modelMatrix* vec4(position, 1.0);
  // modelPosition.z=sin(modelPosition.x*10.0);
  // modelPosition.z+=sin((modelPosition.x+utime*0.5)*10.0)*0.1;
  // modelPosition.z+=sin((modelPosition.y+utime*0.5)*10.0)*0.1;


  gl_Position =projectionMatrix * viewMatrix* modelPosition;
}
`
export default vertexShader
