import { RxCross2 } from "react-icons/rx"
import Card2 from "../components/Card2"
import { useContext } from "react";
import { dataContext } from "../context/userContext";
import { Link } from "react-router-dom";

function Cart() {
  let { showCart, setShowCart, backendCart } = useContext(dataContext)
  let subtotal = backendCart.reduce((total, item) => total + (item.quantity * item.price), 0)
  let deliverFee = 20;
  let taxes = subtotal * 0.005;
  let total = Math.floor(subtotal + deliverFee + taxes)
  return (
    <div>
      <div className={`w-[100vw] h-[100%] fixed top-0 right-0 bg-base-100 dark:bg-base-200 shadow-lg transition-all duration-500 z-50 ${showCart ? "translate-x-0" : "translate-x-full"} md:w-[40vw] overflow-y-auto overflow-x-hidden`}>
        <header className="flex justify-between text-red-500 text-2xl m-[1rem] items-center p-[1rem] font-semibold">
          <span> Order Items</span>
          <RxCross2 className="h-[2rem] w-[2rem] cursor-pointer"
            onClick={() => { setShowCart(false) }} />
        </header>
        {backendCart.length > 0 ?
          <>
            <div>
              {backendCart.map((item, index) => (
                <Card2
                  cid={item.cid}
                  name={item.productName}
                  price={item.price}
                  image={item.image}
                  qty={item.quantity}
                  key={index}
                  stocks={item.stocks}
                />))}
              
            </div>
            <div >
              <div className="w-[90%] border-t-2 border-b-2  m-[1rem] mt-[2rem] flex flex-col gap-[.5rem] absolute right-2">
                <div className="flex justify-between items-center text-xl font-semibold  mt-[1rem]">
                  <span>Subtotal : </span>
                  <span className="text-red-400">Rs {subtotal}/- </span>
                </div>
                <div className="flex justify-between items-center text-xl font-semibold ">
                  <span>Delivery Fee : </span>
                  <span className="text-red-400">Rs {deliverFee}/-</span>
                </div>
                <div className="flex justify-between items-center text-xl font-semibold mb-[1rem]">
                  <span>Taxes : </span>
                  <span className="text-red-400">Rs {taxes}/-</span>
                </div>
              </div>
              <div className="w-[90%] flex flex-wrap justify-between items-center text-xl font-bold m-[1rem] mt-[11.5rem] absolute right-2">
                <span>Total : </span>
                <span className="text-red-400">Rs {total}/-</span>

              </div>
            </div>
            <Link to="/payment">
              <button className="bg-red-400 p-[.7rem] w-[90%] m-[1rem] ml-[3.2rem] mt-[15rem] rounded-md font-bold shadow-md text-white hover:scale-105 transition-all duration-500 cursor-pointer"
                onClick={() => { setShowCart(false) }}
              >Choose your payment method</button></Link>
          </> :
          (<span className="flex justify-center items-center font-semibold text-2xl mt-[20rem]">Empty Cart.......</span>)}
      </div>
    </div>
  )
}

export default Cart
