import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoTrash } from 'react-icons/io5';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RxCross2 } from "react-icons/rx";
import { LuPlus } from "react-icons/lu";
import { jwtDecode } from 'jwt-decode';

function Address() {
    const API_BASE = import.meta.env.VITE_BASE_URL;
    const token = localStorage.getItem("authToken");
    const decode = token ? jwtDecode(token) : null;

    const [addresses, setAddresses] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressFormData, setAddressFormData] = useState({
        uid: decode?.uid,
        addressType: "",
        userName: "",
        houseNo: "",
        colony: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
        phoneNumber: "",
        landmark: "",
        isPrimary: false,
    });

    const handleAddressChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddressFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const fetchAddresses = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/Addresses/${decode?.uid}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setAddresses(
                (Array.isArray(res.data) ? res.data : [res.data]).sort((a, b) => (b.isPrimary === true) - (a.isPrimary === true))
            );

        } catch (error) {
            console.error('Failed to fetch addresses:', error);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const validateForm = () => {
        const { addressType, userName, houseNo, colony, area, city, state, pincode, phoneNumber, landmark } = addressFormData;

        if (!addressType || !userName || !houseNo || !colony || !area || !city || !state || !pincode || !phoneNumber || !landmark) {
            toast.error("All fields are required",{id:"unique-toast"});
            return false;
        }

        if (phoneNumber.length !== 10) {
            toast.error("Please enter a valid Phone Number",{id:"unique-toast"});
            return false;
        }

        if (pincode.length !== 6) {
            toast.error("Please enter a valid pincode",{id:"unique-toast"});
            return false;
        }

        return true;
    }

    const handleAddressSave = async () => {
        if (!validateForm()) return;

        try {
            const method = addressFormData.aid ? 'put' : 'post';
            const url = addressFormData.aid
                ? `${API_BASE}/api/Addresses/edit/${addressFormData.aid}`
                : `${API_BASE}/api/Addresses/`;

            const res = await axios({
                method,
                url,
                data: addressFormData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success(addressFormData.aid ? "Address updated successfully" : "Address added successfully", {id:"unique-toast"});
            setAddressFormData({
                uid: decode?.uid,
                addressType: "",
                userName: "",
                houseNo: "",
                colony: "",
                area: "",
                city: "",
                state: "",
                pincode: "",
                phoneNumber: "",
                landmark: "",
                isPrimary: false,
            });

            setShowAddressForm(false);
            fetchAddresses();
        } catch (error) {
            console.error('Failed to save address:', error);
            toast.error(error.response?.data?.message || 'Failed to save address', {id:"unique-toast"});
        }
    };


    const deleteAddress = async (aidToDelete) => {
        try {
            await axios.delete(`${API_BASE}/api/Addresses/${aidToDelete}`, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            });
            fetchAddresses();
        } catch (error) {
            console.log("Error in removing address", error);
        }
    }

    const handlePrimaryCheckboxChange = async (aidToSet) => {
        try {
            await axios.put(`${API_BASE}/api/Addresses/${aidToSet}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Your address is set as primary",{id:"unique-toast"});
            fetchAddresses();
        } catch (error) {
            console.error('Failed to set address as primary:', error);
            toast.error("Failed to set address as primary");
        }
    };

   

    return (
        <div className="p-5 ml-[13rem] md:ml-[30rem] mt-[6rem]">
            <ToastContainer position="top-center" />
            <div className='flex gap-[1rem] mb-4 items-center'>
                <h2 className='text-xl font-bold ml-[4rem]'>Manage Address</h2>
                <button onClick={() => setShowAddressForm(!showAddressForm)} className='bg-red-400 text-white h-[2rem] w-[2rem] text-2xl rounded-[50%] flex justify-center items-center'>
                    {showAddressForm ? <RxCross2 /> : <LuPlus />}
                </button>
            </div>

            {showAddressForm && (
                <div className='flex flex-col gap-[2rem] justify-center items-center'>
                    <div className='flex flex-col gap-[1rem]'>
                        <div className='flex flex-wrap gap-2 mb-4'>
                            <select name="addressType" onChange={handleAddressChange} value={addressFormData.addressType} className='bg-base-100 dark:bg-base-200 p-[14px] w-[25rem] rounded-md m-[0.5rem] shadow-lg '>
                                <option value="">Choose Address Type</option>
                                <option value="Home">Home</option>
                                <option value="Work">Work</option>
                            </select>
                            <input
                                name='userName'
                                onChange={handleAddressChange}
                                value={addressFormData.userName}
                                placeholder='Name'
                                className='bg-white/10 p-[14px] w-[25rem] rounded-md m-[0.5rem] shadow-lg ' />
                            <input
                                name='houseNo'
                                onChange={handleAddressChange}
                                value={addressFormData.houseNo}
                                placeholder='House'
                                className='bg-white/10 p-[14px] w-[25rem] rounded-md m-[0.5rem] shadow-lg ' />
                            <input
                                name='colony'
                                onChange={handleAddressChange}
                                value={addressFormData.colony}
                                placeholder='Colony'
                                className='bg-white/10 p-[14px] w-[25rem] rounded-md m-[0.5rem] shadow-lg' />
                            <input
                                name='area'
                                onChange={handleAddressChange}
                                value={addressFormData.area}
                                placeholder='Area'
                                className='bg-white/10 p-[14px] w-[25rem] rounded-md m-[0.5rem] shadow-lg' />
                            <input
                                name='city'
                                onChange={handleAddressChange}
                                value={addressFormData.city}
                                placeholder='City'
                                className='bg-white/10 p-[14px] w-[25rem] rounded-md m-[0.5rem] shadow-lg ' />
                            <input
                                name='state'
                                onChange={handleAddressChange}
                                value={addressFormData.state}
                                placeholder='State'
                                className='bg-white/10 p-[14px] w-[25rem] rounded-md m-[0.5rem] shadow-lg ' />
                            <input
                                name="pincode"
                                type="number"
                                min="0"
                                onChange={handleAddressChange}
                                value={addressFormData.pincode}
                                placeholder="Pincode"
                                className="bg-white/10 p-[14px] w-[25rem] rounded-md m-[0.5rem] shadow-lg"
                                inputMode="numeric" />

                            <input
                                name="phoneNumber"
                                type="number"
                                min="0"
                                onChange={handleAddressChange}
                                value={addressFormData.phoneNumber}
                                placeholder="PhoneNo"
                                className="bg-white/10 p-[14px] w-[25rem] rounded-md m-[0.5rem] shadow-lg"
                                inputMode="numeric" />

                            <input
                                name='landmark'
                                onChange={handleAddressChange}
                                value={addressFormData.landmark}
                                placeholder='Landmark'
                                className='bg-white/10 p-[14px] w-[25rem] rounded-md m-[0.5rem] shadow-lg' />
                        </div>
                        <label className='ml-[.5rem]'>
                            <input
                                type="checkbox"
                                name='isPrimary'
                                className='mr-[.5rem] checkbox rounded-[50%]'
                                onChange={handleAddressChange}
                                checked={addressFormData.isPrimary} /> Set as primary
                        </label>
                    </div>
                    <button onClick={handleAddressSave} className="bg-red-400 p-[.7rem] w-[20%] m-[1rem] rounded-md font-bold shadow-md text-white hover:scale-105 transition-all duration-500 cursor-pointer">Save</button>
                </div>
            )}

            <ul className={`list-none pl-5 ${showAddressForm ? "hidden" : ""}`}>
                {[...addresses].sort((a, b) => (b.isPrimary === true) - (a.isPrimary === true)).map((a, index) => (
                    <li key={index} className='bg-white/10 p-4 rounded-[.5rem] w-[95%] md:w-[85%] mt-[3rem] shadow-md hover:scale-105 transition-all duration-500'>
                        <div className='flex justify-between'>
                            <div>
                                <div className='break-words'><strong>Name: </strong>{a.userName}</div>
                                <div className='break-words'><strong>House No: </strong>{a.houseNo}</div>
                                <div className='break-words'><strong>Colony: </strong>{a.colony} </div>
                                <div className='break-words'><strong>Area: </strong>{a.area}</div>
                                <div className='break-words'><strong>City: </strong>{a.city}</div>
                                <div className='break-words'><strong>State: </strong>{a.state}</div>
                                <div className='break-words'><strong>Pincode: </strong>{a.pincode}</div>
                                <div className='break-words'><strong>Phone No: </strong>{a.phoneNumber}</div>
                                <div className='break-words'><strong>Landmark: </strong>{a.landmark} </div>
                            </div>
                            <div className="flex flex-col gap-1 ">
                                <div className='flex items-center gap-3'>
                                    <input
                                        type="checkbox"
                                        className='checkbox rounded-[50%]'
                                        checked={a.isPrimary} onChange={() => handlePrimaryCheckboxChange(a.aid)} />
                                    <label>{a.isPrimary ? "Primary Address" : "Set as Primary"}</label>
                                </div>
                                <div className='flex gap-[1rem] flex-col'>
                                <button
                                    onClick={() => {
                                        setAddressFormData(a);
                                        setShowAddressForm(true);
                                    }}
                                    className="bg-red-400 p-[.7rem] w-[40%] rounded-md font-bold shadow-md text-white hover:scale-105 transition-all duration-500 cursor-pointer">
                                    Edit
                                </button>

                                {!a.isPrimary && (
                                    <div className="flex gap-4 items-center ml-[2rem]">
                                        <IoTrash className="h-[2rem] w-[2rem] cursor-pointer text-red-500" onClick={() => deleteAddress(a.aid)} />
                                    </div>
                                )}
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Address;
