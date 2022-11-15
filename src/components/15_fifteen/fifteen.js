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

import vertexShader from '../../shader/fifteen_shader/vertexShader.js'
import fragmentShader from '../../shader/fifteen_shader/fragmentShader.js'
class Fifteen extends React.Component {
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
      document.getElementById('fifteen-box').appendChild(renderer.domElement)
      renderer.shadowMap.enabled = true
      renderer.setClearColor(0x000000, 1.0)
    }
    var camera
    function initCamera() {
      camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000)
      camera.position.set(100, 100, 100)
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
    var pointmaterils
    function galaxySpace() {
      let params = {
        count: 1000,
        radius: 100,
        subeCount: 4,
        centerColor: '#ff6030',
        endColor: '#1b3984'
      }
      let galaxyGeometry = new THREE.BufferGeometry()

      const textureLoader = new THREE.TextureLoader()

      let texture = textureLoader.load(require('../../assets/img/icion/星星开心.png'))
      let texture2 = textureLoader.load(require('../../assets/img/icion/星星2.png'))
      let texture3 = textureLoader.load(require('../../assets/img/icion/爱心.png'))

      pointmaterils = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending, //叠加会越来越亮
        vertexColors: true,
        depthTest: false, //关闭深度遮挡
        uniforms: {
          uTime: {
            value: 0
          },
          u_Texture: {
            value: texture
          },
          u_Texture1: {
            value: texture2
          },
          u_Texture2: {
            value: texture3
          }
        }
      })

      let positions = new Float32Array(params.count * 3)
      let colors = new Float32Array(params.count * 3)
      let scales = new Float32Array(params.count)
      let imgIndex = new Float32Array(params.count)

      let centerColor = new THREE.Color(params.centerColor)
      let endColor = new THREE.Color(params.endColor)

      for (let i = 0; i < params.count; i++) {
        //该点再第几个分支上
        let branchAngel = ((i % params.subeCount) * (2 * Math.PI)) / params.subeCount
        // 点距离圆心的距离
        let distance = Math.pow(Math.random(), 3) * params.radius
        let current = i * 3
        const randomX = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5
        const randomY = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5
        const randomZ = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5

        positions[current] = Math.cos(branchAngel + (distance / params.radius) * 1.5) * distance + randomX
        positions[current + 1] = randomY
        positions[current + 2] = Math.sin(branchAngel + (distance / params.radius) * 1.5) * distance + randomZ
        //设置颜色
        let lerpColor = centerColor.clone().lerp(endColor, distance / params.radius)
        colors[current] = lerpColor.r
        colors[current + 1] = lerpColor.g
        colors[current + 2] = lerpColor.b
        scales[i] = Math.random() * 10
        imgIndex[i] = i % 3
      }
      galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      galaxyGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
      galaxyGeometry.setAttribute('aImgIndex', new THREE.BufferAttribute(imgIndex, 1))

      var galaxypoint = new THREE.Points(galaxyGeometry, pointmaterils)
      // gsap.to(galaxypoint.rotation, { y: 2 * Math.PI, duration: 5, repeat: -1, ease: 'none' })

      scene.add(galaxypoint)
    }
    //添加点
    var material
    function addPoint() {
      const geometry = new THREE.BufferGeometry()
      const vertices = new Float32Array([0.0, 0.0, 0.0])
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
      // const material = new THREE.PointsMaterial({ color: 0x888888, size: 1, sizeAttenuation: true })
      //点的着色器材质
      const textureLoader = new THREE.TextureLoader()
      let texture = textureLoader.load(require('../../assets/img/icion/运动.png'))

      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        uniforms: {
          u_Texture: {
            value: texture
          },
          uTime: {
            value: 0
          }
        }
      })

      let point = new THREE.Points(geometry, material)
      scene.add(point)
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
      pointmaterils.uniforms.uTime.value = delaTime

      // material.uniforms.uTime.value = delaTime

      orbitControls.update() // 鼠标交互更新
      requestAnimationFrame(animation)
    }
    function threeStart() {
      initRender()
      initCamera()
      initScene()
      initLight()
      // addHdr()
      initControl()
      // addPoint()
      galaxySpace()
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
        <div className='fifteen-box' id='fifteen-box'></div>
      </div>
    )
  }
}

export default Fifteen
