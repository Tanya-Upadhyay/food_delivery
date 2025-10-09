import axios from "axios";

const API_BASE = import.meta.env.VITE_BASE_URL

export const signupUser = async ({ name, email, phoneNumber, password }) => {
  const response = await axios.post(`${API_BASE}/api/register`, {
    name,
    email,
    phoneNumber,
    password,
  });

  return response;
};
