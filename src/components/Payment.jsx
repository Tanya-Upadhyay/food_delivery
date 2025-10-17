import { toast, ToastContainer } from "react-toastify"
import Footer from "./Footer"
import Nav2 from "./Nav2"
import axios from "axios";
import { useContext, useState } from "react";
import { dataContext } from "../context/userContext";
import Cart from "./Cart";
import { jwtDecode } from "jwt-decode";
import { postOrder } from "../services/PostOrderService";


function Payment({ oid }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    let { fetchOrders, paymentMethod, setPaymentMethod } = useContext(dataContext)

    const handlePayment = (e) => {
        const value = e.target.value;
        if (value == "credit" || value == "paypal") {
            toast.error("Sorry for your inconvenience. This payment method is currently not available.")
        }
    }
    const token = localStorage.getItem("authToken");
    const decode = token ? jwtDecode(token) : null;



    const handlePlaceOrder = () => {
        if (paymentMethod === "cod") {
            setShowConfirmModal(true);
        } else {
            toast.error("Please choose a valid payment method");
        }
    };
    const confirmOrder = async () => {
        const orderItems = {
            UID: decode.uid,
            OID: oid,
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
        <div className=" w-[100vw] h-[100vh] flex flex-col justify-between">
            <Nav2 />

            <div className="mt-[8rem] flex flex-col items-center justify-center mt-[3rem]">
                <div>
                    <p className="text-3xl md:text-5xl font-bold mb-[1rem]">Choose a payment method</p>
                    <p className="md:text-xl mb-[3rem]">All transactions are secured and encrypted</p>
                </div>

                <div className='flex justify-between items-center bg-white/10 p-[1rem] w-[80%] md:w-[45%] rounded-md m-[0.5rem] shadow-lg mb-[1rem]'>
                    <label className='ml-[.5rem] text-xl'>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="credit"
                            className='mr-[.5rem] checkbox rounded-[50%]'
                            onChange={(e) => {
                                setPaymentMethod(e.target.value);
                                handlePayment(e);
                            }}
                        />Credit Card
                    </label>
                    <img src="images.png" alt="" className="h-[3rem]" />
                </div>


                <div className='flex justify-between items-center bg-white/10 p-[1rem] w-[80%] md:w-[45%] rounded-md m-[0.5rem] shadow-lg mb-[1rem] '>
                    <label className='ml-[.5rem] text-xl'>
                        <input
                            type="radio"
                            value="paypal"
                            name="paymentMethod"
                            className='mr-[.5rem] checkbox rounded-[50%]'
                            onChange={(e) => {
                                setPaymentMethod(e.target.value);
                                handlePayment(e);
                            }}
                        />PayPal
                    </label>
                    <img src="Pay.png" alt="" className="h-[3rem]" />
                </div>
                <div className='flex justify-between items-center bg-white/10 p-[1rem] w-[80%] md:w-[45%] rounded-md m-[0.5rem] shadow-lg mb-[1rem]'>
                    <label className='ml-[.5rem] text-xl'>
                        <input
                            type="radio"
                            value="cod"
                            name="paymentMethod"
                            className='mr-[.5rem] checkbox rounded-[50%]'
                            onChange={(e) => {
                                setPaymentMethod(e.target.value);
                                handlePayment(e);
                            }}
                        />Cash on delivery
                    </label>
                    <img src="cod.jpg" alt="" className="h-[3rem]" />
                </div>
                <button className="bg-red-400 p-[1rem] w-[15rem] m-[1rem] ml-[3.2rem] mt-[2rem] rounded-md font-bold shadow-md text-white hover:scale-105 transition-all duration-500 cursor-pointer"
                    onClick={handlePlaceOrder}
                >Place Order</button>
            </div>
            {showConfirmModal && (
                <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center shadow-lg">
                    <div className="bg-white p-[5rem] rounded shadow-lg text-center">
                        <h2 className="text-xl font-bold mb-4 text-gray-500">Confirm Your Order</h2>
                        <p className="mb-6 text-gray-500">Are you sure you want to place this order with Cash on Delivery?</p>
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

            <Cart />
            <ToastContainer position="top-center" />
            <Footer />
        </div>
    )
}
export default Payment
