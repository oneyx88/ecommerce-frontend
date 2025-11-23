import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import SetQuantity from "./SetQuantity";
import { useDispatch, useSelector } from "react-redux";
import { decreaseCartItem, increaseCartItem, deleteCartItem } from "../../store/actions";
import toast from "react-hot-toast";

const ItemContent = ({
    productId,
    productName,
    image,
    description,
    quantity,
    price,
    discount,
    specialPrice,
    cartId,
  }) => {
    const [currentQuantity, setCurrentQuantity] = useState(quantity);
    const [qtyLoading, setQtyLoading] = useState(false);
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.cart);

    const patchReduxCart = (updatedItems) => {
        const updatedTotal = (Array.isArray(updatedItems) ? updatedItems : []).reduce((sum, i) => {
            const unit = Number(i?.productPrice) || 0;
            const qty = Number(i?.quantity) || 0;
            return sum + unit * qty;
        }, 0);
        dispatch({ type: "CART_SET", payload: { items: updatedItems, totalPrice: updatedTotal } });
    };

    const handleQtyIncrease = async () => {
        try {
            setQtyLoading(true);
            await dispatch(increaseCartItem(productId));
            const newQty = Number(currentQuantity) + 1;
            setCurrentQuantity(newQty);
            // Patch Redux cart with updated quantity for this item only
            const updatedItems = (items || []).map((i) => (
                Number(i?.productId) === Number(productId)
                    ? { ...i, quantity: Number(i?.quantity || 0) + 1 }
                    : i
            ));
            patchReduxCart(updatedItems);
        } catch (err) {
            toast.error(err?.message || "Failed to increase quantity");
        } finally {
            setQtyLoading(false);
        }
    };

    const handleQtyDecrease = async () => {
        try {
            setQtyLoading(true);
            if (Number(currentQuantity) <= 1) {
                await dispatch(deleteCartItem(productId));
                toast.success("Item removed from cart");
                setCurrentQuantity(0);
                // Remove item from Redux cart without refetch
                const updatedItems = (items || []).filter((i) => Number(i?.productId) !== Number(productId));
                patchReduxCart(updatedItems);
            } else {
                await dispatch(decreaseCartItem(productId));
                const newQty = Number(currentQuantity) - 1;
                setCurrentQuantity(newQty);
                const updatedItems = (items || []).map((i) => (
                    Number(i?.productId) === Number(productId)
                        ? { ...i, quantity: Number(i?.quantity || 0) - 1 }
                        : i
                ));
                patchReduxCart(updatedItems);
            }
        } catch (err) {
            toast.error(err?.message || "Failed to decrease quantity");
        } finally {
            setQtyLoading(false);
        }
    };
    
    return (
        <div className="relative">
          {qtyLoading && (
            <div
              className="absolute inset-0 z-10 rounded-md bg-gray-300/50 pointer-events-auto"
              aria-hidden="true"
            />
          )}
          <div className="grid md:grid-cols-5 grid-cols-4 md:text-md text-sm gap-4 items-center border-[1px] border-slate-200 rounded-md lg:px-4 py-4 p-2">
            <div className="md:col-span-2 justify-self-start flex  flex-col gap-2 ">
                <div className="flex md:flex-row flex-col lg:gap-4 sm:gap-3 gap-0 items-start ">
                   <h3 className="lg:text-[17px] text-sm font-semibold text-slate-600">
                    {productName}
                   </h3>
                </div>

                <div className="md:w-36 sm:w-24 w-12">
                    <img 
                        src={image}
                        alt={productName}
                        className="md:h-36 sm:h-24 h-12 w-full object-cover rounded-md"/>
                

                <div className="flex items-start gap-5 mt-3">
                    <button
                        onClick={async () => {
                            try {
                                setQtyLoading(true);
                                await dispatch(deleteCartItem(productId));
                                toast.success("Item removed from cart");
                                setCurrentQuantity(0);
                                const updatedItems = (items || []).filter((i) => Number(i?.productId) !== Number(productId));
                                patchReduxCart(updatedItems);
                            } catch (err) {
                                toast.error(err?.message || "Failed to remove item");
                            } finally {
                                setQtyLoading(false);
                            }
                        }}
                        disabled={qtyLoading}
                        className="flex items-center font-semibold space-x-2 px-4 py-1 text-xs border border-rose-600 text-rose-600 rounded-md hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        <HiOutlineTrash size={16} className="text-rose-600"/>
                        Remove
                    </button>
                    </div>
                </div>
            </div>

            <div className="justify-self-center lg:text-[17px] text-sm text-slate-600 font-semibold">
                {`$${(Number(specialPrice) || 0).toFixed(2)}`}
            </div>

            <div className="justify-self-center">
                <SetQuantity 
                    quantity={currentQuantity}
                    cardCounter={true}
                    onIncrease={handleQtyIncrease}
                    onDecrease={handleQtyDecrease}
                    loading={qtyLoading}
                />
            </div>

            <div className="justify-self-center lg:text-[17px] text-sm text-slate-600 font-semibold">
                {`$${(Number(currentQuantity) * (Number(specialPrice) || 0)).toFixed(2)}`}
            </div>
          </div>
        </div>
    )
};

export default ItemContent;