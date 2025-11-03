import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import Nav2 from './Nav2'
import Footer from './Footer'
import { postLogin } from '../services/LoginService'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const { authToken } = await postLogin(email, password)
      localStorage.setItem("authToken", authToken)
      localStorage.setItem("isLoggedIn", true)
      toast.success("Login successful!", { id: "unique-toast" })
      navigate("/menu")
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Invalid email or password", { id: "unique-toast" })
      } else {
        toast.error("Login failed. Please try again.", { id: "unique-toast" })
      }
    }
  }

  return (
    <div className='overflow-x-hidden w-[100vw] h-[100vh] flex flex-col justify-between'>
      <Nav2 />
      <div className='flex justify-center items-center p-[2rem]'>
        <div>
          <img src="Login-bro.png" className='h-[100%] w-[70%] mt-[5rem]' alt="login" />
        </div>
        <div className='h-[80%] w-[50%] flex flex-col gap-[2rem] justify-center items-center mr-[10rem] bg-white/10 rounded-lg mt-[4rem] shadow-md'>
          <form onSubmit={handleLogin} className='flex flex-col gap-[1rem] justify-center items-center p-[5rem]'>
            <h1 className='text-3xl font-bold'>Login</h1>
            <input
              type="email"
              placeholder='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='flex bg-white/10 p-[14px] w-[25rem] gap-[1rem] rounded-md m-[1rem] shadow-lg hover:scale-102 transition-all duration-500'
              required
            />
            <div className='relative w-[25rem] m-[1rem]'>
              <input
                type={showPassword ? "text" : "password"}
                placeholder='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                className='flex bg-white/10 p-[14px] w-full gap-[1rem] rounded-md shadow-lg hover:scale-102 transition-all duration-500 pr-10'
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-3 '
              >
                {showPassword ? (
                  <EyeIcon className="h-5 w-5" />
                  
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <button
              type="submit"
              className="bg-red-400 p-[.7rem] w-[22rem] m-[1rem] rounded-md font-bold shadow-md text-white hover:scale-105 transition-all duration-500 cursor-pointer"
            >
              Login
            </button>
            <ToastContainer position="top-center" />
          </form>
          <div className='underline underline-offset-4'>
            <Link to="/signup">Sign up</Link>
          </div>
          <div className='underline underline-offset-4'>
            <Link to="/forgot">Forget Password</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
