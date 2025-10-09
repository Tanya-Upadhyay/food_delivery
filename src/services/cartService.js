import axios from "axios";
import { jwtDecode } from "jwt-decode";
const API_BASE = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("authToken");
const decode = token ? jwtDecode(token) : null;
export const fetchCart = async () => {
  const res = await axios.get(`${API_BASE}/api/Cart/${decode.uid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
