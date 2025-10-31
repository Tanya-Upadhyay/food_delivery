import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const API_BASE = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsSendingOtp(true);
    try {
      await axios.post(`${API_BASE}/api/forgot-password`, { email });
      toast.success("OTP sent to your email.");
      setStep(2);
    } catch {
      setIsSendingOtp(false);
      toast.error("Error sending OTP.",{id:"unique-toast"});
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsVerifyingOtp(true);
    try {
      await axios.post(`${API_BASE}/api/verify-reset-otp`, { email, otp });
      toast.success("OTP verified.", {id:"unique-toast"});
      setStep(3);
    } catch {
      setIsVerifyingOtp(false);
      toast.error("Invalid or expired OTP.", {id:"unique-toast"});
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsResettingPassword(true);
    try {
      await axios.post(`${API_BASE}/api/reset-password`, { email, newPassword });
      toast.success("Password reset successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setIsResettingPassword(false);
      toast.error("Error resetting password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <ToastContainer position="top-center" />
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="flex flex-col gap-4 bg-white/10 w-[40%] p-12 rounded-md shadow-md flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold ">Forgot Password</h2>
          <input type="email" placeholder="Enter your email" className="p-2 shadow-lg rounded w-[60%] bg-gray-50 placeholder-gray-400" onChange={e => setEmail(e.target.value)} />
          <button
            type="submit"
            disabled={isSendingOtp}
            className={`bg-red-400 text-white p-2 w-[30%] rounded ${isSendingOtp ? "cursor-not-allowed opacity-60" : "hover:bg-red-300"}`}
          >
            {isSendingOtp ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4 bg-white/10 w-[40%] p-12 rounded-md shadow-md flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold text-black">Verify OTP</h2>
          <input type="text" placeholder="Enter OTP" className="p-2 shadow-lg rounded w-[60%]" onChange={e => setOtp(e.target.value)} />
          <button
            type="submit"
            disabled={isVerifyingOtp}
            className={`bg-green-500 text-white p-2 w-[30%] rounded ${isVerifyingOtp ? "cursor-not-allowed opacity-60" : "hover:bg-green-400"}`}
          >
            {isVerifyingOtp ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4 w-[40%] bg-white/10 p-12 rounded-md shadow-md shadow-md flex flex-col justify-center items-center ">
          <h2 className="text-2xl font-bold text-black">Reset Password</h2>
          <input type="password" placeholder="New Password" className="p-2 shadow-lg rounded w-[60%]" onChange={e => setNewPassword(e.target.value)} />
          <button
            type="submit"
            disabled={isResettingPassword}
            className={`bg-red-400 text-white p-2 rounded w-[30%] ${isResettingPassword ? "cursor-not-allowed opacity-60" : "hover:bg-red-300"}`}
          >
            {isResettingPassword ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;
