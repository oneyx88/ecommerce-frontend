import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import Status from './Status';
import { MdClose, MdDone } from 'react-icons/md';
import { Divider } from '@mui/material';

function ProductViewModal({open, setOpen, productId}) {
  const getProductById = (id) => {
    if (id === 101) {
      return {
        productId: 101,
        productName: "Wireless Headphones",
        description: "Bluetooth noise-cancelling over-ear headphones",
        availableStock: 50,
        image: "https://placehold.co/600x400",
        price: 120.00,
        discount: 0.15,
        specialPrice: 102.00,
      };
    }
    return {
      productId: id,
      productName: "Unknown Product",
      description: "",
      availableStock: 0,
      image: "https://placehold.co/600x400",
      price: 0.0,
      discount: null,
      specialPrice: null,
    };
  };

  const product = getProductById(productId);
  const { productName, description, availableStock, image, price, specialPrice } = product;
  const isAvailable = availableStock && Number(availableStock) > 0;

return (
    <>
      <Dialog open={open} as="div" className="relative z-10" onClose={() => setOpen(false)}>
      <DialogBackdrop className="fixed inset-0 bg-gray-300 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all md:max-w-[620px] md:min-w-[620px] w-full"
            >
                {image && (
                    <div className='flex justify-center aspect-[3/2]'>
                    <img 
                    src={image}
                    alt={productName} />
                    </div>
                )}



                <div className='px-6 pt-10 pb-2'>
                <DialogTitle as="h1" className="lg:text-3xl sm:text-2xl text-xl font-semibold leading-6 text-gray-800 mb-4">
                {productName}
              </DialogTitle>


              <div className="space-y-2 text-gray-700 pb-4">
                <div className="flex items-center justify-between gap-2">
                  {specialPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 line-through">
                        ${Number(price).toFixed(2)}
                      </span>
                      <span className="sm:text-xl font-semibold text-slate-700">
                        ${Number(specialPrice).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xl font-bold">
                      {" "}
                      ${Number(price).toFixed(2)}
                    </span>
                  )}

                  {isAvailable ? (
                    <Status
                      text="In Stock"
                      icon={MdDone}
                      bg="bg-teal-200"
                      color="text-teal-900"
                    />
                  ) : (
                    <Status
                      text="Out-Of-Stock"
                      icon={MdClose}
                      bg="bg-rose-200"
                      color="text-rose-700"
                    />
                  )}
                </div>

                <Divider />

                <p>{description}</p>
              </div>
                </div>


            <div className="px-6 py-4 flex justify-end gap-4">
              <button
                onClick={() => setOpen(false)}
                type="button"
                className="px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-700 hover:text-slate-800 hover:border-slate-800 rounded-md "
              >
                Close
              </button>
            </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default ProductViewModal