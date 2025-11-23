import { DataGrid } from '@mui/x-data-grid'
import { adminOrderTableColumn, sellerOrderItemColumns } from '../../helper/tableColumn';
import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const OrderTable = ({ adminOrder, pagination, onCancel, loading, isSeller = false }) => {
  const [currentPage, setCurrentPage] = useState(
    pagination?.pageNumber + 1 || 1
  );

  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

const tableRecords = adminOrder?.map((item) => {
  if (isSeller) {
    return {
      id: item.orderItemId ?? item.id,
      productId: item.productId,
      productName: item.productName,
      productPrice: item.productPrice,
      quantity: item.quantity,
      discount: item.discount,
      orderedProductPrice: item.orderedProductPrice,
      ...item,
    };
  }
  return {
    id: item.id ?? item.orderId,
    email: item.email,
    totalAmount: item.totalAmount,
    status: (item.status ?? item.orderStatus ?? '').toString().toUpperCase(),
    date: item.createdAt ?? item.date ?? item.orderDate,
    ...item,
  };
});

const handlePaginationChange = (paginationModel) => {
  const page = paginationModel.page + 1;
  setCurrentPage(page);
  params.set("page", page.toString());
  navigate(`${pathname}?${params.toString()}`);
}

  return (
    <div>
      <h1 className='text-slate-800 text-3xl text-center font-bold pb-6 uppercase'>
        All Orders
      </h1>

      <div>
         <DataGrid
         className='w-full'
            rows={tableRecords}
            columns={isSeller ? sellerOrderItemColumns : adminOrderTableColumn((orderId) => onCancel?.(orderId))}
            paginationMode='server'
            rowCount={pagination?.totalElements || 0}
            density='compact'
            rowHeight={40}
            columnHeaderHeight={44}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: pagination?.pageSize || 10,
                  page: currentPage - 1,
                },
              },
            }}
            onPaginationModelChange={handlePaginationChange}
            disableRowSelectionOnClick
            disableColumnResize
            pageSizeOptions={[pagination?.pageSize || 10]}
            pagination
            paginationOptions={{
              showFirstButton: true,
              showLastButton: true,
              hideNextButton: currentPage === pagination?.totalPages,
            }}
            loading={Boolean(loading)}
            sx={{
              '& .MuiDataGrid-columnHeaders': { minHeight: 44, height: 44 },
              '& .MuiDataGrid-columnHeader': { padding: '6px 8px', fontSize: '13px' },
              '& .MuiDataGrid-cell': { padding: '6px 8px', fontSize: '13px' },
              '& .MuiDataGrid-row': { minHeight: 40 },
            }}
          />
      </div>
    </div>
  )
}

export default OrderTable