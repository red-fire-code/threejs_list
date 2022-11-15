import React, { Component } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class ThreeBim extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  initThree() {
    threeStart()

    var renderer, width, height

    function init() {
      width = window.innerWidth
      height = window.innerHeight
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true
      })
      renderer.setSize(width, height)
      document.getElementById('canvas-frame').appendChild(renderer.domElement)
      renderer.setClearColor(0x000000, 1.0)
    }

    var camera
    function initCamera() {
      camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000)
      camera.position.set(400, 400, 400)
      camera.up.set(0, 1, 0)
      camera.lookAt(0, 0, 0)
    }

    var scene
    function initScene() {
      scene = new THREE.Scene()
    }

    var light
    function initLight() {
      light = new THREE.AmbientLight(0xffffff)
      light.position.set(300, 300, 0)
      scene.add(light)
    }

    function initObject() {
      // for (let i = 0; i < 50; i++) {
      //   var geometry = new THREE.BufferGeometry()
      //   let color = new THREE.Color(Math.random(), Math.random(), Math.random())
      //   var material = new THREE.MeshLambertMaterial({ color: color, transparent: true, opacity: Math.random() })
      //   // var mesh = new THREE.Mesh(geometry, material)
      //   // mesh.position.set(0, 0, 0)
      //   const vertisce = []
      //   for (let j = 0; j < 9; j++) {
      //     vertisce[j] = Math.random() * 100 - 50
      //   }
      //   geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertisce), 3))
      //   const mesh = new THREE.Mesh(geometry, material)
      //   const edges = new THREE.EdgesGeometry(geometry)
      //   const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }))
      //   scene.add(line)
      //   scene.add(mesh)
      // }
      // const geometry2 = new THREE.BoxGeometry(100, 100, 100)
      // const edges = new THREE.EdgesGeometry(geometry2)
      // const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }))
      // scene.add(line)

      const geometry = new THREE.SphereGeometry(100, 100, 100)

      const wireframe = new THREE.WireframeGeometry(geometry)

      const line = new THREE.LineSegments(wireframe)
      line.material.depthTest = false
      line.material.opacity = 0.25
      line.material.transparent = true

      scene.add(line)
    }

    //添加控制器
    var orbitControls
    function initControl() {
      //添加控制器
      orbitControls = new OrbitControls(camera, renderer.domElement)
      orbitControls.enableDamping = true //控制器阻尼
    }
    function initHelper() {
      //坐标辅助器
      const axesHelper = new THREE.AxesHelper(500)
      scene.add(axesHelper)
    }
    //监听窗口变化
    function reszie() {
      //innerHeight 返回窗口的文档显示区的高度，如果有垂直滚动条，也包括滚动条高度
      //innerWidth 返回窗口的文档显示区的宽度，如果有水平滚动条，也包括滚动条高度
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      //设置渲染器的像素比
      renderer.setPixelRatio(window.devicePixelRatio)
    }

    function threeStart() {
      init()
      initCamera()
      initScene()
      initLight()
      initObject()
      initControl()
      initHelper()
      animation()
      window.addEventListener('resize', reszie)
    }
    function animation() {
      renderer.render(scene, camera)
      orbitControls.update() // 鼠标交互更新
      if (!renderer.logarithmicDepthBuffer) renderer.logarithmicDepthBuffer = true

      requestAnimationFrame(animation)
    }
  }

  /**
   * 开始Three
   *
   * @memberof ThreeBim
   */
  componentDidMount() {
    this.initThree()
  }
  render() {
    return <div id='canvas-frame'></div>
  }
}

export default ThreeBim
