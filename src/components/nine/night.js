import React, { Component } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as CANNON from 'cannon-es'
import { GUI } from 'dat.gui'
class PhysicsEngine extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  initThree() {
    var renderer, width, height, world
    let clock = new THREE.Clock()
    const gui = new GUI()
    var raycaster = new THREE.Raycaster()
    var mouse = new THREE.Vector2()
    function init() {
      width = window.innerWidth
      height = window.innerHeight
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true
      })
      renderer.setSize(width, height)
      document.getElementById('physics-engine-box').appendChild(renderer.domElement)
      renderer.shadowMap.enabled = true
      renderer.setClearColor(0x000000, 1.0)
    }

    var camera
    function initCamera() {
      camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000)
      camera.position.set(10, 2, 10)
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
    //增加球
    var sphereObj = {}
    function initObject() {
      const geometry = new THREE.SphereGeometry(1, 20, 20)
      const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide })
      let sphere = new THREE.Mesh(geometry, material)
      sphere.position.set(0, 3, 0)
      sphereObj.mesh = sphere
      sphere.castShadow = true
      scene.add(sphere)
      addPlane()
    }
    //增加立方体
    var cube,
      boxBody,
      cubeToUpdate = []
    function initCube(lenght, position) {
      //往Threejs世界添加物体
      let cubeGeometry = new THREE.BoxGeometry(lenght, lenght, lenght)
      let material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, color: 0xff0024 })
      cube = new THREE.Mesh(cubeGeometry, material)
      cube.position.set(...position)
      scene.add(cube)
      //在物理世界也实例相同的物体
      let boxShape = new CANNON.Box(new CANNON.Vec3(lenght / 2, lenght / 2, lenght / 2))
      boxBody = new CANNON.Body({
        shape: boxShape,
        position: new CANNON.Vec3(...position),
        mass: Math.random() //物体质量
      })
      //保存对象更新数组中
      cubeToUpdate.push({
        mesh: cube,
        body: boxBody
      })
      world.addBody(boxBody)
    }
    function addGui() {
      //先创建对象来存储createSphere函数
      //因为gui.add()第一个参数必须是一个对象，第二个参数是对象的一个属性
      const debugObject = {}
      debugObject.initCube = () => {
        initCube(Math.random(), [Math.random() * 3, Math.random() * 3, Math.random() * 3])
      }
      gui.add(debugObject, 'initCube').name('添加立方体')
    }
    //添加地面
    function addPlane() {
      const geometry = new THREE.PlaneGeometry(10, 10)
      const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide })
      const plane = new THREE.Mesh(geometry, material)
      plane.rotateX(-Math.PI / 2)
      plane.position.set(0, -5, 0)
      plane.receiveShadow = true
      scene.add(plane)
    }
    //增加物理世界
    var sphereBody
    function pythWprld() {
      // world = new Cannon.World({ gravity: -9.8 })//或者
      world = new CANNON.World()
      world.gravity.set(0, -9.8, 0)
      //创建物理小球
      const sphereShape = new CANNON.Sphere(1)
      sphereBody = new CANNON.Body({
        shape: sphereShape,
        position: new CANNON.Vec3(0, 3, 0),
        mass: 1, //物体质量
        material: new CANNON.Material() //物体材质
        // collisionResponse: false
      })
      //将物体添加到物理世界中
      world.addBody(sphereBody)
      // 监听小球碰撞事件
      sphereBody.addEventListener('collide', hitEvent)
      sphereObj.body = sphereBody
      // sphereBody.applyForce(new CANNON.Vec3(-1000, 0, 0), sphereBody.position)
      // 在物理世界创建地面
      const floorShape = new CANNON.Plane()
      const floorBody = new CANNON.Body({
        shape: floorShape,
        mass: 0, //当质量为0的时候会保持物体不动
        material: new CANNON.Material() //物体材质
      })
      // 为地面和球的两种材质添加摩擦和反弹系数
      addConcatMateril(sphereBody.material, floorBody.material, 0.1, 0.7)
      floorBody.position.set(0, -5, 0)
      floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
      world.addBody(floorBody)
      //设置物理世界默认的碰撞材料
      console.log(world, '1111111111')
      const defaultMaterial = new CANNON.Material('default')
      const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
        friction: 0.1,
        restitution: 0.7
      })
      world.addContactMaterial(defaultContactMaterial)
      world.defaultContactMaterial = defaultContactMaterial
      world.broadphase = new CANNON.SAPBroadphase(world)
      world.allowSleep = true
    }
    //添加监听碰撞的事件
    function hitEvent(e) {
      console.log('发生了碰撞', e)
      let hitVoice = new Audio(require('../../assets/sound/锤击打铁砧_爱给网_aigei_com.mp3'))

      const impactStrength = e.contact.getImpactVelocityAlongNormal()
      if (impactStrength > 5) {
        hitVoice.currentTime = 0
        hitVoice.play()
      }
      // 触发声音
      console.log(impactStrength)
    }
    // 添加关联材质，用来控制物理交互
    function addConcatMateril(one, two, num1, num2) {
      const oneConcatMateril = new CANNON.ContactMaterial(one, two, {
        friction: num1,
        restitution: num2
      })
      world.addContactMaterial(oneConcatMateril)
    }
    //添加控制器
    var orbitControls
    function initControl() {
      //添加控制器
      orbitControls = new OrbitControls(camera, renderer.domElement)
      orbitControls.enableDamping = true //控制器阻尼
    }
    function initHelper() {
      //坐标辅助器
      const axesHelper = new THREE.AxesHelper(500)
      scene.add(axesHelper)
    }
    function addRaycaster() {
      let redBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
      let lastMateril = null
      let lastObject = null
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
          console.log('点击了球体')
          sphereObj.body.applyForce(new CANNON.Vec3(-10, 0, 50), sphereBody.position)
        } else {
        }
      }
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
    threeStart()

    function threeStart() {
      init()
      initCamera()
      initScene()
      initLight()
      addRaycaster()
      initObject()
      initControl()
      initHelper()
      pythWprld()
      // initCube()
      addGui()
      animation()
      console.log(world)
      console.log(scene)

      // console.log(Cannon)
      window.addEventListener('resize', reszie)
    }
    function animation() {
      let delaTime = clock.getDelta()
      renderer.render(scene, camera)
      // 更新物理引擎
      world.step(1 / 120, delaTime)
      //更新球体位置
      sphereObj.mesh.position.copy(sphereObj.body.position)
      sphereObj.mesh.quaternion.copy(sphereObj.body.quaternion)
      //更新立方体位置
      cubeToUpdate.forEach((each) => {
        each.mesh.position.copy(each.body.position) //刷新物体位置
        each.mesh.quaternion.copy(each.body.quaternion) //刷新物体旋转
      })

      orbitControls.update() // 鼠标交互更新
      if (!renderer.logarithmicDepthBuffer) renderer.logarithmicDepthBuffer = true

      requestAnimationFrame(animation)
    }
  }

  /**
   * 开始Three
   *
   * @memberof ThreeBim
   */
  componentDidMount() {
    this.initThree()
  }
  render() {
    return (
      <div className='nine-box'>
        <div className='physics-engine-box' id='physics-engine-box'></div>
      </div>
    )
  }
}

export default PhysicsEngine
