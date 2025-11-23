import React from 'react'
import { formatPrice } from '../../utils/formatPrice'
import { useSelector } from 'react-redux'

const OrderConfirmation = ({ totalPrice, cart, address }) => {
  const selectedAddressDetail = useSelector((state) => state.addresses?.selectedDetail);
  const deliveryAddress = address || selectedAddressDetail;
  const resolveImageSrc = (img) => {
    if (!img) return 'https://placehold.co/120x120?text=No+Image';
    if (/^https?:\/\//i.test(img)) return img;
    return `${import.meta.env.VITE_BACK_END_URL}/images/${img}`;
  };
  return (
    <div className="container mx-auto px-4 mb-8">
     <div className="flex flex-wrap">
      <div className="w-full lg:w-8/12 pr-4">
       <div className="space-y-4">
        <div className="p-4 border rounded-lg shadow-sm">
            <h2 className='text-2xl font-semibold mb-2'>Delivery Address</h2>
            <div className='space-y-1 text-gray-700'>
              <p>
                <strong>Recipient Name: </strong>
                {deliveryAddress?.name}
              </p>
              <p>
                <strong>Street: </strong>
                {deliveryAddress?.street}
              </p>
              <p>
                <strong>City: </strong>
                {deliveryAddress?.city}
              </p>
              <p>
                <strong>State: </strong>
                {deliveryAddress?.state}
              </p>
              <p>
                <strong>Zip Code: </strong>
                {deliveryAddress?.zipCode}
              </p>
              <p>
                <strong>Country: </strong>
                {deliveryAddress?.country}
              </p>
            </div>
        </div>

        <div className='pb-4 border rounded-lg shadow-sm mb-6'>
            <h2 className='text-2xl font-semibold mb-2'>Order Items</h2>
            <div className='space-y-2'>
                {cart?.map((item) => {
                  const qty = Number(item?.quantity) || 0;
                  // 优先使用购物车中的 productPrice，其次回退到 specialPrice 或 price
                  const unitPrice = Number(
                    (item?.productPrice ?? item?.specialPrice ?? item?.price)
                  ) || 0;
                  const lineTotal = qty * unitPrice;
                  return (
                    <div key={item?.productId} className='flex items-center gap-3'>
                      <img
                        src={resolveImageSrc(item?.image)}
                        alt={item?.productName || 'Product'}
                        className='w-12 h-12 rounded'
                      />
                      <div className='text-gray-600'>
                        <p className='font-medium'>{item?.productName}</p>
                        <p>
                          {qty} x {formatPrice(unitPrice)} = {formatPrice(lineTotal)}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
        </div>
       </div>
      </div>

      <div className="w-full lg:w-4/12 mt-4 lg:mt-0">
          <div className="border rounded-lg shadow-sm p-4 space-y-4">
            <h2 className="text-2xl font-semibold mb-2">Order Summary</h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Products</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (0%)</span>
                <span>{formatPrice(0)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>SubTotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
        </div>
        </div>
    </div>

    </div>
  )
}

export default OrderConfirmation