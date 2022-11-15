import React from 'react'
import { GUI } from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
//导入动画库
import gsap from 'gsap'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

import vertexShader from '../../shader/thirteen_shader/vertexShader.js'
import fragmentShader from '../../shader/thirteen_shader/fragmentShader.js'
class Thirteen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }
  initThree() {
    var renderer, width, height, world
    let clock = new THREE.Clock()
    const gui = new GUI()

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
      document.getElementById('thirteen-box').appendChild(renderer.domElement)
      renderer.shadowMap.enabled = true
      renderer.setClearColor(0x000000, 1.0)
    }
    var camera
    function initCamera() {
      camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000)
      camera.position.set(2, 2, 2)
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
      new RGBELoader().loadAsync(require('../../assets/img/texture/hdr/moonless_golf_1k.hdr')).then((texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping //映射模式
        scene.background = texture
        scene.environment = texture
      })
    }
    var params = {
      uWaresFrequency: 10,
      uScale: 0.1,
      uNoiseFrequency: 10,
      uNoiseScale: 1.6,
      uXScale: 1,
      uNinColor: '#ff0000',
      uHeightColor: '#d9d922'
    }
    //添加地面
    var materialOne
    const addPlane = () => {
      const geometry = new THREE.PlaneGeometry(1, 1, 512, 512)
      const textureLoader = new THREE.TextureLoader()
      let texture = textureLoader.load(require('../../assets/img/texture/xuehua.png'))
      // let texture = textureLoader.load(require('./girl.jpg'))
      // textureLoader.loadAsync(require('../../assets/img/texture/xuehua.png')).then((texture) => {

      // })
      materialOne = new THREE.RawShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        uniforms: {
          utime: {
            value: 0
          },
          uTexture: { value: texture },
          uWaresFrequency: { value: params.uWaresFrequency },
          uScale: { value: params.uScale },
          uNoiseFrequency: { value: params.uNoiseFrequency },
          uNoiseScale: { value: params.uNoiseScale },
          uXScale: { value: params.uXScale },
          uNinColor: { value: new THREE.Color(params.uNinColor) },
          uHeightColor: { value: new THREE.Color(params.uHeightColor) }
        },
        side: THREE.DoubleSide
      })

      const plane = new THREE.Mesh(geometry, materialOne)
      plane.rotateX(-Math.PI / 2)
      // plane.position.set(0, -0.5, 0)
      plane.receiveShadow = true
      scene.add(plane)

      gui
        .add(params, 'uWaresFrequency')
        .min(0)
        .max(100)
        .step(1)
        .name('uWaresFrequency')
        .onChange((value) => {
          // console.log('值被修改了')
          materialOne.uniforms.uWaresFrequency.value = value
        })
      gui
        .add(params, 'uNoiseFrequency')
        .min(0)
        .max(20)
        .step(1)
        .name('uNoiseFrequency')
        .onChange((value) => {
          // console.log('值被修改了')
          materialOne.uniforms.uNoiseFrequency.value = value
        })

      gui
        .add(params, 'uNoiseScale')
        .min(0)
        .max(5)
        .step(0.01)
        .name('uNoiseScale')
        .onChange((value) => {
          // console.log('值被修改了')
          materialOne.uniforms.uNoiseScale.value = value
        })
      gui
        .add(params, 'uScale')
        .min(0)
        .max(0.2)
        .step(0.01)
        .name('uScale')
        .onChange((value) => {
          // console.log('值被修改了')
          materialOne.uniforms.uScale.value = value
        })
      gui
        .add(params, 'uXScale')
        .min(0)
        .max(5)
        .step(0.1)
        .name('uXScale')
        .onChange((value) => {
          // console.log('值被修改了')
          materialOne.uniforms.uXScale.value = value
        })
      gui
        .addColor(params, 'uHeightColor')
        .name('uHeightColor')
        .onChange((value) => {
          materialOne.uniforms.uHeightColor.value = new THREE.Color(value)
        })
      gui
        .addColor(params, 'uNinColor')
        .name('uNinColor')
        .onChange((value) => {
          materialOne.uniforms.uNinColor.value = new THREE.Color(value)
        })
    }
    //添加控制器
    var orbitControls
    function initControl() {
      //添加控制器
      orbitControls = new OrbitControls(camera, renderer.domElement)
      orbitControls.enableDamping = true //控制器阻尼
      // orbitControls.autoRotate = true
      // orbitControls.autoRotateSpeed = 0.2
      // orbitControls.target.set(0, 1, 0)
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
      materialOne.uniforms.utime.value = delaTime
      orbitControls.update() // 鼠标交互更新
      if (!renderer.logarithmicDepthBuffer) renderer.logarithmicDepthBuffer = true

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
      // loadGlbOne()
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
        <div className='thirteen-box' id='thirteen-box'></div>
      </div>
    )
  }
}

export default Thirteen
