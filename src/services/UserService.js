import axios from "axios";
import { jwtDecode } from "jwt-decode";
const API_BASE = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("authToken");
const decode = token ? jwtDecode(token) : null;
export const fetchUser = async (token) => {
  const res = await axios.get(`${API_BASE}/api/Users/${decode.uid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const fetchAllUser = async (token) => {
  const res = await axios.get(`${API_BASE}/api/Users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
export const updateUser = async (userFormData,) => {
  const res = await axios.put(`${API_BASE}/api/Users/${decode.uid}`,userFormData,{
  header: {
    Authorization : `Bearer ${token}`,
  }
})
return res.data;
};