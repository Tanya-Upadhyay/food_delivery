import { BiSolidFoodMenu } from "react-icons/bi";
import { MdFreeBreakfast } from "react-icons/md";
import { MdSoupKitchen } from "react-icons/md";
import { GiNoodles } from "react-icons/gi";
import { MdFoodBank } from "react-icons/md";
import { FaPizzaSlice } from "react-icons/fa6";
import { GiHamburger } from "react-icons/gi";
 const Categories = [
    {
        id:1,
        name:"All",
        image: <BiSolidFoodMenu  className=" h-[3rem] w-[3rem] text-red-500"/>
    },
    {
        id:2,
        name:"breakfast",
        image: <MdFreeBreakfast className=" h-[3rem] w-[3rem] text-red-500" /> 
    },
    {
        id:3,
        name:"soup",
        image: <MdSoupKitchen className=" h-[3rem] w-[3rem] text-red-500" />
    },
    {
        id:4,
        name:"pasta",
        image: <GiNoodles className=" h-[3rem] w-[3rem] text-red-500" />
    },
    {
        id:5,
        name:"main_course",
        image: <MdFoodBank className=" h-[3rem] w-[3rem] text-red-500" />
    },
    {
        id:6,
        name:"pizza",
        image: <FaPizzaSlice className=" h-[3rem] w-[3rem] text-red-500"/>
    },
    {
        id:7,
        name:"burger",
        image: <GiHamburger className=" h-[3rem] w-[3rem] text-red-500" />
    }
]
export default Categories;