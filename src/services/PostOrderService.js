import axios from "axios";

const API_BASE = import.meta.env.VITE_BASE_URL;


export const postOrder = async (orderItems) => {
    const token = localStorage.getItem("authToken");
    const res = await axios.post(`${API_BASE}/api/Orders`, orderItems, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};
