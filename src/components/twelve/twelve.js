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
import vertexShader from '../../shader/twelve_shader/vertexShader.js'
import fragmentShader from '../../shader/twelve_shader/fragmentShader.js'
class Twelve extends React.Component {
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
      document.getElementById('twelve-box').appendChild(renderer.domElement)
      renderer.shadowMap.enabled = true
      renderer.setClearColor(0x000000, 1.0)
    }
    var camera
    function initCamera() {
      camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000)
      camera.position.set(10, 4, 10)
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
    //加载glb孔明灯模型
    var materialTwo
    function loadGlbOne() {
      materialTwo = new THREE.RawShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          utime: {
            value: 0
          }
          // uTexture: { value: texture }
        },
        side: THREE.DoubleSide,
        transparent: false
        // alphaTest: 1
      })
      const loader = new GLTFLoader()
      loader.load(
        // resource URL
        require('../../assets/model/glb/孔明灯.glb'),
        function (gltf) {
          let mesh = gltf.scene
          mesh.children[1].material = materialTwo
          // scene.add(mesh)
          console.log(mesh.children[1])
          for (let i = 0; i < 100; i++) {
            let flyLight = mesh.clone(true)
            let x = (Math.random() - 0.5) * 300
            let y = Math.random() * 60 + 25
            let z = (Math.random() - 0.5) * 300
            flyLight.position.set(x, y, z)
            gsap.to(flyLight.rotation, { y: Math.PI * 2, duration: 5 + 10 * Math.random(), repeat: -1, yoyo: true })
            gsap.to(flyLight.position, {
              y: '+=' + Math.random() * 30,
              x: '+=' + (Math.random() * 10 - 5),
              z: '+=' + (Math.random() * 10 - 5),

              duration: 10 + 10 * Math.random(),
              repeat: -1,
              yoyo: true
            })

            scene.add(flyLight)
          }
        }
      )
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

      // scene.add(plane)
    }
    //添加控制器
    var orbitControls
    function initControl() {
      //添加控制器
      orbitControls = new OrbitControls(camera, renderer.domElement)
      orbitControls.enableDamping = true //控制器阻尼
      orbitControls.autoRotate = true
      orbitControls.autoRotateSpeed = 0.2
      orbitControls.target.set(0, 10, 0)
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
      materialTwo.uniforms.utime.value = delaTime

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
      addHdr()
      initControl()
      addPlane()
      loadGlbOne()
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
        <div className='twelve-box' id='twelve-box'></div>
      </div>
    )
  }
}

export default Twelve
