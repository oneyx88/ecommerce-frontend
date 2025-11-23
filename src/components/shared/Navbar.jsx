import { useState } from "react";
import { FaShoppingCart, FaSignInAlt, FaSignOutAlt, FaStore } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/actions";
import UserMenu from "../UserMenu";

const Navbar = () => {
    const path = useLocation().pathname;
    const [navbarOpen, setNavbarOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = useSelector((state) => state.auth?.accessToken);
    const user = useSelector((state) => state.auth?.user);
    const cartItems = useSelector((state) => state.cart?.items) || [];
    const cartCount = cartItems.reduce((sum, i) => sum + (Number(i?.quantity) || 0), 0);
    
    return (
        <div className="h-[70px] bg-custom-gradient text-white z-50 flex items-center sticky top-0">
            <div className="lg:px-14 sm:px-8 px-4 w-full flex justify-between">
                <Link to="/" className="flex items-center text-2xl font-bold">
                    <FaStore className="mr-2 text-3xl" />
                    <span className="font-[Poppins]">E-Shop</span>
                </Link>

            <ul className={`flex sm:gap-10 gap-4 sm:items-center  text-slate-800 sm:static absolute left-0 top-[70px] sm:shadow-none shadow-md ${
            navbarOpen ? "h-fit sm:pb-0 pb-5" : "h-0 overflow-hidden"
          }  transition-all duration-100 sm:h-fit sm:bg-none bg-custom-gradient   text-white sm:w-fit w-full sm:flex-row flex-col px-4 sm:px-0`}>
                <li className="font-[500] transition-all duration-150">
                   <Link className={`${
                    path === "/" ? "text-white font-semibold" : "text-gray-200"
                   }`}
                    to="/">
                        Home
                   </Link> 
                </li>

                <li className="font-[500] transition-all duration-150">
                   <Link className={`${
                    path === "/products" ? "text-white font-semibold" : "text-gray-200"
                   }`}
                    to="/products">
                        Products
                   </Link> 
                </li>


                <li className="font-[500] transition-all duration-150">
                   <Link className={`${
                    path === "/about" ? "text-white font-semibold" : "text-gray-200"
                   }`}
                    to="/about">
                        About
                   </Link> 
                </li>

                <li className="font-[500] transition-all duration-150">
                   <Link className={`${
                    path === "/contact" ? "text-white font-semibold" : "text-gray-200"
                   }`}
                    to="/contact">
                        Contact
                   </Link> 
                </li>

                <li className="font-[500] transition-all duration-150">
                   <Link className={`${
                    path === "/cart" ? "text-white font-semibold" : "text-gray-200"
                   } relative`}
                    to="/cart">
                        <FaShoppingCart size={25} />
                        <span
                          className="absolute -top-1.5 -right-2.5 bg-red-600 text-white text-[9px] font-bold px-[5px] py-[1.5px] rounded-full min-w-[16px] text-center"
                          aria-label={`Cart items: ${cartCount}`}
                        >
                          {cartCount}
                        </span>
                   </Link> 
                </li>


                {user && user?.id ? (
                  <li className="font-[500] transition-all duration-150">
                    <UserMenu />
                  </li>
                ) : (
                  <li className="font-[500] transition-all duration-150">
                    <Link
                      className="flex items-center space-x-2 px-4 py-[6px] bg-gradient-to-r from-purple-600 to-red-500 text-white font-semibold rounded-md shadow-lg hover:from-purple-500 hover:to-red-400 transition duration-300 ease-in-out transform"
                      to="/login"
                    >
                      <FaSignInAlt />
                      <span>Login</span>
                    </Link>
                  </li>
                )}
            </ul>

            <button
                onClick={() => setNavbarOpen(!navbarOpen)}
                className="sm:hidden flex items-center sm:mt-0 mt-2 cursor-pointer">
                    {navbarOpen ? (
                        <RxCross2 className="text-white text-3xl" />
                    ) : (
                        <IoIosMenu className="text-white text-3xl" />
                    )}
            </button>
            </div>
        </div>
    )
}

export default Navbar;