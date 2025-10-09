import { LuLeafyGreen } from "react-icons/lu";
import { GiRoastChicken } from "react-icons/gi";
import { AddItem } from "../redux/cartSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useContext } from "react";
import axios from "axios";
import { dataContext } from "../context/userContext";
import { jwtDecode } from "jwt-decode";
function Card({ name, image, id, price, type, stocks }) {
  let dispatch = useDispatch()
  const API_BASE = import.meta.env.VITE_BASE_URL;
  const { fetchCart } = useContext(dataContext)
  const token = localStorage.getItem("authToken");
  const decode = token ? jwtDecode(token) : null;
  const handleAddToCart = async () => {
    const cartItems = {
      UID: decode.uid,
      PID: id,
      Quantity: 1
    };
    try {
      await axios.post(`${API_BASE}/api/cart`, cartItems)
      dispatch(AddItem({ id: id, name: name, price: price, qty: 1, image: image,}))
      toast.success("Item added to cart")
      fetchCart()
    } catch (error) {
      console.log("Error adding to cart", error)
      toast.error("Failed to add item")
    }
  }
  return (
    <div className={`bg-white/10  w-[24rem] flex flex-col justify-center items-center rounded-lg shadow-md hover:shadow-lg hover:scale-110 transition-all duration-500 h-[31rem]`}>
      <div >
        <img src={`${API_BASE}` + image} alt="" className="w-[23rem] h-[17rem] rounded-md" />
      </div>
      <div className="font-semibold m-[1rem] text-3xl ">
        {name}
      </div>
      <div className={`flex gap-[7rem] text-red-500  text-2xl ${stocks==0 ? "mb-[1.5rem]":""}`} >
        Rs {price}/-
        <div className="flex gap-[0.5rem] justify-center items-center">
          {type === "veg" ? <LuLeafyGreen /> : <GiRoastChicken />}
          {type}
        </div>
      </div>
      {stocks<6 ?
      (<div className={`p-[.3rem] ${ stocks == 0 ? "hidden": ""}`}>
        Limited stock! Only {stocks} left.
      </div>):(<div className="p-[1rem]"></div>)
      }
      {stocks>0 ? (<button
        className="bg-red-400 p-[.7rem] w-[90%] m-[1rem] rounded-md font-bold shadow-md text-white hover:scale-105 transition-all duration-500 cursor-pointer"
        onClick={handleAddToCart}
      >Add to Dish</button>):(<div className=" text-center p-[.7rem] w-[90%] m-[1rem] rounded-md font-bold shadow-md text-white bg-gray-300 " >Out of Stock</div>)}
    </div>
  )
}

export default Card
