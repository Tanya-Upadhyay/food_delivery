import axios from "axios";
const API_BASE = import.meta.env.VITE_BASE_URL;
export const postLogin = async (email, password) => {
  const res = await axios.post(`${API_BASE}/api/login`, {
    email,
    password,
  });
  return res.data;
};
