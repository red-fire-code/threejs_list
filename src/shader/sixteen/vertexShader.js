const vertexShader = /*glsl*/ `
uniform float uTime; 
uniform float uSize; 

attribute vec3 aStep;
void main(){
  vec4 modelPosition=modelMatrix*vec4(position,1.0);
  modelPosition.xyz=(aStep*uTime);
  vec4 viewPosition=viewMatrix* modelPosition;
  gl_PointSize=uSize;//必须设置带你大小，不然不报错也看不到点
  gl_Position =projectionMatrix * viewPosition;
}
`
export default vertexShader
