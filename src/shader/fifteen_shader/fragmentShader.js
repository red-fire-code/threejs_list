const fragmentShader = /*glsl*/ `
precision mediump float;
uniform sampler2D u_Texture;
uniform sampler2D u_Texture1;
uniform sampler2D u_Texture2;
varying float v_aImgIndex;
varying vec3 vColor;

void main() {
	//渐变圆形点
	// float strength = 1.0-distance(gl_PointCoord,vec2(0.5))*2.0;
	// gl_FragColor=vec4(strength);
	//圆形点
	// float strength = 1.0-distance(gl_PointCoord,vec2(0.5));
	// strength=step(0.5,strength);
	// gl_FragColor=vec4(strength);
	//图片纹理
	// gl_FragColor=vec4(vColor,1.0);
	// gl_FragColor=vec4(vColor,1.0);

	vec4 textureColor;
	if(v_aImgIndex==0.0){
		textureColor= texture2D(u_Texture1, gl_PointCoord);
	}else if(v_aImgIndex==1.0){
		textureColor = texture2D(u_Texture, gl_PointCoord);
	}else{
		textureColor = texture2D(u_Texture2, gl_PointCoord);
	}
	// color+=vec4(vColor,1.0);
	gl_FragColor=vec4(vColor,textureColor.r);

}
`
export default fragmentShader

// const fragmentShader = /*glsl*/ `
// precision mediump float;
// uniform sampler2D u_Texture;

// void main() {
// 	//渐变圆形点
// 	// float strength = 1.0-distance(gl_PointCoord,vec2(0.5))*2.0;
// 	// gl_FragColor=vec4(strength);
// 	//圆形点
// 	// float strength = 1.0-distance(gl_PointCoord,vec2(0.5));
// 	// strength=step(0.5,strength);
// 	// gl_FragColor=vec4(strength);
// 	// // 圆环
// 	// float strength = 1.0-distance(gl_PointCoord,vec2(0.5));
// 	// float strength1 = 0.90-distance(gl_PointCoord,vec2(0.5));

// 	// strength=step(0.5,strength);
// 	// strength1=step(0.5,strength1);
// 	// float mixStrength=strength-strength1;
// 	// gl_FragColor=vec4(mixStrength);
// 	//图片纹理
// 	// gl_FragColor=vec4(1.0,1.0,0.0,1.0);
// 		vec4	textureColor= texture2D(u_Texture, gl_PointCoord);
// 		gl_FragColor=vec4(1.0,0.0,0.0,textureColor.r);
// 		// gl_FragColor=textureColor;

// 	// vec4 textureColor;
// 	// if(v_aImgIndex==0.0){
// 	// 	textureColor= texture2D(u_Texture1, gl_PointCoord);
// 	// }else if(v_aImgIndex==1.0){
// 	// 	textureColor = texture2D(u_Texture, gl_PointCoord);
// 	// }else{
// 	// 	textureColor = texture2D(u_Texture2, gl_PointCoord);
// 	// }
// 	// // color+=vec4(vColor,1.0);
// 	// gl_FragColor=vec4(vColor,textureColor.r);

// }
// `
// export default fragmentShader
