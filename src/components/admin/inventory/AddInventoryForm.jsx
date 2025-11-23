import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../../shared/InputField';
import Spinners from '../../shared/Spinners';
import api from '../../../api/api';
import toast from 'react-hot-toast';
import SelectProductField from '../../shared/SelectProductField';

const AddInventoryForm = ({ setOpen, onCreated }) => {
  const [loader, setLoader] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'onTouched' });
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchSellerProductsAndInventories = async () => {
      try {
        const [productsRes, inventoriesRes] = await Promise.all([
          api.get('/products/sellers'),
          api.get('/inventories/seller'),
        ]);

        const prodData = productsRes?.data;
        const invData = inventoriesRes?.data;

        const productItems = Array.isArray(prodData?.productSummaries)
          ? prodData.productSummaries
          : (Array.isArray(prodData?.items) ? prodData.items
            : (Array.isArray(prodData?.content) ? prodData.content
              : (Array.isArray(prodData) ? prodData : [])));

        const inventoryItems = Array.isArray(invData?.inventorySummaries)
          ? invData.inventorySummaries
          : (Array.isArray(invData?.items) ? invData.items
            : (Array.isArray(invData?.content) ? invData.content
              : (Array.isArray(invData) ? invData : [])));

        const existingProductIds = new Set(
          (inventoryItems || [])
            .map((inv) => inv?.productId)
            .filter((id) => id !== undefined && id !== null)
        );

        const selectableProducts = (productItems || []).filter(
          (p) => !existingProductIds.has(p?.productId)
        );

        if (!mounted) return;
        setProducts(selectableProducts);
        setSelectedProduct(null);
      } catch (err) {
        if (!mounted) return;
        setProducts([]);
        setSelectedProduct(null);
      }
    };
    fetchSellerProductsAndInventories();
    return () => { mounted = false; };
  }, []);

  const onSubmit = async (data) => {
    const productId = selectedProduct?.productId;
    const payload = {
      availableStock: Number(data?.availableStock),
      lockedStock: Number(data?.lockedStock),
      soldStock: Number(data?.soldStock),
    };
    if (!productId) {
      toast.error('Please select a product');
      return;
    }
    try {
      setLoader(true);
      const { data: res } = await api.post(`/inventories/seller/${encodeURIComponent(productId)}`, payload);
      toast.success('Inventory created');
      setOpen?.(false);
      reset?.();
      onCreated?.();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create inventory';
      toast.error(msg);
    } finally {
      setLoader(false);
    }
  };

  const noSelectableProducts = products.length === 0;
  return (
    <div className='py-5 relative h-full'>
      <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex md:flex-row flex-col gap-4 w-full'>
          <SelectProductField
            label='Product'
            selected={selectedProduct}
            setSelected={setSelectedProduct}
            lists={products}
          />
          <InputField
            label='Available Stock'
            required
            id='availableStock'
            type='number'
            message='*Available stock is required'
            placeholder='Enter available stock'
            register={register}
            errors={errors}
            step={1}
          />
        </div>
        <div className='flex md:flex-row flex-col gap-4 w-full'>
          <InputField
            label='Locked Stock'
            required
            id='lockedStock'
            type='number'
            message='*Locked stock is required'
            placeholder='Enter locked stock'
            register={register}
            errors={errors}
            step={1}
          />
          <InputField
            label='Sold Stock'
            required
            id='soldStock'
            type='number'
            message='*Sold stock is required'
            placeholder='Enter sold stock'
            register={register}
            errors={errors}
            step={1}
          />
        </div>

        <div className='flex w-full justify-between items-center absolute bottom-14'>
          <button
            disabled={loader}
            onClick={() => setOpen(false)}
            type='button'
            className={`border border-blue-500 rounded-[5px] font-metropolis text-textColor py-[10px] px-4 text-sm font-medium`}
          >
            Cancel
          </button>
          <button
            disabled={loader || noSelectableProducts}
            type='submit'
            className={`font-metropolis rounded-[5px] bg-custom-blue hover:bg-blue-800 text-white py-[10px] px-4 text-sm font-medium`}
          >
            {loader ? (
              <div className='flex gap-2 items-center'>
                <Spinners /> Loading..
              </div>
            ) : (
              'Create Inventory'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInventoryForm;