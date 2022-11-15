import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import * as THREE from 'three'
import React from 'react'

class PBRMaterialCom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  initThree() {
    threeStart()
    var renderer, width, height

    function init() {
      width = window.innerWidth
      height = window.innerHeight
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true
      })
      renderer.setSize(width, height)
      document.getElementById('pbrmaterialCom-box').appendChild(renderer.domElement)

      renderer.setClearColor(0x000000, 1.0)
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

    function addCube() {
      const geometry = new THREE.BoxGeometry(100, 100, 100, 100, 100, 100)
      // 导入纹理
      const textureLoader = new THREE.TextureLoader()
      let tengxtiao = textureLoader.load(require('../../assets/img/texture/Ground054_1K-JPG/Ground054_1K_Color.jpg'))
      let aomTexture = textureLoader.load(
        require('../../assets/img/texture/Ground054_1K-JPG/Ground054_1K_AmbientOcclusion.jpg')
      )
      let norTexture = textureLoader.load(
        require('../../assets/img/texture/Ground054_1K-JPG/Ground054_1K_NormalDX.jpg')
      )
      let norTexture1 = textureLoader.load(
        require('../../assets/img/texture/Ground054_1K-JPG/Ground054_1K_NormalGL.jpg')
      )
      // let textureBump = textureLoader.load(
      //   require('../../assets/img/texture/Ground054_1K-JPG/Ground054_1K_Roughness.jpg')
      // )
      let roughnessTex = textureLoader.load(
        require('../../assets/img/texture/Ground054_1K-JPG/Ground054_1K_Roughness.jpg')
      )
      let distureBump = textureLoader.load(
        require('../../assets/img/texture/Ground054_1K-JPG/Ground054_1K_Displacement.jpg')
      )
      // 因为aoMap需要第二组UV，所以为模型增加第二组uv.只需要复制一组即可
      geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2))
      // tengxtiao.offset.set(0.5, 0.5)
      // tengxtiao.center.set(0.5, 0.5)
      // tengxtiao.rotation = Math.PI / 4
      // tengxtiao.repeat.set(2, 3)
      // tengxtiao.wrapS = THREE.RepeatWrapping
      // tengxtiao.wrapT = THREE.RepeatWrapping

      // tengxtiao.minFilter = THREE.NearestFilter
      // tengxtiao.magFilter = THREE.NearestFilter
      console.log(tengxtiao)
      const material = new THREE.MeshStandardMaterial({
        map: tengxtiao,
        // aoMap: aomTexture,
        normalMap: norTexture1,
        // normalMapType: THREE.ObjectSpaceNormalMap,
        // bumpMap: textureBump, //凹凸贴图
        roughnessMap: roughnessTex,
        displacementMap: distureBump,
        displacementScale: 1
      })

      const cube = new THREE.Mesh(geometry, material)
      scene.add(cube)
    }

    // 加载天空盒
    function loadScene() {
      // let texture = new THREE.CubeTextureLoader().load([
      //   require('../../assets/img/texture/pisa/px.png'),
      //   require('../../assets/img/texture/pisa/nx.png'),
      //   require('../../assets/img/texture/pisa/py.png'),
      //   require('../../assets/img/texture/pisa/ny.png'),
      //   require('../../assets/img/texture/pisa/pz.png'),
      //   require('../../assets/img/texture/pisa/nz.png')
      // ])

      new RGBELoader().loadAsync(require('../../assets/img/texture/hdr/royal_esplanade_1k.hdr')).then((texture) => {
        console.log(texture)
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.background = texture
        scene.environment = texture
      })
    }
    function planeCube() {
      //设置加载器

      const loadmanager = new THREE.LoadingManager()
      loadmanager.onLoad = function () {
        console.log('Loading complete!')
      }
      // let url1 = require('../../assets/img/texture/MetalPlates006_2K-JPG/MetalPlates006_2K_Color.jpg')
      loadmanager.onProgress = function (url, itemsLoaded, itemsTotal) {
        console.log(url, (itemsLoaded / itemsTotal) * 100, '1111111')
      }
      const textureLoader = new THREE.TextureLoader(loadmanager)
      let mapT = textureLoader.load(
        require('../../assets/img/texture/MetalPlates006_2K-JPG/MetalPlates006_2K_Color.jpg')
      )
      mapT.wrapS = THREE.MirroredRepeatWrapping //S轴的平铺方式
      mapT.wrapT = THREE.RepeatWrapping //T轴的平铺方式
      mapT.minFilter = THREE.NearestFilter
      mapT.magFilter = THREE.NearestFilter
      let displacementMap = textureLoader.load(
        require('../../assets/img/texture/MetalPlates006_2K-JPG/MetalPlates006_2K_Displacement.jpg')
      )
      let metalnessMap = textureLoader.load(
        require('../../assets/img/texture/MetalPlates006_2K-JPG/MetalPlates006_2K_Metalness.jpg')
      )
      let normalMap = textureLoader.load(
        require('../../assets/img/texture/MetalPlates006_2K-JPG/MetalPlates006_2K_NormalGL.jpg')
      )
      let roughnessMap = textureLoader.load(
        require('../../assets/img/texture/MetalPlates006_2K-JPG/MetalPlates006_2K_Roughness.jpg')
      )

      const geometry = new THREE.PlaneGeometry(100, 100, 100, 100)
      const material = new THREE.MeshStandardMaterial({
        map: mapT,
        side: THREE.DoubleSide,
        displacementMap,
        metalnessMap,
        normalMap,
        roughnessMap
      })
      const plane = new THREE.Mesh(geometry, material)
      plane.position.set(0, 100, 10)
      scene.add(plane)
    }
    //添加控制器
    var orbitControls
    function initControl() {
      //添加控制器
      orbitControls = new OrbitControls(camera, renderer.domElement)
      orbitControls.enableDamping = true //控制器阻尼
    }

    var light
    function initLight() {
      light = new THREE.AmbientLight(0xffffff, 0.3)
      light.position.set(300, 300, 0)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(300, 300, 300)
      scene.add(directionalLight)
      scene.add(light)
    }

    function initHelper() {
      //坐标辅助器
      const axesHelper = new THREE.AxesHelper(500)
      scene.add(axesHelper)
    }
    function animation() {
      renderer.render(scene, camera)
      orbitControls.update() // 鼠标交互更新
      if (!renderer.logarithmicDepthBuffer) renderer.logarithmicDepthBuffer = true
      requestAnimationFrame(animation)
    }
    function threeStart() {
      init()
      initCamera()
      initScene()
      loadScene()
      initControl()
      initLight()
      initHelper()
      addCube()
      planeCube()

      animation()
    }
  }
  componentDidMount() {
    this.initThree()
  }
  render() {
    return <div className='pbrmaterialCom-box' id='pbrmaterialCom-box'></div>
  }
}
export default PBRMaterialCom
