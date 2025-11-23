import React, { useEffect, useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa';
import OrderTable from './OrderTable';
import api from '../../../api/api';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import DeleteModal from '../../shared/DeleteModal';
import { useSelector } from 'react-redux';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10, totalElements: 0, totalPages: 0, lastPage: true });
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelLoader, setCancelLoader] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);

  const hasSellerRoleArray = Array.isArray(user?.roles) && user.roles.some((r) => {
    const role = String(r || '').toUpperCase();
    return role === 'SELLER' || role === 'ROLE_SELLER';
  });
  const singleRole = String(user?.role || '').toUpperCase();
  const hasSellerSingle = singleRole === 'SELLER' || singleRole === 'ROLE_SELLER';
  const isSeller = hasSellerRoleArray || hasSellerSingle;

  const pageParam = Number(searchParams.get('page')) || 1;

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      if (isSeller) {
        const { data } = await api.get(`/orders/seller`);
        const rawList = Array.isArray(data) ? data : [];
        const list = rawList.map((o) => ({
          orderItemId: o?.orderItemId,
          id: o?.orderItemId ?? o?.id,
          productId: o?.productId,
          productName: o?.productName,
          productPrice: o?.productPrice,
          quantity: o?.quantity,
          discount: o?.discount,
          orderedProductPrice: o?.orderedProductPrice,
        }));
        const pg = {
          pageNumber: 0,
          pageSize: list.length,
          totalElements: list.length,
          totalPages: 1,
          lastPage: true,
        };
        setOrders(list);
        setPagination(pg);
      } else {
        const { data } = await api.get(`/orders/admin`, { params: { pageNumber: page - 1 } });
        // 兼容后端返回：{ orders, pageNumber, pageSize, totalPages, totalElements, isLastPage }
        // 以及可能的分页对象：{ content, number, size, totalPages, totalElements, last }
        const rawList = Array.isArray(data?.orders)
          ? data.orders
          : Array.isArray(data?.content)
            ? data.content
            : Array.isArray(data)
              ? data
              : [];

        // 规范化为表格行需要的字段
        const list = (rawList || []).map((o) => ({
          id: o?.orderId ?? o?.id,
          email: o?.email,
          totalAmount: o?.totalAmount,
          status: String(o?.orderStatus ?? o?.status ?? '').toUpperCase(),
          date: o?.createdAt ?? o?.date,
          ...o,
        }));

        const pg = {
          pageNumber: Number((data?.pageNumber ?? data?.number ?? (page - 1))),
          pageSize: Number((data?.pageSize ?? data?.size ?? list?.length ?? 10)),
          totalElements: Number((data?.totalElements ?? list?.length ?? 0)),
          totalPages: Number((data?.totalPages ?? 1)),
          lastPage: Boolean(typeof data?.isLastPage !== 'undefined' ? data?.isLastPage : (data?.last ?? true)),
        };
        setOrders(list);
        setPagination(pg);
      }
    } catch (err) {
      setOrders([]);
      setPagination({ pageNumber: 0, pageSize: 10, totalElements: 0, totalPages: 0, lastPage: true });
      toast.error(err?.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(pageParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageParam]);

  const openCancelConfirm = (orderId) => {
    setSelectedOrderId(orderId);
    setConfirmOpen(true);
  };

  const closeCancelConfirm = () => {
    setConfirmOpen(false);
    setSelectedOrderId(null);
  };

  const confirmAndCancel = async () => {
    const orderId = selectedOrderId;
    if (!orderId) return;
    try {
      setCancelLoader(true);
      await api.put(`/orders/${orderId}/cancel`);
      toast.success('Order cancelled');
      closeCancelConfirm();
      fetchOrders(pageParam);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelLoader(false);
    }
  };

  const emptyOrder = !orders || orders.length === 0;
  return (
    <div className='pb-6 pt-20'>
      {emptyOrder ? (
        <div className='flex flex-col items-center justify-center text-gray-600 py-10'>
          <FaShoppingCart size={50} className='mb-3' />
          <h2 className='text-2xl font-semibold'>No Orders Placed Yet</h2>
        </div>
      ) : (
        <OrderTable adminOrder={orders} pagination={pagination} onCancel={openCancelConfirm} loading={loading} isSeller={isSeller} />
      )}

      <DeleteModal
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title="Cancel Order"
        description={`Are you sure you want to cancel order ${selectedOrderId}? This action cannot be undone.`}
        confirmText="Cancel Order"
        cancelText="Keep Order"
        loader={cancelLoader}
        onDeleteHandler={confirmAndCancel}
      />
    </div>
  );
}

export default Orders