import { toast, ToastContainer } from "react-toastify";
import React, { useContext, useState, useEffect } from "react";
import { dataContext } from "../context/userContext";
import Cart from "./Cart";
import Nav2 from "./Nav2";
import Footer from "./Footer";
import { PostOnlineOrder, postOrder } from "../services/postOrderService";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function Payment() {
  const { backendCart, fetchOrders, paymentMethod, setPaymentMethod } = useContext(dataContext);
  const API_BASE = import.meta.env.VITE_BASE_URL;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [primaryAddress, setPrimaryAddress] = useState(null);
  const token = localStorage.getItem("authToken");
  const decoded = token ? jwtDecode(token) : null;

  const subtotal = backendCart.reduce((total, item) => total + item.quantity * item.price, 0);
  const deliverFee = 20;
  const taxes = subtotal * 0.005;
  const total = Math.floor(subtotal + deliverFee + taxes);

  useEffect(() => {
    const fetchPrimaryAddress = async () => {
      try {
        if (!decoded?.uid) return;
        const res = await axios.get(`${API_BASE}/api/Addresses/${decoded.uid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const addresses = Array.isArray(res.data) ? res.data : [res.data];
        const primary = addresses.find((addr) => addr.isPrimary === true);
        if (!primary) {
          toast.error("Please set a delivery address before proceeding.");
          setPrimaryAddress(null);
        } else {
          setPrimaryAddress(primary);
        }
      } catch (error) {
        toast.error("Unable to load address. Please check your connection.");
      }
    };
    fetchPrimaryAddress();
  }, []);

  const handlePayment = (e) => {
    if (!primaryAddress) {
      toast.error("Please set a delivery address before making payment.");
      return;
    }
    const value = e.target.value;
    setPaymentMethod(value);
  };

  const handleOnlinePayment = async (method) => {
    
    if (!primaryAddress) {
      toast.error("Please set a delivery address before making payment.");
      return;
    }
    try {
      const orderItems = {
        UID: decoded?.uid,
        address: primaryAddress,
        paymentMethod: method,
        total,
        items: backendCart,
      };
      await PostOnlineOrder(total, orderItems);
      toast.success("Payment successful! Placing your order...");
      fetchOrders();
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    }
  };

  const handlePlaceOrder = () => {
    
    if (!primaryAddress) {
      toast.error("Please set a delivery address before placing order.");
      return;
    }
    if (paymentMethod === "cod") {
      setShowConfirmModal(true);
    }
  };

  const confirmOrder = async () => {
    if (!primaryAddress) {
      toast.error("Please set a delivery address before confirming.");
      return;
    }
    const orderItems = {
      UID: decoded?.uid,
      paymentMethod: "cod",
      total,
      items: backendCart,
      address: primaryAddress,
    };
    try {
      await postOrder(orderItems);
      toast.success("Order Placed");
      fetchOrders();
      setShowConfirmModal(false);
    } catch (error) {
      toast.error("Failed to place order.");
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-between">
      <Nav2 />
      <div className="mt-[8rem] flex flex-col items-center justify-center">
        <div>
          <p className="text-3xl md:text-5xl font-bold mb-[1rem]">Choose a payment method</p>
          <p className="md:text-xl mb-[3rem]">All transactions are secured and encrypted</p>
        </div>
        {["credit", "UPI", "cod"].map((val) => (
          <div key={val} className="flex justify-between items-center bg-white/10 p-[1rem] w-[80%] md:w-[45%] rounded-md m-[0.5rem] shadow-lg mb-[1rem]">
            <label className="ml-[.5rem] text-xl">
              <input
                type="radio"
                name="paymentMethod"
                value={val}
                className="mr-[.5rem] checkbox rounded-[50%]"
                onChange={handlePayment}
              />
              {val === "credit" && "Credit Card"}
              {val === "UPI" && "UPI / Pay Now"}
              {val === "cod" && "Cash on Delivery"}
            </label>
            <img
              src={val === "credit" ? "images.png" : val === "UPI" ? "Pay.png" : "cod.jpg"}
              alt=""
              className="h-[3rem]"
            />
          </div>
        ))}
        {paymentMethod && (
          <button
            
            className={`${
              !primaryAddress ? "hidden" : "bg-red-400 hover:scale-105"
            } p-[1rem] w-[15rem] m-[1rem] mt-[2rem] rounded-md font-bold shadow-md text-white transition-all duration-500`}
            onClick={
              paymentMethod === "cod"
                ? handlePlaceOrder
                : () => handleOnlinePayment(paymentMethod)
            }
          >
            {paymentMethod === "cod" ? "Place Order" : "Pay Now"}
          </button>
        )}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center shadow-lg">
            <div className="bg-white p-[5rem] rounded shadow-lg text-center">
              <h2 className="text-xl font-bold mb-4 text-gray-500">Confirm Your Order</h2>
              <p className="mb-6 text-gray-500">
                Are you sure you want to place this order with Cash on Delivery?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={confirmOrder}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
                >
                  Yes, Place Order
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Cart />
      <ToastContainer position="top-center" />
      <Footer />
    </div>
  );
}

export default Payment;
