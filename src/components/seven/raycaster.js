import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import * as THREE from 'three'
import React from 'react'
import { DoubleSide } from 'three'
import { GUI } from 'dat.gui'
import gsap from 'gsap'
class RaycasterCom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  initThree() {
    var renderer, width, height
    // 创建一个gui
    const gui = new GUI()
    var clock = new THREE.Clock()
    var raycaster = new THREE.Raycaster()
    var mouse = new THREE.Vector2()
    threeStart()

    function init() {
      width = window.innerWidth
      height = window.innerHeight
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true
      })
      renderer.setSize(width, height)
      document.getElementById('raycaster-box').appendChild(renderer.domElement)
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
      directionalLight.position.set(50, 50, 50)
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
      gui.add(axesHelper, 'visible').name('增加坐标辅助器')
    }
    function plane() {
      const geometry = new THREE.PlaneGeometry(100, 100)
      const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide })
      const plane = new THREE.Mesh(geometry, material)
      plane.position.set(0, -15, 0)
      plane.rotateX(Math.PI / 2)
      plane.receiveShadow = true
      scene.add(plane)

      gui.add(plane, 'visible').name('显示地面')
    }
    // 添加射线拾取器

    function addRaycaster() {
      let redBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
      let lastMateril = null
      let lastObject = null
      // renderer.domElement.addEventListener('pointerdown', (event) => {
      //   if (event.isPrimary === false) return//如果是监听renderer.domElement需要加上
      //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
      //   checkIntersection()
      // })
      window.addEventListener('pointerdown', (event) => {
        // if (event.isPrimary === false) return
        console.log(event.isPrimary)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        checkIntersection()
      })
      const checkIntersection = () => {
        raycaster.setFromCamera(mouse, camera) //使用一个新的原点和方向来更新射线。需要在刷新函数中也加上
        const intersects = raycaster.intersectObjects(scene.children, true) //检测和射线相交的一组物体

        if (intersects.length > 0) {
          if (lastObject != null) {
            lastObject.material = lastMateril
          }
          const selectedObject = intersects[0].object
          lastMateril = selectedObject.material
          lastObject = selectedObject
          selectedObject.material = redBasicMaterial
          console.log(selectedObject, 7777)
        } else {
        }
      }
    }
    // 生成多个立方体
    function addCube() {
      let count = 1000
      const geometry = new THREE.BoxGeometry(10, 10, 10)
      let MeshBasicMaterial = new THREE.MeshBasicMaterial()

      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          for (let z = 0; z < 5; z++) {
            let cube = new THREE.Mesh(geometry, MeshBasicMaterial)
            cube.position.set(i * 50, j * 50, z * 50)
            scene.add(cube)
          }
        }
      }
    }
    function animation() {
      renderer.render(scene, camera)
      let time = clock.getElapsedTime()

      // 通过摄像机和鼠标位置更新射线
      raycaster.setFromCamera(mouse, camera)
      orbitControls.update() // 鼠标交互更新
      if (!renderer.logarithmicDepthBuffer) renderer.logarithmicDepthBuffer = true
      requestAnimationFrame(animation)
    }

    function threeStart() {
      init()
      initCamera()
      initScene()
      addRaycaster()
      initControl()
      initLight()
      initHelper()
      addCube()
      // plane()

      animation()
    }
  }
  componentDidMount() {
    this.initThree()
  }
  render() {
    return <div className='raycaster-box' id='raycaster-box'></div>
  }
}
export default RaycasterCom
