import axios from "axios";

const API_BASE = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("authToken");

export const postOrder = async (orderItems) => {
    const res = await axios.post(`${API_BASE}/api/Orders`, orderItems, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};
