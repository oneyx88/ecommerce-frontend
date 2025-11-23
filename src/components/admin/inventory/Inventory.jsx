import React, { useEffect, useState } from 'react';
import { FaBoxOpen } from 'react-icons/fa';
import { DataGrid } from '@mui/x-data-grid';
import api from '../../../api/api';
import Loader from '../../shared/Loader';
import ErrorPage from '../../shared/ErrorPage';
import Modal from '../../shared/Modal';
import { sellerInventoryColumns } from '../../helper/tableColumn';
import AddInventoryForm from './AddInventoryForm';

const Inventory = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const fetchInventories = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const { data } = await api.get('/inventories/seller');
      const list = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : (Array.isArray(data?.content) ? data.content : []));
      setInventories(list);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to fetch inventories';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableRecords = inventories?.map((item) => ({
    id: item?.productId,
    availableStock: item?.availableStock,
    lockedStock: item?.lockedStock,
    soldStock: item?.soldStock,
    lastUpdated: item?.lastUpdated,
  })) || [];

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <div>
      <div className='pt-6 pb-10 flex justify-end'>
        <button
          onClick={() => setOpenModal(true)}
          className='bg-custom-blue hover:bg-blue-800 text-white font-semibold py-2 px-4 flex items-center gap-2 rounded-md shadow-md transition-colors hover:text-slate-300 duration-300'>
          <FaBoxOpen className='text-xl' />
          Add Inventory
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {(!inventories || inventories.length === 0) ? (
            <div className='flex flex-col items-center justify-center text-gray-600 py-10'>
              <FaBoxOpen size={50} className='mb-3'/>
              <h2 className='text-2xl font-semibold'>
                No inventories yet
              </h2>
            </div>
          ) : (
            <div className='max-w-full'>
              <h1 className='text-slate-800 text-3xl text-center font-bold pb-6 uppercase'>
                My Inventory
              </h1>
              <DataGrid
                className='w-full'
                rows={tableRecords}
                columns={sellerInventoryColumns}
                disableRowSelectionOnClick
                disableColumnResize
                pageSizeOptions={[tableRecords.length || 10]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: tableRecords.length || 10, page: 0 },
                  },
                }}
              />
            </div>
          )}
        </>
      )}

      <Modal open={openModal} setOpen={setOpenModal} title='Add Inventory'>
        <AddInventoryForm setOpen={setOpenModal} onCreated={fetchInventories} />
      </Modal>
    </div>
  );
};

export default Inventory;