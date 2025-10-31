import { LuLeafyGreen } from "react-icons/lu";
import { GiRoastChicken } from "react-icons/gi";
import { AddItem } from "../redux/cartSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useContext } from "react";
import axios from "axios";
import { dataContext } from "../context/userContext";
import { jwtDecode } from "jwt-decode";
import { fetchCart as getCartItems } from "../services/cartService";
function Card({ name, image, id, price, type, stocks, isBestSeller }) {
  let dispatch = useDispatch()
  const API_BASE = import.meta.env.VITE_BASE_URL;
  const { fetchCart } = useContext(dataContext);
  const token = localStorage.getItem("authToken");
  const decode = token ? jwtDecode(token) : null;
  const handleAddToCart = async () => {
  try {
    if (!token) {
      toast.error("Please log in to add items to your cart");
      return;
    }

    const cartItems = {
      UID: decode.uid,
      PID: id,
      Quantity: 1,
    };
    const allItems = await getCartItems();
    const existingItem = allItems.find((item) => item.productName === name);
    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      if (newQuantity > stocks) {
        toast.error(`Limited stock!`);
        return;
      }
    } else if (stocks <= 0) {
      toast.error("This item is out of stock");
      return;
    }
    await axios.post(`${API_BASE}/api/cart`, cartItems);
    dispatch(AddItem({ id, name, price, qty: 1, image }));
    toast.success("Item added to cart",{id:"unique-toast"});
    fetchCart();
  } catch (error) {
    console.error("Error adding to cart:", error);
    toast.error("Something went wrong. Please try again.", {id:"unique-toast"});
  }
};

  return (
    <div className={`bg-white/10  w-[24rem] flex flex-col justify-center items-center rounded-lg shadow-md hover:shadow-lg hover:scale-110 transition-all duration-500 h-[31rem]`}>
      <div >
        <img src={`${API_BASE}` + image} alt="" className="w-[23rem] h-[17rem] rounded-md" />
      </div>
      <div className={`font-semibold  text-3xl ${!isBestSeller ? "m-[1.5rem]" : "m-[.5rem]"}`}>
        {name}
      </div>
      <div className={`flex gap-[7rem] text-red-500 text-2xl ${stocks == 0 ? "mb-[.5rem]" : ""}`} >
        Rs {price}/-
        <div className="flex gap-[0.5rem] justify-center items-center">
          {type === "veg" ? <LuLeafyGreen /> : <GiRoastChicken />}
          {type}
        </div>
      </div>

      <div className="flex gap-[1rem] w-[90%] justify-center items-center">
        {isBestSeller ? (<img src="best-seller-stamp-png.png" alt="" className="h-[4rem] w-[7rem] " />) : (<div className="p-[1rem]"></div>)}

        {stocks < 6 &&
          <div className={`p-[.3rem] ${stocks == 0 ? "hidden" : ""}`}>
            Limited stock! Only {stocks} left.
          </div>
        }
      </div>
      {stocks > 0 ? (<button
        className="bg-red-400 p-[.7rem] w-[90%] rounded-md font-bold shadow-md text-white hover:scale-105 transition-all duration-500 cursor-pointer"
        onClick={handleAddToCart}
      >Add to Dish</button>) : (<div className="text-center p-[.7rem] w-[90%] rounded-md font-bold shadow-md text-white bg-gray-300" >Out of Stock</div>)}
    </div>
  )
}

export default Card


