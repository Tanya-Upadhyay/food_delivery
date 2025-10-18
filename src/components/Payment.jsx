import { toast, ToastContainer } from "react-toastify";
import React, { useContext, useState } from "react";
import { dataContext } from "../context/userContext";
import Cart from "./Cart";
import Nav2 from "./Nav2";
import Footer from "./Footer";
import { PostOnlineOrder, postOrder } from "../services/postOrderService";
import {jwtDecode} from "jwt-decode";

function Payment() {
  const { showCart, setShowCart, backendCart, fetchOrders, paymentMethod, setPaymentMethod } = useContext(dataContext);

  const subtotal = backendCart.reduce((total, item) => total + item.quantity * item.price, 0);
  const deliverFee = 20;
  const taxes = subtotal * 0.005;
  const total = Math.floor(subtotal + deliverFee + taxes);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handlePayment = async (e) => {
    const value = e.target.value;
    setPaymentMethod(value);
    if (value === "credit" || value === "UPI") {
      try {
        await PostOnlineOrder(total);
        toast.success("Payment process started");
      } catch (error) {
        console.error("Payment process error", error);
        toast.error("Payment failed to start");
      }
    }
  };

  const token = localStorage.getItem("authToken");
  const decoded = token ? jwtDecode(token) : null;

  const handlePlaceOrder = () => {
    if (paymentMethod === "cod") {
      setShowConfirmModal(true);
    }
  };

  const confirmOrder = async () => {
    const orderItems = {
      UID: decoded?.uid,
      
    };
    try {
      await postOrder(orderItems);
      toast.success("Order Placed");
      fetchOrders();
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error in placing order", error);
      toast.error("Failed to place order.");
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-between">
      <Nav2/>

      <div className="mt-[8rem] flex flex-col items-center justify-center">
        <div>
          <p className="text-3xl md:text-5xl font-bold mb-[1rem]">Choose a payment method</p>
          <p className="md:text-xl mb-[3rem]">All transactions are secured and encrypted</p>
        </div>

        {["credit", "UPI", "cod"].map((val) => (
          <div key={val} className='flex justify-between items-center bg-white/10 p-[1rem] w-[80%] md:w-[45%] rounded-md m-[0.5rem] shadow-lg mb-[1rem]'>
            <label className='ml-[.5rem] text-xl'>
              <input
                type="radio"
                name="paymentMethod"
                value={val}
                className='mr-[.5rem] checkbox rounded-[50%]'
                onChange={handlePayment}
              />
              { val === "credit" && "Credit Card" }
              { val === "UPI" && "UPI / Pay Now" }
              { val === "cod" && "Cash on Delivery" }
            </label>
            <img src={ val === "credit" ? "images.png" : val==="UPI" ? "Pay.png" : "cod.jpg" } alt="" className="h-[3rem]" />
          </div>
        ))}

        <button
          className="bg-red-400 p-[1rem] w-[15rem] m-[1rem] ml-[3.2rem] mt-[2rem] rounded-md font-bold shadow-md text-white hover:scale-105 transition-all duration-500 cursor-pointer"
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>

        {showConfirmModal && (
          <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center shadow-lg">
            <div className="bg-white p-[5rem] rounded shadow-lg text-center">
              <h2 className="text-xl font-bold mb-4 text-gray-500">Confirm Your Order</h2>
              <p className="mb-6 text-gray-500">Are you sure you want to place this order with Cash on Delivery?</p>
              <div className="flex justify-center space-x-4">
                <button onClick={confirmOrder} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400">Yes, Place Order</button>
                <button onClick={() => setShowConfirmModal(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-200">Cancel</button>
              </div>
            </div>
          </div>
        )}

      </div>

      <Cart/>
      <ToastContainer position="top-center"/>
      <Footer/>
    </div>
  );
}

export default Payment;
