
import Home from './pages/Home'

import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import User from './components/User';
import Payment from './components/Payment';
import AdminPanel from './components/AdminPanel';
import ChatBox from './components/ChatBox';
import ChatDashboard from './components/ChatDashboard';
import ForgotPassword from './components/ForgotPassword';


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/menu' element={<Home/>}></Route>
          <Route path='/about' element={<About/>}></Route>
          <Route path='/contact' element={<Contact/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/signup'element={<Signup/>}></Route>
          <Route path='/user' element={<User/>}></Route>
          <Route path='*' element={<About/>}></Route>
          <Route path='/payment' element={<Payment/>}></Route>
          <Route path = '/admin' element={<AdminPanel/>}></Route>
          <Route path = '/chatbox' element={<ChatBox/>}></Route>
          <Route path = '/chatdashboard' element={<ChatDashboard/>}></Route>
          <Route path = '/forgot' element={<ForgotPassword/>}></Route>
        </Routes>
      </Router>
      
    </div>
  )
}

export default App
