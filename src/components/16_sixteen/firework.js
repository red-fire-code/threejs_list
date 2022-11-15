import * as THREE from 'three'
import vertexShader from '../../shader/sixteen/vertexShader'
import fragmentShader from '../../shader/sixteen/fragmentShader'
import vsFirework from '../../shader/sixteen/firework/vsFirework'
import fsFirework from '../../shader/sixteen/firework/fsFirework.js'
class Firework {
  constructor(params) {
    this._color = new THREE.Color(params.color)
    this._from = params.from
    console.log(params)
    this._position = params.position
    this.creatSphere()
    this.fireWork()
    this.loadVoice()
    this.clock = new THREE.Clock()
    // this.update()
  }
  // init()
  init() {}
  // 创建烟花
  creatSphere() {
    console.log('111111111')
    this.startGeometry = new THREE.BufferGeometry()
    const startPositionArray = new Float32Array(3)
    startPositionArray[0] = this._position.x
    startPositionArray[1] = this._position.y
    startPositionArray[2] = this._position.z
    const formToArray = new Float32Array(3)
    formToArray[0] = this._position.x - this._from.x
    formToArray[1] = this._position.y - this._from.y
    formToArray[2] = this._position.z - this._from.z
    this.startGeometry.setAttribute('position', new THREE.BufferAttribute(startPositionArray, 3))
    this.startGeometry.setAttribute('aStep', new THREE.BufferAttribute(formToArray, 3))

    // 设置着色器材质
    this.starMateril = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: {
          value: 0
        },
        uSize: {
          value: 10.0
        },
        uColor: {
          value: this._color
        }
      }
    })
    this.stratPoint = new THREE.Points(this.startGeometry, this.starMateril)
  }
  //创建烟花爆竹
  fireWork() {
    this.fireWorkGeometry = new THREE.BufferGeometry()
    this.fireWorkCount = 200 + Math.floor(Math.random() * 200)
    let positionFireWorkArr = new Float32Array(this.fireWorkCount * 3)
    let scaleFireArr = new Float32Array(this.fireWorkCount)
    let directionArr = new Float32Array(this.fireWorkCount * 3)

    for (let i = 0; i < this.fireWorkCount; i++) {
      //烟花初始位置
      positionFireWorkArr[i * 3 + 0] = this._position.x
      positionFireWorkArr[i * 3 + 1] = this._position.y
      positionFireWorkArr[i * 3 + 2] = this._position.z
      // 烟花大小
      scaleFireArr[i] = Math.random()
      //设置爆炸发射的角度
      let theta = Math.random() * 2 * Math.PI
      let beta = Math.random() * 2 * Math.PI
      let r = Math.random() * 10.0 //设置爆炸的半径
      directionArr[i * 3 + 0] = r * Math.sin(theta) + r * Math.sin(beta)
      directionArr[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(beta)
      directionArr[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(beta)
      // directionArr[i * 3 + 0] = r * Math.sin(theta) + r * Math.cos(beta)
      // directionArr[i * 3 + 1] = r * Math.sin(theta) + r * Math.sin(beta)
      // directionArr[i * 3 + 2] = r * Math.cos(beta)
    }

    this.fireWorkGeometry.setAttribute('position', new THREE.BufferAttribute(positionFireWorkArr, 3))
    this.fireWorkGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleFireArr, 1))
    this.fireWorkGeometry.setAttribute('aDirection', new THREE.BufferAttribute(directionArr, 3))
    // 设置着色器材质
    this.fireWorMateril = new THREE.ShaderMaterial({
      vertexShader: vsFirework,
      fragmentShader: fsFirework,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: {
          value: 0
        },
        uSize: {
          value: 10.0
        },
        uColor: {
          value: this._color
        }
      }
    })
    this.fireworkPoints = new THREE.Points(this.fireWorkGeometry, this.fireWorMateril)
  }
  // 加载音频
  loadVoice() {
    // 创建音频

    this.linstener = new THREE.AudioListener()
    this.linstenerStart = new THREE.AudioListener()

    this.sound = new THREE.Audio(this.linstener)
    this.startSound = new THREE.Audio(this.linstenerStart)

    //创建音频加载器
    this.audioLoader = new THREE.AudioLoader()
    this.audioLoader.load(require('../../assets/sound/3.mp3'), (buffer) => {
      this.sound.setBuffer(buffer)
      this.sound.setLoop(false)
      this.sound.setVolume(3)
    })
    this.audioLoader.load(require('../../assets/sound/4.mp3'), (buffer) => {
      this.startSound.setBuffer(buffer)
      this.startSound.setLoop(false)
      this.startSound.setVolume(0.5)
    })
  }
  addScene(scene, camera) {
    // console.log('11111')
    this.scene = scene
    scene.add(this.stratPoint)
    console.log(this.stratPoint)
  }
  update() {
    const elapsedTime = this.clock.getElapsedTime()
    if (elapsedTime < 1) {
      this.starMateril.uniforms.uTime.value = elapsedTime
      this.starMateril.uniforms.uSize.value = 40.0
      if (elapsedTime > 0.1) {
        if (!this.startSound.isPlaying && !this.startplay) {
          this.startSound.play()
          this.startplay = true
        }
      }
    } else {
      const time = elapsedTime - 1.0
      this.starMateril.uniforms.uSize.value = 0
      this.scene.remove(this.stratPoint)
      // if (!this.sound.isPlaying && !this.play) {
      //   this.sound.play()
      //   this.play = true
      // }
      this.stratPoint.clear() //从内存中清除
      this.startGeometry.dispose() //清楚几何体
      this.starMateril.dispose() //清除材质
      this.scene.add(this.fireworkPoints)
      this.fireWorMateril.uniforms.uTime.value = time
      this.fireWorMateril.uniforms.uSize.value = 20.0

      if (time > 2.0) {
        this.scene.remove(this.fireworkPoints)
        this.fireworkPoints.clear() //从内存中清除
        this.fireWorkGeometry.dispose() //清楚几何体
        this.fireWorMateril.dispose() //清除材质
      }
    }
    // console.log(this.starMateril.uniforms)
  }
}
export default Firework
