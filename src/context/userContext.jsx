import { createContext, useEffect, useState } from "react"

import { fetchActiveProducts, fetchProducts, fetchTopSellingProducts } from "../services/ProductService";
import { fetchCart as getCartItems } from "../services/cartService";
import { fetchOrder as getOrderItems } from "../services/GetOrderService";

export const dataContext = createContext()
export function UserContext({ children }) {
  let [cate, setCate] = useState([])
  let [input, setInput] = useState("")
  let [showCart, setShowCart] = useState(false)
  const [backendCart, setBackendCart] = useState([])
  const [backendOrders, setBackendOrders] = useState([])
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [allProducts, setAllProducts] = useState([])
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalItems, setTotalItems] = useState(0);
  const [bestSellerIds, setBestSellerIds] = useState([]);

const fetchTopSellerIds = async () => {
  try {
    const data = await fetchTopSellingProducts();
    const ids = data.map(p => p.productId);
    setBestSellerIds(ids);
  } catch (err) {
    console.error("Failed to fetch best seller IDs", err);
  }
};

useEffect(() => {
  fetchTopSellerIds();
}, []);

  const loadProducts = async () => {
    try {
      const response = await fetchActiveProducts({
        page,
        pageSize,
        searchTerm: input,
      });

      setCate(response.items);
      setAllProducts(response.items);
      setTotalItems(response.totalItems);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [input, page, pageSize]);

 
  const fetchCart = async () => {
    try {
      const cartItems = await getCartItems();

      setBackendCart(cartItems);
      
    } catch (error) {
      console.error("Failed to fetch cart items", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [input, page, pageSize]);

 useEffect(() => {
  const token = localStorage.getItem('authToken');
  if (token) {
    fetchCart();
  }
}, [localStorage.getItem('authToken')]);

  const fetchOrders = async () => {
    try {
      const orderItems = await getOrderItems()
      setBackendOrders(orderItems);
      fetchCart()
    } catch (error) {
      console.log("Failed to fetch order items", error)
    }
  }

 useEffect(() => {
  const token = localStorage.getItem('authToken');
  if (token) {
    fetchOrders();
    fetchCart()
  } 
}, [localStorage.getItem('authToken')]); 



  const data = {
    input,
    setInput,
    cate,
    setCate,
    allProducts,
    setAllProducts,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    setTotalItems,
    loadProducts,
    showCart,
    setShowCart,
    backendCart,
    fetchCart,
    showOrderDetails,
    setShowOrderDetails,
    fetchOrders,
    backendOrders,
    setBackendOrders,
    paymentMethod,
    setPaymentMethod,
    bestSellerIds,
  };

  return (
    <div>
      <dataContext.Provider value={data}>
        {children}
      </dataContext.Provider>

    </div>
  )
}

