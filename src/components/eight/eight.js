import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import React from 'react'
import gsap from 'gsap'
import './eight.scss'
class TDOfficialWeb extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  initThree() {
    var renderer, width, height
    let groupArr = []
    var clock = new THREE.Clock()
    var raycaster = new THREE.Raycaster()
    var mouse = new THREE.Vector2()
    var movemouse = new THREE.Vector2()

    threeStart()

    function init() {
      width = window.innerWidth
      height = window.innerHeight
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true,
        alpha: true
      })
      renderer.setSize(width, height)
      document.getElementById('td-official-web-box').appendChild(renderer.domElement)
      // renderer.setClearColor(0x000000, 1.0)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.gammaInput = true
      // 默认为 false. 如果设置了该参数，表示所有纹理和颜色应当使用预乘的gamma值来输出。
      renderer.gammaOutput = true
    }
    var camera
    function initCamera() {
      camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000)
      camera.position.set(400, 0, 400)
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
      scene.add(directionalLight)
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
      window.addEventListener('pointermove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        checkIntersection()
      })
      const checkIntersection = () => {
        raycaster.setFromCamera(mouse, camera) //使用一个新的原点和方向来更新射线。需要在刷新函数中也加上
        const intersects = raycaster.intersectObjects(cubeGroup.children, true) //检测和射线相交的一组物体
        if (intersects.length > 0) {
          if (lastObject != null) {
            lastObject.material = lastMateril
          }
          const selectedObject = intersects[0].object
          lastMateril = selectedObject.material
          lastObject = selectedObject
          selectedObject.material = redBasicMaterial
        } else {
        }
      }
    }
    var cubeGroup
    // 生成多个立方体
    function addCube() {
      let count = 5
      cubeGroup = new THREE.Group()
      const geometry = new THREE.BoxGeometry(15, 15, 15)
      let MeshBasicMaterial = new THREE.MeshBasicMaterial()

      for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
          for (let z = 0; z < count; z++) {
            let cube = new THREE.Mesh(geometry, MeshBasicMaterial)
            cube.position.set(i * 40 - 80, j * 40 - 80, z * 40 - 80)
            cubeGroup.add(cube)
          }
        }
      }
      groupArr.push(cubeGroup)
      gsap.to(cubeGroup.rotation, { x: Math.PI, duration: 2, repeat: -1, ease: 'none' })

      scene.add(cubeGroup)
    }
    //增加三角形
    function addThrAng() {
      let meshGroup = new THREE.Group()
      for (let i = 0; i < 50; i++) {
        var geometry = new THREE.BufferGeometry()
        let color = new THREE.Color(Math.random(), Math.random(), Math.random())
        var material = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: Math.random(),
          side: THREE.DoubleSide
        })
        const vertisce = []
        for (let j = 0; j < 9; j++) {
          vertisce[j] = Math.random() * 180 - 90
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertisce), 3))
        const mesh = new THREE.Mesh(geometry, material)
        const edges = new THREE.EdgesGeometry(geometry)
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }))

        meshGroup.add(line)
        meshGroup.add(mesh)
      }
      gsap.to(meshGroup.rotation, { x: 2 * Math.PI, duration: 5, repeat: -1, ease: 'none' })
      groupArr.push(meshGroup)
      meshGroup.position.set(0, -560, 0)

      scene.add(meshGroup)
    }
    //添加星系
    function galaxySpace() {
      let params = {
        count: 10000,
        radius: 150,
        subeCount: 6,
        centerColor: '#ff6030',
        endColor: '#1b3984'
      }
      let galaxyGeometry = new THREE.BufferGeometry()
      let pointmaterils = new THREE.PointsMaterial({ size: 5 })
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

      let galaxyGroup = new THREE.Group()
      galaxyGroup.add(galaxypoint)
      galaxyGroup.position.set(0, -1100, 0)
      groupArr.push(galaxyGroup)

      gsap.to(galaxyGroup.rotation, { y: 2 * Math.PI, duration: 5, repeat: -1, ease: 'none' })
      galaxyGroup.rotation.set(Math.PI / 2, 0, 0)
      scene.add(galaxyGroup)
    }
    //监听滚动事件并修改相机
    var currentPage = 0
    function addEventListenerScrY() {
      let pageArr = textShow()
      window.addEventListener('scroll', () => {
        let newpage = Math.floor(window.scrollY / window.innerHeight)
        if (newpage != currentPage) {
          currentPage = newpage
          gsap.to(groupArr[currentPage].scale, { x: 1.5, y: 1.5, z: 1.5, duration: 1, repeat: 1, yoyo: true })
          gsap.to(pageArr[currentPage - 1], { xPercent: 60, duration: 2 })
        }
      })
    }
    //监听鼠标移动来摇晃相机
    function addEveLisMove() {
      window.addEventListener('mousemove', (event) => {
        movemouse.x = (event.clientX / window.innerWidth) * 2 - 1.5
        movemouse.y = -(event.clientY / window.innerHeight) * 2 + 1.5
      })
    }
    //让文字随着滚动展示出来
    function textShow() {
      let pageArr = []
      // pageArr[0] = document.getElementById('page1')
      pageArr[0] = document.getElementById('page2')
      pageArr[1] = document.getElementById('page3')
      return pageArr
    }
    function animation() {
      renderer.render(scene, camera)
      // let time = clock.getElapsedTime()
      let timedelta = clock.getDelta()
      // 通过摄像机和鼠标位置更新射线
      raycaster.setFromCamera(mouse, camera)
      camera.position.y = -(window.scrollY / window.innerHeight) * 550
      // camera.position.x += ((movemouse.x * 1600 - camera.position.x) * timedelta) / 5
      camera.position.x = 400 + Math.pow(movemouse.x, 3) * 30

      // orbitControls.update() // 鼠标交互更新
      //根据滚动去设置相机位置
      if (!renderer.logarithmicDepthBuffer) renderer.logarithmicDepthBuffer = true
      requestAnimationFrame(animation)
    }

    function threeStart() {
      init()
      initCamera()
      initScene()
      addRaycaster()
      initLight()
      addEventListenerScrY()
      addEveLisMove()
      addCube()
      addThrAng()
      galaxySpace()
      animation()
    }
  }
  componentDidMount() {
    this.initThree()
  }
  render() {
    return (
      <div className='eight-box'>
        <div className='td-official-web-box' id='td-official-web-box'></div>
        <div className='page' id='page1'>
          <h1>射线拾取器</h1>
          <h3>实现3D交互</h3>
        </div>
        <div className='page' id='page2'>
          <h1>材质</h1>
          <h3>多彩三角形</h3>
        </div>
        <div className='page' id='page3'>
          <h1>点和点材质</h1>
          <h3>星河-星系-下雪</h3>
        </div>
      </div>
    )
  }
}
export default TDOfficialWeb
