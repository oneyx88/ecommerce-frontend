import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, addToCart } from "../../store/actions";
import { toast } from "react-hot-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productDetail } = useSelector((state) => state.products);
  const { detailLoader, detailError } = useSelector((state) => state.errors);
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
  }, [dispatch, id]);

  // Always call hooks at top-level on every render to keep count consistent
  const detail = productDetail || {};
  const {
    productId,
    productName,
    description,
    availableStock,
    image,
    price,
    discount,
    specialPrice,
  } = detail;

  const maxQty = Number(availableStock) || 0;
  const isAvailable = maxQty > 0;

  const [quantity, setQuantity] = useState(() => (isAvailable ? 1 : 0));

  useEffect(() => {
    setQuantity(isAvailable ? 1 : 0);
  }, [isAvailable]);

  const renderPrice = (price, specialPrice) => {
    if (specialPrice) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-gray-400 line-through">${Number(price).toFixed(2)}</span>
          <span className="sm:text-2xl text-xl font-semibold text-slate-700">
            ${Number(specialPrice).toFixed(2)}
          </span>
        </div>
      );
    }
    return (
      <span className="sm:text-2xl text-xl font-bold text-slate-800">
        ${Number(price).toFixed(2)}
      </span>
    );
  };

  // Early returns for UI states AFTER hooks to keep hook order stable
  if (detailLoader) {
    return (
      <div className="lg:px-14 sm:px-8 px-4 py-14 flex justify-center items-center">
        <span className="text-slate-700">Loading product...</span>
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="lg:px-14 sm:px-8 px-4 py-14 flex flex-col justify-center items-center gap-4">
        <span className="text-slate-800 text-lg font-medium">{detailError}</span>
        <Link to="/products" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Back to Products
        </Link>
      </div>
    );
  }

  if (!productDetail) return null;

  const incQty = () => {
    setQuantity((q) => Math.min(q + 1, maxQty));
  };

  const decQty = () => {
    setQuantity((q) => Math.max(q - 1, 1));
  };

  const onQtyChange = (e) => {
    const val = e.target.value;
    let num = parseInt(val, 10);
    if (isNaN(num)) num = 1;
    setQuantity(Math.max(1, Math.min(num, maxQty)));
  };

  const onAddToCart = async () => {
    if (!isAvailable || quantity < 1) return;
    if (!accessToken) {
      toast.error("Please log in before adding items");
      navigate("/login");
      return;
    }
    try {
      const result = await dispatch(addToCart(productId, quantity));
      const backendMessage = typeof result === "object" && result?.message;
      const nameForMsg = productName || `Product ${productId ?? ""}`;
      const successMessage = backendMessage || `Added ${nameForMsg} (x${quantity}) to cart`;
      toast.success(successMessage);
      // Optionally navigate to cart
      // navigate('/cart');
    } catch (err) {
      console.error("Add to cart failed:", err?.message || err);
      const errorMessage = err?.message || "Failed to add to cart";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="lg:px-14 sm:px-8 px-4 py-10 2xl:w-[90%] 2xl:mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/products"
          className="inline-block px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-700 hover:text-slate-800 hover:border-slate-800 rounded-md"
        >
          Back
        </Link>
      </div>

      {/* Main layout: 12-col grid like mainstream e-commerce */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Image gallery area */}
        <div className="lg:col-span-5">
          <div className="border rounded-md bg-white p-4 flex items-center justify-center">
            {image ? (
              <img src={image} alt={productName} className="max-h-[500px] object-contain" />
            ) : (
              <div className="w-full h-[300px] bg-gray-100 rounded-md" />
            )}
          </div>
        </div>

        {/* Middle: Product info */
        }
        <div className="lg:col-span-4">
          <div className="space-y-4">
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900">{productName}</h1>
            <div className="text-sm text-slate-600">Product ID: {productId}</div>

            {/* Price and availability */}
            <div className="flex items-center justify-between">
              {renderPrice(price, specialPrice)}
            </div>

            {/* Discount info */}
            {typeof discount === "number" && (
              <div className="text-sm text-green-700">
                Save {Math.round(discount * 100)}%
              </div>
            )}

            {/* Description */}
            {description && (
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-2">Description</h2>
                <p className="text-slate-700 leading-7">{description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary panel */}
        <div className="lg:col-span-3">
          <div className="border rounded-md bg-white p-4 space-y-3">
            <div className="text-slate-800 font-semibold">Price</div>
            <div>
              {specialPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 line-through">${Number(price).toFixed(2)}</span>
                  <span className="text-xl font-bold text-slate-900">${Number(specialPrice).toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-xl font-bold text-slate-900">${Number(price).toFixed(2)}</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-700">Stock</span>
              <span className="text-slate-900 font-medium">{availableStock}</span>
            </div>

            <div className="text-sm text-slate-600">Product ID: {productId}</div>

            {isAvailable && (
              <div className="pt-2 space-y-2">
                <div className="text-slate-800 font-medium">Quantity</div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={decQty}
                    disabled={!isAvailable || quantity <= 1}
                    className="px-3 py-1 border border-slate-300 rounded-md text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={maxQty}
                    value={quantity}
                    onChange={onQtyChange}
                    disabled={!isAvailable}
                    className="w-16 text-center border border-slate-300 rounded-md py-1 text-slate-800 disabled:bg-gray-100"
                  />
                  <button
                    type="button"
                    onClick={incQty}
                    disabled={!isAvailable || quantity >= maxQty}
                    className="px-3 py-1 border border-slate-300 rounded-md text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                <div className="text-xs text-slate-500">Maximum {availableStock} items</div>
              </div>
            )}

            {/* Add to Cart button or out-of-stock message */}
            {isAvailable ? (
              <button
                type="button"
                onClick={onAddToCart}
                className="mt-2 w-full px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add to Cart
              </button>
            ) : (
              <div className="mt-2 w-full px-4 py-2 bg-gray-200 text-gray-600 rounded-md text-center">
                Out of Stock
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;