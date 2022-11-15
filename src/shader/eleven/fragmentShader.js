//fragmentShader.js
const fragmentShader = /*glsl*/ `
// highp~ 2^-16-2^16
// mediump~ 2^-10-2^10
// lowp~ 2^-8-2^8

precision mediump float;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float utime;
// 随机函数
float random (vec2 st) {
  return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}
// 旋转函数
// (uv,旋转度数,旋转中心)
vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x -  mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}
void main() {
  // gl_FragColor = vec4(vUv, 1.0, 1.0);
  // 根据UV来进行采样
  // vec4 textureColor= texture2D(uTexture,vUv);
  // gl_FragColor =textureColor;
  // 渐变
  // float f_num=(vUv.y+mod(utime,1.0));
  // gl_FragColor = vec4(f_num, f_num,f_num, f_num);
  //利用取模达到反复的效果
  // float f_num=mod(vUv.y*10.0,1.0);
  // gl_FragColor = vec4(1.0, f_num,f_num, 1.0);
  //利用step函数实现斑马效果
  // float f_nums=mod(vUv.y*10.0,1.0);
  // float f_num=step(0.5,f_nums);//超过0.5为1，小于为0
  // gl_FragColor = vec4(1.0, f_num,f_num, 1.0);
  //条纹相加
  // float strength = step(0.8, mod(vUv.x * 10.0 , 1.0)) ;
  // strength += step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
  // gl_FragColor =vec4(1.0,strength,strength,1);
  // 条纹相乘
  // float strength = step(0.8, mod(vUv.x * 10.0 , 1.0)) ;
  // strength *= step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
  // gl_FragColor =vec4(1.0,strength,strength,1);
  // 条纹相减
  // float strength = step(0.8, mod(vUv.x * 10.0 , 1.0)) ;
  // strength -= step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
  // gl_FragColor =vec4(1.0,strength,strength,1);
  //方块图像
  // float strength = step(0.2, mod(vUv.x * 10.0 , 1.0)) ;
  // strength *= step(0.2, mod(vUv.y * 10.0 , 1.0)) ;
  // gl_FragColor =vec4(1.0,strength,strength,1);
  //绝对值中间渐变
  // float strength = abs(vUv.x - 0.5) ;//|-0.5~0.5|=0.5-0-0.5
  // gl_FragColor =vec4(1.0,strength,strength,1);
  //利用最小值
  // float strength =min(abs(vUv.x - 0.5), abs(vUv.y - 0.5))  ;
  // gl_FragColor =vec4(1.0,strength,strength,1);
  //利用最大值
  // float strength =max(abs(vUv.x - 0.5), abs(vUv.y - 0.5))  ;
  // gl_FragColor =vec4(1.0,strength,strength,1);
  // 6.6 利用step、max、abs实现小正方形
  // float strength =step(0.1,max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)))   ;
  // gl_FragColor =vec4(1.0,strength,strength,1);
  // 6.7 利用向下取整函数floor实现条纹渐变
  // float strength = floor(vUv.x*10.0)/10.0;//水平 向下取整实现阶段性图形变化
  // gl_FragColor =vec4(1.0,strength,strength,1);
  // 利用条纹相乘实现渐变格子
  // float strength = floor(vUv.x*10.0)/10.0*floor(vUv.y*10.0)/10.0;
  // gl_FragColor =vec4(1.0,strength,strength,1);
 
 
  // float strength = ceil(vUv.x*10.0)/10.0*ceil(vUv.y*10.0)/10.0;
  // strength = random(vec2(strength,strength));
  // gl_FragColor =vec4(strength,strength,strength,1);
  // length
  // float strength = length(vUv);
  // gl_FragColor =vec4(1.0,strength,strength,1);
  // 利用distance
  // float strength =0.15/ distance(vUv,vec2(0.5,0.5));
  // gl_FragColor =vec4(strength,strength,strength,1);
  // 绘制星星
  // float  strength = 0.15 / distance(vec2(vUv.x,(vUv.y-0.5)*5.0+0.5),vec2(0.5,0.5)) - 1.0;
  // strength += 0.15 / distance(vec2(vUv.y,(vUv.x-0.5)*5.0+0.5),vec2(0.5,0.5)) - 1.0;
  // gl_FragColor =vec4(strength,strength,strength,strength);
  // 旋转
  // vec2 rotateUv = rotate(vUv,utime,vec2(0.5));
  // float  strength = 0.15 / distance(vec2(rotateUv.x,(rotateUv.y-0.5)*5.0+0.5),vec2(0.5,0.5)) - 1.0;
  // strength += 0.15 / distance(vec2(rotateUv.y,(rotateUv.x-0.5)*5.0+0.5),vec2(0.5,0.5)) - 1.0;
  // gl_FragColor =vec4(strength,strength,strength,strength);
  // 画圆圈
  // float strength =step(0.3,distance(vUv,vec2(0.5,0.5)));
  // gl_FragColor =vec4(1.0,strength,strength,1);
  // 圆环
  // strength=mod(strength*10.0,1.0); 
  // float strength =step(0.15,distance(vUv,vec2(0.5,0.5)));
  // strength*=(1.0-step(0.2,distance(vUv,vec2(0.5,0.5))));
  // gl_FragColor =vec4(1.0,strength,strength,1);
  // 靶子
  // float strength=mod(distance(vUv,vec2(0.5))*10.0,1.0); 
  // strength =step(0.5,strength);
  // gl_FragColor =vec4(1.0,strength,strength,1);
  // 雷达图
  vec2 rotateUv = rotate(vUv,utime,vec2(0.5));
  float apha =step(0.5,distance(vUv,vec2(0.5)));
  float strength=atan(rotateUv.x-0.5,rotateUv.y-0.5);
  strength=(strength+3.14)/6.28 ;
  gl_FragColor =vec4(1.0,strength,strength,apha);
} 
`
export default fragmentShader
