import React from 'react'
import { GUI } from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { Water } from 'three/examples/jsm/objects/Water'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
//导入动画库
import gsap from 'gsap'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

import vertexShader from '../../shader/thirteen_shader/vertexShader.js'
import fragmentShader from '../../shader/thirteen_shader/fragmentShader.js'
class Fourteen extends React.Component {
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
      const params = {
        exposure: 1.0,
        toneMapping: 'ACESFilmic',
        blurriness: 0.3
      }

      const toneMappingOptions = {
        None: THREE.NoToneMapping,
        Linear: THREE.LinearToneMapping,
        Reinhard: THREE.ReinhardToneMapping,
        Cineon: THREE.CineonToneMapping,
        ACESFilmic: THREE.ACESFilmicToneMapping,
        Custom: THREE.CustomToneMapping
      }

      width = window.innerWidth
      height = window.innerHeight
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true,
        outputEncoding: THREE.sRGBEncoding, //定义渲染器的输出编码
        toneMapping: toneMappingOptions.Reinhard //render的色调映射
      })

      renderer.setSize(width, height)
      document.getElementById('fourteen-box').appendChild(renderer.domElement)
      renderer.shadowMap.enabled = true
      renderer.setClearColor(0x000000, 1.0)
    }
    var camera
    function initCamera() {
      camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000)
      camera.position.set(10, 10, 10)
      camera.up.set(0, 1.0, 0)
      // camera.lookAt(0, 10, 0)//在添加控制器后就无效了
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
    //加载全景
    const addHdr = () => {
      new RGBELoader().loadAsync(require('../../assets/img/texture/hdr/050.hdr')).then((texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping //映射模式
        scene.background = texture
        scene.environment = texture
      })
    }

    //添加水面
    var water
    const addPlane = () => {
      const waterGeometry = new THREE.PlaneGeometry(2000, 2000)

      water = new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load(
          require('../../assets/img/water/waternormals.jpg'),
          function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping
          }
        ),
        color: 0x001e0f
      })
      water.rotation.x = -Math.PI / 2
      scene.add(water)
    }
    //加载小岛
    function loadIsLand() {
      const loader = new GLTFLoader()
      // loader.load(
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
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      //设置渲染器的像素比
      renderer.setPixelRatio(window.devicePixelRatio)
    }
    const animation = () => {
      let delaTime = clock.getElapsedTime()
      renderer.render(scene, camera)
      water.material.uniforms['time'].value += 1.0 / 120.0

      orbitControls.update() // 鼠标交互更新
      requestAnimationFrame(animation)
    }
    function threeStart() {
      initRender()
      initCamera()
      initScene()
      initLight()
      addHdr()
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
        <div className='fourteen-box' id='fourteen-box'></div>
      </div>
    )
  }
}

export default Fourteen
