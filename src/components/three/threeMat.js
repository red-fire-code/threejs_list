import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import React from 'react'

class MaterialCom extends React.Component {
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
      document.getElementById('materialCom-box').appendChild(renderer.domElement)

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
    window.addEventListener('resize', reszie)

    function addCube() {
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      // 导入纹理
      const textureLoader = new THREE.TextureLoader()
      let tengxtiao = textureLoader.load(require('../../assets/img/texture/Wicker007B_2K-PNG/Wicker007B_2K_Color.png'))
      let aomTexture = textureLoader.load(
        require('../../assets/img/texture/Wicker007B_2K-PNG/Wicker007B_2K_AmbientOcclusion.png')
      )
      // 因为aoMap需要第二组UV，所以为模型增加第二组uv.只需要复制一组即可
      geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2))
      // tengxtiao.offset.set(0.5, 0.5)
      // tengxtiao.center.set(0.5, 0.5)
      // tengxtiao.rotation = Math.PI / 4
      // tengxtiao.repeat.set(2, 3)
      // tengxtiao.wrapS = THREE.RepeatWrapping
      // tengxtiao.wrapT = THREE.RepeatWrapping

      // tengxtiao.minFilter = THREE.NearestFilter
      // tengxtiao.magFilter = THREE.NearestFilter
      console.log(tengxtiao)
      const material = new THREE.MeshBasicMaterial({ map: tengxtiao, aoMap: aomTexture })

      const cube = new THREE.Mesh(geometry, material)
      cube.scale.set(100, 100, 100)
      scene.add(cube)
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
    function animation() {
      renderer.render(scene, camera)
      orbitControls.update() // 鼠标交互更新
      if (!renderer.logarithmicDepthBuffer) renderer.logarithmicDepthBuffer = true
      requestAnimationFrame(animation)
    }
    function threeStart() {
      init()
      initCamera()
      initScene()
      initControl()
      initHelper()
      addCube()
      animation()
    }
  }
  componentDidMount() {
    this.initThree()
  }
  render() {
    return <div className='materialCom-box' id='materialCom-box'></div>
  }
}
export default MaterialCom
