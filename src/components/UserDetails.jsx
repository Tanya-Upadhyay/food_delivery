import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { fetchUser as getUsers } from "../services/UserService";

function UserDetails() {
  const API_BASE = import.meta.env.VITE_BASE_URL;
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const token = localStorage.getItem("authToken");
  const decode = token ? jwtDecode(token) : null;

  const handleUserDetailsChange = (e) => {
    setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
  };

  const fetchUser = async () => {
    try {
      const user = await getUsers();
      setUserDetails(user);
      setUserFormData(user);
    } catch (error) {
      console.error("Failed to fetch user");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  
  const handleUserDetailsSave = async () => {
    if (userFormData.phoneNumber.length !== 10) {
      toast.error("Please enter a valid phone number" , {id:"unique-toast"});
      return;
    }

    if (!userFormData.name || !userFormData.email || !userFormData.phoneNumber ) {
            toast.error("All fields are required",{id:"unique-toast"});
            return false;
        }

    try {
      const res = await axios.put(`${API_BASE}/api/Users/${decode.uid}`, userFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setIsEditing(false);
      setUserDetails(res.data);
      fetchUser();
      toast.success("User details updated successfully");
    } catch (error) {
      console.error("Failed to update user", error);
      toast.error("Failed to update user details");
    }
  };

  return (
    <div>
      <ToastContainer position="top-center" />
      <div className="p-5 ml-[36vw] mt-[9rem]">
        <div className='mb-4 items-center'>
          <h2 className='text-xl font-bold'>User Details</h2>
          {isEditing ? (
            <div className='flex flex-col gap-2 mb-4'>
              <input
                name='name'
                maxLength={50}
                onChange={handleUserDetailsChange}
                value={userFormData.name}
                placeholder='Name'
                className='bg-white/10 p-[14px] w-[25rem] rounded-md m-[0.5rem] shadow-lg' 
                required/>
              <input
                name='email'
                maxLength={50}
                onChange={handleUserDetailsChange}
                value={userFormData.email}
                placeholder='Email'
                className='bg-white/10 p-[14px] w-[25rem] rounded-md m-[0.5rem] shadow-lg ' 
                required/>
              <input
                name='phoneNumber'
                type="number"
                min="0"
                onChange={handleUserDetailsChange}
                value={userFormData.phoneNumber}
                placeholder='PhoneNo'
                className='bg-white/10 p-[14px] w-[25rem] rounded-md m-[0.5rem] shadow-lg ' 
                inputMode='numeric'
                required/>
              <button
                onClick={handleUserDetailsSave}
                className="bg-red-400 p-[.7rem] w-[20%] m-[0.5rem] rounded-md font-bold shadow-md text-white hover:bg-red-300 cursor-pointer">
                Save
              </button>
            </div>
          ) : (
            userDetails && (
              <div className='bg-white/10 shadow-md p-4 rounded-[.5rem] w-[90%] md:w-[80%] flex flex-col mt-[2rem] gap-[.7rem] hover:scale-110 transition-all duration-500'>
                <div><strong>Name:  </strong>{userDetails?.name}</div>
                <div><strong>Email:  </strong>{userDetails?.email}</div>
                <div><strong>PhoneNo:  </strong>{userDetails?.phoneNumber}</div>
                <button
                  onClick={() => {
                    setUserFormData(userDetails);
                    setIsEditing(true);
                  }}
                  className='bg-red-400 text-white font-bold mt-4 p-3 w-[22%] rounded-md hover:scale-105 transition-all duration-500'>
                  Edit
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
