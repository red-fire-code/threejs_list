import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import * as THREE from 'three'
import React from 'react'
import { DoubleSide } from 'three'
import { GUI } from 'dat.gui'
import gsap from 'gsap'
class PointMaterils extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  initThree() {
    var renderer, width, height
    // 创建一个gui
    const gui = new GUI()
    var clock = new THREE.Clock()

    threeStart()

    function init() {
      width = window.innerWidth
      height = window.innerHeight
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true
      })
      renderer.setSize(width, height)
      document.getElementById('point-materils-box').appendChild(renderer.domElement)
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
      console.log(axesHelper)
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
    // 增加球体
    function addSphere() {
      const geometry = new THREE.SphereGeometry(10, 32, 32)
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
      const sphere = new THREE.Mesh(geometry, material)
      sphere.position.set(0, 0, 0)
      // scene.add(sphere)

      const textureLoader = new THREE.TextureLoader()
      textureLoader.loadAsync(require('../../assets/img/sprites/disc.png')).then((texture) => {
        let pointmaterils = new THREE.PointsMaterial({ color: 0xfff000, size: 1 })
        pointmaterils.map = texture
        pointmaterils.alphaMap = texture
        pointmaterils.transparent = true
        pointmaterils.depthWrite = false
        pointmaterils.blending = THREE.AdditiveBlending
        let point = new THREE.Points(geometry, pointmaterils)
        scene.add(point)
        gui.add(point, 'visible').name('显示点球体')
      })
      // 添加点球体
    }
    //增加星空
    function addStarrySky() {
      let pointmaterils = new THREE.PointsMaterial({ size: 1 })
      const textureLoader = new THREE.TextureLoader()
      let texture = textureLoader.load(require('../../assets/img/sprites/disc.png'))
      pointmaterils.map = texture
      pointmaterils.alphaMap = texture
      pointmaterils.transparent = true
      pointmaterils.depthWrite = false
      pointmaterils.blending = THREE.AdditiveBlending
      pointmaterils.vertexColors = true
      let params = {
        count: 10000
      }

      let bufgeometry = new THREE.BufferGeometry()
      let positions = new Float32Array(params.count * 3)
      let colors = new Float32Array(params.count * 3)
      let pointSize = new Float32Array(params.count)
      for (let i = 0; i < params.count * 3; i++) {
        positions[i] = Math.random() * 200 - 100
        colors[i] = Math.random()
      }
      for (let i = 0; i < params.count; i++) {
        pointSize[i] = Math.random() * 100
      }
      bufgeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      bufgeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      // bufgeometry.setAttribute('PointSize', new THREE.BufferAttribute(pointSize, 1))

      let point = new THREE.Points(bufgeometry, pointmaterils)
      console.log(point)
      scene.add(point)
      point.visible = false
      gui.add(point, 'visible').name('隐藏星空')
    }
    //加载下雪天
    function snowball(url, size = 3) {
      let sonwGeometry = new THREE.BufferGeometry()
      let pointmaterils = new THREE.PointsMaterial({ size: 3 })
      const textureLoader = new THREE.TextureLoader()
      // let texture = textureLoader.load(require('../../assets/img/sprites/snowflake2.png'))
      let texture = textureLoader.load(url)

      pointmaterils.map = texture
      pointmaterils.alphaMap = texture
      pointmaterils.transparent = true
      pointmaterils.depthWrite = false
      pointmaterils.blending = THREE.AdditiveBlending
      // pointmaterils.vertexColors = true
      let params = {
        count: 1000
      }
      let positions = new Float32Array(params.count * 3)

      for (let i = 0; i < params.count * 3; i++) {
        positions[i] = Math.random() * 200 - 100
      }
      sonwGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      let sonwpoint = new THREE.Points(sonwGeometry, pointmaterils)
      console.log(sonwpoint, 'sonwpoint')
      scene.add(sonwpoint)
      sonwpoint.visible = false
      gui.add(sonwpoint, 'visible').name('下雪')
      return sonwpoint
    }
    //创建星系

    function galaxySpace() {
      let params = {
        count: 10000,
        radius: 100,
        subeCount: 6,
        centerColor: '#ff6030',
        endColor: '#1b3984'
      }
      let galaxyGeometry = new THREE.BufferGeometry()
      let pointmaterils = new THREE.PointsMaterial({ size: 2 })
      const textureLoader = new THREE.TextureLoader()
      let texture = textureLoader.load(require('../../assets/img/sprites/disc.png'))
      pointmaterils.map = texture
      pointmaterils.alphaMap = texture
      pointmaterils.transparent = true
      pointmaterils.depthWrite = false
      pointmaterils.blending = THREE.AdditiveBlending
      pointmaterils.vertexColors = true

      let positions = new Float32Array(params.count * 3)
      let colors = new Float32Array(params.count * 3)

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
        let lerpColor = centerColor.clone().lerp(endColor, distance / params.radius)
        colors[current] = lerpColor.r
        colors[current + 1] = lerpColor.g
        colors[current + 2] = lerpColor.b
      }
      galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      var galaxypoint = new THREE.Points(galaxyGeometry, pointmaterils)
      gsap.to(galaxypoint.rotation, { y: 2 * Math.PI, duration: 5, repeat: -1, ease: 'none' })

      scene.add(galaxypoint)
    }
    var snowball
    function animation() {
      renderer.render(scene, camera)
      let time = clock.getElapsedTime()

      snowball.rotation.x = time
      // galaxypoint.rotation.y = time
      // snowball.rotation.y = Math.random() * 0.01
      // snowball.rotation.z = Math.random() * 0.01

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
      initHelper()
      let snowflake2 = require('../../assets/img/sprites/snowflake2.png')
      snowball = snowball(snowflake2)
      galaxySpace()
      plane()
      addSphere()
      addStarrySky()

      // gui.add(snowShpere.rotation, 'x').min(0).max(100)
      animation()
    }
  }
  componentDidMount() {
    this.initThree()
  }
  render() {
    return <div className='point-materils-box' id='point-materils-box'></div>
  }
}
export default PointMaterils
