const vertexShader = /*glsl*/ `
precision mediump float;

attribute float aScale;
attribute float aImgIndex;
uniform float uTime;
varying vec3 vColor;

varying float v_aImgIndex;
void main(){
	vec4 modelPosition=modelMatrix*vec4(position,1.0);
	// modelPosition.y+=uTime;
	// gl_PointSize=(aScale+0.5)*20.0;

	// 获取定点得角度
	float angle=atan(modelPosition.x,modelPosition.z);
	// 获取点位到中心点得距离
	float distanceCenter=length(modelPosition.xz);
	//根据顶点到中心得距离，设置旋转角度
	// float angleOffset=1.0/distanceCenter*uTime;
	float angleOffset=uTime;

	angle+=angleOffset;
	modelPosition.x=cos(angle)*distanceCenter;
	modelPosition.z=sin(angle)*distanceCenter;

	// 根据z轴决定点大小,即根据视图矩阵的z轴
	vec4 viewPosition=viewMatrix* modelPosition;
	gl_PointSize=200.0/-viewPosition.z*aScale;

	gl_Position =projectionMatrix * viewPosition;
	v_aImgIndex=aImgIndex;
	vColor=color;
}
`
export default vertexShader
// const vertexShader = /*glsl*/ `
// // precision mediump float;

// void main(){
// 	vec4 modelPosition=modelMatrix*vec4(position,1.0);
// 	vec4 viewPosition=viewMatrix* modelPosition;
// 	gl_PointSize=60.0;

// 	gl_Position =projectionMatrix * viewPosition;
// }
// `
// export default vertexShader
