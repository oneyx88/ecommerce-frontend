import React, { useEffect } from 'react'
import InputField from '../shared/InputField'
import { useForm } from 'react-hook-form';
import { FaAddressCard } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Spinners from '../shared/Spinners';
import { toast } from 'react-hot-toast';
import { createAddress, updateAddress } from '../../store/actions';
import BackDrop from '../BackDrop';

const AddAddressForm = ({ address, setOpenAddressModal }) => {
    const dispatch = useDispatch();
    const { saving } = useSelector((state) => state.addresses);
    const {
            register,
            handleSubmit,
            reset,
            formState: { errors, isDirty },
        } = useForm({
            mode: "onTouched",
        });

        // 编辑模式：打开时预填原始地址；新增模式：清空表单
        useEffect(() => {
            const isObj = address && typeof address === 'object';
            if (isObj) {
                reset({
                    name: address.name || '',
                    street: address.street || '',
                    city: address.city || '',
                    state: address.state || '',
                    country: address.country || '',
                    zipCode: address.zipCode || '',
                    label: address.label || '',
                    isDefault: Boolean(address.isDefault),
                });
            } else {
                reset({
                    name: '',
                    street: '',
                    city: '',
                    state: '',
                    country: '',
                    zipCode: '',
                    label: '',
                    isDefault: false,
                });
            }
        }, [address, reset]);

        const onSaveAddressHandler = async (form) => {
            // 第一提示：点击保存时立即提示（中文）
            const loadingId = toast.loading('Loading...');
            const payload = {
                name: form.name?.trim(),
                street: form.street?.trim(),
                city: form.city?.trim(),
                state: form.state?.trim(),
                country: form.country?.trim(),
                zipCode: form.zipCode?.trim(),
                label: form.label?.trim(),
                isDefault: Boolean(form.isDefault),
            };
            try {
                if (address?.addressId || address?.id) {
                    // 编辑模式：如无改动则不允许保存并提示
                    const original = {
                        name: address.name?.trim() || '',
                        street: address.street?.trim() || '',
                        city: address.city?.trim() || '',
                        state: address.state?.trim() || '',
                        country: address.country?.trim() || '',
                        zipCode: address.zipCode?.trim() || '',
                        label: address.label?.trim() || '',
                        isDefault: Boolean(address.isDefault),
                    };
                    const noChange = Object.keys(original).every((k) => original[k] === payload[k]);
                    if (noChange) {
                        toast.dismiss(loadingId);
                        // 第二提示（英文）：无改动失败
                        toast.error('No changes detected.');
                        return;
                    }
                    await dispatch(updateAddress(address.addressId || address.id, payload));
                    toast.dismiss(loadingId);
                    // 第二提示（英文）：更新成功
                    toast.success('Address updated');
                } else {
                    await dispatch(createAddress(payload));
                    toast.dismiss(loadingId);
                    // 第二提示（英文）：新增成功
                    toast.success('Address added');
                }
                setOpenAddressModal(false);
            } catch (e) {
                toast.dismiss(loadingId);
                // 第二提示（英文）：保存失败
                toast.error(e?.message || 'Failed to save address');
            }
        };

  return (
    <div className="">
            {saving && <BackDrop />}
            <form
                onSubmit={handleSubmit(onSaveAddressHandler)}
                className="">
                    <div className="flex justify-center items-center mb-4 font-semibold text-2xl text-slate-800 py-2 px-4">
                        <FaAddressCard className="mr-2 text-2xl"/>
                        {address ? 'Edit Address' : 'Add Address'}
                    </div>
            <div className="flex flex-col gap-4">
                <InputField
                    label="Name"
                    required
                    id="name"
                    type="text"
                    message="*Name is required"
                    placeholder="Enter Name"
                    register={register}
                    errors={errors}
                    />
                <InputField
                    label="City"
                    required
                    id="city"
                    type="text"
                    message="*City is required"
                    placeholder="Enter City"
                    register={register}
                    errors={errors}
                    />

                <InputField
                    label="State"
                    required
                    id="state"
                    type="text"
                    message="*State is required"
                    placeholder="Enter State"
                    register={register}
                    errors={errors}
                    />

                <InputField
                    label="Zip Code"
                    required
                    id="zipCode"
                    type="text"
                    message="*Zip Code is required"
                    placeholder="Enter Zip Code"
                    pattern={/^\d{5}(-\d{4})?$/}
                    patternMessage="Invalid US ZIP code format"
                    register={register}
                    errors={errors}
                    />    
                <InputField
                    label="Street"
                    required
                    id="street"
                    type="text"
                    message="*Street is required"
                    placeholder="Enter Street"
                    register={register}
                    errors={errors}
                    />   

                <InputField
                    label="Country"
                    required
                    id="country"
                    type="text"
                    message="*Country is required"
                    placeholder="Enter Country"
                    register={register}
                    errors={errors}
                    />        

                <InputField
                    label="Label"
                    required
                    id="label"
                    type="text"
                    message="*Label is required"
                    placeholder="Enter label (e.g., Home, Work)"
                    register={register}
                    errors={errors}
                    />   

                <div className="flex items-center gap-2">
                    <input id="isDefault" type="checkbox" {...register('isDefault')} />
                    <label htmlFor="isDefault" className="text-slate-800">Set as default</label>
                </div>
            </div>

            <button
                disabled={saving}
                className="text-white bg-custom-blue px-4 py-2 rounded-md mt-4 cursor-pointer"
                type="submit">
                {saving ? (
                    <>
                    <Spinners /> Loading...
                    </>
                ) : (
                    <>Save</>
                )}
            </button>
            </form>
        </div>
  )
}

export default AddAddressForm;