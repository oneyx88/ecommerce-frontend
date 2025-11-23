import { useState } from "react";
import { useNavigate } from "react-router-dom";
import truncateText from "../../utils/truncateText";

const ProductCard = ({
        productId,
        productName,
        image,
        price,
        discount,
        specialPrice,
}) => {
    const navigate = useNavigate();

    const handleProductView = (id) => {
        navigate(`/products/${id}`);
    }

    return (
        <div className="border rounded-lg shadow-xl overflow-hidden transition-shadow duration-300">

            <div onClick={() => {
                handleProductView(productId)
            }} className="w-full overflow-hidden aspect-[3/2]">
                 <img 
                className="w-full h-full cursor-pointer transition-transform duration-300 transform hover:scale-105"
                src={image}
                alt={productName}>
                </img>
            </div>


            <div className="p-4">   
                <h2 onClick={() => {
                    handleProductView(productId)
                }}
                    className="text-lg font-semibold mb-2 cursor-pointer">
                    {truncateText(productName, 50)}
                </h2>

                <div className="flex items-center justify-between"> 
                    {specialPrice ? (
                    <div className="flex flex-col">
                        <span className="text-gray-400 line-through">
                            ${Number(price).toFixed(2)}
                        </span>
                        <span className="text-xl font-bold text-slate-700">
                            ${Number(specialPrice).toFixed(2)}
                        </span>
                    </div>
                ) : (
                    <span className="text-xl font-bold text-slate-700">
                        {"  "}
                        ${Number(price).toFixed(2)}
                    </span>
                )}

                </div>

            </div>
            {/* Navigates to detail page; modal removed */}

        </div>
    );
}

export default ProductCard;