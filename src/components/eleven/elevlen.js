import React from 'react'
import { GUI } from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import vertexShader from '../../shader/eleven/vertexShader.js'
import fragmentShader from '../../shader/eleven/fragmentShader.js'
class Elevlen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }
  initThree() {
    var renderer, width, height, world
    let clock = new THREE.Clock()
    // const gui = new GUI()
    var raycaster = new THREE.Raycaster()
    var mouse = new THREE.Vector2()

    function initRender() {
      width = window.innerWidth
      height = window.innerHeight
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true
      })
      renderer.setSize(width, height)
      document.getElementById('eleven-box').appendChild(renderer.domElement)
      renderer.shadowMap.enabled = true
      renderer.setClearColor(0x000000, 1.0)
    }
    var camera
    function initCamera() {
      camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000)
      camera.position.set(1, 3, 2)
      camera.up.set(0, 1, 0)
      camera.lookAt(0, 0, 0)
    }

    var scene
    function initScene() {
      scene = new THREE.Scene()
    }
    var light
    function initLight() {
      light = new THREE.AmbientLight(0xffffff, 0.2)
      light.position.set(30, 30, 0)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(20, 40, 20)
      directionalLight.castShadow = true
      // const helper = new THREE.CameraHelper(directionalLight.shadow.camera)
      // scene.add(helper)
      scene.add(directionalLight)
      scene.add(light)
    }
    //添加地面
    var materialOne
    const addPlane = () => {
      const geometry = new THREE.PlaneGeometry(1, 1, 64, 64)
      const textureLoader = new THREE.TextureLoader()
      let texture = textureLoader.load(require('../../assets/img/texture/xuehua.png'))
      // let texture = textureLoader.load(require('./girl.jpg'))
      // textureLoader.loadAsync(require('../../assets/img/texture/xuehua.png')).then((texture) => {

      // })
      materialOne = new THREE.RawShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          utime: {
            value: 0
          },
          uTexture: { value: texture }
        },
        side: THREE.DoubleSide
      })
      console.log(materialOne.uniforms)

      const plane = new THREE.Mesh(geometry, materialOne)
      // plane.rotateX(-Math.PI / 2)
      // plane.position.set(0, -0.5, 0)
      plane.receiveShadow = true

      scene.add(plane)
    }
    //添加控制器
    var orbitControls
    function initControl() {
      //添加控制器
      orbitControls = new OrbitControls(camera, renderer.domElement)
      orbitControls.enableDamping = true //控制器阻尼
    }
    //添加拾取器
    function addRaycaster() {
      renderer.domElement.addEventListener('pointerdown', (event) => {
        if (event.isPrimary === false) return //如果是监听renderer.domElement需要加上
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        checkIntersection()
      })

      const checkIntersection = () => {
        raycaster.setFromCamera(mouse, camera) //使用一个新的原点和方向来更新射线。需要在刷新函数中也加上
        const intersects = raycaster.intersectObjects(scene.children, true) //检测和射线相交的一组物体
        if (intersects.length > 0) {
          console.log('点击了物体')
        } else {
        }
      }
    }
    //坐标辅助器
    function initHelper() {
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
    const animation = () => {
      let delaTime = clock.getElapsedTime()
      renderer.render(scene, camera)
      // 更新物理引擎
      // console.log(this.state)
      materialOne.uniforms.utime.value = delaTime
      // console.log(delaTime)
      orbitControls.update() // 鼠标交互更新
      if (!renderer.logarithmicDepthBuffer) renderer.logarithmicDepthBuffer = true

      requestAnimationFrame(animation)
    }
    function threeStart() {
      initRender()
      initCamera()
      initScene()
      initLight()
      initControl()
      addPlane()
      addRaycaster()
      // initHelper()
      animation()
      window.addEventListener('resize', reszie)
    }
    threeStart()
  }
  componentDidMount() {
    this.initThree()
  }
  render() {
    return (
      <div>
        <div className='eleven-box' id='eleven-box'></div>
      </div>
    )
  }
}

export default Elevlen
