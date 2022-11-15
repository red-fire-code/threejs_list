import React from 'react'
import { GUI } from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { Water } from 'three/examples/jsm/objects/Water2'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Firework from './firework.js'
//导入动画库
import gsap from 'gsap'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

import vertexShader from '../../shader/thirteen_shader/vertexShader.js'
import fragmentShader from '../../shader/thirteen_shader/fragmentShader.js'
import vsWater from '../../shader/water/vsWater.js'
import fsWater from '../../shader/water/fsWater.js'
class Sixteen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }
  initThree() {
    var renderer, width, height, world, waterMateril
    let clock = new THREE.Clock()

    const gui = new GUI()
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
      document.getElementById('sixteen-box').appendChild(renderer.domElement)
      renderer.shadowMap.enabled = true
      renderer.setClearColor(0x000000, 1.0)
    }
    var camera
    function initCamera() {
      camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000)
      camera.position.set(-5128, 1589, 734)
      camera.up.set(0, 1.0, 0)
      camera.far = 400000

      // camera.lookAt(0, 10, 0)//在添加控制器后就无效了
    }

    var scene = null
    function initScene() {
      if (scene != null) scene = null
      scene = new THREE.Scene()
    }
    var light
    function initLight() {
      light = new THREE.AmbientLight(0xffffff, 0.1)
      light.position.set(0, 3000, 0)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(1000, 2000, 1000)
      // directionalLight.shadow.camera.left = -5000
      // directionalLight.shadow.camera.right = 5000
      // directionalLight.shadow.camera.bottom = -5000
      // directionalLight.shadow.camera.top = 5000
      directionalLight.castShadow = true

      const pointlight = new THREE.PointLight(0xffffff, 1, 0)
      pointlight.position.set(1000, 2000, 1000)
      // scene.add(pointlight)
      scene.add(directionalLight)
      scene.add(light)
    }
    //加载全景
    const addHdr = () => {
      new RGBELoader()
        .loadAsync(require('../../assets/img/texture/hdr/3DCollective-Skies_0006_4k.hdr'))
        .then((texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping //映射模式
          scene.background = texture
          scene.environment = texture
        })
    }
    //生成水材质
    function creatWaterMaterial() {
      waterMateril = new THREE.ShaderMaterial({
        vertexShader: vsWater,
        fragmentShader: fsWater,
        // transparent: true,
        // blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: {
            value: 0
          },
          uNinColor: { value: new THREE.Color('#ff0000') },
          uHeightColor: { value: new THREE.Color('#d9d922') }
        }
      })
    }

    //添加水面
    var water
    const addPlane = () => {
      let waterGeometry = {}
      // waterGeometry = new THREE.PlaneGeometry(2000, 2000)
      const loader = new GLTFLoader()
      loader.load(
        // resource URL
        require('../../assets/model/glb/yugang.glb'),
        function (gltf) {
          let mesh = gltf.scene
          mesh.scale.set(100, 100, 100)
          console.log(mesh)
          mesh.children[1].material.side = THREE.DoubleSide
          waterGeometry = mesh.children[1].geometry

          water = new Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            scale: 4,
            color: '#7dabc9',
            flowDirection: new THREE.Vector2(1, 1)
          })
          scene.add(water)
          water.scale.set(100, 100, 100)

          scene.add(mesh)
        }
      )
    }
    //加载别墅

    function loadGlb() {
      creatWaterMaterial()
      let material = new THREE.MeshBasicMaterial({
        color: 0xff0000
        // side: THREE.DoubleSide
      })
      const loader = new GLTFLoader()
      loader.load(require('../../assets/model/glb/白色泳池别墅.glb'), function (gltf) {
        let mesh = gltf.scene
        mesh.children[2].material = {}
        mesh.children[2].material.side = THREE.BackSide //设置水背面显示

        let waterGeometry = mesh.children[2].geometry

        // mesh.children[2].material = material

        // console.log(mesh, 2)
        water = new Water(waterGeometry, {
          textureWidth: 1024,
          textureHeight: 1024,
          scale: 1,
          color: '#7dabc9',
          flowDirection: new THREE.Vector2(1, 1)
        })
        mesh.scale.set(0.1, 0.1, 0.1)
        water.scale.set(0.1, 0.1, 0.1)
        water.material.side = THREE.BackSide
        scene.add(water)

        const waterMesh = new THREE.Mesh(waterGeometry, waterMateril)
        waterMesh.scale.set(0.5, 0.5, 0.5)
        // scene.add(waterMesh)

        scene.add(mesh)
      })
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
          console.log(intersects[0].object)
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
    //实例创建烟花
    let fireworks = []
    function clickWindow() {
      console.log('camera', camera)
      let params = {
        color: `hsl(${Math.floor(Math.random() * 360)},100%,80%)`,
        position: {
          x: (Math.random() - 0.5) * 1500,
          y: (Math.random() - 0.5) * 500 + 1500,
          z: (Math.random() - 0.5) * 1500
        },
        from: {
          x: 0.0,
          y: 0.0,
          z: 0.0
        }
      }
      let firework = new Firework(params)
      firework.addScene(scene, camera)
      fireworks.push(firework)
    }
    let guiParams = {
      pauseFn: () => {
        clickWindow()
      }
    }
    gui.add(guiParams, 'pauseFn').name('发射火花')

    const animation = () => {
      let delaTime = clock.getElapsedTime()
      renderer.render(scene, camera)
      // water.material.uniforms['time'].value += 1.0 / 120.0
      waterMateril.uniforms.uTime.value = delaTime

      fireworks.forEach((each) => {
        each.update()
      })
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
      // addPlane()
      addRaycaster()
      loadGlb()
      // initHelper()
      animation()
      window.addEventListener('resize', reszie)
      // window.addEventListener('click', clickWindow)
    }
    threeStart()
  }
  componentDidMount() {
    this.initThree()
  }
  render() {
    return (
      <div>
        <div className='sixteen-box' id='sixteen-box'></div>
      </div>
    )
  }
}

export default Sixteen
