import React, { useEffect, useState } from 'react'
import Skeleton from '../shared/Skeleton';
import { FaAddressBook } from 'react-icons/fa';
import AddressInfoModal from './AddressInfoModal';
import AddAddressForm from './AddAddressForm';
import AddressList from './AddressList';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserAddresses, deleteAddress } from '../../store/actions';
import { toast } from 'react-hot-toast';
import BackDrop from '../BackDrop';

const AddressInfo = () => {
    const dispatch = useDispatch();
    const { items: addresses, loading, error, saving } = useSelector((state) => state.addresses);

    const [openAddressModal, setOpenAddressModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const addNewAddressHandler = () => {
        setSelectedAddress("");
        setOpenAddressModal(true);
    };

    useEffect(() => {
        try { dispatch(fetchUserAddresses()); } catch (_) {}
    }, [dispatch]);

    // 默认选中：优先默认地址，其次首个地址
    useEffect(() => {
        const list = Array.isArray(addresses) ? addresses : [];
        const def = list.find((a) => a?.isDefault);
        const id = (def?.addressId || def?.id) || (list[0]?.addressId || list[0]?.id) || null;
        setSelectedAddressId(id);
        try { dispatch({ type: 'ADDRESS_SELECTED', payload: id }); } catch (_) {}
    }, [addresses, dispatch]);

    const handleEdit = (addr) => {
        setSelectedAddress(addr);
        setOpenAddressModal(true);
    };

    const handleDelete = async (addr) => {
        if (!addr?.addressId && !addr?.id) return;
        const id = addr.addressId || addr.id;
        try {
            await dispatch(deleteAddress(id));
            toast.success('Address deleted');
        } catch (e) {
            toast.error(e?.message || 'Failed to delete address');
        }
    };

    const handleSelect = (addr) => {
        const id = addr?.addressId || addr?.id || null;
        setSelectedAddressId(id);
        try { dispatch({ type: 'ADDRESS_SELECTED', payload: id }); } catch (_) {}
    };
  return (
    <div className='pt-4'>
        {(loading || saving) && <BackDrop />}
        {loading ? (
            <div className='py-4 px-8'>
                <Skeleton />
            </div>
        ) : (addresses && addresses.length === 0) ? (
            <div className='p-6 rounded-lg max-w-md mx-auto flex flex-col items-center justify-center'>
                <FaAddressBook size={50} className='text-gray-500 mb-4' />
                <h1 className='mb-2 text-slate-900 text-center font-semibold text-2xl'>
                    No Address Added Yet
                </h1>
                <p className='mb-6 text-slate-800 text-center'>
                    Please add your address to complete purchase
                </p>

                <button
                    onClick={addNewAddressHandler}
                    className='px-4 py-2 bg-blue-600 text-white cursor-pointer font-medium rounded hover:bg-blue-700 transition-all'>
                    Add Address
                </button>
            </div>
        ) : (
            <div className='relative p-6 rounded-lg max-w-md mx-auto'>
                <h1 className='text-slate-800 text-center font-bold text-2xl'>
                    Select Address
                </h1>
                <div className='space-y-4 pt-6'>
                    {error && (
                        <div className='text-center text-rose-600'>{error}</div>
                    )}
                    <AddressList
                        addresses={addresses}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        selectedAddressId={selectedAddressId}
                        onSelect={handleSelect}
                    />
                    <div className='flex justify-center pt-4'>
                        <button
                            onClick={addNewAddressHandler}
                            className='px-4 py-2 bg-blue-600 text-white cursor-pointer font-medium rounded hover:bg-blue-700 transition-all'>
                            Add Address
                        </button>
                    </div>
                </div>
            </div>
        )}


        <AddressInfoModal
            open={openAddressModal}
            setOpen={setOpenAddressModal}>
                <AddAddressForm 
                    address={selectedAddress}
                    setOpenAddressModal={setOpenAddressModal}/>
        </AddressInfoModal>
    </div>
  )
}

export default AddressInfo;