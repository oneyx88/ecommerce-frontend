import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import InputField from '../../shared/InputField';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateProductFromDashboard, fetchCategories, createProductFromDashboard } from '../../../store/actions';
import toast from 'react-hot-toast';
import Spinners from '../../shared/Spinners';
import SelectTextField from '../../shared/SelectTextField';

const AddProductForm = ({ setOpen, product, update=false}) => {
const [loader, setLoader] = useState(false);
const [selectedCategory, setSelectedCategory] = useState();
const { categories } = useSelector((state) => state.products);
const { categoryLoader, errorMessage } = useSelector((state) => state.errors);
const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        mode: "onTouched"
    });

    const saveProductHandler = (data) => {
        if(!update) {
            const categoryId = selectedCategory?.categoryId;
            if (!categoryId) {
                toast.error("Please select a category");
                return;
            }
            const sendData = {
                productName: data.productName,
                description: data.description,
                price: Number(data.price),
                discount: Number(data.discount || 0),
            };
            dispatch(createProductFromDashboard(categoryId, sendData, toast, reset, setLoader, setOpen));
        } else {
            // 更新请求体不包含 quantity 与 specialPrice，且规范化 discount
            const sendData = {
                id: product.id,
                productName: data.productName,
                description: data.description,
                price: Number(data.price),
                discount: Number(data.discount || 0),
            };
            dispatch(updateProductFromDashboard(sendData, toast, reset, setLoader, setOpen));
        }
    };


    useEffect(() => {
        if (update && product) {
            setValue("productName", product?.productName);
            setValue("price", product?.price);
            setValue("discount", product?.discount);
            setValue("description", product?.description);
        }
    }, [update, product]);

    useEffect(() => {
        if (!update) {
            dispatch(fetchCategories());
        }
    }, [dispatch, update]);

    useEffect(() => {
        if (!update && !categoryLoader && Array.isArray(categories) && categories.length > 0) {
            setSelectedCategory(categories[0]);
        }
    }, [categories, categoryLoader, update]);

  if (!update && categoryLoader) {
    return <div className='py-8'><Spinners /> Loading categories...</div>;
  }

  if (!update && errorMessage) {
    return <div className='py-8 text-red-600 font-semibold'>
      {errorMessage}
    </div>;
  }

  return (
    <div className='py-5 relative h-full'>
        <form className='space-y-4'
            onSubmit={handleSubmit(saveProductHandler)}>
            <div className='flex md:flex-row flex-col gap-4 w-full'>
                <InputField 
                    label="Product Name"
                    required
                    id="productName"
                    type="text"
                    message="This field is required*"
                    min={3}
                    max={255}
                    register={register}
                    placeholder="Product Name"
                    errors={errors}
                    />
                {!update && (
                    <SelectTextField
                        label="Select Categories"
                        select={selectedCategory}
                        setSelect={setSelectedCategory}
                        lists={categories}
                    />
                )}
            </div>

            <div className='flex md:flex-row flex-col gap-4 w-full'>
                <InputField 
                    label="Price"
                    required
                    id="price"
                    type="number"
                    message="This field is required*"
                    placeholder="Product Price"
                    register={register}
                    errors={errors}
                    />
            </div>
        <div className="flex md:flex-row flex-col gap-4 w-full">
          <InputField
            label="Discount"
            id="discount"
            type="number"
            message="This field is required*"
            placeholder="Product Discount"
            step="0.01"
            validate={(value) => {
              if (value === undefined || value === null || value === "") return true;
              const num = Number(value);
              if (Number.isNaN(num)) return "Discount must be a number";
              if (num < 0 || num > 1) return "Discount must be between 0 and 1";
              const str = String(value);
              const decimals = str.includes('.') ? str.split('.')[1].length : 0;
              if (decimals > 2) return "Discount must have at most 2 decimal places";
              return true;
            }}
            register={register}
            errors={errors}
          />
          
        </div>

        <div className="flex flex-col gap-2 w-full">
            <label htmlFor='desc'
              className='font-semibold text-sm text-slate-800'>
                Description
            </label>

            <textarea
                rows={5}
                placeholder="Add product description...."
                className={`px-4 py-2 w-full border outline-hidden bg-transparent text-slate-800 rounded-md ${
                    errors["description"]?.message ? "border-red-500" : "border-slate-700" 
                }`}
                {...register("description", {
                    required: { value: true, message: "Description is required" },
                    minLength: { value: 6, message: "Description must be between 6 and 255 characters" },
                    maxLength: { value: 255, message: "Description must be between 6 and 255 characters" },
                })}
                />

                {errors["description"]?.message && (
                    <p className="text-sm font-semibold text-red-600 mt-0">
                        {errors["description"]?.message}
                    </p>
                )}
        </div>

        <div className='flex w-full justify-between items-center absolute bottom-14'>
            <Button disabled={loader}
                    onClick={() => setOpen(false)}
                    variant='outlined'
                    className='text-white py-[10px] px-4 text-sm font-medium'>
                Cancel
            </Button>

            <Button
                disabled={loader}
                type='submit'
                variant='contained'
                color='primary'
                className='bg-custom-blue text-white  py-[10px] px-4 text-sm font-medium'>
                {loader ? (
                    <div className='flex gap-2 items-center'>
                        <Spinners /> Loading...
                    </div>
                ) : (
                    update ? "Update" : "Add"
                )}
            </Button>
        </div>
        </form>
    </div>
  )
}

export default AddProductForm