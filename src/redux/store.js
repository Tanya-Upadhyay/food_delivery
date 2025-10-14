import {configureStore} from "@reduxjs/toolkit";
import cartSlice from "./cartSlice"

import addressReducer from './addressSlice';

export const store = configureStore({
    reducer:{
        cart: cartSlice,
        
    addresses: addressReducer
       
    }
})