import axios from "axios";
const API_BASE = import.meta.env.VITE_BASE_URL;
export const postLogin = async (email, password) => {
  const token = localStorage.getItem("authToken");
  const res = await axios.post(`${API_BASE}/api/login`, {
    email,
    password,
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};
