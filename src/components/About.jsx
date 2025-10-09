
import { Link } from 'react-router-dom'
import Footer from './Footer'
import Nav2 from './Nav2'
import Cart from './Cart'
function About() {
  return (<>
    <div className='w-[100vw] h-[100vh] flex flex-col overflow-hidden'>
      <Nav2 />
      <div className=' w-[100vw] h-[100vh] flex justify-between mt-[10rem] md:mt-[10rem]'>
        <div className='flex flex-col gap-[2rem] ml-[1rem] md:ml-[7rem]'>
          <div className='flex gap-[1rem] justify-center items-center mr-[58%] md:mr-[72%] '>
            <div className='text-6xl font-bold text-red-500 md:text-9xl '>Fast</div>
            <div className='text-2xl font-bold md:text-5xl'>Food <br /> Delivery</div>
            <img src="Group 4.png" className='h-[4rem] md:h-[9rem]' alt="" />
          </div>
          <div className='w-[53%] md:w-[60%] md:text-xl'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur distinctio dolore nesciunt exercitationem officia excepturi id minus necessitatibus veniam asperiores! ipsum dolor sit amet, consectetur adipisicing elit. Earum blanditiis enim accusamus dolorem fugiat. Consequuntur illum quae qui. Quod blanditiis a quia possimus, minima deleniti provident explicabo maxime culpa quaerat quidem beatae eaque ex aut nihil qui error, doloribus adipisci tempore corrupti totam voluptas vel, hic accusamus. Numquam, minima provident, illum aliquid ipsum eos aspernatur itaque unde fugiat libero ipsam! Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, quos doloribus cumque modi repellat, odit nisi sunt suscipit tempora nesciunt sit dolores, quia non. Saepe quidem vero ut aperiam ex!
          </div>
          <div className='flex flex-col gap-[.5rem]'>
            <Link to="/menu">
              <button className="bg-red-400 p-[.7rem] w-[10rem] rounded-md font-bold shadow-md text-white hover:scale-105 transition-all duration-500 cursor-pointer">Order Now</button></Link>
            <div className='flex flex-col '>
              <span className='md:text-xl font-semibold'>5 Star Rating</span>
              based on 17889 reviews
            </div>
          </div>
        </div>
        <img src="17372 [Converted] 1.png" className='h-[40%] md:h-[48%] w-[39%] mt-[1.5rem] absolute right-[2rem] md:h-[55%] md:w-[25%] md:right-[9rem]' alt="" />
      </div>
      <Cart />
      <Footer />
    </div>
  </>
  )
}

export default About;
