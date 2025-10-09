import Footer from "./Footer"
import Nav2 from "./Nav2"
import { FaEnvelope } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import Cart from "./Cart";

function Contact() {
    return (
        <div className="flex flex-col w-[100vw] h-[100vh] ">
            <Nav2 />
            <div className="flex p-[3rem] justify-between items-center h-[80%] md:ml-[15rem]">
                <div className="flex flex-col gap-[5rem] md:gap-[2rem]">
                    <div className="h-[10rem] w-[10rem] md:h-[15rem] md:w-[15rem] bg-red-400 rounded-[50%] flex flex-col justify-center items-center gap-[1.5rem] md:gap-[.7rem] shadow-lg">
                        <span className="text-3xl md:text-5xl font-semibold text-white">40%</span>
                        <span className="md:text-xl text-white font-semibold">BUSINESS LUNCH</span>
                    </div>
                    <div className="flex flex-col gap-[2rem] md:gap-[1rem]">
                        <span className="text-xl font-bold md:text-3xl ">GET IN TOUCH</span>
                        <span className="text-3xl font-bold md:text-7xl text-red-400">OUR CONTACT</span>

                    </div>
                </div>
                <div className="flex flex-col gap-[6rem] md:gap-[3rem]">
                    <div className=" flex gap-[1rem] md:justify-between items-center ">
                        <div className="h-[3rem] w-[3rem] md:h-[4rem] md:w-[4rem] rounded-[50%] shadow-lg bg-red-400 flex justify-center items-center">
                            <FaEnvelope className="h-[1rem] w-[1rem] md:h-[2rem] md:w-[2rem] text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-xl md:text-2xl ">CHAT WITH US</h3>
                            <p className=" md:text-xl">Our friendly team is here to help</p>
                            <p className="text-red-400 font-bold">hi@ourcompany.com</p>
                        </div>
                    </div>
                    <div className=" flex gap-[1rem] md:justify-between items-center ">
                        <div className="h-[3rem] w-[3rem] md:h-[4rem] md:w-[4rem] rounded-[50%] shadow-lg bg-red-400 flex justify-center items-center">
                            <FaLocationDot className="h-[1rem] w-[1rem] md:h-[2rem] md:w-[2rem] text-white" />
                        </div>
                        <div >
                            <h3 className="font-semibold text-xl md:text-2xl">OFFICE</h3>
                            <p className=" md:text-xl">Come say Hello at our office HQ</p>
                            <p className="text-red-400 font-bold">121 Street, New York</p>
                        </div>
                    </div>
                    <div className=" flex gap-[1rem] md:justify-between items-center ">
                        <div className="h-[3rem] w-[3rem] md:h-[4rem] md:w-[4rem] rounded-[50%] shadow-lg bg-red-400 flex justify-center items-center">
                            <IoCall className="h-[1rem] w-[1rem] md:h-[2rem] md:w-[2rem] text-white" />
                        </div>
                        <div className="mr-[2rem]">
                            <h3 className="font-semibold text-xl md:text-2xl">PHONE</h3>
                            <p className=" md:text-xl">Mon - Fri from 8am to 11pm</p>
                            <p className="text-red-400 font-bold">1112223330</p>
                        </div>
                    </div>
                </div>
                <div>

                </div>
            </div>
            <Cart />
            <Footer />
        </div>

    )
}

export default Contact
