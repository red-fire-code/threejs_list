const vsFirework = /*glsl*/ `
attribute float aScale; 

uniform float uTime; 

uniform float uSize; 
attribute vec3 aDirection;
void main(){
  vec4 modelPosition=modelMatrix*vec4(position,1.0);
  modelPosition.xyz+=(aDirection*uTime*10.0);
 
  vec4 viewPosition=viewMatrix* modelPosition;
  gl_PointSize=uSize*aScale-uTime*10.0;//必须设置带你大小，不然不报错也看不到点
  gl_Position =projectionMatrix * viewPosition;
}
`
export default vsFirework
