import { FaEdit, FaEye, FaImage, FaTrashAlt, FaTimesCircle } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

export const adminProductTableColumn = (
  handleEdit,
  handleDelete,
  handleImageUpload,
  handleProductView
) => [
  {
    disableColumnMenu: true,
    sortable: false,
    field: "id",
    headerName: "ID",
    minWidth: 200,
    headerAlign: "center",
    align: "center",
    editable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: (params) => <span className="text-center">ProductID</span>,
  },
  {
    disableColumnMenu: true,
    field: "productName",
    headerName: "Product Name",
    align: "center",
    width: 260,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: (params) => <span>Product Name</span>,
  },

  {
    disableColumnMenu: true,
    field: "price",
    headerName: "Price",
    minWidth: 200,
    headerAlign: "center",
    align: "center",
    editable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: (params) => <span className="text-center">Price</span>,
  },
  {
    sortable: false,
    field: "image",
    headerName: "Image",
    headerAlign: "center",
    align: "center",
    width: 200,
    editable: false,
    disableColumnMenu: true,
    headerClassName: "text-black font-semibold border ",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: (params) => <span className="ps-10">Image</span>,
  },

  {
    field: "action",
    headerName: "Action",
    headerAlign: "center",
    editable: false,
    headerClassName: "text-black font-semibold text-center",
    cellClassName: "text-slate-700 font-normal",
    sortable: false,
    width: 400,
    renderHeader: (params) => <span>Action</span>,
    renderCell: (params) => {
      return (
        <div className="flex justify-center items-center space-x-2 h-full pt-2">
          <button
            onClick={() => handleImageUpload(params.row)}
            className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 h-9 rounded-md"
          >
            <FaImage className="mr-2" />
            Image
          </button>
          <button
            onClick={() => handleEdit(params.row)}
            className="flex items-center bg-blue-500 text-white px-4 h-9 rounded-md "
          >
            <FaEdit className="mr-2" />
            Edit
          </button>

          <button
            onClick={() => handleDelete(params.row)}
            className="flex items-center bg-red-500 text-white px-4   h-9 rounded-md"
          >
            <FaTrashAlt className="mr-2" />
            Delete
          </button>
          <button
            onClick={() => handleProductView(params.row)}
            className="flex items-center bg-slate-800 text-white px-4   h-9 rounded-md"
          >
            <FaEye className="mr-2" />
            View
          </button>
        </div>
      );
    },
  },
];


export const adminOrderTableColumn = (onCancel) => [
  {
    sortable: false,
    disableColumnMenu: true,
    field: "id",
    headerName: "Order ID",
    minWidth: 160,
    headerAlign: "center",
    editable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: () => <span className='text-center'>Order ID</span>,
  },
  {
    disableColumnMenu: true,
    field: "email",
    headerName: "Email",
    align: "center",
    width: 240,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Email</span>,
  },
  {
    disableColumnMenu: true,
    field: "totalAmount",
    headerName: "Total Amount",
    align: "center",
    width: 160,
    editable: false,
    sortable: true,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Total Amount</span>,
  },
  {
    disableColumnMenu: true,
    field: "status",
    headerName: "Status",
    align: "center",
    width: 140,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Status</span>,
  },
  {
    disableColumnMenu: true,
    field: "date",
    headerName: "Order Date",
    align: "center",
    width: 200,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Order Date</span>,
    valueGetter: (params) => params?.row?.createdAt || params?.row?.date || "",
  },
  {
    disableColumnMenu: true,
    field: "keycloakId",
    headerName: "Keycloak ID",
    align: "center",
    width: 260,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Keycloak ID</span>,
  },
  {
    disableColumnMenu: true,
    field: "paymentId",
    headerName: "Payment ID",
    align: "center",
    width: 140,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Payment ID</span>,
  },
  {
    disableColumnMenu: true,
    field: "shipmentId",
    headerName: "Shipment ID",
    align: "center",
    width: 140,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Shipment ID</span>,
  },
  {
    disableColumnMenu: true,
    field: "shippingName",
    headerName: "Shipping Name",
    align: "center",
    width: 180,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Shipping Name</span>,
  },
  {
    disableColumnMenu: true,
    field: "shippingStreet",
    headerName: "Shipping Street",
    align: "center",
    width: 220,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Shipping Street</span>,
  },
  {
    disableColumnMenu: true,
    field: "shippingCity",
    headerName: "Shipping City",
    align: "center",
    width: 160,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Shipping City</span>,
  },
  {
    disableColumnMenu: true,
    field: "shippingState",
    headerName: "Shipping State",
    align: "center",
    width: 160,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Shipping State</span>,
  },
  {
    disableColumnMenu: true,
    field: "shippingCountry",
    headerName: "Shipping Country",
    align: "center",
    width: 200,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Shipping Country</span>,
  },
  {
    disableColumnMenu: true,
    field: "shippingZipCode",
    headerName: "Shipping Zip",
    align: "center",
    width: 140,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Shipping Zip</span>,
  },
  {
    disableColumnMenu: true,
    field: "paidAt",
    headerName: "Paid At",
    align: "center",
    width: 220,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Paid At</span>,
  },
  {
    disableColumnMenu: true,
    field: "shippedAt",
    headerName: "Shipped At",
    align: "center",
    width: 220,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Shipped At</span>,
  },
  {
    disableColumnMenu: true,
    field: "deliveredAt",
    headerName: "Delivered At",
    align: "center",
    width: 220,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Delivered At</span>,
  },
  {
    disableColumnMenu: true,
    field: "updatedAt",
    headerName: "Updated At",
    align: "center",
    width: 220,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Updated At</span>,
  },
  {
    disableColumnMenu: true,
    field: "orderItems",
    headerName: "Items",
    align: "left",
    width: 380,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-left",
    renderHeader: () => <span>Items</span>,
    renderCell: (params) => {
      const items = Array.isArray(params?.row?.orderItems) ? params.row.orderItems : [];
      if (!items.length) return <span className='text-gray-400'>—</span>;
      return (
        <div className='flex flex-col w-full py-1'>
          {items.map((it, idx) => (
            <div key={idx} className='text-[13px] text-slate-700'>
              {it?.productName} × {it?.quantity} @ {it?.orderedProductPrice}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    field: "action",
    headerName: "Action",
    headerAlign: "center",
    editable: false,
    headerClassName: "text-black font-semibold text-center",
    cellClassName: "text-slate-700 font-normal",
    sortable: false,
    width: 220,
    renderHeader: () => <span>Action</span>,
    renderCell: (params) => {
      const status = String(params?.row?.status || '').toUpperCase();
      const orderId = params?.row?.id;
      const showCancel = status === 'CREATED';
      if (!showCancel) {
        return <div className='text-gray-400 text-sm text-center w-full'>—</div>;
      }
      return (
        <div className='flex justify-start items-center h-full pl-2'>
          <button
            onClick={() => onCancel?.(orderId)}
            className='flex items-center bg-red-600 hover:bg-red-500 text-white px-2 h-7 rounded-md cursor-pointer text-[12px]'>
              <FaTimesCircle className='mr-1' size={11} />
              Cancel
          </button>
        </div>
      );
    },
  },
];

// Seller order items table columns
export const sellerOrderItemColumns = [
  {
    disableColumnMenu: true,
    sortable: false,
    field: "id",
    headerName: "Order Item ID",
    minWidth: 160,
    headerAlign: "center",
    align: "center",
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: () => <span className='text-center'>Order Item ID</span>,
  },
  {
    disableColumnMenu: true,
    field: "productName",
    headerName: "Product Name",
    align: "center",
    width: 240,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Product Name</span>,
  },
  {
    disableColumnMenu: true,
    field: "productPrice",
    headerName: "Product Price",
    align: "center",
    width: 160,
    editable: false,
    sortable: true,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Product Price</span>,
  },
  {
    disableColumnMenu: true,
    field: "quantity",
    headerName: "Quantity",
    align: "center",
    width: 140,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Quantity</span>,
  },
  {
    disableColumnMenu: true,
    field: "orderedProductPrice",
    headerName: "Ordered Price",
    align: "center",
    width: 180,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Ordered Price</span>,
  },
];

// Seller inventory table columns
export const sellerInventoryColumns = [
  {
    disableColumnMenu: true,
    sortable: false,
    field: "id",
    headerName: "Product ID",
    minWidth: 160,
    headerAlign: "center",
    align: "center",
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: () => <span className='text-center'>Product ID</span>,
  },
  {
    disableColumnMenu: true,
    field: "availableStock",
    headerName: "Available Stock",
    align: "center",
    width: 180,
    editable: false,
    sortable: true,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Available Stock</span>,
  },
  {
    disableColumnMenu: true,
    field: "lockedStock",
    headerName: "Locked Stock",
    align: "center",
    width: 160,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Locked Stock</span>,
  },
  {
    disableColumnMenu: true,
    field: "soldStock",
    headerName: "Sold Stock",
    align: "center",
    width: 160,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Sold Stock</span>,
  },
  {
    disableColumnMenu: true,
    field: "lastUpdated",
    headerName: "Last Updated",
    align: "center",
    width: 220,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Last Updated</span>,
  },
];

//table column for categories in admin panel
export const categoryTableColumns = (handleEdit, handleDelete) => [
  {
    sortable: false,
    disableColumnMenu: true,
    field: "id",
    headerName: "CategoryId",
    minWidth: 300,
    headerAlign: "center",
    align: "center",
    editable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: (params) => <span className="text-center">CategoryId</span>,
  },
  {
    disableColumnMenu: true,
    field: "categoryName",
    headerName: "Category Name",
    align: "center",
    width: 400,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: (params) => <span>Category Name</span>,
  },
  {
    disableColumnMenu: true,
    field: "description",
    headerName: "Description",
    align: "left",
    width: 500,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-left",
    renderHeader: (params) => <span>Description</span>,
  },

  {
    field: "action",
    headerName: "Action",
    headerAlign: "center",
    editable: false,
    headerClassName: "text-black font-semibold text-center",
    cellClassName: "text-slate-700 font-normal",
    sortable: false,
    width: 400,
    renderHeader: (params) => <span>Action</span>,
    renderCell: (params) => {
      return (
        <div className="flex justify-center space-x-2 h-full pt-2">
          <button
            onClick={() => handleEdit(params.row)}
            className="flex items-center bg-blue-500 text-white px-4 h-9 rounded-md "
          >
            <FaEdit className="mr-2" />
            Edit
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleDelete(params.row)}
            className="flex items-center bg-red-500 text-white px-4   h-9 rounded-md"
          >
            <FaTrashAlt className="mr-2" />
            Delete
          </button>
        </div>
      );
    },
  },

];


//table column for seller in admin panel
export const sellerTableColumns = [
  {
    disableColumnMenu: true,
    field: "id",
    headerName: "ID",
    minWidth: 400,
    headerAlign: "center",
    align: "center",
    editable: false,

    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: (params) => <span className="text-center">SellerID</span>,
  },
  {
    disableColumnMenu: true,
    field: "username",
    headerName: "UserName",
    minWidth: 400,
    headerAlign: "center",
    align: "center",
    editable: false,
    sortable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: (params) => <span className="text-center">UserName</span>,
  },
  {
    disableColumnMenu: true,
    field: "email",
    headerName: "Email",
    align: "center",
    width: 400,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: (params) => <span>Email</span>,
    renderCell: (params) => {
      return (
        <div className="flex items-center justify-center gap-1">
          <span>
            <MdOutlineEmail className="text-slate-700 text-lg" />
          </span>
          <span>{params?.row?.email}</span>
        </div>
      );
    },
  },
  
];