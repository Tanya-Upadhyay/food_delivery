import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name:"cart",
    initialState: [],
    reducers:{
        AddItem:(state, action)=>{
            let existItem = state.find((item)=>item.id === action.payload.id)
            if(existItem){
                return state.map((item)=>(item.id === action.payload.id?{...item,qty:item.qty+1}:item))
            }else{
                state.push(action.payload)
            }
            
        },
        RemoveItem:(state, action)=>{
            
            return state.filter((item)=>item.id !== action.payload)
        },
         
        EmptyCart: () => {
        return [];
        },
        

    }
})
export const {AddItem, RemoveItem, EmptyCart}= cartSlice.actions
export default cartSlice.reducer

