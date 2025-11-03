import { IoTrash } from "react-icons/io5";
import { RemoveItem } from "../redux/cartSlice";
import { useDispatch } from "react-redux";
import { useContext } from "react";
import { dataContext } from "../context/userContext";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_BASE_URL;

function Card2({ cid, name, price, image, qty, stocks }) {
  const dispatch = useDispatch()

  const { fetchCart } = useContext(dataContext)
  const updateQty = async (newQty) => {
    const token = localStorage.getItem("authToken");
    if (newQty > stocks) {
      toast.error(`Limited Stock`,{id:"unique-toast"});
      return;
    }

    try {
      await axios.put(
        `${API_BASE}/api/cart/${cid}`,
        { quantity: newQty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
      fetchCart();
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/api/cart/${cid}`)
      dispatch(RemoveItem(cid))
      fetchCart()
    } catch (error) {
      console.log("Error cannot remove item from cart", error)
    }
  }
  return (
    <div className='flex justify-between items-center p-[1rem] m-[1rem] w-[100vw] bg-white/10 rounded-lg shadow-lg'>
      <div className="flex justify-center items-center gap-[1rem]">
        <div>
          <img src={`${API_BASE}${image}`} alt="" className='w-[12rem] h-[8rem] rounded-md shadow-lg' />
        </div>
        <div>
          <div className='text-lg font-bold'>
            {name}
          </div>
          <div className='flex justify-center items-center w-[7rem] h-[2.5rem] mt-[.5rem] rounded-lg overflow-hidden border-2 border-red-400 shadow-lg text-red-400'>
            <button
              className='w-[30%] h-full text-xl font-bold flex justify-center items-center bg-white/10 cursor-pointer hover:bg-red-100'
              onClick={() => updateQty(qty - 1)}
              disabled={qty <= 1}
            >-</button>
            <span className='w-[40%] h-full bg-gyay-100 flex justify-center items-center text-red-400 font-semibold'>{qty}</span>
            <button
              className='w-[30%] h-full text-xl font-bold flex justify-center items-center bg-white/10 cursor-pointer hover:bg-red-100'
              onClick={() => { updateQty(qty + 1) }}
              disabled={qty >= stocks}
            >+</button>
          </div>
        </div>
      </div>
      <div className="flex flex-col text-xl text-red-400 absolute right-[3rem] gap-[.2rem]">
        Rs {price}/-
        <IoTrash
          className="h-[2rem] w-[2rem] cursor-pointer"
          onClick={handleDelete} />
      </div>
    </div>
  )
}

export default Card2;
