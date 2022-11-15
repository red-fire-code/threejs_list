const vsWater = /*glsl*/ `
precision mediump float;
// attribute vec2 uv;
// uniform mat4 modelMatrix;
// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;

uniform float uTime;


varying float vElevation;




void main() {

  vec4 modelPosition=modelMatrix* vec4(position, 1.0);
 
  float elevation=sin(modelPosition.x*10.0+uTime)*sin(modelPosition.z*10.0*1.0+uTime);
  elevation += -abs(cnoise(vec2(modelPosition.xz*10.0+uTime)))*1.6;
  vElevation=elevation;
 
  elevation*=0.1;
  modelPosition.y+=elevation;
  gl_Position =projectionMatrix * viewMatrix*modelPosition ;
  
}
`
export default vsWater
