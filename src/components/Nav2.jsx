import { Link } from 'react-router-dom'
import { SiIfood } from "react-icons/si";
import ThemeController from './ThemeController';
import { IoPerson } from "react-icons/io5";
import { useContext, useEffect, useRef, useState, } from 'react';
import { dataContext } from '../context/userContext';
import { IoBag } from "react-icons/io5";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import * as signalR from '@microsoft/signalr';
function Nav2() {
  let { setShowCart, backendCart } = useContext(dataContext)
  const [unreadCount, setUnreadCount] = useState(0)
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const token = localStorage.getItem("authToken");
  const decode = token ? jwtDecode(token) : null;
  const API_BASE = import.meta.env.VITE_BASE_URL;
  const adminId = "31"

  const connectionRef = useRef(null);

  useEffect(() => {

    const fetchUnreadCount = async () => {
      if (decode?.roles === "user") {
        try {
          const response = await axios.get(`${API_BASE}/api/chat/unread-counts`, {
            params: { senderId: adminId, receiverId: `${decode.uid}` },
            headers: { Authorization: `Bearer ${token}` }
          });

          setUnreadCount(Object.values(response.data)[0] || 0);
        } catch (error) {
          console.error("Error fetching unread chat count", error);
        }
      }
    };
    fetchUnreadCount();


    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE}/chatHub`, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .build();

    newConnection.start()
      .then(() => {

        return newConnection.invoke('Join', decode.uid);
      })
      .then(() => {

        newConnection.on('ReceiveMessage', (from, message, timestamp) => {

          if (from === adminId) {
            setUnreadCount(prev => prev + 1);
          }
        });
      })
      .catch(e => console.error('SignalR Connection Error:', e));

    connectionRef.current = newConnection;

    return () => {
      newConnection.stop();
    };
  }, []);
  
  const handleMarkAsRead = async () => {
    try {
      await axios.post(`${API_BASE}/api/chat/mark-as-read`, adminId,{
        params: {
          senderId: adminId,
          receiverId: `${decode?.uid}`
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUnreadCount(prev => ({
                                ...prev,
                                [`${decode?.uid}`]: 0
                            }));
    } catch (error) {
      console.error("Failed to mark messages as read", error);
    }
  };

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
            {decode?.roles === "user" && (
              <li>
                <Link to="/chatbox">
                  <div onClick={handleMarkAsRead} className="relative inline-block">
                    Support
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            )}

          </ul>
        </div>

        <div className={`flex gap-[1rem] ${decode?.roles ==="user" ? "md:ml-[20%]" : "md:ml-[26%]" }  ml-[3%] `}>
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
