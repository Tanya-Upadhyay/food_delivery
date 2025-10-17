import axios from "axios";
import { jwtDecode } from "jwt-decode";
const API_BASE = import.meta.env.VITE_BASE_URL;

export const fetchCart = async () => {
  const token = localStorage.getItem("authToken");
  const decode = token ? jwtDecode(token) : null;
  const res = await axios.get(`${API_BASE}/api/Cart/${decode.uid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(res.data)
  return res.data;
};
