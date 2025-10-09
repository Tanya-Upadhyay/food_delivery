import {configureStore} from "@reduxjs/toolkit";
import cartSlice from "./cartSlice"
import userReducer from './userSlice';
import orderReducer from './orderSlice';
import addressReducer from './addressSlice';

export const store = configureStore({
    reducer:{
        cart: cartSlice,
        user: userReducer,
        orders: orderReducer,
    addresses: addressReducer
       
    }
})