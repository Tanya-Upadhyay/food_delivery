import axios from "axios";

const API_BASE = import.meta.env.VITE_BASE_URL;
export const CreatePayment=async(amount)=>{
    const token = localStorage.getItem("authToken");
    const payload={
        amount:amount,
        currency: "INR"
    }
    const res = await axios.post(`${API_BASE}/api/Payment/create-order`,payload,{
        headers: {
            Authorization: `Bearer ${token}`
        }
});
    
    return res.data
}