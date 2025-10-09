import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import Nav2 from './Nav2'
import Footer from './Footer'
import axios from 'axios'
import { signupUser } from '../services/SignupService'
function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSignup = async (e) => {
  e.preventDefault();

  try {
    const response = await signupUser({ name, email, phoneNumber, password });
    const { authToken, } = response.data;

    localStorage.setItem("authToken", authToken);
    localStorage.setItem("isLoggedIn", true);
    toast.success("Signup successful!");
    navigate("/about");

  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Something went wrong");
    }
  }
}

  return (
    <div className='w-[100vw] h-[100vh] flex flex-col justify-between'>
      <Nav2 />
      <div className=' flex flex-col gap-[2rem] justify-center items-center mt-[12rem]'>
        <form
          onSubmit={handleSignup}
          className='flex flex-col gap-[1rem] justify-center items-center'>
          <h1 className='text-3xl font-bold'>Sign Up</h1>
          <input
            type="text"
            placeholder='name'
            onChange={e => setName(e.target.value)}
            className='flex  bg-transparent p-[14px] w-[25rem] gap-[1rem] rounded-md m-[1rem] shadow-lg hover:scale-102 transtition-all duration-500 bg-white/10' />
          <input
            type="text"
            placeholder="email"
            onChange={e => setEmail(e.target.value)}
            className='flex  bg-transparent p-[14px] w-[25rem] gap-[1rem] rounded-md m-[1rem] shadow-lg hover:scale-102 transtition-all duration-500  bg-white/10' />
          <input
            type="number"
            placeholder='phoneNumber'
            onChange={e => setPhoneNumber(e.target.value)}
            className='flex  bg-transparent p-[14px] w-[25rem] gap-[1rem] rounded-md m-[1rem] shadow-lg hover:scale-102 transtition-all duration-500  bg-white/10' />
          <input
            type="text"
            placeholder='password'
            onChange={e => setPassword(e.target.value)}
            className='flex  bg-transparent p-[14px] w-[25rem] gap-[1rem] rounded-md m-[1rem] shadow-lg hover:scale-102 transtition-all duration-500  bg-white/10' />
          <button
            onSubmit={handleSignup}
            className="bg-red-400 p-[.7rem] w-[22rem] m-[1rem] rounded-md font-bold shadow-md text-white hover:bg-red-300 cursor-pointer">Sign in</button>
        </form>
        <ToastContainer position="top-center" />
      </div>
      <Footer />
    </div>
  )
}

export default Signup
