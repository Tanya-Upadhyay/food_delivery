import { useState } from "react";
import Nav2 from "./Nav2";
import AddProducts from "./AddProducts";
import UpdateOrderStatus from "./UpdateOrderStatus";
import { ToastContainer } from "react-toastify";
import Footer from "./Footer";
import Cart from "./Cart";
import UserRole from "./UserRole";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
function AdminPanel() {
  const [activeSection, setActiveSection] = useState("updateUserRole")
  const token = localStorage.getItem("authToken");
  const decode = token ? jwtDecode(token) : null;
   const navigate = useNavigate()
 
  return (
    <>
      {decode.roles == "admin" ?
        (<div className="overflow-hidden min-h-screen flex flex-col justify-between">
          <Nav2 />
          <div>
            <div className={`w-[45vh] h-[100%] fixed top-21 left-0 bg-tranparent  shadow-lg transition-all duration-500  overflow-y-auto overflow-x-hidden flex flex-col rounded-[.5rem] bg-white/10`}>
              <p className='text-2xl text-red-500 ml-[6rem] mt-7'>
                <strong>Admin Master</strong>
              </p>
              <div className='flex flex-col gap-2 text-xl ml-10 mt-10 font-bold'>
                <div className='p-[1rem] hover:bg-red-400 hover:text-white transition-all duration-500 top-10 right-0' onClick={() => setActiveSection("updateUserRole")}>Update User Role</div>
                <div className='p-[1rem] hover:bg-red-400 hover:text-white transition-all duration-500 top-10 right-0' onClick={() => setActiveSection("updateOrderStatus")}>Update Order Status</div>
                <div className='p-[1rem] hover:bg-red-400 hover:text-white transition-all duration-500' onClick={() => setActiveSection("addProducts")} >Add Products</div>
                <div className='p-[1rem] hover:bg-red-400 hover:text-white transition-all duration-500' onClick={() => navigate("/chatdashboard")} >Chat Dashboard</div>
              </div>
            </div>
            {activeSection == "updateUserRole" &&
              <UserRole />}
            {activeSection == "updateOrderStatus" &&
              <UpdateOrderStatus />}
            {activeSection == "addProducts" &&
              <AddProducts />}
              {activeSection == "addProducts" &&
              <AddProducts />}

            <ToastContainer position="top-center" />
            <Cart />
          </div>
          <Footer className="flex-end" />
        </div>) : (navigate("/about"))}
    </>
  )
}

export default AdminPanel;
