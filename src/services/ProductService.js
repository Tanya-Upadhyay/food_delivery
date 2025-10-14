import axios from "axios";
const API_BASE = import.meta.env.VITE_BASE_URL;

export const fetchActiveProducts = async ({ page = 1, pageSize = 6, searchTerm = "" }) => {
  const res = await axios.get(`${API_BASE}/api/Products/active`, {
    params: {
      pageNumber: page,
      pageSize,
      searchTerm,
    },
  });
  return res.data;
};

export const fetchProducts = async ({ page = 1, pageSize = 6, token}) => {
  
  const res = await axios.get(`${API_BASE}/api/Products`, {
    params: {
      pageNumber: page,
      pageSize,
    },
    headers:{
      Authorization: `Bearer ${token}`,
    }
  });
  return res.data;
};

export const fetchTopSellingProducts=async(token) =>{
  const res = await axios.get(`${API_BASE}/api/Products/best-seller`,{
    header:{
      Authorization:`Bearer ${token}`
    }
  });
  return res.data; 
}


