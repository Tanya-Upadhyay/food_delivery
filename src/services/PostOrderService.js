import axios from "axios";
import { CreatePayment } from "./PaymentController";
const token = localStorage.getItem("authToken");
const API_BASE = import.meta.env.VITE_BASE_URL;
export const postOrder = async (orderItems) => {
  console.log(orderItems)
  const token = localStorage.getItem("authToken");
  const res = await axios.post(`${API_BASE}/api/Orders`, orderItems, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return res.data;
};

export const PostOnlineOrder = async (amount,orderItems) => {
  const paymentOrder = await CreatePayment(amount);
  console.log("Payment order response:", paymentOrder);

  const { orderId, amount: amt, currency } = paymentOrder;
  if (!orderId) {
    throw new Error("Failed to create order for payment");
  }

  
  const options = {
    
    key: import.meta.env.VITE_RAZORPAY_KEY, 
    amount: amt.toString(),                 
    currency: currency,
    name: "Fast Food Delivery",
    description: "Purchase Description",
    order_id: orderId,                      
    handler: async (response) => {
      console.log("Razorpay response:", response);
      
      const res =await axios.post(`${API_BASE}/api/Payment/verify`, {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature,
        amount: amt,
        currency: currency
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await postOrder(orderItems);
      
    },
    prefill: {
      
      name: "", email: "", contact: ""
    },
    theme: {
      color: "#3399cc"
    }
  };
  
  const rz = new window.Razorpay(options);
  rz.open();

  
};
