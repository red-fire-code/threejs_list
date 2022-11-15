import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import { mat4 } from '../../assets/js/glMatrix-0.9.6.min'
import vs from '../../shader/webpack_glsl/vs.glsl' //引入vs
import fs from '../../shader/webpack_glsl/fs.glsl' //引入fs

export default class GlslWebpackTest extends Component {
  init() {
    var webgl, webglDiv
    // let projMat4 = mat4.create()
    let vertexstring = `
		attribute vec2 a_position;
 
		void main(void){
				gl_Position = vec4(a_position,0.0, 1.0);;
			
		}
		`
    let fragmentstring = `
		precision mediump float;

		void main(void){
	
			gl_FragColor = vec4(1.0,0.0,1.0,1.0);
		}
		`
    let anglex = 0.0
    let angley = 0.0
    let count = 0.0
    let textureOne = null
    initStart()
    console.log('11111')

    function initWebgl() {
      webglDiv = document.getElementById('mycanvas')
      webgl = webglDiv.getContext('webgl')
      webgl.viewport(0, 0, webglDiv.width, webglDiv.height)
      // mat4.ortho(0, webglDiv.clientWidth, webglDiv.clientHeight, 0, -1.0, 1.0, this.projMat4)
    }
    function initShaders() {
      let vsShader = webgl.createShader(webgl.VERTEX_SHADER)
      let fsShader = webgl.createShader(webgl.FRAGMENT_SHADER)

      webgl.shaderSource(vsShader, vertexstring) //赋予vs
      webgl.shaderSource(fsShader, fragmentstring) //赋予fs

      webgl.compileShader(vsShader)
      webgl.compileShader(fsShader)

      if (!webgl.getShaderParameter(vsShader, webgl.COMPILE_STATUS)) {
        var err = webgl.getShaderInfoLog(vsShader)
        console.log('vs顶点着色器错误')
        alert(err)
        return
      }
      if (!webgl.getShaderParameter(fsShader, webgl.COMPILE_STATUS)) {
        var err = webgl.getShaderInfoLog(fsShader)
        console.log('fs片段着色器错误')
        alert(err)
        return
      }

      let program = webgl.createProgram()
      webgl.attachShader(program, vsShader)
      webgl.attachShader(program, fsShader)

      webgl.linkProgram(program)
      webgl.useProgram(program)

      webgl.program = program
    }

    function initBuffers() {
      let arr = [-0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5]
      let index = [0, 1, 2, 2, 3, 0]

      let pointFA = new Float32Array(arr)
      let aPosition = webgl.getAttribLocation(webgl.program, 'a_position')
      let pointBuffer = webgl.createBuffer()
      webgl.bindBuffer(webgl.ARRAY_BUFFER, pointBuffer)
      webgl.bufferData(webgl.ARRAY_BUFFER, pointFA, webgl.STATIC_DRAW)
      webgl.enableVertexAttribArray(aPosition)
      webgl.vertexAttribPointer(aPosition, 2, webgl.FLOAT, false, 0, 0)
    }
    function draw() {
      webgl.clearColor(0.0, 0.0, 0.0, 1.0)
      webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT)
      webgl.enable(webgl.DEPTH_TEST)
      // webgl.drawElements(webgl.TRIANGLES, 2, webgl.UNSIGNED_BYTE, 0)
      webgl.drawArrays(webgl.TRIANGLE_FAN, 0, 4) //(绘制什么，从几个开始绘制，绘制多少个数据)
    }

    function initStart() {
      initWebgl()
      initShaders()
      initBuffers()
      draw()
    }
  }
  componentDidMount() {
    this.init()
  }
  render() {
    return (
      <div>
        <canvas className='mycanvas' id='mycanvas' width='1024' height='768'></canvas>
      </div>
    )
  }
}
