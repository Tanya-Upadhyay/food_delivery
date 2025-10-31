import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import Nav2 from './Nav2'
import Footer from './Footer'
import axios from 'axios'
import { signupUser } from '../services/SignupService'

function Signup() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [isOtpSent, setIsOtpSent] = useState(false)

  const navigate = useNavigate()
  const API_BASE = import.meta.env.VITE_BASE_URL;

  const handleSignup = async (e) => {
    e.preventDefault();

    if (phoneNumber.length !== 10) {
      toast.error("Please enter a valid phone number", {id:"unique-toast"})
      return
    }

    setIsOtpSent(true);

    try {
      await signupUser({ name, email, phoneNumber, password });
      toast.success("Registration successful! OTP sent to your email.", {id:"unique-toast"});
      setStep(2);
    } catch (error) {
      setIsOtpSent(false);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong", {id:"unique-toast"});
      }
    }
  }
  
  const handleOtpVerify = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_BASE}/api/verify-email`, {
        email,
        otp
      })
      const { authToken } = response.data;
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("isLoggedIn", true);
      toast.success("Email verified successfully.",{id:"unique-toast"})
      navigate("/menu")
    } catch (error) {
      toast.error(error?.response?.data?.message || "OTP verification failed.")
    }
  }

  return (
    <div className='w-[100vw] overflow-hidden min-h-screen flex flex-col justify-between'>
      <Nav2 />
      <div className='flex justify-center items-center p-[2rem]'>
        <div><img src="Mobile login-amico.png" className='h-[70%] w-[70%] mt-[5rem]' /></div>
        <div className={`${step === 1 ? "h-[90%] w-[50%]" : "h-[60%] w-[80%]"} flex flex-col gap-[2rem] justify-center items-center mr-[10rem] bg-white/10 rounded-lg mt-[4rem] shadow-lg p-[4rem]`}>
          {step === 1 && <form
            onSubmit={handleSignup}
            className='flex flex-col gap-[1rem] justify-center items-center'>
            <h1 className='text-3xl font-bold'>Sign Up</h1>
            <input
              type="text"
              placeholder='name'
              maxLength={50}
              onChange={e => setName(e.target.value)}
              className='flex bg-transparent p-[14px] w-[25rem] gap-[1rem] rounded-md m-[1rem] shadow-lg hover:scale-102 transtition-all duration-500 bg-white/10' />
            <input
              type="text"
              placeholder="email"
              onChange={e => setEmail(e.target.value)}
              className='flex bg-transparent p-[14px] w-[25rem] gap-[1rem] rounded-md m-[1rem] shadow-lg hover:scale-102 transtition-all duration-500 bg-white/10' />
            <input
              type="number"
              min="0"
              placeholder='phoneNumber'
              onChange={e => setPhoneNumber(e.target.value)}
              className='flex bg-transparent p-[14px] w-[25rem] gap-[1rem] rounded-md m-[1rem] shadow-lg hover:scale-102 transtition-all duration-500 bg-white/10' 
              inputMode='numeric'/>
            <input
              type="password"
              placeholder='password'
              onChange={e => setPassword(e.target.value)}
              className='flex bg-transparent p-[14px] w-[25rem] gap-[1rem] rounded-md m-[1rem] shadow-lg hover:scale-102 transtition-all duration-500 bg-white/10' />
            <button
              type="submit"
              disabled={isOtpSent}
              className={`bg-red-400 p-[.7rem] w-[22rem] m-[1rem] rounded-md font-bold shadow-md text-white 
                ${isOtpSent ? "cursor-not-allowed opacity-60" : "hover:bg-red-300"}`}
            >
              {isOtpSent ? "Sending OTP..." : "Sign Up"}
            </button>
          </form>}
          {step === 2 && (
            <form onSubmit={handleOtpVerify} className='flex flex-col gap-4'>
              <h1 className='text-3xl font-bold mb-2 text-center'>Verify Email</h1>
              <input
                type="text"
                placeholder='Enter OTP'
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className='p-3 rounded-md bg-white/10 placeholder-gray-300 shadow-lg' />
              <button
                type="submit"
                className='bg-green-500 hover:bg-green-400 transition p-3 rounded-md font-bold text-white mt-2'>
                Verify OTP
              </button>
            </form>
          )}
          <ToastContainer position="top-center" />
        </div>
      </div>
    </div>
  )
}

export default Signup
