import * as THREE from 'three'
import { useEffect, useRef, useCallback, useState } from 'react'
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//导入动画库
import gsap from 'gsap'
//导入dat.gui
import * as dat from 'dat.gui'
// console.log(THREE, window.innerWidth / window.innerHeight)
import './one.scss'
function Hello() {
  let gaspOne, gaspTwo
  // let activeState = '暂停'
  // 创建ref元素
  const page = useRef(0) // useRef不会导致重新渲染
  const timer = useRef(null) // 定时器

  // 1、创建场景
  const scene = new THREE.Scene()
  // 2、创建相机
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.set(0, 0, 10)
  scene.add(camera)
  // 3、初始化渲染器
  const renderer = new THREE.WebGLRenderer({
    //增加下面两个属性，可以抗锯齿
    antialias: true
    // alpha: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio) //为了兼容高清屏幕
  // renderer.setClearColor(new THREE.Color(0x000000)) // 设置背景颜色和透明度
  // 增加datGui控件
  const gui = new dat.GUI()

  //监听窗口变化
  const reszie = () => {
    //innerHeight 返回窗口的文档显示区的高度，如果有垂直滚动条，也包括滚动条高度
    //innerWidth 返回窗口的文档显示区的宽度，如果有水平滚动条，也包括滚动条高度
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    //设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio)
  }
  window.addEventListener('resize', reszie)

  // 创建物体并加入到场景中
  function createMesh() {
    // 创建geometry和材质
    const params = {
      color: '#ffff00',
      pauseFn: () => {
        console.log('触发了事件')
      }
    }
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
    const cube = new THREE.Mesh(boxGeometry, boxMaterial)

    gaspOne = gsap.to(cube.position, { x: 5, duration: 5, repeat: -1, yoyo: true, ease: 'power2.inOut' })
    gaspTwo = gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5, repeat: -1, yoyo: true, ease: 'power2.inOut' })

    // gsap.fromTo(cube.rotation, { x: -40, duration: 5 }, { x: 40, duration: 4 })
    scene.add(cube) //将几何体添加到场景当中
    gui
      .add(cube.position, 'x')
      .min(0)
      .max(5)
      .step(0.1)
      .name('移动x轴')
      .onChange(() => {
        console.log('值被修改了')
      })
      .onFinishChange(() => {
        console.log('值改变停止时候')
      })
    //修改物体的颜色
    gui.addColor(params, 'color').onChange((value) => {
      cube.material.color.set(value)
    })
    //显示隐藏
    gui.add(cube, 'visible').name('显示隐藏')
    //设置按钮触发事件
    gui.add(params, 'pauseFn').name('触发事件')
    //设置抽屉
    let guiFolder1 = gui.addFolder('设置立方体')
    console.log(cube)
    guiFolder1.add(cube.material, 'wireframe').name('显示线框模型')
  }
  //添加控制器
  var orbitControls = new OrbitControls(camera, renderer.domElement)
  orbitControls.enableDamping = true //控制器阻尼

  function insertHelper() {
    //坐标辅助器
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)
  }
  let [activeState, setActiveState] = useState('暂停')

  //button操作事件
  function PauseActive() {
    if (gaspOne.isActive() || gaspTwo.isActive()) {
      gaspOne.pause()
      gaspTwo.pause()
    } else {
      gaspOne.resume()
      gaspTwo.resume()
    }
  }
  //开启关闭全屏
  function fullScreen() {
    let fullScreenEl = document.fullscreenElement
    if (!fullScreenEl) {
      renderer.domElement.requestFullscreen() //打开全屏
    }
  }
  useEffect(() => {
    page?.current.appendChild(renderer.domElement)
    init()
    createMesh()
    insertHelper()
    renderer.render(scene, camera)
    renderScene()

    // return () => {
    //   // 销毁定时器
    //   cancelAnimationFrame(timer.current)
    //   // 销毁材质、几何体、渲染器、场景
    // }
  }, [])
  // 把模型渲染到页面中
  const init = useCallback(() => {
    window.addEventListener('dblclick', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen() //关闭全屏全屏
      }
      console.log(11111)
    })
  }, [renderer, scene])
  // 渲染器执行渲染
  const renderScene = useCallback(() => {
    orbitControls.update() // 鼠标交互更新
    renderer.render(scene, camera)

    timer.current = window.requestAnimationFrame(() => renderScene())
  }, [renderer])

  return (
    <div className='one-box'>
      <div className='threejs-box' id='threejs-box' ref={page}></div>
      <div className='left-box'>
        <button className='pause-bt' onClick={PauseActive}>
          暂停/启动
        </button>
        <button className='pause-bt' onClick={fullScreen}>
          全屏干活
        </button>
      </div>
    </div>
  )
}

export default Hello
