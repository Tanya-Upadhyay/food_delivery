import { useNavigate } from 'react-router-dom';
import Nav2 from './Nav2';
import Footer from './Footer';
import { useContext, useEffect, useState } from 'react';
import Order from './Order';
import { dataContext } from '../context/userContext';
import Address from './Address';
import UserDetails from './UserDetails';
import { ToastContainer } from 'react-toastify';
import Cart from './Cart';
import { fetchUser as getUserDetails } from "../services/UserService";
import { useDispatch } from 'react-redux'; 
import { clearAddresses } from '../redux/addressSlice'; 
import { clearOrders } from '../redux/orderSlice';



function User() {
  
  let { backendOrders, clearOrderData, clearCartData} = useContext(dataContext)
  const token = localStorage.getItem("authToken");
  const [activeSection, setActiveSection] = useState("user")
  const [user, setUser] = useState(null)
  const dispatch = useDispatch();
 
  const fetchUserName = async () => {
    
    try {
      const userDetails = await getUserDetails({token})
      setUser(userDetails);
    } catch (error) {
      console.error("Failed to fetch user" + error)
    }
  }
  useEffect(() => {
    fetchUserName();
  }, []);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  useEffect(() => {
    if (isLoggedIn == "false") {
      navigate('/login')
    }
  }, []);
  const handleLogout = () => {
     dispatch(clearAddresses());
     setUser(null)
     clearOrderData()
     clearCartData()
    localStorage.removeItem("authToken");
    localStorage.setItem('isLoggedIn', false);
   
    navigate("/about");
    return;
  };
  
  const [expandedOrderId, setExpandedOrderId] = useState(false);
  const handleToggleDetails = (orderId) => {
    setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
  }
  return (
    <div className='flex flex-col w-[100vw] h-[100vh] justify-between overflow-x-hidden'>
      <Nav2 />
      <>
        <div className={`w-[28vw] h-[100%] md:w-[20vw] fixed top-22 left-0 bg-tranparent  shadow-lg transition-all duration-500  overflow-y-auto overflow-x-hidden flex flex-col rounded-[.5rem] bg-white/10`}>
          <p className='text-xl text-red-500 ml-7 mt-7'>
            hey <strong>{user?.name}</strong>
          </p>
          <div className='flex flex-col gap-2 text-xl md:ml-10 mt-10 font-bold'>
            <div className='p-[1rem] hover:bg-red-400 hover:text-white transition-all duration-500' onClick={() => setActiveSection("user")} >User Details</div>
            <div className='p-[1rem] hover:bg-red-400 hover:text-white transition-all duration-500 top-10 right-0' onClick={() => setActiveSection("address")}>Manage Address</div>
            <div className='p-[1rem] hover:bg-red-400 hover:text-white transition-all duration-500' onClick={() => setActiveSection("order")}>Order History</div>
            <div onClick={handleLogout} className='p-[1rem] hover:bg-red-400 hover:text-white transition-all duration-500'>Logout</div>
          </div>
        </div>
        {activeSection == "user" &&
          <UserDetails />
        }
        {activeSection == "address" &&
          <Address />
        }
        
        {activeSection == "order" &&
        
          backendOrders.map((item, index) => (
            <Order
              order={item}
              key={index}
              isExpanded={expandedOrderId === item.oid}
              onToggle={() => handleToggleDetails(item.oid)}
            />)
          )}
        <ToastContainer position="top-center" />
      </>
      <Cart />
      <Footer />

    </div>
  );
}
export default User;
