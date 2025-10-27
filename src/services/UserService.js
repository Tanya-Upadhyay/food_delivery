import axios from "axios";
import { jwtDecode } from "jwt-decode";
const API_BASE = import.meta.env.VITE_BASE_URL;
//

export const fetchUser = async () => {
   const token = localStorage.getItem("authToken");
  const decode = token ? jwtDecode(token) : null;
  const res = await axios.get(`${API_BASE}/api/Users/${decode.uid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    
  });
  return res.data;
};

export const fetchAllUser = async ({ page = 1, pageSize = 6, token}) => {
  
  
  const res = await axios.get(`${API_BASE}/api/Users`, {
    params: {
      pageNumber: page,
      pageSize,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
// export const updateUser = async (userFormData,) => {
//   const token = localStorage.getItem("authToken");
//   const decode = token ? jwtDecode(token) : null;
//   const res = await axios.put(`${API_BASE}/api/Users/${decode.uid}`,userFormData,{
//   headers: {
//     Authorization : `Bearer ${token}`,
//   }
// })
// return res.data;
// };