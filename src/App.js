import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Hello from './components/one/one'
import RouteList from './route/route'
import ThreeBim from './components/two/two'
import MaterialCom from './components/three/threeMat'
import PBRMaterialCom from './components/four/pbrMaterial'
import LightndShaow from './components/five/lightca'
import PointMaterils from './components/six/pointmaterils'
import RaycasterCom from './components/seven/raycaster'
import TDOfficialWeb from './components/eight/eight'
import PhysicsEngine from './components/nine/night'
import Ten from './components/ten/ten'
import Elevlen from './components/eleven/elevlen'
import Twelve from './components/twelve/twelve'
import Thirteen from './components/thirteen/thirteen'
import Fourteen from './components/14_fourteen/fourteen'
import Fifteen from './components/15_fifteen/fifteen'
import Sixteen from './components/16_sixteen/sixteen'
import GlslWebpackTest from './components/glsl_webpack_test/glsl_webpack_test'
import './app.scss'

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<RouteList>link</RouteList>} />
          <Route path='/hello' element={<Hello>link</Hello>} />
          <Route path='/two' element={<ThreeBim>link</ThreeBim>} />
          <Route path='/three' element={<MaterialCom>link</MaterialCom>} />
          <Route path='/four' element={<PBRMaterialCom>link</PBRMaterialCom>} />
          <Route path='/five' element={<LightndShaow>link</LightndShaow>} />
          <Route path='/six' element={<PointMaterils>link</PointMaterils>} />
          <Route path='/seven' element={<RaycasterCom>link</RaycasterCom>} />
          <Route path='/eight' element={<TDOfficialWeb>link</TDOfficialWeb>} />
          <Route path='/nine' element={<PhysicsEngine>link</PhysicsEngine>} />
          <Route path='/ten' element={<Ten>link</Ten>} />
          <Route path='/eleven' element={<Elevlen>link</Elevlen>} />
          <Route path='/twelve' element={<Twelve>link</Twelve>} />
          <Route path='/thirteen' element={<Thirteen>link</Thirteen>} />
          <Route path='/fourteen' element={<Fourteen>link</Fourteen>} />
          <Route path='/fifteen' element={<Fifteen>link</Fifteen>} />
          <Route path='/sixteen' element={<Sixteen>link</Sixteen>} />
          <Route path='/glsl' element={<GlslWebpackTest>link</GlslWebpackTest>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
