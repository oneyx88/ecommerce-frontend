import React, { useState } from 'react';
import { Skeleton } from '@mui/material';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// 前端不再在支付成功时通知后端，成功后仅进行本地清理与跳转

const PaymentForm = ({ clientSecret, totalPrice, addressId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const paymentElementOptions = {
    layout: 'tabs',
  };

  // 当 Stripe 尚未就绪或 clientSecret 不存在时展示占位（Skeleton）
  const notReady = !clientSecret || !stripe || !elements;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!stripe || !elements) {
      setErrorMessage('Payment not initialized');
      return;
    }

    setSubmitting(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // 成功后的回调页面（保留以兼容 Stripe 默认流程）
          return_url: `${window.location.origin}/payment-success`,
        },
        // 在 SPA 中尽量不强制跳转，只有需要时才跳转
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        setSubmitting(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // 本地清理：clientSecret、购物车、选中地址
        try { localStorage.removeItem('client-secret'); } catch (_) {}
        try { localStorage.removeItem('cartItems'); } catch (_) {}
        try { dispatch({ type: 'CLIENT_SECRET_CLEAR' }); } catch (_) {}
        try { dispatch({ type: 'CART_CLEAR' }); } catch (_) {}
        try { dispatch({ type: 'REMOVE_CLIENT_SECRET_ADDRESS' }); } catch (_) {}

        navigate('/payment-success');
        return;
      }

      // 其他状态（如需要 3DS 验证 / 处理中）
      setErrorMessage(`Payment not completed. Status: ${paymentIntent?.status || 'unknown'}`);
      setSubmitting(false);
    } catch (err) {
      setErrorMessage(err?.message || 'Unexpected error');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
      {notReady ? (
        <Skeleton />
      ) : (
        <>
          {clientSecret && <PaymentElement options={paymentElementOptions} />}
          {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
          <button
            type="submit"
            className="text-white w-full px-5 py-[10px] bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
            disabled={!stripe || notReady || submitting}
          >
            {submitting ? 'Processing' : `Pay $${Number(totalPrice).toFixed(2)}`}
          </button>
        </>
      )}
    </form>
  );
};

export default PaymentForm;