import { RxCross2 } from "react-icons/rx";
import { LuPlus } from "react-icons/lu";
import { FaEdit } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchProducts } from "../services/ProductService";
import { jwtDecode } from "jwt-decode";
function AddProducts() {
    const API_BASE = import.meta.env.VITE_BASE_URL;
    const token = localStorage.getItem("authToken");

    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [cate, setCate] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize,] = useState(8);
    const [formData, setFormData] = useState({
        productName: "",
        category: "",
        price: "",
        type: "",
        image: "",
        stocks: 0,
        productStatus: "",
    });

    const loadProducts = async () => {
        try {
            const response = await fetchProducts({
                page,
                pageSize,
                token
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
    }, [page, pageSize]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = new FormData();
        productData.append("productName", formData.productName);
        productData.append("category", formData.category);
        productData.append("price", formData.price);
        productData.append("type", formData.type);
        productData.append("stock", formData.stocks);
        productData.append("productStatus", formData.productStatus,)
        productData.append("ImageFile", formData.image);

        try {
            let res;
            if (isEditing) {
                res = await axios.put(`${API_BASE}/api/products/${editingId}`, productData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                toast.success("Product Updated Successfully", {id:"unique-toast"});
            } else {
                res = await axios.post(`${API_BASE}/api/products`, productData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success("Product Added Successfully",{id:"unique-toast"});
            }
            await loadProducts()
            setFormData({ productName: "", category: "", price: "", type: "", image: "", stocks: 0, productStatus: "" });
            setShowForm(false);
            setIsEditing(false);
            setEditingId(null);
        } catch (err) {
            console.error("Error submitting form:", err);
        }
    };
    const handleEdit = (product) => {
        setFormData({
            productName: product.productName,
            category: product.category,
            price: product.price,
            type: product.type,
            image: product.image,
            stocks: product.stocks,
            productStatus: product.productStatus
        });
        setEditingId(product.pid);
        setIsEditing(true);
        setShowForm(true);
    };

    return (
        <div className="p-5 ml-[22rem] md:ml-[30rem] mt-[6rem]">
            <div className="flex gap-[1rem] mb-4 justify-center items-center">
                <h2 className="text-xl font-bold">Add Products</h2>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setIsEditing(false);
                        setFormData({ productName: "", category: "", price: "", type: "", image: "", stocks: 0, productStatus: "" });
                    }}
                    className="bg-red-400 text-white h-[2rem] w-[2rem] text-2xl rounded-full flex justify-center items-center"
                >
                    {showForm ? <RxCross2 /> : <LuPlus />}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap justify-center items-center">

                    <input
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        placeholder="Product Name"
                        className="bg-white/10 p-[14px] w-[25rem] rounded-md m-[0.5rem] shadow-lg"
                        required
                    />
                    <select name="category" onChange={handleChange} value={formData.category} className='bg-white/10 p-[14px] w-[25rem] rounded-md m-[0.5rem] shadow-lg '>
                        <option value="Choose Product Category"
                            className='bg-base-100 dark:bg-base-200 '>Choose Product Category</option>
                        <option value="breakfast"
                            className='bg-base-100 dark:bg-base-200 '>breakfast</option>
                        <option value="pasta"
                            className='bg-base-100 dark:bg-base-200 '>pasta</option>
                        <option value="soup"
                            className='bg-base-100 dark:bg-base-200 '>soup</option>
                        <option value="pasta"
                            className='bg-base-100 dark:bg-base-200 '>main_course</option>
                        <option value="pizza"
                            className='bg-base-100 dark:bg-base-200 '>pizza</option>
                        <option value="burger"
                            className='bg-base-100 dark:bg-base-200 '>burger</option>
                    </select>
                    <select name="type" onChange={handleChange} value={formData.type} className='bg-white/10 p-[14px] w-[25rem] rounded-md shadow-lg '>
                        <option value="Choose Product Type"
                            className='bg-base-100 dark:bg-base-200 '>Choose Product Type</option>
                        <option value="veg"
                            className='bg-base-100 dark:bg-base-200 '>veg</option>
                        <option value="non_veg"
                            className='bg-base-100 dark:bg-base-200 '>non_veg</option>
                    </select>
                    <input
                        name="price"
                        type="number"
                        min = "0"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Product Price"
                        className="bg-white/10 p-[14px] w-[25rem] rounded-md m-[0.5rem] shadow-lg"
                        required />
                    <input
                        name="stocks"
                        type="number"
                        min = "0"
                        value={formData.stocks}
                        onChange={handleChange}
                        placeholder="Stock"
                        className="bg-white/10 p-[14px] w-[25rem] rounded-md m-[0.5rem] shadow-lg"
                        required />

                    <select name="productStatus" onChange={handleChange} value={formData.productStatus} className='bg-white/10 p-[14px] w-[25rem] rounded-md  shadow-lg '>
                        <option value=""
                            className='bg-base-100 dark:bg-base-200 '>Product Status</option>
                        <option value="active"
                            className='bg-base-100 dark:bg-base-200 '>active</option>
                        <option value="inactive"
                            className='bg-base-100 dark:bg-base-200 '>inactive</option>
                    </select>
                    <input
                        name="image"
                        type="file"
                        onChange={handleChange}
                        className="bg-white/10 p-[14px] w-[25rem] rounded-md m-[0.5rem] shadow-lg"
                        accept="image/*"
                        required={!isEditing} />
                    <button
                        type="submit"
                        className='bg-red-400 text-white font-bold  p-[14px] w-[24.5rem] m-[0.5rem] rounded-md hover:bg-red-300'>
                        {isEditing ? "Update Product" : "Add Product"}
                    </button>
                </form>
            )}
            <div className="flex flex-col justify-center items-center">
                <table className="border-separate w-[80%] mt-[1rem]">
                    <thead>
                        <tr>
                            <th className="rounded-tl-lg rounded-bl-lg border border-gray-400 px-2 py-2">Image</th>
                            <th className="border border-gray-400 px-4 py-2">Name</th>
                            <th className="border border-gray-400 px-4 py-2">Category</th>
                            <th className="border border-gray-400 px-4 py-2">Type</th>
                            <th className="border border-gray-400 px-4 py-2">Stocks</th>
                            <th className="border border-gray-400 px-4 py-2">Product Status</th>
                            <th className="border border-gray-400 px-4 py-2">Price</th>
                            <th className="rounded-tr-lg rounded-br-lg border border-gray-400 px-4 py-2">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allProducts.map(product => (
                            <tr key={product.pid} className="h-[4.5rem]">
                                <td className="rounded-bl-lg rounded-tl-lg border border-gray-400 px-2 py-1 flex justify-center items-center">
                                    <img src={`${API_BASE}/${product.image}`} className="w-[6rem] h-[3.9rem] rounded-md" />
                                </td>
                                <td className=" border border-gray-400 px-4 py-1 text-center">{product.productName}</td>
                                <td className="border border-gray-400 px-4 py-1 text-center">{product.category}</td>
                                <td className="border border-gray-400 px-4 py-1 text-center">{product.type}</td>
                                <td className="border border-gray-400 px-4 py-1 text-center">{product.stocks}</td>
                                <td className="border border-gray-400 px-4 py-1 text-center">{product.productStatus}</td>
                                <td className="border border-gray-400 px-4 py-1 text-center">₹{product.price}/-</td>
                                <td className="rounded-tr-lg rounded-br-lg border border-gray-400 px-4 py-1 text-center">
                                    <button onClick={() => handleEdit(product)}>
                                        <FaEdit className="w-[1.5rem] h-[1.5rem] text-red-500" />
                                    </button>
                                </td>
                            </tr>
                        ))}
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
                            Showing {cate?.length || 0} of {totalItems} results
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProducts;
