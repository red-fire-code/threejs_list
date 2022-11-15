import { Link } from 'react-router-dom'

import './route.scss'

const ruterdata = [
  { name: '1、Threejs+函数组件', path: '第一课.png', routePath: 'Hello' },
  { name: '2、认识threejs物体+类组件', path: '第二课.png', routePath: 'two' },
  { name: '3、认识threejs材质+类组件', path: '第三课.png', routePath: 'three' },
  { name: '4、认识threejsPBR材质纹理+类组件', path: '第四课.png', routePath: 'four' },
  { name: '5、灯光和阴影+类组件', path: '第五课.png', routePath: 'five' },
  { name: '6、点和点材质+星空+星河+下雪', path: '第六课.png', routePath: 'six' },
  { name: '7、射线拾取器', path: '第七课.png', routePath: 'seven' },
  { name: '8、3D全屏滚动官网', path: '第八课.png', routePath: 'eight' },
  { name: '9、物理引擎', path: '第九课.png', routePath: 'nine' },
  { name: '10、Threejs着色器', path: '第十课.png', routePath: 'ten' },
  { name: '11、Threejs着色器进阶', path: '第十一课.png', routePath: 'eleven' },
  { name: '12、Threejs孔明灯', path: '第十二课.png', routePath: 'twelve' },
  { name: '13、Threejs着色器水波纹', path: '第十三课.gif', routePath: 'thirteen' },
  { name: '14、水效果——图片纹理', path: 'fourteen.gif', routePath: 'fourteen' },
  { name: '15、着色器点材质', path: '第十五课.gif', routePath: 'fifteen' },
  { name: '16、烟花', path: '第16课.gif', routePath: 'sixteen' },
  { name: '17、GLSL配置', path: '第16课.gif', routePath: 'glsl' }
]

function createIB() {
  return ruterdata.map((item, id) => (
    <Link to={'/' + item.routePath} key={id}>
      <div className='piece-box'>
        <img src={require('../assets/img/' + item.path)} alt={item.path} className='img-box' />
        <h4>{item.name}</h4>
      </div>
    </Link>

    // <div className='piece-box' onClick={() => window.open(`/${item.routePath}`)} key={id}>
    //   <img src={require('../assets/img/' + item.path)} alt={item.path} className='img-box' />
    //   <h4>{item.name}</h4>
    // </div>
  ))
}

function RouteList() {
  return (
    <div className='rout-list'>
      <div className='max-box'>
        <div className='line-box'>{createIB()}</div>
      </div>
    </div>
  )
}

export default RouteList
