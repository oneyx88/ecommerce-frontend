import { MdArrowBack, MdShoppingCart } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Loader from "../shared/Loader";
import ItemContent from "./ItemContent";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../store/actions";

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, totalPrice, loading, error } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        // 依赖路由保护：只有在用户存在时才拉取购物车
        if (user) {
            dispatch(fetchCart());
        }
    }, [user, dispatch]);

    const renderItems = () => {
        if (loading) return (
            <div className="py-10"><Loader /></div>
        );
        if (error) return (
            <div className="py-6 text-center text-rose-600 font-semibold">{error}</div>
        );
        if (!items.length) return (
            <div className="py-6 text-center text-slate-600">Your cart is empty</div>
        );
        return (
            <div className="mt-4 divide-y divide-slate-200">
                {items.map((item) => (
                    <ItemContent
                        key={`${item.productId}`}
                        productId={item?.productId}
                        productName={item?.productName}
                        image={String(item?.image || "")}
                        description={item?.description || ""}
                        quantity={Number(item?.quantity) || 0}
                        price={Number(item?.productPrice) || 0}
                        discount={Number(item?.discount) || 0}
                        specialPrice={Number(item?.productPrice) || 0}
                        cartId={item?.cartId}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="lg:px-14 sm:px-8 px-4 py-10">
            <div className="flex flex-col items-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                  <MdShoppingCart size={36} className="text-gray-700" />
                    Your Cart
                </h1>
                <p className="text-lg text-gray-600 mt-2">All your selected items</p>
            </div>

            <div className="grid md:grid-cols-5 grid-cols-4 gap-4 pb-2 font-semibold items-center">
                <div className="md:col-span-2 justify-self-start text-lg text-slate-800 lg:ps-4">
                    Product
                </div>

                <div className="justify-self-center text-lg text-slate-800">
                    Price
                </div>

                <div className="justify-self-center text-lg text-slate-800">
                    Quantity
                </div>

                <div className="justify-self-center text-lg text-slate-800">
                    Total
                </div>
            </div>

            {renderItems()}

            <div className="border-t-[1.5px] border-slate-200 py-4 flex sm:flex-row sm:px-0 px-2 flex-col sm:justify-between gap-4">
                <div></div>
                <div className="flex text-sm gap-1 flex-col">
                    <div className="flex justify-between w-full md:text-lg text-sm font-semibold">
                        <span>Subtotal</span>
                        <span>${Number(totalPrice || 0).toFixed(2)}</span>
                    </div>

                    <p className="text-slate-500">
                        Taxes and shipping calculated at checkout
                    </p>

                    {items && items.length > 0 && (
                      <Link className="w-full flex justify-end" to="/checkout">
                        <button
                            onClick={() => {}}
                            className="font-semibold w-[300px] py-2 px-4 rounded-sm cursor-pointer bg-custom-blue text-white flex items-center justify-center gap-2 hover:text-gray-300 transition duration-500">
                            <MdShoppingCart size={20} />
                            Checkout
                        </button>
                      </Link>
                    )}

                    <Link className="flex gap-2 items-center mt-2 text-slate-500" to="/products">
                        <MdArrowBack />
                        <span>Continue Shopping</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;