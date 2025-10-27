import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const API_BASE = import.meta.env.VITE_BASE_URL;
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/forgot-password`, { email });
      toast.success("OTP sent to your email.");
      setStep(2);
    } catch {
      toast.error("Error sending OTP.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/verify-reset-otp`, { email, otp });
      toast.success("OTP verified.");
      setStep(3);
    } catch {
      toast.error("Invalid or expired OTP.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/reset-password`, { email, newPassword });
      toast.success("Password reset successful!");
      setTimeout(() => (window.location.href = "/login"), 1500);
    } catch {
      toast.error("Error resetting password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <ToastContainer position="top-center" />
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="flex flex-col gap-4 bg-white/10 w-[40%] p-12 rounded-md shadow-md flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold text-black">Forgot Password</h2>
          <input type="email" placeholder="Enter your email" className="p-2 border-1 rounded w-[60%]" onChange={e => setEmail(e.target.value)} />
          <button type="submit" className="bg-red-400 text-white p-2 w-[30%] rounded">Send OTP</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4 bg-white/10 w-[40%] p-12 rounded-md shadow-md flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold text-black">Verify OTP</h2>
          <input type="text" placeholder="Enter OTP" className="p-2 border-1 rounded w-[60%]" onChange={e => setOtp(e.target.value)} />
          <button type="submit" className="bg-green-500 text-white p-2 w-[30%] rounded">Verify OTP</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4 w-[40%] bg-white/10 p-12 rounded-md shadow-md shadow-md flex flex-col justify-center items-center ">
          <h2 className="text-2xl font-bold text-black">Reset Password</h2>
          <input type="password" placeholder="New Password" className="p-2 border-1 rounded w-[60%]" onChange={e => setNewPassword(e.target.value)} />
          <button type="submit" className="bg-red-400 text-white p-2 rounded w-[30%]">Reset Password</button>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;
