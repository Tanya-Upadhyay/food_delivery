import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { fetchAllOrders } from "../services/GetOrderService";
import axios from "axios";

function UpdateOrderStatus() {
  const [allOrders, setAllOrders] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [selectedStatus, setSelectedStatus] = useState(null);
  const API_BASE = import.meta.env.VITE_BASE_URL;

  const orders = async () => {
    try {
      const res = await fetchAllOrders();
      setAllOrders(res);
    } catch (error) {
      console.error("Failed to fetch all orders", error);
    }
  };

  useEffect(() => {
    orders();
  }, []);

  const handleSaveStatus = async (orderId) => {
    try {
      await axios.put(
        `${API_BASE}/api/OrderTrackers/${orderId}/${statusUpdates[orderId]}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await orders();
      
      setEditingOrderId(null);
      setStatusUpdates((prev) => {
        const updated = { ...prev };
        delete updated[orderId];
        return updated;
      });
    } catch (error) {
      console.error("Failed to update Order Status", error.response?.data || error);
    }
  };

  const handleEditClick = (orderId) => {
    setEditingOrderId(orderId);
    setStatusUpdates((prev) => ({
      ...prev,
      [orderId]: "",
    }));
  };


  const statusOrder = ["Order Placed", "Packed", "Out For Delivery", "Delivered"];

  const uniqueStatuses = statusOrder.filter(status =>
    allOrders.some(order => order.status[order.status.length - 1] === status)
  );


  const filteredOrders = selectedStatus
    ? allOrders.filter(
      (order) => order.status[order.status.length - 1] === selectedStatus
    )
    : [];

  const statusTransitions = {
    "Order Placed": ["Packed"],
    "Packed": ["Out For Delivery"],
    "Out For Delivery": ["Delivered"],
    "Delivered": [],
  };

  return (
    <div className="p-5 mt-[6rem] ml-[15rem]">
      <h2 className="text-2xl font-bold text-center mb-6">Manage Order Status</h2>
      <div className="flex flex-wrap justify-center gap-10 mb-10 mt-10">
        {uniqueStatuses.map((status, index) => (
          <div
            key={index}
            onClick={() => setSelectedStatus(status)}
            className={`cursor-pointer p-6 w-60 h-30 flex flex-col gap-[1rem] justify-center items-center rounded-lg shadow-md transition-transform hover:scale-110 ${selectedStatus === status
              ? "bg-blue-200 border-blue-500"
              : "bg-gray-200 hover:bg-red-200"
              }`}
          >
            <h3 className="text-lg font-bold text-black">{status}</h3>
            <p className="text-gray-500 font-semibold">
              {
                allOrders.filter(
                  (order) => order.status[order.status.length - 1] === status
                ).length
              }{" "}
              order(s)
            </p>
          </div>
        ))}
      </div>
      {selectedStatus && (
        <div className=" flex flex-col justify-center items-center ">
          <h3 className="text-xl font-bold mb-4">
            Order status: {selectedStatus}
          </h3>
          <table className=" border-separate w-[65%]">
            <thead>
              <tr>
                <th className="rounded-tl-lg rounded-bl-lg border border-gray-400 px-4 py-2">Order ID</th>
                <th className="border border-gray-400 px-4 py-2">Order Date</th>
                <th className="border border-gray-400 px-4 py-2">Status</th>
                <th className="rounded-tr-lg rounded-br-lg border border-gray-400 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((item) => {
                const currentStatus = item.status[item.status.length - 1];
                const isDelivered = currentStatus === "Delivered";
                const nextOptions = statusTransitions[currentStatus] || [];

                return (
                  <tr key={item.oid} className="h-[5rem]">
                    <td className="rounded-tl-lg rounded-bl-lg border border-gray-400 px-4 py-2 text-center">{item.oid}</td>
                    <td className="border border-gray-400 px-4 py-2 text-center">{item.orderdate}</td>
                    <td className="border border-gray-400 px-4 py-2 text-center">
                      {editingOrderId === item.oid ? (
                        <select
                          name="status"
                          value={statusUpdates[item.oid] || ""}
                          onChange={(e) =>
                            setStatusUpdates((prev) => ({
                              ...prev,
                              [item.oid]: e.target.value,
                            }))
                          }
                          className="bg-base-100 dark:bg-base-200 p-[4px] rounded-md"
                        >
                          <option value="">Select status</option>
                          {nextOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        currentStatus
                      )}
                    </td>
                    <td className="rounded-tr-lg rounded-br-lg border border-gray-400 px-4 py-2 text-center">
                      {isDelivered ? (
                        <span className="text-gray-400 italic">No further updates</span>
                      ) : editingOrderId === item.oid ? (
                        <button
                          onClick={() => handleSaveStatus(item.oid)}
                          className="p-2 w-[5rem] bg-red-400 rounded-md text-white hover:bg-red-500"
                        >
                          Save
                        </button>
                      ) : (
                        <button onClick={() => handleEditClick(item.oid)}>
                          <FaEdit className="w-[1.5rem] h-[2rem] text-red-500" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UpdateOrderStatus;

