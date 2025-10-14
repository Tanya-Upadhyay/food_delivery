import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import Nav2 from './Nav2'
import Footer from './Footer'

import { postLogin } from '../services/LoginService';
import { dataContext } from '../context/userContext'
function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
   
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { authToken } = await postLogin(email, password);
      
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("isLoggedIn", true);
      toast.success("Login successful!");
      navigate("/about");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Invalid email or password");
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  }
  return (
    <div className='overflow-hidden w-[100vw] h-[100vh] flex flex-col justify-between '>
      <Nav2 />
      <div className='flex flex-col gap-[2rem] justify-center items-center mt-[15rem]'>

        <form onSubmit={handleLogin} className='flex flex-col gap-[1rem] justify-center items-center' >
          <h1 className='text-3xl font-bold '>Login</h1>
          <input
            type="email"
            placeholder='email'
            onChange={e => setEmail(e.target.value)}
            className='flex  bg-white/10 p-[14px] w-[25rem] gap-[1rem] rounded-md m-[1rem] shadow-lg hover:scale-102 transtition-all duration-500 ' />
          <input
            type="text"
            placeholder='password'
            onChange={e => setPassword(e.target.value)}
            className='flex  bg-white/10 p-[14px] w-[25rem] gap-[1rem] rounded-md m-[1rem] shadow-lg hover:scale-102 transtition-all duration-500 ' />
          <button onSubmit={handleLogin}
            className="bg-red-400 p-[.7rem] w-[22rem] m-[1rem] rounded-md font-bold shadow-md text-white hover:scale-105 transition-all duration-500 cursor-pointer">Login</button>
          <ToastContainer position="top-center" />
        </form>
        <div className='underline underline-offset-4 '>
          <Link to="/signup">Sign up</Link>
        </div>
      </div>
      <Footer />
    </div>

  )
}

export default Login;
