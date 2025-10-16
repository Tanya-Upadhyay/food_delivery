import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { fetchAllUser } from "../services/UserService";

function UserRole() {
  const token = localStorage.getItem("authToken");
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedRole, setEditedRole] = useState("");
  const API_BASE = import.meta.env.VITE_BASE_URL;
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize,] = useState(5);

  // const loadProducts = async () => {
  //         try {
  //             const response = await fetchProducts({
  //                 page,
  //                 pageSize,
  //                 token
  //             });

  //             setCate(response.items);
  //             setAllProducts(response.items);
  //             setTotalItems(response.totalItems);
  //         } catch (err) {
  //             console.error("Failed to fetch products", err);
  //         }
  //     };
  //     useEffect(() => {
  //         loadProducts();
  //     }, [page, pageSize]);
  const loadUsers = async () => {
    try {
      const response = await fetchAllUser({
        page,
        pageSize,
        token
      });

      setUsers(response.items);
      setTotalItems(response.totalItems);
    } catch (err) {
      console.error('Failed to fetch products', err)
    }
  };
  useEffect(() => {
    loadUsers();

  }, [page, pageSize])


  const handleEditClick = (user) => {
    setEditingUserId(user.email);
    setEditedRole(user.roles || "");
  };

  const handleSaveClick = async (email) => {
    const user = users.find((u) => u.email === email);
    if (!user) {
      console.error("User not found");
      return;
    }
    try {
      await axios.put(`${API_BASE}/api/Users/${email}/roles`, {
        email: user.email,
        roles: editedRole,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.email === email ? { ...user, roles: editedRole } : user
        )
      );

      console.log(`Updated Role ${editedRole}`);
      setEditingUserId(null);
      setEditedRole("");
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  return (
    <div className="mt-[10rem] ml-[40rem] w-[60%] flex flex-col justify-between items-center">
      <h1 className="text-xl font-bold mb-[2rem]">Manage Role</h1>
      <table className="border-separate w-full ">
        <thead>
          <tr>
            <th className="rounded-tl-lg rounded-bl-lg border border-gray-400 px-2 py-2">UID</th>
            <th className="border border-gray-400 px-2 py-2">Name</th>
            <th className="border border-gray-400 px-4 py-2">Email</th>
            <th className="border border-gray-400 px-4 py-2">Phone Number</th>
            <th className="border border-gray-400 px-4 py-2">Role</th>
            <th className="rounded-tr-lg rounded-br-lg border border-gray-400 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {[...users]
            .sort((a, b) => (b.roles === "admin") - (a.roles === "admin"))
            .map((user) => {
              const isEditing = editingUserId === user.email;
              return (
                <tr key={user.email} className="h-[5rem]">
                  <td className="rounded-tl-lg rounded-bl-lg border border-gray-400 px-4 py-2 text-center">{user.uid}</td>
                  <td className="border border-gray-400 px-4 py-2 text-center">{user.name}</td>
                  <td className="border border-gray-400 px-4 py-2 text-center">{user.email}</td>
                  <td className="border border-gray-400 px-4 py-2 text-center">{user.phoneNumber}</td>
                  <td className="border border-gray-400 px-4 py-2 text-center">
                    <select
                      value={isEditing ? editedRole : user.roles || ""}
                      disabled={!isEditing}
                      onChange={(e) => setEditedRole(e.target.value)}
                      className={`bg-base-100 dark:bg-base-200 p-[4px] rounded-md ${isEditing ? "border border-blue-500" : "text-gray-500"
                        }`}
                    >
                      <option value="">Assign Role</option>
                      <option value="admin">admin</option>
                      <option value="user">user</option>
                    </select>
                  </td>
                  <td className="rounded-tr-lg rounded-br-lg border border-gray-400 px-4 py-2 text-center">
                    {isEditing ? (
                      <button
                        onClick={() => handleSaveClick(user.email)}
                        className="p-2 w-[5rem] bg-red-400 rounded-md">
                        Save
                      </button>
                    ) : (
                      <button onClick={() => handleEditClick(user)}>
                        <FaEdit className="w-[1.5rem] h-[2rem] text-red-500 hover:scale-110 transition-transform" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="flex flex-col justify-center items-center gap-4 my-8 mt-[5rem]">
        <div className="flex gap-[1rem] justify-center items-center">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50 ">
            Prev
          </button>
          <span className="font-semibold">Page {page}</span>
          <button
            onClick={() =>
              setPage((prev) =>
                prev * pageSize < totalItems ? prev + 1 : prev
              )}
            disabled={page * pageSize >= totalItems}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50">
            Next
          </button>
        </div>
        <div>
          <p className="text-center mt-2">
            Showing {users?.length || 0} of {totalItems} results
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserRole;
