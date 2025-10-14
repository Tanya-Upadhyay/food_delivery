import { Link } from 'react-router-dom'
import { SiIfood } from "react-icons/si";
import ThemeController from './ThemeController';
import { IoPerson } from "react-icons/io5";
import { useContext, } from 'react';
import { dataContext } from '../context/userContext';
import { IoBag } from "react-icons/io5";
import { jwtDecode } from 'jwt-decode';
function Nav2() {
  let { setShowCart, backendCart } = useContext(dataContext)
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const token = localStorage.getItem("authToken");
  const decode = token ? jwtDecode(token) : null;
  return (
    <div className='fixed bg-base-100 dark:bg-base-200 w-[100vw] sm:w-[100vw] md:w-[100vw] flex justify-between z-50'>
      <div className="navbar border-white shadow-lg">
        <div className="navbar-start flex justify-between">
          <div className="w-[60px] h-[60px] bg-white/10 flex justify-center items-center rounded-md  shadow-lg hover:scale-110  cursor-pointer transition-all duration-500 ml-[1rem] md:ml-[3rem]">
            <Link to="/"><SiIfood className="color-red-400 w-[35px] h-[35px] rounded-md text-red-500" /></Link>
          </div>
        </div>
        <div className="navbar-center lg:flex">
          <ul className="menu menu-horizontal font-semibold md:text-lg ">
            <li><Link to="/">About</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            {decode?.roles == "user" ? (<li><Link to="/chatbox">Chat Box</Link></li>): (null)}
          </ul>
        </div>

        <div className='flex gap-[1rem]  md:ml-[25%] ml-[3%] '>
          <div >
            <ThemeController />
          </div>
          <div
            className="w-[60px] h-[60px] flex justify-center items-center rounded-md  shadow-lg relative hover:scale-110  cursor-pointer transition-all duration-500 bg-white/10 "
            onClick={() => { setShowCart(true) }}>
            <span className="absolute top-0 right-2 font-bold ">{backendCart.length}</span>
            <IoBag className="color-red-400 w-[35px] h-[35px] rounded-md text-red-500 " />
          </div>
          {isLoggedIn ?
            (<Link to="/user">
              <div className="w-[60px] h-[60px] bg-white/10 flex justify-center items-center rounded-md  shadow-lg hover:scale-110  cursor-pointer transition-all duration-500 ">
                <IoPerson className="color-red-400 w-[35px] h-[35px] rounded-md text-red-500" />
              </div>
            </Link>) :
            (<Link to="/login">
              <div className="w-[60px] h-[60px] bg-white/10 flex justify-center items-center rounded-md shadow-lg hover:scale-110 cursor-pointer 
              md:mr-[3rem]transition-all duration-500 ">
                <IoPerson className="color-red-400 w-[35px] h-[35px] rounded-md text-red-500" />
              </div>
            </Link>)}
        </div>
      </div>
    </div>
  )
}

export default Nav2;
