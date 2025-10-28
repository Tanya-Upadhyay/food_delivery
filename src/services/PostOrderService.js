import axios from "axios";
import { CreatePayment } from "./PaymentController";
const API_BASE = import.meta.env.VITE_BASE_URL;
export const postOrder = async (orderItems) => {
  const token = localStorage.getItem("authToken");
  const res = await axios.post(`${API_BASE}/api/Orders`, orderItems, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const PostOnlineOrder = async (amount, orderItems, onSuccess, onError) => {
  try {
    const paymentOrder = await CreatePayment(amount);
    const { orderId, amount: amt, currency } = paymentOrder;
    if (!orderId) throw new Error("Failed to create order for payment");

    const token = localStorage.getItem("authToken");

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: amt.toString(),
      currency,
      name: "Fast Food Delivery",
      description: "Purchase Description",
      order_id: orderId,
      handler: async (response) => {
        try {
          
          await axios.post(
            `${API_BASE}/api/Payment/verify`,
            {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: amt,
              currency,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          
          await postOrder(orderItems);

          
          if (onSuccess) onSuccess();

        } catch (err) {
          console.error("Error in Razorpay handler:", err);
          if (onError) onError(err);
        }
      },
      prefill: { name: "", email: "", contact: "" },
      theme: { color: "#3399cc" },
    };

    const rz = new window.Razorpay(options);
    rz.open();
  } catch (err) {
    console.error("Payment error:", err);
    if (onError) onError(err);
  }
};

