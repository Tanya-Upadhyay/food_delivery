import { IoMdSearch } from "react-icons/io"
import Categories from "../Category"
import Card from "../components/Card"
import { dataContext } from "../context/userContext"
import { useContext, useState } from "react"
import { ToastContainer } from "react-toastify"
import Footer from "../components/Footer"
import Nav2 from "../components/Nav2"
import Cart from "../components/Cart"
function Home() {
  
  const {
    cate = [],
    setInput,
    input,
    page,
    setPage,
    pageSize,
    totalItems,
    bestSellerIds
  } = useContext(dataContext);
   const [selectedCategory, setSelectedCategory] = useState("All");
  function filter(category) {
    setInput(category === "All" ? "" : category);
    setPage(1);
    setSelectedCategory(category);
  }
  return (
    <>
      <div className="w-full min-h-screen overflow-hidden">
        <Nav2 />
        <form
          className=" mt-[6rem] flex items-center p-[14px] w-[62%] gap-[1rem] rounded-md m-[1rem] ml-[4rem] sm:ml-[10rem] md:ml-[25rem] shadow-lg hover:scale-102 transtition-all duration-500  bg-white/10 mb-[4rem]"
          onSubmit={(e) => e.preventDefault()}>
          <IoMdSearch className="w-[35px] h-[30px] rounded-md text-red-500" />
          <input
            type="text"
            placeholder="Search Items..."
            className="w-[100%] outline-none font-semibold p-[0.5rem]"
            onChange={(e) => {
              setInput(e.target.value);
              setPage(1);
              
            }}
            
          />
        </form>
        <div className="flex gap-[2.5rem] justify-center items-center m-[3rem] sm:flex-wrap gap-[1rem] ">
          {Categories.map((item, index) => {
            const isActive = selectedCategory === item.name;
            return <div className={`bg-white/10  w-[10rem] h-[8rem] flex flex-col justify-center items-center gap-[1rem] rounded-lg shadow-lg  hover:bg-white/10 cursor-pointer transition-all duration-500 font-bold sm: w-[5rem] h-[4rem]
               ${
                    isActive
                       ? "bg-red-500 text-red-400 scale-110" 
                       : "bg-white/10 hover:bg-white/20 "
                  }`}
              key={index}
              onClick={() => filter(item.name)}>
              {item.image}
              {item.name}
            </div>
          })}
        </div>
        <div className={`flex flex-wrap gap-[3rem] justify-center items-center m-[1rem]`}>
          {cate.length > 0 ?
            (cate.slice()
              .map((item, index) => (
                <Card
                  name={item.productName}
                  key={index}
                  image={item.image}
                  price={item.price}
                  id={item.pid}
                  type={item.type}
                  stocks={item.stocks}
                  isBestSeller={bestSellerIds.includes(item.pid)}
                />
              ))) : (<div className="flex flex-col justify-center items-center mt-[19rem] gap-[.7rem] text-2xl font-semibold text-gray-500">
                <div>We are sorry:(</div>
                <div>No Dish Found!</div>
              </div>)}


        </div>
        <Cart />
        <div className="flex flex-col justify-center items-center gap-4 my-8">
          <div className="flex gap-[1rem] justify-center items-center">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="font-semibold">Page {page}</span>
            <button
              onClick={() =>
                setPage((prev) =>
                  prev * pageSize < totalItems ? prev + 1 : prev
                )
              }
              disabled={page * pageSize >= totalItems}
              className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div>
            <p className="text-center mt-2">
              Showing {cate?.length || 0} of {totalItems} results
            </p>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer position="top-center" />
    </>
  )
}
export default Home;


