import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("authToken");
const decode = token ? jwtDecode(token) : null;
export const fetchAddresses = async (token) => {
  const response = await axios.get(`${API_BASE}/api/Addresses/${decode.uid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const createAddress = async (addressData, token) => {
  const response = await axios.post(`${API_BASE}/api/Addresses`, addressData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const updateAddress = async (addressId, updatedData, token) => {
  const response = await axios.put(`${API_BASE}/api/Addresses/${addressId}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const deleteAddress = async (addressId, token) => {
  const response = await axios.delete(`${API_BASE}/api/Addresses/${addressId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
