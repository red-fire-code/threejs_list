import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import * as THREE from 'three'
import React from 'react'
import { DoubleSide } from 'three'
import { GUI } from 'dat.gui'

class LightndShaow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  initThree() {
    const gui = new GUI()

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
      document.getElementById('light-shadow-box').appendChild(renderer.domElement)
      // renderer.setClearColor(0x000000, 1.0)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.gammaInput = true
      // 默认为 false. 如果设置了该参数，表示所有纹理和颜色应当使用预乘的gamma值来输出。
      renderer.gammaOutput = true
    }
    var camera
    function initCamera() {
      camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000)
      camera.position.set(100, 100, 100)
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

    //添加控制器
    var orbitControls
    function initControl() {
      //添加控制器
      orbitControls = new OrbitControls(camera, renderer.domElement)
      orbitControls.enableDamping = true //控制器阻尼
    }

    var light
    function initLight() {
      light = new THREE.AmbientLight(0xffffff, 0.1)
      scene.add(light)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(Math.random() * 100, Math.random() * 100, Math.random() * 100)

      gui.add(directionalLight.position, 'x').min(0).max(500).name('移动相机位置')
      directionalLight.castShadow = true
      directionalLight.shadow.camera.left = -50
      directionalLight.shadow.camera.right = 50
      directionalLight.shadow.camera.bottom = -50
      directionalLight.shadow.camera.top = 50
      directionalLight.shadow.radius = 50
      directionalLight.shadow.mapSize.set(512 * 4, 512 * 4)
      const helper = new THREE.CameraHelper(directionalLight.shadow.camera)
      // scene.add(helper)
      // console.log()
      scene.add(directionalLight)
    }

    function initHelper() {
      //坐标辅助器
      const axesHelper = new THREE.AxesHelper(500)
      scene.add(axesHelper)
    }
    function plane() {
      const geometry = new THREE.PlaneGeometry(100, 100)
      const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide })
      const plane = new THREE.Mesh(geometry, material)
      plane.position.set(0, -15, 0)
      plane.rotateX(Math.PI / 2)
      plane.receiveShadow = true
      scene.add(plane)
    }
    function spherCube() {
      plane()
      const geometry = new THREE.SphereGeometry(15, 32, 16)
      const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
      const sphere = new THREE.Mesh(geometry, material)
      scene.add(sphere)

      sphere.castShadow = true
    }
    // 添加一个发光的球体
    var smallShape
    var clock
    function addFlashSpher() {
      clock = new THREE.Clock()
      const light = new THREE.PointLight(0xff0000, 1, 100)

      const geometry = new THREE.SphereGeometry(2, 20, 20)
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
      smallShape = new THREE.Mesh(geometry, material)
      smallShape.add(light)
      light.castShadow = true
      smallShape.position.set(20, 20, 20)
      // gui.add(smallShape.rotation, 'x').min(0).max(Math.PI).name('旋转球体位置')
      // smallShape.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(30, 30, 30))
      // smallShape.geometry.translate(30, 30, 30)
      scene.add(smallShape)
    }
    function addCube() {
      plane()
      const geometry = new THREE.BoxGeometry(16, 6, 8, 10, 10, 10)

      const material = new THREE.MeshStandardMaterial()

      const cube = new THREE.Mesh(geometry, material)
      cube.castShadow = true
      cube.receiveShadow = true
      scene.add(cube)
    }
    function animation() {
      renderer.render(scene, camera)
      let time = clock.getElapsedTime()
      console.log(time)
      if (time > 3.14 * 2) {
        clock.start() //避免time过大，重置当前时间
      }
      smallShape.position.x = Math.sin(time) * 20
      smallShape.position.z = Math.cos(time) * 20

      orbitControls.update() // 鼠标交互更新
      if (!renderer.logarithmicDepthBuffer) renderer.logarithmicDepthBuffer = true
      requestAnimationFrame(animation)
    }
    function threeStart() {
      init()
      initCamera()
      initScene()
      initControl()
      initLight()
      spherCube()
      addFlashSpher()
      // addCube()
      initHelper()
      animation()
    }
  }
  componentDidMount() {
    this.initThree()
  }
  render() {
    return <div className='light-shadow-box' id='light-shadow-box'></div>
  }
}
export default LightndShaow
